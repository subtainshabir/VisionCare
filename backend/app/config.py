"""Application configuration and environment settings for VisionCare backend."""

from functools import lru_cache
import os
import re
from typing import List, Optional
from urllib.parse import urlsplit, urlunsplit
from dotenv import load_dotenv

# Load local environment if present (checking backend/.env and root .env)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))


def normalize_database_url(raw_url: Optional[str]) -> Optional[str]:
    """
    Normalizes a PostgreSQL database URL for SQLAlchemy 2.x and Psycopg 3.
    Replaces legacy schemes (postgres:// and postgresql://) with postgresql+psycopg://
    and ensures SSL requirements for Neon endpoints are respected.
    """
    if not raw_url or not raw_url.strip():
        return None

    url = raw_url.strip()

    # Normalize connection driver scheme to psycopg 3
    if url.startswith("postgres://"):
        url = "postgresql+psycopg://" + url[len("postgres://") :]
    elif url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://") :]

    return url


def mask_database_url(url: Optional[str]) -> str:
    """
    Returns a masked version of the database URL with credentials redacted
    for safe logging and diagnostics.
    """
    if not url:
        return "Not configured"

    try:
        parsed = urlsplit(url)
        if not parsed.netloc:
            return "Invalid URL format"

        # Check if user:pass is present in netloc
        if "@" in parsed.netloc:
            userinfo, host = parsed.netloc.split("@", 1)
            if ":" in userinfo:
                username, _ = userinfo.split(":", 1)
                masked_netloc = f"{username}:***@{host}"
            else:
                masked_netloc = f"{userinfo}:***@{host}"
            masked = urlunsplit((parsed.scheme, masked_netloc, parsed.path, parsed.query, parsed.fragment))
            return masked
        return url
    except Exception:
        # Fallback regex masking
        return re.sub(r":([^:@]+)@", r":***@", url)


class Settings:
    """Strongly-typed application settings loaded from environment variables."""

    def __init__(self):
        self.environment: str = os.getenv("ENVIRONMENT", "development").lower()
        self.backend_host: str = os.getenv("BACKEND_HOST", "0.0.0.0")
        self.backend_port: int = int(os.getenv("BACKEND_PORT", "8000"))

        raw_cors = os.getenv("CORS_ORIGINS", "http://localhost:3000")
        self.cors_origins: List[str] = [
            origin.strip() for origin in raw_cors.split(",") if origin.strip()
        ]

        raw_db_url = os.getenv("DATABASE_URL")
        self.database_url: Optional[str] = normalize_database_url(raw_db_url)

    @property
    def is_database_configured(self) -> bool:
        """Returns True if a non-empty, non-placeholder database URL is configured."""
        if not self.database_url:
            return False
        # Guard against placeholder values
        placeholders = ["placeholder", "example", "USER:PASSWORD", "username:password"]
        return not any(p in self.database_url for p in placeholders)

    @property
    def masked_database_url(self) -> str:
        return mask_database_url(self.database_url)


@lru_cache
def get_settings() -> Settings:
    """Cached settings singleton."""
    return Settings()
