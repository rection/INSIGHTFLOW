
import os
from tavily import TavilyClient
from schemas import Source


DIRECTION_CONTEXT = {
    "tech": "technology, AI, software, hardware, startups",
    "lifestyle": "lifestyle, health, travel, food, culture",
    "finance": "finance, economy, stocks, crypto, banking",
    "custom": "",
}


def search_news(topic: str, direction: str) -> list[Source]:
    client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

    query = topic
    context = DIRECTION_CONTEXT.get(direction, "")
    if context:
        query = f"{topic} {context}"

    results = client.search(
        query=query,
        topic="news",
        days=1,
        max_results=5,
    )

    sources = []
    for r in results.get("results", []):
        sources.append(
            Source(
                title=r.get("title", ""),
                url=r.get("url", ""),
                snippet=r.get("content", "")[:300],
                published_date=r.get("published_date"),
            )
        )

    if not sources:
        raise ValueError(f"No news found for topic: {topic}")

    return sources
