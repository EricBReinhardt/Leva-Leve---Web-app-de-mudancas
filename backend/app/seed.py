from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.models import ClientProfile, DriverProfile, RequestStatus, SessionToken, TransportRequest, User, UserRole


def _hash_password(password: str) -> str:
    return f"hash::{password}"


def seed_database(db: Session) -> None:
    client = db.scalar(select(User).where(User.email == "cliente.teste@levaleve.com"))
    if not client:
        client = User(
            role=UserRole.client,
            name="Cliente Teste",
            email="cliente.teste@levaleve.com",
            phone="(11) 90000-0001",
            password_hash=_hash_password("Cliente123!"),
            avatar_url=None,
        )
        client.client_profile = ClientProfile(
            street="Rua das Flores",
            number="123",
            complement="Apto 42",
            neighborhood="Vila Mariana",
            city="Sao Paulo",
            state="SP",
            zip_code="04000-000",
            has_elevator=True,
            floor="3",
        )
        db.add(client)

    driver = db.scalar(select(User).where(User.email == "motorista.teste@levaleve.com"))
    if not driver:
        driver = User(
            role=UserRole.driver,
            name="Carlos Silva",
            email="motorista.teste@levaleve.com",
            phone="(11) 98888-0002",
            password_hash=_hash_password("Motorista123!"),
            avatar_url=None,
        )
        driver.driver_profile = DriverProfile(
            cpf="123.456.789-00",
            cnh="12345678901",
            vehicle_name="Fiat Fiorino",
            vehicle_plate="ABC-1234",
            vehicle_type="Van cargo",
            capacity_kg=650,
            rating=4.9,
            trips_completed=2847,
            available_balance=0.0,
        )
        db.add(driver)
    elif driver.driver_profile:
        driver.driver_profile.available_balance = 0.0
        driver.driver_profile.trips_completed = 0
        db.add(driver)

    db.execute(text("DELETE FROM transport_requests WHERE title = :title"), {"title": "Sofa de 3 lugares"})

    db.commit()


def create_session(db: Session, user_id: str) -> str:
    token = f"session::{user_id}::{datetime.now(timezone.utc).timestamp()}"
    db.add(SessionToken(token=token, user_id=user_id, expires_at=datetime.now(timezone.utc) + timedelta(days=7)))
    db.commit()
    return token
