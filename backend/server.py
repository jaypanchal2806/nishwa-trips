```python
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt


# ============================================================
# PATHS / ENVIRONMENT
# ============================================================

ROOT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT_DIR.parent

load_dotenv(ROOT_DIR / ".env")
load_dotenv(PROJECT_ROOT / ".env")


# ============================================================
# ENVIRONMENT VARIABLES
# ============================================================

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
ADMIN_PASSCODE = os.environ.get("ADMIN_PASSCODE")
JWT_SECRET = os.environ.get("JWT_SECRET")

JWT_ALG = "HS256"
JWT_TTL_HOURS = 24 * 7


if not MONGO_URL:
    raise RuntimeError("MONGO_URL environment variable is missing")

if not DB_NAME:
    raise RuntimeError("DB_NAME environment variable is missing")

if not ADMIN_PASSCODE:
    raise RuntimeError("ADMIN_PASSCODE environment variable is missing")

if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET environment variable is missing")


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)


# ============================================================
# MONGODB
# ============================================================

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Nishwa Tours & Travels API",
    version="1.0.0",
)

api_router = APIRouter(prefix="/api")


# ============================================================
# CORS
# ============================================================

cors_origins = os.environ.get(
    "CORS_ORIGINS",
    "https://nishwatoursandtravels.in,"
    "https://www.nishwatoursandtravels.in,"
    "https://nishwa-trips.onrender.com,"
    "http://localhost:3000",
).split(",")

cors_origins = [origin.strip() for origin in cors_origins if origin.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# MODELS
# ============================================================

class BookingCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=6, max_length=20)
    car_type: str = Field(
        ...,
        description="Swift Dzire | Ertiga | Innova Crysta",
    )
    trip_type: str = Field(
        ...,
        description="One Way | Round Trip",
    )
    pickup: str = Field(..., min_length=2, max_length=200)
    drop: str = Field(..., min_length=2, max_length=200)
    travel_date: str = Field(
        ...,
        description="YYYY-MM-DD",
    )
    message: Optional[str] = Field(
        default="",
        max_length=500,
    )


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4())
    )

    name: str
    phone: str
    car_type: str
    trip_type: str
    pickup: str
    drop: str
    travel_date: str

    message: str = ""
    status: str = "new"

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class BookingUpdate(BaseModel):
    status: Optional[str] = None
    message: Optional[str] = None


class AdminLogin(BaseModel):
    passcode: str


class AdminToken(BaseModel):
    token: str
    expires_at: str


# ============================================================
# AUTH HELPERS
# ============================================================

def make_token() -> AdminToken:
    exp = datetime.now(timezone.utc) + timedelta(
        hours=JWT_TTL_HOURS
    )

    payload = {
        "sub": "admin",
        "exp": exp,
    }

    token = jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALG,
    )

    return AdminToken(
        token=token,
        expires_at=exp.isoformat(),
    )


def require_admin(
    authorization: Optional[str] = Header(None),
) -> str:

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing Bearer token",
        )

    if not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format",
        )

    token = authorization.split(
        " ",
        1,
    )[1].strip()

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALG],
        )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expired",
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    if payload.get("sub") != "admin":
        raise HTTPException(
            status_code=401,
            detail="Invalid subject",
        )

    return "admin"


# ============================================================
# PUBLIC API ROUTES
# ============================================================

@api_router.get("/")
async def api_root():
    return {
        "message": "Nishwa Tours & Travels API is running",
        "status": "ok",
    }


@api_router.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "Nishwa Tours & Travels API",
    }


@api_router.post(
    "/bookings",
    response_model=Booking,
)
async def create_booking(
    payload: BookingCreate,
):

    booking = Booking(
        **payload.model_dump()
    )

    doc = booking.model_dump()

    doc["created_at"] = doc["created_at"].isoformat()

    try:

        await db.bookings.insert_one(doc)

    except Exception as e:

        logger.exception(
            "Failed to save booking"
        )

        raise HTTPException(
            status_code=500,
            detail="Could not save booking",
        )

    return booking


# ============================================================
# ADMIN ROUTES
# ============================================================

@api_router.post(
    "/admin/login",
    response_model=AdminToken,
)
async def admin_login(
    payload: AdminLogin,
):

    if payload.passcode != ADMIN_PASSCODE:

        raise HTTPException(
            status_code=401,
            detail="Invalid passcode",
        )

    return make_token()


@api_router.get("/admin/me")
async def admin_me(
    _: str = Depends(require_admin),
):

    return {
        "ok": True,
        "role": "admin",
    }


@api_router.get(
    "/admin/bookings",
    response_model=List[Booking],
)
async def admin_list_bookings(
    _: str = Depends(require_admin),
):

    docs = await db.bookings.find(
        {},
        {"_id": 0},
    ).sort(
        "created_at",
        -1,
    ).to_list(2000)

    for doc in docs:

        if isinstance(
            doc.get("created_at"),
            str,
        ):

            try:

                doc["created_at"] = datetime.fromisoformat(
                    doc["created_at"]
                )

            except Exception:
                pass

    return docs


@api_router.patch(
    "/admin/bookings/{booking_id}",
    response_model=Booking,
)
async def admin_update_booking(
    booking_id: str,
    patch: BookingUpdate,
    _: str = Depends(require_admin),
):

    updates = {
        key: value
        for key, value in patch.model_dump().items()
        if value is not None
    }

    if not updates:

        raise HTTPException(
            status_code=400,
            detail="No fields to update",
        )

    result = await db.bookings.find_one_and_update(
        {"id": booking_id},
        {"$set": updates},
        return_document=True,
    )

    if not result:

        raise HTTPException(
            status_code=404,
            detail="Booking not found",
        )

    result.pop("_id", None)

    if isinstance(
        result.get("created_at"),
        str,
    ):

        try:

            result["created_at"] = datetime.fromisoformat(
                result["created_at"]
            )

        except Exception:
            pass

    return result


@api_router.delete(
    "/admin/bookings/{booking_id}"
)
async def admin_delete_booking(
    booking_id: str,
    _: str = Depends(require_admin),
):

    result = await db.bookings.delete_one(
        {"id": booking_id}
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Booking not found",
        )

    return {
        "ok": True
    }


@api_router.get("/admin/stats")
async def admin_stats(
    _: str = Depends(require_admin),
):

    total = await db.bookings.count_documents({})

    new = await db.bookings.count_documents({
        "status": "new"
    })

    confirmed = await db.bookings.count_documents({
        "status": "confirmed"
    })

    completed = await db.bookings.count_documents({
        "status": "completed"
    })

    cancelled = await db.bookings.count_documents({
        "status": "cancelled"
    })

    today_iso = datetime.now(
        timezone.utc
    ).strftime("%Y-%m-%d")

    today = await db.bookings.count_documents({
        "created_at": {
            "$regex": f"^{today_iso}"
        }
    })

    return {
        "total": total,
        "new": new,
        "confirmed": confirmed,
        "completed": completed,
        "cancelled": cancelled,
        "today": today,
    }


# ============================================================
# INCLUDE API ROUTER
# ============================================================

app.include_router(api_router)


# ============================================================
# REACT FRONTEND
# ============================================================

FRONTEND_BUILD = PROJECT_ROOT / "frontend" / "build"


if FRONTEND_BUILD.exists():

    logger.info(
        "React build found at: %s",
        FRONTEND_BUILD,
    )

    # Serve React static assets
    app.mount(
        "/static",
        StaticFiles(
            directory=FRONTEND_BUILD / "static"
        ),
        name="static",
    )

else:

    logger.warning(
        "React build directory not found: %s",
        FRONTEND_BUILD,
    )


# ============================================================
# FRONTEND ROOT
# ============================================================

@app.get("/")
async def serve_frontend():

    index_file = FRONTEND_BUILD / "index.html"

    if not index_file.exists():

        return {
            "message": "Nishwa Tours & Travels API is running",
            "frontend": "React build not found",
        }

    return FileResponse(index_file)


# ============================================================
# REACT SPA FALLBACK
# ============================================================

@app.get("/{full_path:path}")
async def react_spa_fallback(
    full_path: str,
):

    # Never intercept API requests
    if full_path.startswith("api/"):

        raise HTTPException(
            status_code=404,
            detail="Not Found",
        )

    index_file = FRONTEND_BUILD / "index.html"

    if not index_file.exists():

        raise HTTPException(
            status_code=404,
            detail="Frontend build not found",
        )

    requested_file = FRONTEND_BUILD / full_path

    # Serve an existing frontend file
    if requested_file.is_file():

        return FileResponse(requested_file)

    # React Router fallback
    return FileResponse(index_file)


# ============================================================
# SHUTDOWN
# ============================================================

@app.on_event("shutdown")
async def shutdown_db_client():

    client.close()
```
