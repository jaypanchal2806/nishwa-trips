```python
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# Load .env from backend/.env if available
load_dotenv(ROOT_DIR / ".env")

# Also try project-root .env
load_dotenv(PROJECT_ROOT / ".env")


# ============================================================
# ENVIRONMENT VARIABLES
# ============================================================

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
ADMIN_PASSCODE = os.environ.get("ADMIN_PASSCODE")
JWT_SECRET = os.environ.get("JWT_SECRET")

if not MONGO_URL:
    raise RuntimeError("MONGO_URL environment variable is not set")

if not DB_NAME:
    raise RuntimeError("DB_NAME environment variable is not set")

if not ADMIN_PASSCODE:
    raise RuntimeError("ADMIN_PASSCODE environment variable is not set")

if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET environment variable is not set")


# ============================================================
# MONGODB
# ============================================================

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


# ============================================================
# APP CONFIGURATION
# ============================================================

JWT_ALG = "HS256"
JWT_TTL_HOURS = 24 * 7

app = FastAPI(
    title="Nishwa Tours & Travels API",
    version="1.0.0"
)

api_router = APIRouter(prefix="/api")


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


# ============================================================
# MODELS
# ============================================================

class BookingCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=6, max_length=20)
    car_type: str = Field(
        ...,
        description="Swift Dzire | Ertiga | Innova Crysta"
    )
    trip_type: str = Field(
        ...,
        description="One Way | Round Trip"
    )
    pickup: str = Field(..., min_length=2, max_length=200)
    drop: str = Field(..., min_length=2, max_length=200)
    travel_date: str = Field(..., description="YYYY-MM-DD")
    message: Optional[str] = Field(default="", max_length=500)


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
        "exp": exp
    }

    token = jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALG
    )

    return AdminToken(
        token=token,
        expires_at=exp.isoformat()
    )


def require_admin(
    authorization: Optional[str] = Header(None)
) -> str:

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing Bearer token"
        )

    if not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing Bearer token"
        )

    token = authorization.split(" ", 1)[1].strip()

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALG]
        )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expired"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    if payload.get("sub") != "admin":
        raise HTTPException(
            status_code=401,
            detail="Invalid subject"
        )

    return "admin"


# ============================================================
# PUBLIC API ROUTES
# ============================================================

@api_router.get("/")
async def api_root():
    return {
        "message": "Nishwa Tours & Travels API is running",
        "status": "success"
    }


@api_router.get("/health")
async def api_health():
    return {
        "status": "healthy"
    }


# ============================================================
# BOOKINGS
# ============================================================

@api_router.post(
    "/bookings",
    response_model=Booking
)
async def create_booking(payload: BookingCreate):

    booking = Booking(
        **payload.model_dump()
    )

    doc = booking.model_dump()

    doc["created_at"] = doc["created_at"].isoformat()

    try:
        await db.bookings.insert_one(doc)

    except Exception as e:
        logger.error(
            f"Failed to save booking: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Could not save booking"
        )

    return booking


# ============================================================
# ADMIN LOGIN
# ============================================================

@api_router.post(
    "/admin/login",
    response_model=AdminToken
)
async def admin_login(payload: AdminLogin):

    if payload.passcode != ADMIN_PASSCODE:
        raise HTTPException(
            status_code=401,
            detail="Invalid passcode"
        )

    return make_token()


@api_router.get("/admin/me")
async def admin_me(
    _: str = Depends(require_admin)
):
    return {
        "ok": True,
        "role": "admin"
    }


# ============================================================
# ADMIN BOOKINGS
# ============================================================

@api_router.get(
    "/admin/bookings",
    response_model=List[Booking]
)
async def admin_list_bookings(
    _: str = Depends(require_admin)
):

    docs = await db.bookings.find(
        {},
        {"_id": 0}
    ).sort(
        "created_at",
        -1
    ).to_list(2000)

    for d in docs:

        if isinstance(
            d.get("created_at"),
            str
        ):

            try:
                d["created_at"] = datetime.fromisoformat(
                    d["created_at"]
                )

            except Exception:
                pass

    return docs


@api_router.patch(
    "/admin/bookings/{booking_id}",
    response_model=Booking
)
async def admin_update_booking(
    booking_id: str,
    patch: BookingUpdate,
    _: str = Depends(require_admin)
):

    updates = {
        k: v
        for k, v in patch.model_dump().items()
        if v is not None
    }

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No fields to update"
        )

    res = await db.bookings.find_one_and_update(
        {"id": booking_id},
        {"$set": updates},
        return_document=True
    )

    if not res:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    res.pop("_id", None)

    if isinstance(
        res.get("created_at"),
        str
    ):

        try:
            res["created_at"] = datetime.fromisoformat(
                res["created_at"]
            )

        except Exception:
            pass

    return res


@api_router.delete(
    "/admin/bookings/{booking_id}"
)
async def admin_delete_booking(
    booking_id: str,
    _: str = Depends(require_admin)
):

    res = await db.bookings.delete_one(
        {"id": booking_id}
    )

    if res.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    return {
        "ok": True
    }


# ============================================================
# ADMIN STATS
# ============================================================

@api_router.get("/admin/stats")
async def admin_stats(
    _: str = Depends(require_admin)
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
        "today": today
    }


# ============================================================
# INCLUDE API ROUTER
# ============================================================

app.include_router(api_router)


# ============================================================
# REACT FRONTEND
# ============================================================

# Expected React build location:
#
# project/
# ├── backend/
# │   └── server.py
# └── frontend/
#     └── build/
#         ├── index.html
#         └── static/
#

FRONTEND_DIR = PROJECT_ROOT / "frontend" / "build"
FRONTEND_INDEX = FRONTEND_DIR / "index.html"


@app.get("/")
async def frontend_root():

    if FRONTEND_INDEX.exists():
        return FileResponse(
            FRONTEND_INDEX
        )

    return {
        "message": "Nishwa Tours & Travels API is running",
        "frontend": "React build not found",
        "status": "backend-only"
    }


# Serve React static files
if FRONTEND_DIR.exists():

    app.mount(
        "/static",
        StaticFiles(
            directory=FRONTEND_DIR / "static"
        ),
        name="static"
    )


# ============================================================
# REACT SPA FALLBACK
# ============================================================

# This allows routes such as:
#
# /about
# /contact
# /booking
#
# to load the React application instead of returning 404.

@app.get("/{full_path:path}")
async def react_spa_fallback(full_path: str):

    # Never intercept API routes
    if full_path.startswith("api/"):
        raise HTTPException(
            status_code=404,
            detail="API endpoint not found"
        )

    if FRONTEND_INDEX.exists():
        return FileResponse(
            FRONTEND_INDEX
        )

    raise HTTPException(
        status_code=404,
        detail="Frontend not found"
    )


# ============================================================
# CORS
# ============================================================

cors_origins = os.environ.get(
    "CORS_ORIGINS",
    "*"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# SHUTDOWN
# ============================================================

@app.on_event("shutdown")
async def shutdown_db_client():

    client.close()
```
