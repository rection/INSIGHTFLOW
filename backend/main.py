from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import GenerateRequest, GenerateResponse
from services.search_service import search_news
from services.llm_service import generate_content

app = FastAPI(title="InsightFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/generate-content", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    # Step 1: Search
    try:
        sources = search_news(req.topic, req.direction)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Search failed: {e}")

    # Step 2: Generate content via LLM
    try:
        news_article, social_post = generate_content(sources, req.topic, req.direction)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"LLM generation failed: {e}")

    return GenerateResponse(
        sources=sources,
        news_article=news_article,
        social_post=social_post,
    )
