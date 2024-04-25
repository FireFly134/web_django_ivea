import hashlib
import json
from enum import Enum
from io import BufferedReader
from typing import Any, Sequence

import redis

from taskmanager import settings


redis_instance = redis.StrictRedis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    password=settings.REDIS_PASSWORD,
)


class CacherMode(Enum):
    paths = "paths"
    md5 = "md5"


class RedisCacher:
    def __init__(
        self,
        service_name: str,
        hashes: Sequence[str | None] | None = None,
        paths: Sequence[str | None] | None = None,
        mode: CacherMode = CacherMode.md5,
    ) -> None:
        if not hashes and not paths:
            raise ValueError("Необходимо указать путь или хэш")
        self.__service_name = service_name
        self.__is_checked = False
        self.__mode = mode

        if self.__mode == CacherMode.md5:
            md5 = ""
            if hashes is not None:
                for el in hashes:
                    if isinstance(el, str):
                        md5 += el
            self.__md5 = md5
        elif self.__mode == CacherMode.paths:
            self.__paths = paths

    @staticmethod
    def __get_md5_of_file(file: BufferedReader) -> str:
        return hashlib.md5(file.read()).hexdigest()

    def check(self, skip: bool = False) -> bool:
        if not skip:
            result = self.__check_hash_sums()
            self.__is_checked = True
            return result
        return True

    def __check_hash_sums(self) -> bool:
        hash_from_redis = redis_instance.hget(self.__service_name, "hash")

        if self.__mode == CacherMode.md5:
            current_hash = self.__md5
        elif self.__mode == CacherMode.paths:
            current_hash = ""
            if self.__paths is None:
                raise ValueError("Нет доступных путей")
            for path in self.__paths:
                if path is not None:
                    with open(path, "rb") as f:
                        current_hash += self.__get_md5_of_file(f)

        self.__current_hash: str = current_hash

        if not isinstance(hash_from_redis, bytes):
            return False

        if hash_from_redis is not None:
            hash_from_redis = hash_from_redis.decode()

        if not hash_from_redis:
            return False

        return hash_from_redis == current_hash

    def update_cache(self, cache_dict: dict[str, Any]) -> None:
        if not self.__is_checked:
            raise Exception("Перед обновлением необходимо проверить хэш")
        redis_instance.hset(
            self.__service_name, "cache", json.dumps(cache_dict)
        )
        redis_instance.hset(self.__service_name, "hash", self.__current_hash)

    def get_cache(self) -> Any:
        if not self.__is_checked:
            raise Exception("Перед обновлением необходимо проверить хэш")
        cached_value = redis_instance.hget(self.__service_name, "cache")
        if isinstance(cached_value, bytes):
            return json.loads(cached_value)
