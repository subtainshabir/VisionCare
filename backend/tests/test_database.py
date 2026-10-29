"""Unit tests for database engine, session lifecycle, and connectivity checking."""

import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import (
    get_db,
    check_db_connectivity,
    reset_database_state,
    Base,
    _engine,
)
import app.database as db_module


def test_get_db_unconfigured_raises_503(monkeypatch):
    """When database is unconfigured, get_db raises HTTP 503."""
    reset_database_state()
    monkeypatch.setattr(db_module, "get_session_factory", lambda: None)

    generator = get_db()
    with pytest.raises(HTTPException) as exc_info:
        next(generator)
    assert exc_info.value.status_code == 503


def test_get_db_session_lifecycle(monkeypatch):
    """Verify get_db cleanly opens and closes a session."""
    test_engine = create_engine("sqlite:///:memory:")
    TestSessionFactory = sessionmaker(bind=test_engine)

    monkeypatch.setattr(db_module, "get_session_factory", lambda: TestSessionFactory)

    generator = get_db()
    session = next(generator)

    close_called = False
    original_close = session.close

    def spy_close():
        nonlocal close_called
        close_called = True
        return original_close()

    session.close = spy_close

    # Complete the generator to trigger finally: db.close()
    try:
        next(generator)
    except StopIteration:
        pass

    assert close_called is True


def test_check_db_connectivity_unconfigured(monkeypatch):
    """When unconfigured, check_db_connectivity returns safe False without errors."""
    reset_database_state()
    from app.config import Settings
    fake_settings = Settings()
    fake_settings.database_url = None
    monkeypatch.setattr("app.database.get_settings", lambda: fake_settings)

    is_connected, message, details = check_db_connectivity()
    assert is_connected is False
    assert "not configured" in message.lower()
    assert details["configured"] is False


def test_check_db_connectivity_success(monkeypatch):
    """When engine connects and executes SELECT 1, returns True."""
    test_engine = create_engine("sqlite:///:memory:")
    monkeypatch.setattr(db_module, "get_engine", lambda: test_engine)

    from app.config import Settings
    fake_settings = Settings()
    fake_settings.database_url = "sqlite:///:memory:"
    monkeypatch.setattr("app.database.get_settings", lambda: fake_settings)

    is_connected, message, details = check_db_connectivity()
    assert is_connected is True
    assert "verified successfully" in message.lower()
    assert details["configured"] is True
    assert details["dialect"] == "sqlite"


def test_declarative_base_exists():
    """Verify Base declarative base is ready for future models."""
    assert Base is not None
    assert hasattr(Base, "metadata")
