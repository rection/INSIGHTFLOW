# InsightFlow — 开发文档

> AI 资讯编排引擎：输入主题，自动检索最新资讯，生成专业新闻稿与社交媒体帖子。

---

## 目录

- [1. 项目概览](#1-项目概览)
- [2. 技术栈](#2-技术栈)
- [3. 项目结构](#3-项目结构)
- [4. 环境配置](#4-环境配置)
- [5. 快速启动](#5-快速启动)
- [6. 架构设计](#6-架构设计)
- [7. 前端详解](#7-前端详解)
- [8. 后端详解](#8-后端详解)
- [9. API 接口文档](#9-api-接口文档)
- [10. 数据模型](#10-数据模型)
- [11. UI 设计规范](#11-ui-设计规范)
- [12. 已知问题与注意事项](#12-已知问题与注意事项)
- [13. 扩展方向](#13-扩展方向)

---

## 1. 项目概览

InsightFlow 是一个基于 AI 的资讯编排工具，工作流程为：

```
用户输入主题 + 方向
  → Tavily API 实时检索相关新闻
  → DeepSeek LLM 编排为专业新闻稿（~500字）
  → DeepSeek LLM 二次生成社交媒体帖子
  → 前端展示：参考资料列表 + 新闻稿 + 社交贴片（一键复制）
```

**核心价值**：将新闻检索、内容编排、格式适配三步合一，节省内容创作者的信息处理时间。

---

## 2. 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 15.5.16 | React 框架（App Router, RSC） |
| React | 18.3.1 | UI 库 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 4.x | 原子化 CSS |
| shadcn/ui | 4.7.0 (base-nova) | UI 组件库 |
| Three.js | 0.184.0 | WebGL 粒子动画背景 |
| Axios | 1.16.0 | HTTP 请求 |
| Lucide React | 1.14.0 | 图标库 |
| tw-animate-css | 1.4.0 | Tailwind 动画扩展 |

### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| FastAPI | 0.115.6 | Web 框架 |
| Uvicorn | 0.34.0 | ASGI 服务器 |
| Pydantic | 2.10.4 | 数据验证 |
| Tavily Python | 0.5.0 | 新闻检索 API |
| OpenAI SDK | 1.58.1 | DeepSeek LLM 调用（兼容 OpenAI 接口） |
| python-dotenv | 1.0.1 | 环境变量加载 |

### 外部 API

| 服务 | 用途 | 定价模型 |
|------|------|----------|
| [Tavily](https://tavily.com) | 实时新闻检索 | 按请求计费 |
| [DeepSeek](https://platform.deepseek.com) | LLM 内容生成 | 按 token 计费 |

---

## 3. 项目结构

```
素材收集工具/
├── frontend/                    # Next.js 前端
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # 根布局（字体、元数据、暗色主题）
│   │   │   ├── page.tsx         # 首页（状态管理、布局编排）
│   │   │   └── globals.css      # 全局样式（主题变量、动画、玻璃态效果）
│   │   ├── components/
│   │   │   ├── NeuralBackground.tsx   # Three.js 粒子动画背景
│   │   │   ├── SearchComponent.tsx    # 搜索栏（主题输入 + 方向选择）
│   │   │   ├── ResultView.tsx         # 结果展示（参考资料 + 内容标签页）
│   │   │   ├── ContentTabs.tsx        # 内容切换（新闻稿 / 社交贴片 + 复制）
│   │   │   └── ui/                    # shadcn/ui 基础组件
│   │   │       ├── button.tsx
│   │   │       ├── input.tsx
│   │   │       ├── select.tsx
│   │   │       ├── tabs.tsx
│   │   │       └── badge.tsx
│   │   └── lib/
│   │       ├── api.ts           # API 客户端（Axios 实例 + 请求函数）
│   │       ├── types.ts         # TypeScript 类型定义
│   │       └── utils.ts         # 工具函数（cn 合并类名）
│   ├── public/                  # 静态资源
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts           # Next.js 配置（当前为空）
│   ├── postcss.config.mjs       # PostCSS 配置
│   ├── eslint.config.mjs        # ESLint 配置
│   ├── components.json          # shadcn/ui 配置
│   └── .env.local.example       # 环境变量模板
│
├── backend/                     # FastAPI 后端
│   ├── main.py                  # 应用入口（路由、CORS、错误处理）
│   ├── schemas.py               # Pydantic 数据模型
│   ├── services/
│   │   ├── __init__.py
│   │   ├── search_service.py    # Tavily 新闻检索
│   │   └── llm_service.py       # DeepSeek LLM 内容生成
│   ├── requirements.txt         # Python 依赖
│   ├── .env.example             # 环境变量模板
│   └── .venv/                   # Python 虚拟环境
│
└── DEVELOPMENT.md               # 本文档
```

---

## 4. 环境配置

### 前端环境变量

创建 `frontend/.env.local`：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 后端环境变量

创建 `backend/.env`：

```env
TAVILY_API_KEY=tvly-dev-xxxxxxxxxxxxxxxx
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
```

> **注意**：`.env` 文件包含敏感密钥，务必加入 `.gitignore`，不要提交到版本控制。

### 获取 API Key

- **Tavily**：注册 [tavily.com](https://tavily.com)，在 Dashboard 获取 API Key
- **DeepSeek**：注册 [platform.deepseek.com](https://platform.deepseek.com)，在 API Keys 页面创建

---

## 5. 快速启动

### 启动后端

```bash
cd backend

# 创建虚拟环境（首次）
python -m venv .venv

# 激活虚拟环境
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动服务
uvicorn main:app --reload --port 8000
```

后端启动后访问 http://localhost:8000/docs 查看自动生成的 Swagger API 文档。

### 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端默认运行在 http://localhost:3000。

### 构建生产版本

```bash
cd frontend
npm run build
npm start
```

---

## 6. 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────┐
│                  浏览器 (React)                   │
│                                                   │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │ SearchBar │→│ ResultView │→│ ContentTabs   │  │
│  └────┬─────┘  └─────┬─────┘  └──────────────┘  │
│       │              │                            │
│       └── Axios ─────┘                            │
│              POST /api/generate-content            │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│              FastAPI 后端 (:8000)                  │
│                                                   │
│  POST /api/generate-content                       │
│    │                                              │
│    ├─ Step 1: search_news(topic, direction)       │
│    │   └─→ Tavily API (实时新闻检索)               │
│    │                                              │
│    ├─ Step 2: generate_content(sources, ...)      │
│    │   ├─→ DeepSeek LLM (生成新闻稿)              │
│    │   └─→ DeepSeek LLM (生成社交帖子)            │
│    │                                              │
│    └─→ 返回 GenerateResponse                      │
└──────────────────────────────────────────────────┘
```

### 数据流

```
用户输入: topic="AI芯片最新进展", direction="tech"
    │
    ▼
搜索查询: "AI芯片最新进展 technology, AI, software, hardware, startups"
    │
    ▼
Tavily 返回: 5 条新闻源 (title, url, content, published_date)
    │
    ▼
Phase 1 LLM: 将 5 条新闻源编排为 ~500 字专业新闻稿
    │
    ▼
Phase 2 LLM: 将新闻稿转化为社交媒体帖子（含 Emoji、Hashtags）
    │
    ▼
返回: { sources[], news_article, social_post }
```

---

## 7. 前端详解

### 7.1 设计方向："Intelligence Briefing"

采用深色情报简报风格，核心设计语言：
- **色彩**：深墨黑背景 `#05050c`，暖白色文字，青绿强调色
- **字体**：Playfair Display（标题，编辑感）+ Outfit（正文）+ JetBrains Mono（数据/代码）
- **效果**：暗角叠加 (vignette)、终端风格搜索栏、编辑卡片式布局
- **动效**：结果区模糊淡入、源卡片依次滑入、光标闪烁

### 7.2 页面架构 (`page.tsx`)

首页是单页应用，管理四个核心状态：

| 状态 | 类型 | 用途 |
|------|------|------|
| `result` | `GenerateResponse \| null` | API 返回的生成结果 |
| `loading` | `boolean` | 请求加载状态 |
| `error` | `string` | 错误信息 |
| `hasSearched` | `boolean` | 是否已搜索过（控制 Hero 区域收缩动画） |

布局结构：
- **Header**：极简式 — "IF//" 品牌缩写 + 分隔线 + "INSIGHTFLOW" + 右侧 "SYS:ONLINE" 状态
- **Hero**：编辑部风格 — "AI INTELLIGENCE ENGINE" 上标 + Playfair Display 大标题 "资讯洞察，一触即达" + 渐变下划线
- **Search**：终端风格搜索栏，`>` 闪烁光标提示符
- **Loading Skeleton**：简约骨架屏（1:2 栅格布局）
- **Results**：280px 侧栏 + 内容区的两栏布局
- **Footer**：系统信息 — 版本号、引擎、延迟

额外层：
- **暗角叠加层**：固定定位的径向渐变，四周加深
- **WebGL 背景**：更微妙的粒子动画

### 7.3 搜索组件 (`SearchComponent.tsx`)

终端命令行风格搜索栏：
- **光标提示符**：`>` 符号，focus 时亮度提升，持续脉冲动画
- **输入框**：无边框透明背景，placeholder "输入主题进行深度检索..."
- **方向选择器**：底部行，标签 "分类" + 四个按钮（科技/生活/财经/综合），选中时青色高亮
- **快速建议**：标题 "TRENDING" + 三个建议按钮
- **交互**：focus 时容器边框变亮 + 微发光阴影

### 7.4 结果展示 (`ResultView.tsx`)

两栏布局（280px + 1fr）：
- **左侧**：参考资料列表
  - 标题行："参考资料" + 分隔线 + 条数计数
  - 源卡片：序号 `01`~`05`（monospace）+ 标题 + 摘要 + 日期
  - 悬停效果：背景变亮 + 边框青色
  - 统计栏：字数 / 预估阅读时间 / 来源数量
- **右侧**：`ContentTabs` 组件

### 7.5 内容标签页 (`ContentTabs.tsx`)

自定义 Tab 实现（未使用 shadcn/ui）：
- **Tab 按钮**：图标 + 标签，选中时底部青色/绿色下划线
- **专业新闻稿 Tab**：青色主题
- **社交贴片 Tab**：绿色主题
- **内容区**：正文显示 + 右上角复制按钮

每个 Tab 包含 `CopyableContent` 组件：
- 显示内容全文（`pre-wrap` 保留换行）
- 右上角一键复制按钮（复制后显示绿色 "已复制" 反馈，2 秒恢复）

### 7.6 WebGL 背景 (`NeuralBackground.tsx`)

更微妙的粒子动画（匹配编辑部风格）：
- **50 个粒子**：较小、较低透明度、较慢运动
- **连线阈值**：4.0（更宽松，连线更少）
- **线条透明度**：0.05（非常淡）
- **叠加渐变**：从半透明到全黑，确保内容可读性
- **SSR 兼容**：通过 `next/dynamic` + `ssr: false` 确保仅客户端加载
- **降级处理**：WebGL 不可用时静默失败，不影响页面功能

### 7.7 API 客户端 (`api.ts`)

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 60000,  // 60秒超时（LLM 生成可能较慢）
});

// 唯一接口
async function generateContent(req: GenerateRequest): Promise<GenerateResponse>
```

### 7.8 类型定义 (`types.ts`)

```typescript
interface Source {
  title: string;
  url: string;
  snippet: string;
  published_date: string | null;
}

interface GenerateRequest {
  topic: string;
  direction: "tech" | "lifestyle" | "finance" | "custom";
}

interface GenerateResponse {
  sources: Source[];
  news_article: string;
  social_post: string;
}
```

---

## 8. 后端详解

### 8.1 应用入口 (`main.py`)

```python
app = FastAPI(title="InsightFlow API")
```

- **CORS 配置**：允许 `http://localhost:3000` 跨域
- **唯一路由**：`POST /api/generate-content`
- **错误处理**：
  - 搜索失败 → HTTP 502
  - LLM 生成失败 → HTTP 503

### 8.2 搜索服务 (`search_service.py`)

```python
def search_news(topic: str, direction: str) -> list[Source]:
```

- 使用 Tavily Client 搜索，过滤最近 1 天的新闻，最多返回 5 条
- 方向映射表：

| direction | 搜索附加关键词 |
|-----------|---------------|
| `tech` | technology, AI, software, hardware, startups |
| `lifestyle` | lifestyle, health, travel, food, culture |
| `finance` | finance, economy, stocks, crypto, banking |
| `custom` | （无附加） |

- 如果未找到结果，抛出 `ValueError`

### 8.3 LLM 服务 (`llm_service.py`)

```python
@lru_cache
def _get_client() -> OpenAI:
    return OpenAI(api_key=os.environ["DEEPSEEK_API_KEY"], base_url="https://api.deepseek.com")
```

两阶段生成流程：

**Phase 1 — 新闻稿生成**
- System prompt：专业新闻编辑角色
- 要求：标题、导语、正文分段、简短评论，~500 字
- 风格：客观、严谨、信息量大
- 引用来源编号 [1][2]

**Phase 2 — 社交帖子生成**
- System prompt：社交媒体内容创作者角色
- 要求：吸睛标题（加粗）、Emoji、Bullet points、Hashtags
- 风格：口语化、易于传播、强互动性
- 目标平台：小红书 / 微博 / X

LLM 调用参数：
- 模型：`deepseek-chat`
- Temperature：0.7
- Max tokens：2000

### 8.4 数据模型 (`schemas.py`)

```python
class GenerateRequest(BaseModel):
    topic: str
    direction: str = "custom"

class Source(BaseModel):
    title: str
    url: str
    snippet: str
    published_date: str | None = None

class GenerateResponse(BaseModel):
    sources: list[Source]
    news_article: str
    social_post: str
```

---

## 9. API 接口文档

### `POST /api/generate-content`

**请求**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `topic` | `string` | 是 | 搜索主题，如 "AI芯片最新进展" |
| `direction` | `string` | 否（默认 `"custom"`） | 内容方向：`tech` / `lifestyle` / `finance` / `custom` |

**请求示例**

```json
{
  "topic": "AI芯片最新进展",
  "direction": "tech"
}
```

**成功响应** `200 OK`

```json
{
  "sources": [
    {
      "title": "英伟达发布新一代AI芯片...",
      "url": "https://example.com/news/1",
      "snippet": "英伟达于昨日发布了...",
      "published_date": "2025-01-15"
    }
  ],
  "news_article": "英伟达发布新一代AI芯片，算力提升300%\n\n导语：...\n\n正文：...",
  "social_post": "**重磅！英伟达AI芯片大升级**\n\n 算力暴增300%\n ...\n\n#英伟达 #AI芯片"
}
```

**错误响应**

| 状态码 | 原因 | 示例 |
|--------|------|------|
| `502` | 搜索服务失败 | `{"detail": "Search failed: No news found for topic: xxx"}` |
| `503` | LLM 生成失败 | `{"detail": "LLM generation failed: ..."}` |

---

## 10. 数据模型

### 实体关系

```
GenerateRequest
  │
  ├─ topic: str          → 搜索关键词
  ├─ direction: str      → 搜索方向（tech / lifestyle / finance / custom）
  │
  ▼
GenerateResponse
  ├─ sources: Source[]   → 检索到的新闻源（1~5 条）
  │   ├─ title: str
  │   ├─ url: str
  │   ├─ snippet: str
  │   └─ published_date: str | null
  ├─ news_article: str   → LLM 生成的新闻稿
  └─ social_post: str    → LLM 生成的社交帖子
```

---

## 11. UI 设计规范

### 设计方向：Intelligence Briefing

灵感来源：高端情报简报系统 × 编辑部排版。深色沉浸背景、编辑感排版、终端风格交互元素。

### 主题色板

| 语义 | 色值 | 用途 |
|------|------|------|
| Background | `#05050c` | 深墨黑背景 |
| Text Primary | `rgba(240,240,240,0.9)` | 近白色主文字 |
| Text Secondary | `rgba(240,240,240,0.35)` | 次要文字 |
| Text Muted | `rgba(240,240,240,0.18)` | 弱化文字（标签、状态） |
| Accent Cyan | `rgba(0,240,255,0.8)` | 主强调色（按钮、高亮、光标） |
| Accent Green | `rgba(0,255,136,0.8)` | 辅助强调色（社交帖子 Tab、成功反馈） |
| Border | `rgba(255,255,255,0.03)~0.06` | 分隔线、卡片边框 |
| Error | `#ff6b6b` / `rgba(200,30,30,0.15)` | 错误提示 |

### 字体系统

| 字体 | CSS 变量 | 用途 |
|------|----------|------|
| Playfair Display | `--font-playfair` | 页面大标题（编辑感、权威感） |
| Outfit | `--font-sans` | 正文、UI 文字 |
| JetBrains Mono | `--font-mono` | 数据、序号、标签、状态信息 |

### CSS 动画

| 关键帧 | 效果 |
|--------|------|
| `resultReveal` | 结果区：从下方淡入 + 模糊消除 |
| `sourceSlideIn` | 源卡片：从左侧滑入 |
| `briefFadeIn` | 内容区：简单淡入 |
| `cursorPulse` | 光标提示符：亮度脉冲 |
| `animate-fade-up` | 通用：从下方淡入（保留） |
| `animate-fade-in` | 通用：淡入（保留） |

### 自定义滚动条

5px 宽，青色半透明滑块，透明轨道。

---

## 12. 已知问题与注意事项

### 12.1 WebGL 上下文限制

`NeuralBackground` 组件在开发模式下可能触发 "WebGL context could not be created" 错误。原因：React StrictMode 在开发模式下会双倍执行 Effect，导致两个 WebGL 上下文连续创建/销毁，浏览器可能拒绝第二个上下文。

当前已通过 try-catch 做了降级处理——WebGL 不可用时静默跳过，不影响功能。

### 12.2 同源策略 (CORS)

后端 CORS 仅允许 `http://localhost:3000`。生产部署时需要在 `main.py` 中更新 `allow_origins`。

### 12.3 API Key 安全

- API Key 存储在后端 `.env` 文件中，仅服务端使用，不会暴露给前端
- 前端 `NEXT_PUBLIC_API_URL` 是公开变量，不包含敏感信息
- 确保 `.env` 已加入 `.gitignore`

### 12.4 LLM 超时

DeepSeek API 响应时间取决于内容长度和网络状况，前端设置了 60 秒超时。如果经常超时，考虑：
- 减少 `max_tokens`（当前 2000）
- 使用流式响应（SSE）

### 12.5 搜索结果为空

如果 Tavily 对某主题未返回任何结果，后端会抛出 502 错误。可考虑添加 fallback 逻辑（如放宽时间范围到 7 天）。

---

## 13. 扩展方向

### 短期（1~2 周）

- [ ] **更多内容方向**：教育、娱乐、体育、医疗、法律等，支持自定义方向关键词
- [ ] **流式输出 (SSE)**：后端改为 Server-Sent Events，前端实时展示 LLM 逐字生成过程，提升用户体验
- [ ] **搜索结果缓存**：对相同 topic + direction 组合缓存 Tavily 结果（Redis / 本地文件），减少 API 调用
- [ ] **历史记录**：本地存储（localStorage）最近 20 条搜索记录，支持一键回看和重新生成
- [ ] **响应式优化**：移动端适配（搜索栏堆叠、结果区单栏、字体缩放）
- [ ] **错误重试**：网络失败时提供重试按钮，自动重试 3 次（指数退避）

### 中期（1~2 月）

- [ ] **用户认证系统**：GitHub / Google OAuth 登录，个人 workspace 隔离
- [ ] **内容编辑功能**：生成后可直接在页面上编辑修改，支持 Markdown 格式
- [ ] **导出功能**：
  - Markdown 文件下载
  - PDF 导出（支持自定义模板）
  - 一键复制为 HTML 格式（保留富文本格式）
- [ ] **多语言支持**：中 / 英 / 日三语界面切换，LLM 输出语言可选
- [ ] **批量生成**：一次输入多个主题，批量生成新闻稿和社交帖子
- [ ] **自定义 Prompt**：允许用户自定义新闻稿和社交帖子的生成模板
- [ ] **字数 / 风格控制**：新闻稿长度（300/500/800 字）、语气（正式/轻松/幽默）

### 长期（3~6 月）

- [ ] **多 LLM 支持**：
  - 模型切换：DeepSeek / GPT-4o / Claude / 通义千问
  - 模型对比：同一输入多模型并行生成，对比质量
  - 成本估算：显示每次请求的 token 消耗和费用
- [ ] **RAG 增强**：
  - 向量数据库（Pinecone / Qdrant）存储历史搜索内容
  - 新查询时检索相似历史内容作为补充上下文
  - 企业知识库上传（PDF/Word/网页），基于私有数据生成
- [ ] **团队协作**：
  - 团队空间：共享搜索历史和生成内容
  - 角色权限：管理员 / 编辑 / 查看者
  - 审核流程：内容发布前多级审核
- [ ] **内容质量评分**：
  - 自动评分系统：信息密度、可读性、SEO 友好度
  - 用户反馈循环：点赞 / 点踩，反馈用于优化 prompt
  - A/B 测试：同主题不同 prompt 版本对比
- [ ] **工作流自动化**：
  - 定时任务：每日/每周自动生成特定主题内容
  - Webhook 集成：生成完成后自动推送到 CMS / 社交媒体
  - API 开放：提供公开 API 供第三方集成
- [ ] **数据分析面板**：
  - 使用统计：搜索次数、热门主题、生成字数
  - 内容分析：关键词云、趋势图
  - 成本追踪：API 调用费用统计
