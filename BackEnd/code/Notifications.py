from datetime import date
from fastapi import WebSocket
from typing import List


class admin_notify:

    active_admins: List[WebSocket] = []

    @staticmethod
    async def notify_admins_new_transaction(username: str, game_name: str, transaction_id: int):
        for ws in list(admin_notify.active_admins):
            try:
                await ws.send_json({
                    "date": str(date.today()),
                    "type": "new_transaction",
                    "username": username,
                    "game_name": game_name,
                    "transaction_id": transaction_id
                })
                print("New Transaction Notfication Sent.")
            except Exception:
                admin_notify.active_admins.remove(ws)
