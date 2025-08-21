import os
from dotenv import load_dotenv


load_dotenv()


class Settings:
    # Example MySQL: mysql+pymysql://user:pass@host:3306/dbname
    SQLALCHEMY_URL = os.getenv(
        "SQLALCHEMY_URL",
        "mysql+pymysql://root:poasword@127.0.0.1:3306/roomy"
    )


    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB = int(os.getenv("REDIS_DB", "0"))
    REDIS_TTL_SECONDS = int(os.getenv("REDIS_TTL_SECONDS", "3600")) # 1 hour


    MODEL_PATH = os.getenv("MODEL_PATH", "model.pkl")


settings = Settings()