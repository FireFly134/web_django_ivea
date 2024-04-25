from typing import Any, IO

from taskmanager.settings import Y_TOKEN

from yadisk import yadisk
from yadisk.exceptions import PathExistsError
from yadisk.objects import OperationLinkObject


class UploadManager:
    def __init__(self, upload_path: str = "/") -> None:
        self.__y: yadisk.YaDisk = yadisk.YaDisk(token=Y_TOKEN)
        self.__upload_path = upload_path

    @staticmethod
    def __dir_to_valid(path: str) -> str:
        return (
            path.replace("\\", "_")
            .replace("/", "_")
            .replace(":", "_")
            .replace("*", "_")
            .replace("?", "_")
            .replace("»", "_")
            .replace("<", "_")
            .replace(">", "_")
            .replace("|", "_")
        )

    def upload(
        self,
        file: IO[Any],
        filename: str = "file",
        upload_path: str | None = None,
    ) -> Any:
        file.seek(0)
        path = upload_path if upload_path else self.__upload_path
        path += filename
        rlo = self.__y.upload(
            file,
            path,
        )
        return rlo.path

    def upload_all(
        self,
        files: list[IO[Any]],
        filenames: list[str],
        upload_path: str | None = None,
    ) -> list[Any]:
        paths = []

        for i, file in enumerate(files):
            file.seek(0)

            path = upload_path if upload_path else self.__upload_path
            path += filenames[i]

            if self.__y.exists(path):
                self.__y.remove(path)

            try:
                paths.append(self.__y.upload(file, path, timeout=1000.0).path)
            except PathExistsError:
                paths.append(path)

        return paths

    def mkdir(self, dir_name: str) -> Any:
        dir_name = self.__dir_to_valid(dir_name)
        dir_path = self.__upload_path + dir_name
        if not self.__y.exists(dir_path):
            dir_path = self.__y.mkdir(dir_path).path
        return dir_path + "/"

    def delete(self, path: str) -> OperationLinkObject | None:
        return self.__y.remove(path)
