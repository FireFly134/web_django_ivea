import io
from typing import Any

from taskmanager.settings import Y_TOKEN

from yadisk import yadisk


class DownloadManager:
    def __init__(self) -> None:
        self.__y: yadisk.YaDisk = yadisk.YaDisk(token=Y_TOKEN)

    def __check_path(self, path: str) -> None:
        if not self.__y.exists(path):
            raise PathDoesNotExist(f"Указанный путь не существует ({path})")

    def __get_listdir(self, path: str) -> list[str]:
        return [
            el.path
            for el in self.__y.listdir(path)
            if isinstance(el.path, str)
        ]

    def __base_download(self, paths: list[str]) -> list[io.BytesIO]:
        files_list: list[io.BytesIO] = []

        for path in paths:
            self.__check_path(path)
            file: io.BytesIO = io.BytesIO()
            self.__y.download(path, file)
            file.seek(0)
            files_list.append(file)

        return files_list

    def download(self, paths: list[str]) -> list[io.BytesIO]:
        return self.__base_download(paths)

    def download_dir(self, dir_path: str) -> list[io.BytesIO]:
        return self.__base_download(self.__get_listdir(dir_path))

    def get_md5(self, path: str) -> Any:
        return self.__y.get_meta(path).md5

    def get_md5_dir(self, path: str) -> list[str]:
        return [
            el.md5 for el in self.__y.listdir(path) if isinstance(el.md5, str)
        ]

    def get_download_link(self, path: str) -> Any:
        return self.__y.get_meta(path).file


class PathDoesNotExist(Exception):
    pass
