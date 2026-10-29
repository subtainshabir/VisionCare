"""Unit tests for configuration parsing, URL normalization, and credential masking."""

import os
from app.config import normalize_database_url, mask_database_url, Settings


def test_normalize_database_url_postgresql():
    """Verify postgresql:// is normalized to postgresql+psycopg://."""
    raw = "postgresql://user:pass123@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require"
    normalized = normalize_database_url(raw)
    assert normalized == "postgresql+psycopg://user:pass123@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require"


def test_normalize_database_url_postgres_legacy():
    """Verify postgres:// legacy scheme is normalized to postgresql+psycopg://."""
    raw = "postgres://user:pass123@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require"
    normalized = normalize_database_url(raw)
    assert normalized == "postgresql+psycopg://user:pass123@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require"


def test_normalize_database_url_already_psycopg():
    """Verify postgresql+psycopg:// is preserved."""
    raw = "postgresql+psycopg://user:pass123@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require"
    normalized = normalize_database_url(raw)
    assert normalized == raw


def test_normalize_database_url_empty_or_none():
    """Verify empty or None inputs return None."""
    assert normalize_database_url(None) is None
    assert normalize_database_url("") is None
    assert normalize_database_url("   ") is None


def test_mask_database_url_redacts_password():
    """Verify password is completely masked with ***."""
    url = "postgresql+psycopg://vision_user:super_secret_pw@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require"
    masked = mask_database_url(url)
    assert "super_secret_pw" not in masked
    assert "vision_user:***@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require" in masked


def test_mask_database_url_unconfigured():
    """Verify None or empty returns 'Not configured'."""
    assert mask_database_url(None) == "Not configured"
    assert mask_database_url("") == "Not configured"


def test_settings_is_database_configured_with_placeholder(monkeypatch):
    """Verify placeholder or example URLs are detected as unconfigured."""
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg://USER:PASSWORD@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require")
    settings = Settings()
    assert settings.is_database_configured is False


def test_settings_is_database_configured_valid(monkeypatch):
    """Verify real-looking URL is recognized as configured."""
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg://app_usr:p987654@ep-prod-99.neon.tech/prod_db?sslmode=require")
    settings = Settings()
    assert settings.is_database_configured is True
    assert "p987654" not in settings.masked_database_url
    assert "app_usr:***@" in settings.masked_database_url
