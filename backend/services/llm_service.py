import os
from functools import lru_cache
from openai import OpenAI
from schemas import Source

DIRECTION_LABELS = {
    "tech": "科技",
    "lifestyle": "生活",
    "finance": "财经",
    "custom": "综合",
}


@lru_cache
def _get_client() -> OpenAI:
    return OpenAI(
        api_key=os.environ["DEEPSEEK_API_KEY"],
        base_url="https://api.deepseek.com",
    )


def generate_content(
    sources: list[Source], topic: str, direction: str
) -> tuple[str, str]:
    direction_cn = DIRECTION_LABELS.get(direction, "综合")

    source_text = "\n\n".join(
        f"[{i+1}] {s.title}\n来源: {s.url}\n摘要: {s.snippet}"
        for i, s in enumerate(sources)
    )

    # Phase 1: News article
    news_article = _call_llm(
        system="你是一位专业的新闻编辑，擅长将多来源信息编排为严谨、信息量大的新闻稿件。",
        user=f"""基于以下参考资料，围绕主题「{topic}」（方向：{direction_cn}），撰写一篇约500字的专业新闻稿。

要求：
- 包含标题、导语、正文主体（逻辑分段）、简短评论
- 风格：客观、严谨、信息量大
- 包含具体的时间指引（如"昨日"、"本周"等）
- 引用参考资料时标注来源编号 [1][2] 等

参考资料：
{source_text}""",
    )

    # Phase 2: Social post
    social_post = _call_llm(
        system="你是一位社交媒体内容创作者，擅长将新闻转化为易于传播的帖子。",
        user=f"""基于以下新闻稿，生成一段适合小红书/微博/X 的社交媒体帖子。

要求：
- 吸睛标题（加粗）
- 使用 Emoji 表情
- 核心点位用 Bullet points
- 末尾附热门标签（Hashtags）
- 风格：口语化、易于传播、强互动性

新闻稿内容：
{news_article}""",
    )

    return news_article, social_post


def _call_llm(system: str, user: str) -> str:
    response = _get_client().chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.7,
        max_tokens=2000,
    )
    return response.choices[0].message.content
