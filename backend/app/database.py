"""Database engine, session management, and connectivity verification for VisionCare."""

import logging
from typing import Generator, Optional, Tuple, Dict, Any
from sqlalchemy import create_engine, text, Engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session, DeclarativeBase
from sqlalchemy.exc import SQLAlchemyError, OperationalError
from app.config import get_settings, mask_database_url

logger = logging.getLogger("visioncare.database")

# Reusable SQLAlchemy 2.x Declarative Base for future models
class Base(DeclarativeBase):
    """Declarative Base for all VisionCare database models."""
    pass


# Global engine and sessionmaker references
_engine: Optional[Engine] = None
_SessionFactory: Optional[sessionmaker] = None


def get_engine(force_recreate: bool = False) -> Optional[Engine]:
    """
    Returns the singleton SQLAlchemy Engine configured for Neon PostgreSQL.
    Configures pre-ping connection liveness verification and pool recycling
    to handle cloud and serverless connection lifecycles safely.
    """
    global _engine, _SessionFactory
    settings = get_settings()

    if not settings.is_database_configured:
        return None

    if _engine is None or force_recreate:
        try:
            logger.info("Initializing database engine with target: %s", settings.masked_database_url)
            _engine = create_engine(
                settings.database_url,
                pool_pre_ping=True,      # Tests connection liveness before checkout (essential for Neon)
                pool_recycle=300,        # Recycles connections every 5 minutes to prevent stale idle connections
                pool_size=5,             # Sensible pool size for serverless Postgres
                max_overflow=10,         # Allows temporary burst capacity
                connect_args={
                    "connect_timeout": 10,  # 10s timeout prevents hanging on network partition
                },
            )
            _SessionFactory = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=_engine,
            )
        except Exception as exc:
            logger.error("Failed to initialize database engine: %s", str(exc))
            _engine = None
            _SessionFactory = None
            return None

    return _engine


def get_session_factory() -> Optional[sessionmaker]:
    """Returns the session factory, initializing the engine if necessary."""
    global _SessionFactory
    if _SessionFactory is None:
        get_engine()
    return _SessionFactory


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency yielding a thread-local SQLAlchemy database session.
    Guarantees session closure in a finally block to avoid connection leaks.
    """
    factory = get_session_factory()
    if factory is None:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=503,
            detail="Database service is currently unconfigured or unavailable."
        )

    db: Session = factory()
    try:
        yield db
    finally:
        db.close()


def check_db_connectivity() -> Tuple[bool, str, Dict[str, Any]]:
    """
    Executes a lightweight query (SELECT 1) against the configured PostgreSQL database.
    Returns (is_connected, message, details).
    Never exposes database passwords, tokens, or raw connection strings.
    """
    settings = get_settings()

    if not settings.is_database_configured:
        return False, "Database URL is not configured or contains placeholder credentials.", {
            "configured": False,
            "target": settings.masked_database_url,
        }

    engine = get_engine()
    if engine is None:
        return False, "Database engine could not be initialized.", {
            "configured": True,
            "target": settings.masked_database_url,
        }

    try:
        # Perform lightweight non-destructive ping query
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            val = result.scalar()
            if val == 1:
                return True, "Database connection verified successfully.", {
                    "configured": True,
                    "target": settings.masked_database_url,
                    "dialect": engine.dialect.name,
                }
            return False, f"Unexpected query scalar result: {val}", {
                "configured": True,
                "target": settings.masked_database_url,
            }
    except OperationalError as op_err:
        logger.warning("Database operational error during connectivity check: %s", str(op_err))
        return False, "Database connection failed (host unreachable, timeout, or invalid credentials).", {
            "configured": True,
            "target": settings.masked_database_url,
        }
    except SQLAlchemyError as sql_err:
        logger.warning("Database query error during connectivity check: %s", str(sql_err))
        return False, "Database query error during connectivity check.", {
            "configured": True,
            "target": settings.masked_database_url,
        }
    except Exception as exc:
        logger.error("Unexpected error during database check: %s", str(exc))
        return False, "Internal error during database connectivity verification.", {
            "configured": True,
            "target": settings.masked_database_url,
        }


def reset_database_state():
    """Utility function to dispose existing engines during tests or reconfigurations."""
    global _engine, _SessionFactory
    if _engine is not None:
        try:
            _engine.dispose()
        except Exception:
            pass
    _engine = None
    _SessionFactory = None
