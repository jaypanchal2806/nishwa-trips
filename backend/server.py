```python
from fastapi import FastAPI, APIRouter, HTTPException, Security
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ReturnDocument

from pydantic import BaseModel, Field, ConfigDict

from typing import List, Optional
from pathlib import Path
from datetime import datetime, timezone, timedelta

import os
import logging
import uuid
import jwt


# ============================================================
# PATHS
# ============================================================

ROOT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT_DIR.parent

FRONTEND_BUILD = PROJECT_ROOT / "frontend" / "build"


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
)

logger = logging.getLogger("nishwa-travels")


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv(ROOT_DIR / ".env")
load_dotenv(PROJECT_ROOT / ".env")


# ============================================================
# ENVIRONMENT VARIABLES
# ============================================================

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")
ADMIN_PASSCODE = os.getenv("ADMIN_PASSCODE")
JWT_SECRET = os.getenv("JWT_SECRET")

JWT_ALGORITHM = "HS256"
JWT_TTL_HOURS = 24 * 7


# ============================================================
# VALIDATE ENVIRONMENT VARIABLES
# ============================================================

missing_variables = []

if not MONGO_URL:
    missing_variables.append("MONGO_URL")

if not DB_NAME:
    missing_variables.append("DB_NAME")

if not ADMIN_PASSCODE:
    missing_variables.append("ADMIN_PASSCODE")

if not JWT_SECRET:
    missing_variables.append("JWT_SECRET")

if missing_variables:
    raise RuntimeError(
        "Missing required environment variables: "
        + ", ".join(missing_variables)
    )


# ============================================================
# CLEAN ENVIRONMENT VALUES
# ============================================================

MONGO_URL = MONGO_URL.strip()
DB_NAME = DB_NAME.strip()
ADMIN_PASSCODE = ADMIN_PASSCODE.strip()
JWT_SECRET = JWT_SECRET.strip()


# ============================================================
# VALIDATE MONGODB URL
# ============================================================

if not (
    MONGO_URL.startswith("mongodb://")
    or MONGO_URL.startswith("mongodb+srv://")
):
    raise RuntimeError(
        "Invalid MONGO_URL. "
        "It must start with mongodb:// or mongodb+srv://"
    )


# IMPORTANT:
# Never print the complete MongoDB URL because it contains
# your database username/password.

logger.info(
    "MongoDB URL loaded successfully. Scheme=%s",
    MONGO_URL.split("://", 1)[0],
)

logger.info(
    "MongoDB database name: %s",
    DB_NAME,
)


# ============================================================
# MONGODB
# ============================================================

client = AsyncIOMotorClient(
    MONGO_URL,
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
    socketTimeoutMS=20000,
    retryWrites=True,
)

db = client[DB_NAME]


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Nishwa Tours & Travels API",
    description="Booking API for Nishwa Tours & Travels",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

default_origins = [
    "https://nishwatoursandtravels.in",
    "https://www.nishwatoursandtravels.in",
    "https://nishwa-trips.onrender.com",
    "http://localhost:3000",
    "http://localhost:3001",
]

cors_value = os.getenv("CORS_ORIGINS")

if cors_value:
    cors_origins = [
        origin.strip().rstrip("/")
        for origin in cors_value.split(",")
        if origin.strip()
    ]
else:
    cors_origins = default_origins


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API ROUTER
# ============================================================

api_router = APIRouter(
    prefix="/api"
)


# ============================================================
# HTTP BEARER SECURITY
# ============================================================
#
# This is what creates the OpenAPI Bearer authentication
# scheme used by Swagger UI.
#
# Swagger should display:
#
#     Authorize
#
# After login, paste ONLY the JWT token.
#
# ============================================================

security = HTTPBearer(
    scheme_name="BearerAuth",
    description="Paste the JWT token returned by /api/admin/login",
    auto_error=True,
)


# ============================================================
# MODELS
# ============================================================

class BookingCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    phone: str = Field(
        ...,
        min_length=6,
        max_length=20,
    )

    car_type: str = Field(
        ...,
        description="Swift Dzire | Ertiga | Innova Crysta",
    )

    trip_type: str = Field(
        ...,
        description="One Way | Round Trip",
    )

    pickup: str = Field(
        ...,
        min_length=2,
        max_length=200,
    )

    drop: str = Field(
        ...,
        min_length=2,
        max_length=200,
    )

    travel_date: str = Field(
        ...,
        description="YYYY-MM-DD",
    )

    message: Optional[str] = Field(
        default="",
        max_length=500,
    )


class Booking(BaseModel):
    model_config = ConfigDict(
        extra="ignore"
    )

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
# JWT - CREATE ADMIN TOKEN
# ============================================================

def create_admin_token() -> AdminToken:
    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(hours=JWT_TTL_HOURS)
    )

    payload = {
        "sub": "admin",
        "exp": expires_at,
    }

    token = jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )

    return AdminToken(
        token=token,
        expires_at=expires_at.isoformat(),
    )


# ============================================================
# JWT - REQUIRE ADMIN
# ============================================================

def require_admin(
    credentials: HTTPAuthorizationCredentials = Security(security),
):
    """
    Validate JWT Bearer authentication.

    HTTPBearer extracts the token from:

        Authorization: Bearer <JWT>

    credentials.credentials contains ONLY the JWT token.
    """

    if credentials is None:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
        )

    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication scheme",
        )

    token = credentials.credentials.strip()

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Missing authentication token",
        )

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
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
            status_code=403,
            detail="Admin access required",
        )

    return "admin"


# ============================================================
# ROOT HEALTH
# ============================================================

@app.get(
    "/health",
    tags=["Health"],
)
async def root_health():
    return {
        "status": "healthy",
        "service": "Nishwa Tours & Travels API",
        "database": "configured",
        "frontend_build": FRONTEND_BUILD.exists(),
    }


# ============================================================
# API ROOT
# ============================================================

@api_router.get(
    "/",
    tags=["Health"],
)
async def api_root():
    return {
        "message": "Nishwa Tours & Travels API is running",
        "status": "ok",
    }


# ============================================================
# API HEALTH
# ============================================================

@api_router.get(
    "/health",
    tags=["Health"],
)
async def api_health():
    return {
        "status": "healthy",
        "service": "Nishwa Tours & Travels API",
    }


# ============================================================
# DATABASE HEALTH
# ============================================================

@api_router.get(
    "/health/db",
    tags=["Health"],
)
async def database_health():
    try:
        await client.admin.command("ping")

        return {
            "status": "healthy",
            "database": "connected",
            "db_name": DB_NAME,
        }

    except Exception as exc:
        logger.exception(
            "MongoDB health check failed"
        )

        raise HTTPException(
            status_code=503,
            detail="Database connection failed",
        )


# ============================================================
# CREATE BOOKING
# ============================================================

@api_router.post(
    "/bookings",
    response_model=Booking,
    tags=["Bookings"],
)
async def create_booking(
    payload: BookingCreate,
):
    booking = Booking(
        **payload.model_dump()
    )

    document = booking.model_dump()

    document["created_at"] = (
        document["created_at"].isoformat()
    )

    try:
        await client.admin.command("ping")

        result = await db.bookings.insert_one(
            document
        )

        logger.info(
            "Booking created successfully. booking_id=%s",
            booking.id,
        )

    except Exception:
        logger.exception(
            "Failed to create booking"
        )

        raise HTTPException(
            status_code=500,
            detail="Could not save booking",
        )

    return booking


# ============================================================
# ADMIN LOGIN
# ============================================================

@api_router.post(
    "/admin/login",
    response_model=AdminToken,
    tags=["Admin"],
)
async def admin_login(
    payload: AdminLogin,
):
    if payload.passcode != ADMIN_PASSCODE:
        raise HTTPException(
            status_code=401,
            detail="Invalid passcode",
        )

    return create_admin_token()


# ============================================================
# ADMIN ME
# ============================================================

@api_router.get(
    "/admin/me",
    tags=["Admin"],
)
async def admin_me(
    _: str = Security(require_admin),
):
    return {
        "ok": True,
        "role": "admin",
    }


# ============================================================
# ADMIN - LIST BOOKINGS
# ============================================================

@api_router.get(
    "/admin/bookings",
    response_model=List[Booking],
    tags=["Admin"],
)
async def admin_list_bookings(
    _: str = Security(require_admin),
):
    try:
        documents = await (
            db.bookings
            .find(
                {},
                {"_id": 0},
            )
            .sort(
                "created_at",
                -1,
            )
            .to_list(2000)
        )

    except Exception:
        logger.exception(
            "Failed to retrieve bookings"
        )

        raise HTTPException(
            status_code=500,
            detail="Could not retrieve bookings",
        )

    for document in documents:
        created_at = document.get("created_at")

        if isinstance(created_at, str):
            try:
                document["created_at"] = (
                    datetime.fromisoformat(created_at)
                )

            except ValueError:
                document["created_at"] = (
                    datetime.now(timezone.utc)
                )

    return documents


# ============================================================
# ADMIN - UPDATE BOOKING
# ============================================================

@api_router.patch(
    "/admin/bookings/{booking_id}",
    response_model=Booking,
    tags=["Admin"],
)
async def admin_update_booking(
    booking_id: str,
    patch: BookingUpdate,
    _: str = Security(require_admin),
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

    allowed_statuses = {
        "new",
        "confirmed",
        "completed",
        "cancelled",
    }

    if "status" in updates:
        if updates["status"] not in allowed_statuses:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid status. Allowed values: "
                    "new, confirmed, completed, cancelled"
                ),
            )

    try:
        result = await db.bookings.find_one_and_update(
            {"id": booking_id},
            {"$set": updates},
            projection={"_id": 0},
            return_document=ReturnDocument.AFTER,
        )

    except Exception:
        logger.exception(
            "Failed to update booking"
        )

        raise HTTPException(
            status_code=500,
            detail="Could not update booking",
        )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Booking not found",
        )

    created_at = result.get("created_at")

    if isinstance(created_at, str):
        try:
            result["created_at"] = (
                datetime.fromisoformat(created_at)
            )

        except ValueError:
            result["created_at"] = (
                datetime.now(timezone.utc)
            )

    return result


# ============================================================
# ADMIN - DELETE BOOKING
# ============================================================

@api_router.delete(
    "/admin/bookings/{booking_id}",
    tags=["Admin"],
)
async def admin_delete_booking(
    booking_id: str,
    _: str = Security(require_admin),
):
    try:
        result = await db.bookings.delete_one(
            {"id": booking_id}
        )

    except Exception:
        logger.exception(
            "Failed to delete booking"
        )

        raise HTTPException(
            status_code=500,
            detail="Could not delete booking",
        )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Booking not found",
        )

    return {
        "ok": True,
        "message": "Booking deleted",
    }


# ============================================================
# ADMIN - STATISTICS
# ============================================================

@api_router.get(
    "/admin/stats",
    tags=["Admin"],
)
async def admin_stats(
    _: str = Security(require_admin),
):
    try:
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

    except Exception:
        logger.exception(
            "Failed to calculate statistics"
        )

        raise HTTPException(
            status_code=500,
            detail="Could not calculate statistics",
        )

    today = datetime.now(
        timezone.utc
    ).strftime("%Y-%m-%d")

    today_count = 0

    try:
        cursor = db.bookings.find(
            {},
            {
                "_id": 0,
                "created_at": 1,
            },
        )

        async for document in cursor:
            created_at = document.get("created_at")

            if (
                isinstance(created_at, str)
                and created_at.startswith(today)
            ):
                today_count += 1

            elif isinstance(created_at, datetime):
                if created_at.astimezone(
                    timezone.utc
                ).strftime("%Y-%m-%d") == today:
                    today_count += 1

    except Exception:
        logger.exception(
            "Failed to calculate today's bookings"
        )

        raise HTTPException(
            status_code=500,
            detail="Could not calculate today's bookings",
        )

    return {
        "total": total,
        "new": new,
        "confirmed": confirmed,
        "completed": completed,
        "cancelled": cancelled,
        "today": today_count,
    }


# ============================================================
# INCLUDE API ROUTER
# ============================================================

app.include_router(api_router)


# ============================================================
# REACT STATIC FILES
# ============================================================

if FRONTEND_BUILD.exists():

    logger.info(
        "React build found: %s",
        FRONTEND_BUILD,
    )

    static_directory = FRONTEND_BUILD / "static"

    if static_directory.exists():

        app.mount(
            "/static",
            StaticFiles(
                directory=static_directory
            ),
            name="static",
        )

else:

    logger.warning(
        "React build NOT found: %s",
        FRONTEND_BUILD,
    )


# ============================================================
# FRONTEND ROOT
# ============================================================

@app.get(
    "/",
    include_in_schema=False,
)
async def frontend_root():

    index_file = FRONTEND_BUILD / "index.html"

    if index_file.exists():
        return FileResponse(index_file)

    return {
        "message": "Nishwa Tours & Travels API is running",
        "frontend": "React build not found",
    }


# ============================================================
# REACT SPA FALLBACK
# ============================================================

@app.get(
    "/{full_path:path}",
    include_in_schema=False,
)
async def frontend_fallback(
    full_path: str,
):

    if full_path.startswith("api/"):
        raise HTTPException(
            status_code=404,
            detail="API endpoint not found",
        )

    if full_path == "health":
        raise HTTPException(
            status_code=404,
            detail="Health endpoint not found",
        )

    index_file = FRONTEND_BUILD / "index.html"

    if not index_file.exists():
        raise HTTPException(
            status_code=404,
            detail="Frontend build not found",
        )

    requested_file = FRONTEND_BUILD / full_path

    if requested_file.is_file():
        return FileResponse(requested_file)

    return FileResponse(index_file)


# ============================================================
# SHUTDOWN
# ============================================================

@app.on_event("shutdown")
async def shutdown():

    logger.info(
        "Closing MongoDB connection"
    )

    client.close()
```
