import asyncio
import os

import telegram
from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
)


async def notification_of_new_counterparties(
    name: str,
    inn: str,
    edit_url: str,
) -> None:
    bot = telegram.Bot(os.getenv("TELEGRAM_TOKEN", ""))
    id_telegram_supply: str = os.getenv("SUPPLY_ID", "")
    text = f"""Добавлен новый контрагент
Полное наименование: {name}
Группа: Поставщики
Вид контрагента: Юридическое лицо
ИНН контрагента: {inn}
{edit_url}"""
    keyboard = [
        [
            InlineKeyboardButton(
                "Заполнить данные через бота",
                callback_data=f"update_k_info-\
        {int(inn)}",
            )
        ],
        [
            InlineKeyboardButton(
                "Заполнить данные через сайт",
                url=edit_url,
            )
        ],
    ]
    try:
        await bot.send_message(
            chat_id=id_telegram_supply,
            text=text,
            reply_markup=InlineKeyboardMarkup(keyboard),
        )
    except Exception as err:
        print(
            "ERROR - ./ivea/ui/web/invoice_analysis/utils/tg_notifications.py",
            err,
        )


def send_notification_about_new_counterparty(
    name: str,
    inn: str,
    edit_url: str,
) -> None:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(
        notification_of_new_counterparties(name, inn, edit_url)
    )
