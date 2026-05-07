from pydantic import BaseModel


class GenerateRequest(BaseModel):
    topic: str
    direction: str = "custom"  # tech | lifestyle | finance | custom


class Source(BaseModel):
    title: str
    url: str
    snippet: str
    published_date: str | None = None


class GenerateResponse(BaseModel):
    sources: list[Source]
    news_article: str
    social_post: str
