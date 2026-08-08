```python
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
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
# Configuration
# ============================================================

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ============================================================
# MongoDB Connection
# ============================================================

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ============================================================
# Authentication Configuration
# ============================================================

ADMIN_PASSCODE = os.environ["ADMIN_PASSCODE"]

JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "temporary-development-secret"
)

JWT_ALG = "HS256"
JWT_TTL_HOURS = 24 * 7  # 7 days

# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(title="Nishwa Tours & Travels API")

# ============================================================
# ROOT / HOMEPAGE ROUTE
# ============================================================
# This fixes:
# GET / -> 404 Not Found
#
# Your existing API router uses /api prefix, so this route
# specifically handles the main website URL.
# ============================================================

@app.get("/")
async def homepage():
    return {
        "message": "Nishwa Tours & Travels API is running",
        "status": "online"
    }


# ============================================================
# API Router
# ============================================================

api_router = APIRouter(prefix="/api")

# ============================================================
# Logging
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

# ============================================================
# Models
# ============================================================


class BookingCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    phone: str = Field(
        ...,
        min_length=6,
        max_length=20
    )

    car_type: str = Field(
        ...,
        description="Swift Dzire | Ertiga | Innova Crysta"
    )

    trip_type: str = Field(
        ...,
        description="One Way | Round Trip"
    )

    pickup: str = Field(
        ...,
        min_length=2,
        max_length=200
    )

    drop: str = Field(
        ...,
        min_length=2,
        max_length=200
    )

    travel_date: str = Field(
        ...,
        description="YYYY-MM-DD"
    )

    message: Optional[str] = Field(
        default="",
        max_length=500
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
# Authentication Helpers
# ============================================================


def _make_token() -> AdminToken:
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

    if not authorization or not authorization.lower().startswith(
        "bearer "
    ):
        raise HTTPException(
            status_code=401,
            detail="Missing Bearer token"
        )

    token = authorization.split(
        " ",
        1
    )[1].strip()

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
# Public Routes
# ============================================================


@api_router.get("/")
async def root():
    return {
        "message": "Nishwa Tours & Travels API is running"
    }


@api_router.post(
    "/bookings",
    response_model=Booking
)
async def create_booking(
    payload: BookingCreate
):

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
# Admin Routes
# ============================================================


@api_router.post(
    "/admin/login",
    response_model=AdminToken
)
async def admin_login(
    payload: AdminLogin
):

    if payload.passcode != ADMIN_PASSCODE:

        raise HTTPException(
            status_code=401,
            detail="Invalid passcode"
        )

    return _make_token()


@api_router.get("/admin/me")
async def admin_me(
    _: str = Depends(require_admin)
):

    return {
        "ok": True,
        "role": "admin"
    }


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
# Register API Routes
# ============================================================

app.include_router(api_router)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get(
        "CORS_ORIGINS",
        "*"
    ).split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Database Shutdown
# ============================================================


@app.on_event("shutdown")
async def shutdown_db_client():

    client.close()
```
