import redis
import json
from typing import Optional
from app.config import settings

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)


def get_cache(key: str) -> Optional[dict]:
    """Get cached data"""
    try:
        data = redis_client.get(key)
        if data:
            return json.loads(data)
        return None
    except Exception as e:
        print(f"Cache get error: {e}")
        return None


def set_cache(key: str, value: dict, ttl: int = 300):
    """Set cache with TTL (default 5 minutes)"""
    try:
        redis_client.setex(key, ttl, json.dumps(value))
    except Exception as e:
        print(f"Cache set error: {e}")


def delete_cache(pattern: str):
    """Delete cache by pattern"""
    try:
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
    except Exception as e:
        print(f"Cache delete error: {e}")