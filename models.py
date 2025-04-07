# modelo de la base de datos
from pydantic import BaseModel, Field
from typing  import Optional
from bson import ObjectId
from datetime import datetime, timezone

class Task(BaseModel):
    id: Optional[str] = Field(alias="_id")  # Asegura que `_id` de Mongo se maneje como `id`
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # Se genera automáticamente
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {datetime: lambda v: v.isoformat()} # Convierte datetime a ISO 8601

class UpdateTask(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True