from contextlib import asynccontextmanager
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import check_db_connectivity, reset_database_state


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager handling startup and graceful shutdown."""
    yield
    # Cleanup database connection pool on shutdown
    reset_database_state()


settings = get_settings()

app = FastAPI(
    title="VisionCare API",
    description="Backend services for the VisionCare vision screening platform",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "service": "VisionCare Backend API",
        "status": "online",
    }


@app.get("/health")
def health_check():
    """
    Basic application liveness endpoint.
    Reports basic application service health independently of external dependencies.
    """
    return {
        "status": "healthy",
        "service": "VisionCare API",
    }


@app.get("/health/db")
def database_health_check(response: Response):
    """
    Database readiness endpoint.
    Executes a lightweight query (SELECT 1) against the configured PostgreSQL database.
    Distinguishes application health from database connectivity.
    Never exposes raw secrets, passwords, or detailed stack traces.
    """
    is_connected, message, details = check_db_connectivity()

    if is_connected:
        response.status_code = status.HTTP_200_OK
        return {
            "status": "connected",
            "database": "postgresql",
            "message": message,
            "target": details.get("target"),
            "dialect": details.get("dialect", "postgresql"),
        }

    # If unconfigured or connection failed, return 503 Service Unavailable
    response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    db_status = "unconfigured" if not details.get("configured", False) else "unavailable"
    return {
        "status": db_status,
        "database": "postgresql",
        "message": message,
        "target": details.get("target"),
    }
