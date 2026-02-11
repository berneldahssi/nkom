"""Auth endpoint tests."""

import pytest
from httpx import AsyncClient

API = "/api/v1"


@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    response = await client.post(
        f"{API}/auth/register",
        json={
            "email": "test@example.com",
            "password": "securepassword123",
            "first_name": "Test",
            "last_name": "User",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    payload = {
        "email": "dup@example.com",
        "password": "securepassword123",
        "first_name": "Dup",
        "last_name": "User",
    }
    await client.post(f"{API}/auth/register", json=payload)
    response = await client.post(f"{API}/auth/register", json=payload)
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    # Register first
    await client.post(
        f"{API}/auth/register",
        json={
            "email": "login@example.com",
            "password": "securepassword123",
            "first_name": "Login",
            "last_name": "User",
        },
    )
    # Then login
    response = await client.post(
        f"{API}/auth/login",
        json={"email": "login@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    await client.post(
        f"{API}/auth/register",
        json={
            "email": "wrong@example.com",
            "password": "securepassword123",
            "first_name": "Wrong",
            "last_name": "Pass",
        },
    )
    response = await client.post(
        f"{API}/auth/login",
        json={"email": "wrong@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
