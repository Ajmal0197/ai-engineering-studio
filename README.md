# 🚀 AI Engineering Teaching Studio (Milestones 1–6)

An interactive, production-grade teaching playground designed to teach modern Applied AI and LLM Engineering using Google Gemini, LangChain, LangGraph, Qdrant, FastMCP, and Ragas evaluation frameworks.

---

## 🌟 Architecture & Features

The Studio features a **Dual-Lens Teaching Workspace** (Interactive Visual Lab on the left, Production Code Studio Blueprint on the right), with 1-click classroom presets, interactive architecture flowcharts, and live concept deep-dives:

| Milestone | Architecture / Pattern | Key Production Technologies |
| :--- | :--- | :--- |
| **Milestone 1** | **Basic RAG Pipeline** | `RecursiveCharacterTextSplitter`, `QdrantVectorStore`, `gemini-embedding-2`, `LCEL Chains` |
| **Milestone 2** | **Hybrid Search & RRF** | `BM25Retriever` (Sparse) + `Qdrant` (Dense) fused via Reciprocal Rank Fusion (`1 / (k + rank)`) |
| **Milestone 3** | **Autonomous ReAct Agent** | `LangGraph StateGraph`, `@tool` decorators, `ToolNode`, dynamic tool calling loops |
| **Milestone 4** | **Multi-Agent Orchestrator** | Supervisor Pattern with `with_structured_output(RouteDecision)`, specialized expert workers |
| **Milestone 5** | **Knowledge Assistant & MCP** | Model Context Protocol (`FastMCP`), read-only Resources, `Pydantic v2` JSON schema validation |
| **Milestone 6** | **Guardrails & LLM-as-a-Judge** | Grounded in *Attention Is All You Need* (Vaswani et al., 2017), Claim-level Hallucination Judge, Ragas Triad, Circuit Breakers |

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/YOUR_USERNAME/ai-engineering-studio.git
cd ai-engineering-studio
pip install -r requirements.txt
```

### 2. Configure Environment
Create a `.env` file from the template:
```bash
cp .env.example .env
```
Add your free Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
```

### 3. Run Locally
```bash
python server.py
```
Open **`http://localhost:8000`** in your browser.

---

## 🐳 Docker Deployment

Run with Docker in a single command:
```bash
docker build -t ai-engineering-studio .
docker run -p 8000:8000 -e GEMINI_API_KEY="your_gemini_api_key_here" ai-engineering-studio
```

---

## ☁️ 1-Click Cloud Deployment

### Deploy to Render
1. Push this repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/), click **New > Web Service** and connect this repository.
3. Add the environment variable:
   - `GEMINI_API_KEY` = *your Gemini API key*
4. Render will automatically build the service using `render.yaml` or `Dockerfile`.

### Deploy to Railway / Hugging Face Spaces
- **Railway**: Click *New Project > Deploy from GitHub repo*, add `GEMINI_API_KEY`.
- **Hugging Face Spaces**: Select **Docker SDK**, connect repo, set `GEMINI_API_KEY` in Space Secrets.

---

## 💡 Classroom Teaching Tools
- **Double-Click Code Explainer**: Double-click or select any word or line of code in the Code Studio to see its **Production Details**, **Real-World Analogy**, and **Industry Alternatives**.
- **Click-to-Inspect Architecture Nodes**: Click on any node in the flowchart to view its architectural input/output contract.
- **Presenter Mode**: Toggle full-screen classroom presentation typography.
