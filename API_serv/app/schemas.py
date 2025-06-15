# API_serv/app/schemas.py

from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

# --- Evaluation Schemas ---
class EvaluationInList(BaseModel):
    id: int
    ouvrage: str = "Unknown"
    epreuve: str = ""
    type_question: str = ""
    total_question: str = ""

    model_config = ConfigDict(from_attributes=True)


# --- Choice Schemas ---
# This schema defines the shape of the JSON for a single choice.
class Choice(BaseModel):
    # This tells Pydantic: 
    #   "Create a JSON key 'choice_id' from the model's 'id' attribute."
    choice_id: int = Field(alias="id")
    
    identifier: str
    
    # "Create a JSON key 'text' from the model's 'choice_text' attribute."
    text: str = Field(alias="choice_text")
    
    # "Create a JSON key 'is_correct' from the model's 'is_correct_solution' attribute."
    is_correct: bool = Field(alias="is_correct_solution")
    
    # This vital config tells Pydantic it can read these attributes from an ORM model instance,
    # not just a dictionary.
    model_config = ConfigDict(from_attributes=True)


# --- Question Schemas ---
# This schema defines the shape for a single question, including its list of choices.
class Question(BaseModel):
    # "Create a JSON key 'question_id' from the model's 'id' attribute."
    question_id: int = Field(alias="id")
    question_text: str
    question_image_url: Optional[str] = None
    
    # This tells Pydantic that the 'choices' attribute from the ORM model
    # should be a list, and each item in that list must conform to our 'Choice' schema above.
    # Pydantic will automatically apply the aliasing for each choice.
    choices: List[Choice] = []

    model_config = ConfigDict(from_attributes=True)


# --- Answer Schemas ---
class UserAnswerCreate(BaseModel):
    # Accept either camelCase or snake_case keys from the client
    question_id: int = Field(..., alias="questionId")
    choice_id: int = Field(..., alias="choiceId")
    duration_ms: int | None = Field(None, alias="durationMs")

    model_config = ConfigDict(populate_by_name=True)


class BulkUserAnswerCreate(BaseModel):
    user_id: int = Field(..., alias="userId")
    answers: List[UserAnswerCreate]

    # Allow either field names or aliases in incoming payloads
    model_config = ConfigDict(populate_by_name=True)


class UserResultCreate(BaseModel):
    user_id: int = Field(..., alias="userId")
    bank_name: str = Field(..., alias="bankName")
    date: str
    score: float

    model_config = ConfigDict(populate_by_name=True)


class UserResult(BaseModel):
    bank_name: str = Field(..., alias="bankName")
    date: str
    score: float

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
