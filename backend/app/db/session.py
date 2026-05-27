from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine_kwargs = {"pool_pre_ping": True}
database_url = settings.database_url
if database_url.startswith("sqlite"):
	engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
	url = make_url(database_url)
	if url.drivername in {"postgresql", "postgres"}:
		url = url.set(drivername="postgresql+psycopg")
	# Keep the real password when rebuilding the URL for the SQLAlchemy driver.
	database_url = url.render_as_string(hide_password=False)

engine = create_engine(database_url, **engine_kwargs)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
