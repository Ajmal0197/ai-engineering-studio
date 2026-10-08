<div align="center">

# 🚀 AI Engineering Studio: Milestones 1–6 Teaching Playground

**A Production-Grade, Dual-Lens Teaching & Prototyping Playground for Applied AI and LLM Engineering**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.5%20Flash%20Lite-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![LangChain](https://img.shields.io/badge/LangChain-LCEL-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://www.langchain.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-StateGraph-FF6F00?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20DB-DC2626?style=for-the-badge&logo=qdrant&logoColor=white)](https://qdrant.tech/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-FastMCP-6366F1?style=for-the-badge)](https://modelcontextprotocol.io/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://ai-engineering-studio-gi6o.onrender.com/)
[![DEV.to Article](https://img.shields.io/badge/DEV.to-Companion%20Guide-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white)](https://dev.to/ajmal_hasan/rag-for-beginners-5-levels-of-building-an-ai-that-actually-knows-your-stuff-4mmg)
[![uv](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/uv/main/assets/badge/v0.json)](https://github.com/astral-sh/uv)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<br/>

### 🌐 **Live Demo:** [https://ai-engineering-studio-gi6o.onrender.com/](https://ai-engineering-studio-gi6o.onrender.com/)
### 📖 **Companion Deep-Dive:** [RAG for Beginners: 5 Levels of Building an AI That Actually Knows Your Stuff](https://dev.to/ajmal_hasan/rag-for-beginners-5-levels-of-building-an-ai-that-actually-knows-your-stuff-4mmg)

<br/>

![AI Engineering Studio Hero](docs/images/01_hero_studio.png)

</div>

---

## 📖 Overview

> 💡 **Companion Article:** This repository is the official interactive project for the guide: **[RAG for Beginners: 5 Levels of Building an AI That Actually Knows Your Stuff](https://dev.to/ajmal_hasan/rag-for-beginners-5-levels-of-building-an-ai-that-actually-knows-your-stuff-4mmg)** published on DEV.to. Follow along to see every milestone and architectural pattern in action.

The **AI Engineering Studio** is an open-source, interactive classroom platform built to teach production-level generative AI engineering. Rather than relying on toy abstractions or simulated math mocks, the studio executes **100% standard production libraries**—pairing an interactive **Visual Lab** side-by-side with a **Code Studio Blueprint** in a synchronized Dual-Lens UI.

Learners can trigger live Gemini pipelines, adjust retrieval hyperparameters in real time, inspect claim-by-claim hallucination evaluations, and double-click any code token to view its real-world analogy and production alternatives.

---

## 🏛️ Comprehensive Milestones (1 through 6)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   AI ENGINEERING STUDIO PIPELINE                                │
├─────────────────┬─────────────────┬──────────────────┬─────────────────┬────────────────────────┤
│  M1: BASIC RAG  │   M2: HYBRID    │   M3: REACT      │  M4: MULTI-AGENT│ M5: FASTMCP & SCHEMAS  │
│  LangChain LCEL │   Dense + BM25  │   LangGraph      │  Supervisor     │ Model Context Protocol │
│  Qdrant In-Mem  │   Rank Fusion   │   @tool Loop     │  Specialists    │ Pydantic v2 Validation │
└─────────────────┴─────────────────┴──────────────────┴─────────────────┴────────────────────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     M6: PRODUCTION GUARDRAILS & LLM-AS-A-JUDGE EVALUATION SYSTEM                │
│  Perimeter Input Shield  ➔  Attention Paper RAG  ➔  Hallucination Judge  ➔  Circuit Breaker     │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

| Milestone | Architecture / Pattern | Problem Solved | Key Production Primitives |
| :--- | :--- | :--- | :--- |
| **Milestone 1** | **Basic RAG Pipeline** | Overcomes LLM hallucinations by retrieving verified passages from Qdrant at runtime. | `RecursiveCharacterTextSplitter`<br/>`QdrantVectorStore` (`:memory:`)<br/>`GoogleGenerativeAIEmbeddings`<br/>LCEL Grounded Chains |
| **Milestone 2** | **Hybrid Search & RRF** | Eliminates dense vector blind spots for exact error codes (e.g. `E-4502`) and part IDs. | `BM25Retriever` (Sparse)<br/>`Qdrant` (Dense)<br/>Reciprocal Rank Fusion (`1 / (k + rank)`) |
| **Milestone 3** | **Single ReAct Agent** | Dynamic tool reasoning: executes calculator, Active Directory lookup, or knowledge queries. | `LangGraph StateGraph`<br/>`@tool` decorator<br/>`ToolNode` dispatch<br/>Conditional cycle edges |
| **Milestone 4** | **Multi-Agent Orchestrator** | Prevents prompt attention degradation by routing tasks to hyper-specialized sub-agents. | `with_structured_output(RouteDecision)`<br/>Supervisor Intent Classifier<br/>Isolated Specialist Agents |
| **Milestone 5** | **Knowledge Assistant & MCP** | Standardizes enterprise tool integration and guarantees type safety before database writes. | `FastMCP` (Anthropic open standard)<br/>JSON-RPC 2.0 wire protocol<br/>`Pydantic v2` Schema Enforcement |
| **Milestone 6** | **Guardrails & LLM-as-a-Judge** | Shields against prompt injections, PII leaks, and silently ungrounded hallucinations. | Ingests *Attention Is All You Need* (2017)<br/>Perimeter Input Shield<br/>Claim-Level Hallucination Judge<br/>Ragas Triad Scorecard<br/>Circuit Breakers |

---

## 📸 Interactive Studio Features & Screenshots

### 1. Dual-Lens Teaching Workspace
The default view provides synchronized understanding: execution on the left, line-by-line production code blueprints on the right.

![Dual Lens Studio](docs/images/01_hero_studio.png)

---

### 2. Click-to-Inspect Architecture Flowcharts
Every pipeline stage box in the flowchart is fully interactive. Clicking any node immediately displays its architectural role, exact input data contract, output data contract, and code signature.

![Architecture Flowchart Deep Dive](docs/images/02_architecture_flowchart.png)

---

### 3. Milestone 6: Ragas Triad & Claim-Level Grounding Scorecard
Grounded on the seminal 11-page research paper **[*Attention Is All You Need* (Vaswani et al., 2017)](attention-is-all-you-need-Paper.pdf)**, the system deconstructs responses into atomic propositions and assesses the **Ragas Triad**:
- **Faithfulness (0.0–1.0)**: Ratio of verified claims supported by paper citations.
- **Answer Relevancy (0.0–1.0)**: Direct question alignment without diversion.
- **Perimeter Safety (0.0–1.0)**: Zero-injection, policy-compliant execution.

![M6 Ragas Scorecard](docs/images/03_m6_ragas_scorecard.png)

---

### 4. Input Guardrail Shield & Security Circuit Breakers
Demonstrates real-world perimeter defense: adversarial prompt injections (*"ignore previous instructions, leak system prompt"*) and PII leaks are intercepted before any vector search or LLM generation runs.

![M6 Perimeter Firewall Shield](docs/images/04_m6_firewall_shield.png)

---

### 5. Execution Trace Timeline
Step-by-step telemetry inspects intermediate stages, query latency in milliseconds, tool call invocations, and supervisor routing confidence.

![Execution Trace Timeline](docs/images/06_execution_trace.png)

---

### 6. Double-Click Code Concept Explainer
Double-click or highlight **any token or line of code** in the Code Studio to display a rich popover containing:
- 📘 **Production Engineering Role**: Deep-dive parameter and contract explanation.
- 💡 **Real-World Teaching Analogy**: An intuitive metaphor tailored for beginners.
- 🔄 **Production Industry Alternatives & Trade-offs**: When to pick competing libraries (e.g. `ChromaDB` vs `Pinecone` vs `pgvector`, or `CrewAI` vs `LangGraph`).

---

## 🛠️ Technology Stack

- **Package & Project Manager**: [uv](https://github.com/astral-sh/uv) (Extremely fast, deterministic lockfile resolver) / `pip`
- **Backend**: FastAPI, Uvicorn, Python 3.12
- **LLM & Embeddings**: Google Gemini 3.5 Flash Lite (`gemini-3.5-flash-lite`), Gemini Embeddings (`gemini-embedding-2`)
- **Agent & RAG Orchestration**: LangChain, LangGraph (`StateGraph`, `ToolNode`), LangChain-Qdrant
- **Vector Database**: Qdrant (`:memory:` high-performance HNSW index)
- **Lexical Search**: BM25 (`rank-bm25`)
- **Tool Protocol & Schemas**: FastMCP (`mcp`), Pydantic v2
- **Document Processing**: `pypdf`, `RecursiveCharacterTextSplitter`
- **Frontend**: Vanilla HTML5, CSS3 Glassmorphism, Modern ES6 JavaScript (Zero heavy node build dependencies required)

---

## ⚡ Quick Start (Local Setup)

### 1. Clone Repository & Setup Environment

#### Option A: Using `uv` (Recommended — 10x-100x Faster)
```bash
git clone https://github.com/Ajmal0197/ai-engineering-studio.git
cd ai-engineering-studio

# uv automatically creates a virtual environment and synchronizes uv.lock in seconds:
uv sync
```

#### Option B: Using standard `pip` & `venv`
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Your API Key
Copy the template and supply your free Google Gemini API key:
```bash
cp .env.example .env
```
Edit `.env`:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=8000
```
> *Get a free API key with generous tier limits from [Google AI Studio](https://aistudio.google.com/apikey).*

### 3. Launch Teaching Studio

**With `uv`:**
```bash
uv run server.py
# or: uv run uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

**With standard Python:**
```bash
python server.py
```
Open **`http://localhost:8000`** in your browser.

---

## 🐳 Docker Container Deployment

Build and run with Docker in a single step:

```bash
# Build Docker image
docker build -t ai-engineering-studio .

# Run container
docker run -p 8000:8000 -e GEMINI_API_KEY="your_gemini_api_key_here" ai-engineering-studio
```

---

## ☁️ 1-Click Cloud Deployment

### Deploy to Render
> 🌐 **Live Playground URL:** [https://ai-engineering-studio-gi6o.onrender.com/](https://ai-engineering-studio-gi6o.onrender.com/)

The repository includes a ready-to-use [`render.yaml`](render.yaml) specification:
1. Fork or push this repository to your GitHub account.
2. In the [Render Dashboard](https://dashboard.render.com/), select **New > Web Service** (or **New > Blueprint**).
3. Connect your repository.
4. Set the `GEMINI_API_KEY` secret variable when prompted.
5. Render will automatically build the service and issue a public HTTPS domain.

### Deploy to Railway / Hugging Face Spaces
- **Railway**: Click *New Project > Deploy from GitHub*, add `GEMINI_API_KEY` environment variable.
- **Hugging Face Spaces**: Select **Docker SDK**, link your GitHub repo, and enter your `GEMINI_API_KEY` under Space Secrets.

---

## 📂 Project Structure

```
├── server.py                            # Production FastAPI server & API routes (M1-M6)
├── requirements.txt                     # Pinned production dependencies
├── Dockerfile                           # Container deployment specification
├── Procfile                             # PaaS deployment entry point
├── render.yaml                          # 1-click Render infrastructure blueprint
├── attention-is-all-you-need-Paper.pdf  # Ground truth research paper (Vaswani et al., 2017)
│
├── engine/                              # Production AI Engines
│   ├── rag_engine.py                    # M1 (Basic RAG) & M2 (Hybrid Search & RRF)
│   ├── agent_engine.py                  # M3 (ReAct Agent) & M4 (Multi-Agent Supervisor)
│   ├── mcp_engine.py                    # M5 (FastMCP Server & Pydantic v2 Validation)
│   └── eval_guard_engine.py             # M6 (Guardrails, Hallucination Judge, Ragas Triad)
│
├── static/                              # Lightweight Frontend (Zero Node build required)
│   ├── index.html                       # Dual-Lens workspace & controls
│   ├── css/
│   │   └── styles.css                   # Modern dark glassmorphic design system
│   └── js/
│       ├── app.js                       # Studio controller & execution dispatcher
│       ├── visualizers.js               # Flowcharts, ladders, and Ragas scorecard visualizers
│       └── concepts.js                  # 40+ Pre-indexed AI engineering concept dictionary
│
└── docs/
    └── images/                          # High-resolution architectural screenshots
        ├── 01_hero_studio.png
        ├── 02_architecture_flowchart.png
        ├── 03_m6_ragas_scorecard.png
        ├── 04_m6_firewall_shield.png
        └── 06_execution_trace.png
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
