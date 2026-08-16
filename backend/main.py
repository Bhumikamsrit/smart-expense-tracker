
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="SpendWise API", version="1.0.0")

class Expense(BaseModel):
    merchant: str
    amount: float
    category: Optional[str] = None
    method: str = "UPI"

@app.get("/health")
def health():
    return {"status":"ok"}

@app.post("/v1/transactions")
def create_transaction(expense: Expense):
    return {
        "id": "demo",
        **expense.model_dump(),
        "status": "accepted",
        "architecture": "stateless-ingest -> event-bus -> categorizer -> analytics"
    }
