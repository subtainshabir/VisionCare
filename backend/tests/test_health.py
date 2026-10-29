"""Tests for API health check and database readiness endpoints."""

from fastapi.testclient import TestClient
from app.main import app
import app.main as main_module

client = TestClient(app)


def test_root_endpoint():
    """Verify GET / returns service information and online status."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "VisionCare Backend API"
    assert data["status"] == "online"


def test_basic_health_endpoint():
    """
    Verify GET /health reports basic application health independently
    of external database status.
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "VisionCare API"


def test_database_health_unconfigured(monkeypatch):
    """
    When database is unconfigured, GET /health/db returns 503 Service Unavailable
    with status 'unconfigured' and no secrets.
    """
    monkeypatch.setattr(
        main_module,
        "check_db_connectivity",
        lambda: (
            False,
            "Database URL is not configured or contains placeholder credentials.",
            {"configured": False, "target": "Not configured"},
        ),
    )

    response = client.get("/health/db")
    assert response.status_code == 503
    data = response.json()
    assert data["status"] == "unconfigured"
    assert data["database"] == "postgresql"
    assert "not configured" in data["message"].lower()
    assert data["target"] == "Not configured"


def test_database_health_connected(monkeypatch):
    """
    When database connection succeeds, GET /health/db returns 200 OK
    with status 'connected'.
    """
    masked_url = "postgresql+psycopg://app_user:***@ep-demo.neon.tech/neondb?sslmode=require"
    monkeypatch.setattr(
        main_module,
        "check_db_connectivity",
        lambda: (
            True,
            "Database connection verified successfully.",
            {
                "configured": True,
                "target": masked_url,
                "dialect": "postgresql",
            },
        ),
    )

    response = client.get("/health/db")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "connected"
    assert data["database"] == "postgresql"
    assert data["target"] == masked_url
    assert "verified successfully" in data["message"]
    # Verify no raw password leaked
    assert "***" in data["target"]


def test_database_health_unavailable_failure(monkeypatch):
    """
    When connection fails (e.g. timeout or bad host), GET /health/db returns 503
    with status 'unavailable'.
    """
    masked_url = "postgresql+psycopg://app_user:***@ep-down.neon.tech/neondb?sslmode=require"
    monkeypatch.setattr(
        main_module,
        "check_db_connectivity",
        lambda: (
            False,
            "Database connection failed (host unreachable, timeout, or invalid credentials).",
            {"configured": True, "target": masked_url},
        ),
    )

    response = client.get("/health/db")
    assert response.status_code == 503
    data = response.json()
    assert data["status"] == "unavailable"
    assert data["database"] == "postgresql"
    assert "failed" in data["message"].lower()
    assert data["target"] == masked_url
