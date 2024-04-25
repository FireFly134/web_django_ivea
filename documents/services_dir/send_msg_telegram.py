import asyncio
import os

from db_utils import engine

import pandas as pd

import telegram


bot = telegram.Bot(os.getenv("TELEGRAM_TOKEN", ""))


async def send_message(msg: str, chat_id: str) -> None:
    await bot.send_message(chat_id=chat_id, text=msg)


async def mass_send_message(msg: str) -> None:
    info = pd.read_sql(
        "SELECT user_id FROM doc_key_corp WHERE access > 0;", engine
    )
    for i in range(len(info)):
        if str(info.loc[i, "user_id"]) != "127522234":
            try:
                await bot.send_message(
                    chat_id=str(info.loc[i, "user_id"]), text=msg
                )
            except Exception as err:
                await bot.send_message(
                    chat_id="943180118",
                    text="Error2: \
                    Не удалось отправить сообщение пользователю! - "
                    + str(err)
                    + "\n",
                )


def go_main(msg: str, chat_id: str = "943180118") -> None:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    if chat_id == "all":
        loop.run_until_complete(mass_send_message(msg))
    else:
        loop.run_until_complete(send_message(msg, chat_id))


# def go_main(msg: str, chat_id: str = "943180118") -> None:
#     loop = asyncio.get_event_loop()
#     if chat_id == "all":
#         loop.run_until_complete(mass_send_message(msg))
#     else:
#         loop.run_until_complete(send_message(msg, chat_id))


if __name__ == "__main__":
    go_main("send test message!")
