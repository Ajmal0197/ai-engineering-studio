/**
 * AI Engineering Teaching Playground — Main Application Controller (Milestones 1–6)
 */

const MILESTONE_CONFIG = {
  p1: {
    number: "Prereq 1",
    subcategory: "Language & Tooling Foundation",
    title: "Python Essentials for GenAI (Typing, Pydantic & @tool)",
    problem: "JavaScript/TypeScript developers entering GenAI often struggle with Python idioms, runtime typing, and schema decorators. Pydantic v2 and type hints guarantee that LLM function calls remain strictly typed and validated.",
    analogy: "Like adding TypeScript strict mode to plain JavaScript—Pydantic ensures only valid, schema-compliant objects enter your business logic and tool calls.",
    tags: ["JS ➔ Python Mental Model", "Type Hints", "Pydantic v2", "BaseModel & Field", "@tool Decorator", "Async Streaming"],
    tip: "Click the Invalid Profile preset to see how Pydantic halts dirty data with clear field-level errors before any model invocation.",
    defaultQuery: '{"name": "Sarah Chen", "role": "Senior AI Architect", "experience_years": 8, "skills": ["LangGraph", "Qdrant", "Python"]}'
  },
  p2: {
    number: "Prereq 2",
    subcategory: "Mathematical Foundation",
    title: "Embeddings & Vector Math (Cosine Distance & 3072-D Space)",
    problem: "Computers cannot read text directly. Embedding models map words into continuous high-dimensional coordinates (3072 dimensions) where semantic meaning is captured by vector direction.",
    analogy: "Multi-dimensional GPS coordinates of thought: 'Puppy' and 'Dog' point in almost identical directions in space, while 'Pizza' points completely perpendicularly (orthogonal).",
    tags: ["gemini-embedding-2", "3072 Dimensions", "Cosine Similarity", "Dot Product (A·B)", "Euclidean Norms", "Angular Distance"],
    tip: "Compare two sentences to inspect their cosine score, angular distance, and interactive 2D geometric vector projection.",
    defaultQuery: "I love playing with my golden retriever puppy in the park || Dogs are my favorite loyal companions to take outdoors"
  },
  p3: {
    number: "Prereq 3",
    subcategory: "Composition & Runnables",
    title: "LangChain & LCEL Primitives (Linux Pipe Chaining)",
    problem: "Building custom string concatenations and LLM wrappers creates brittle code without unified streaming or batching. LCEL uses Python's pipe operator (|) to compose Prompt | Model | Parser declaratively.",
    analogy: "A Unix shell pipeline ('cat file | grep word | wc -l') where each stage receives the output of the previous stage cleanly and streams results in real time.",
    tags: ["LCEL (|) Pipe Operator", "ChatPromptTemplate", "ChatGoogleGenerativeAI", "StrOutputParser", "RunnableSequence"],
    tip: "Run any concept topic to trace the 3-stage transformation: Variable Interpolation -> AIMessage Tensor -> Sanitized String Output.",
    defaultQuery: "Retrieval-Augmented Generation (RAG)"
  },
  p4: {
    number: "Prereq 4",
    subcategory: "State Machine Foundation",
    title: "LangGraph State Machines (StateGraph & Reducers)",
    problem: "Linear chains cannot handle loops, retries, or conversational memory. LangGraph models agentic workflows as explicit state graphs with typed state stores and reducers.",
    analogy: "Redux Toolkit + React Navigation for AI agents: StateGraph acts as the central store, add_messages acts as the append reducer, and conditional edges act as navigation guards.",
    tags: ["StateGraph", "TypedDict State", "add_messages Reducer", "Graph Nodes", "Conditional Edges", "ReAct Cycles"],
    tip: "Observe how add_messages prevents chat history from being overwritten when new tool results return from nodes.",
    defaultQuery: "How does the add_messages reducer manage conversation state without overwriting history?"
  },
  p5: {
    number: "Prereq 5",
    subcategory: "Retrieval & Indexing Science",
    title: "Vector DBs & Chunking Strategies (HNSW & Shingle Overlap)",
    problem: "Feeding 50-page PDFs into prompts causes 'lost in the middle' attention degradation. Vector DBs index passages with HNSW graphs for sub-2ms nearest-neighbor retrieval.",
    analogy: "Like building an indexed textbook research card box: overlapping cards (chunk overlap) ensure critical sentences are never snipped in half at the edges.",
    tags: ["RecursiveCharacterTextSplitter", "Chunk Overlap", "Qdrant HNSW Graph", "In-Memory :memory:", "Top-K Selection"],
    tip: "Adjust the Chunk Size and Overlap sliders to see how character windows split across sample corporate documents.",
    defaultQuery: "Compare chunk size 300 with overlap 60 versus zero overlap on complex policy paragraphs"
  },
  p6: {
    number: "Prereq 6",
    subcategory: "Standards & Production Ops",
    title: "Protocols & Evals (FastMCP & Ragas Evaluation Triad)",
    problem: "Deploying AI apps without standardized tool protocols or automated quality metrics leads to integration chaos and undetected hallucinations in production.",
    analogy: "USB-C for AI (FastMCP) paired with an automated ISO quality inspector (Ragas Triad): plug-and-play tools with strict Faithfulness scorecards.",
    tags: ["Model Context Protocol (MCP)", "FastMCP Server", "JSON-RPC 2.0", "Ragas Triad", "Faithfulness SLA", "Circuit Breakers"],
    tip: "Inspect how MCP standardizes Resources, Tools, and Prompts while the Ragas Triad computes objective factual fidelity.",
    defaultQuery: "Why does Model Context Protocol use JSON-RPC 2.0 with Resources, Tools, and Prompts?"
  },
  m1: {
    number: "Milestone 1",
    subcategory: "Retrieval Foundation",
    title: "Basic RAG (Retrieval-Augmented Generation)",
    problem: "LLMs hallucinate and lack internal enterprise memory. RAG retrieves verified document chunks from Qdrant at runtime and supplies them into the prompt.",
    analogy: "An open-book exam: instead of memorizing all enterprise manuals (which leads to guessing), the student flips to the exact indexed page and cites the verified answer.",
    tags: ["RecursiveCharacterTextSplitter", "gemini-embedding-2", "QdrantVectorStore", "LCEL Chains"],
    tip: "Use the Chunk Size slider to demonstrate how large chunks dilute semantic focus while tiny chunks break critical context across boundaries.",
    defaultQuery: "How many days of paid time off do I get per year, and can I roll over unused days?"
  },
  m2: {
    number: "Milestone 2",
    subcategory: "Lexical + Semantic Retrieval",
    title: "Hybrid Search & Reciprocal Rank Fusion (RRF)",
    problem: "Dense semantic vector search has blind spots: it struggles with exact product IDs, acronyms, and error codes (like 'E-4502'). Hybrid search pairs BM25 keyword matching with Vector search.",
    analogy: "A library catalog with both a topical subject index (Vector meaning) and an exact barcode/ISBN scanner (BM25 keywords). RRF fuses their rankings without needing score normalization.",
    tags: ["BM25Retriever", "QdrantVectorStore", "Reciprocal Rank Fusion", "RRF Formula"],
    tip: "Run the 'Error Code E-4502' query to show students that Vector search alone ranks the runbook lower, while BM25 catches it at Rank 1. RRF merges them cleanly.",
    defaultQuery: "How do I resolve Error code E-4502?"
  },
  m3: {
    number: "Milestone 3",
    subcategory: "Autonomous Agentic Loops",
    title: "Single ReAct Agent with Tools (LangGraph)",
    problem: "Static pipelines always retrieve documents even for math problems or weather checks. A ReAct Agent dynamically reasons about which tool to call, executes it, and repeats until satisfied.",
    analogy: "A skilled detective who inspects a clue (Thought), runs an experiment or calls a contact (Action/Tool), reads the report (Observation), and reasons to the final conclusion.",
    tags: ["ReAct Pattern", "LangGraph", "@tool Decorator", "StateGraph", "Conditional Edges"],
    tip: "Show students the circular ReAct loop: the agent queries the policy for the 4% match rule, then immediately invokes the calculator tool to compute 4% of $120,000.",
    defaultQuery: "If I earn $120,000, how much does the company contribute to my 401(k) match?"
  },
  m4: {
    number: "Milestone 4",
    subcategory: "Agent Specialization & Orchestration",
    title: "Multi-Agent Orchestrator System",
    problem: "A single monolithic agent given 50 tools suffers from confusion and degraded prompt attention. The Orchestrator pattern delegates queries to hyper-specialized sub-agents.",
    analogy: "A hospital triage desk: the intake nurse (Supervisor) assesses the patient and directs them to Cardiology, Orthopedics, or Surgery (Specialists).",
    tags: ["Supervisor Pattern", "Query Intent Routing", "RAG Specialist", "BM25 Specialist", "CoT Reasoning"],
    tip: "Highlight how the Supervisor analyzes the query and produces a confidence score before handing off execution to the appropriate specialist agent.",
    defaultQuery: "Incident runbook diagnosis for Error E-9011 connection pool exhaustion"
  },
  m5: {
    number: "Milestone 5",
    subcategory: "Standardized Tooling & Schemas",
    title: "FastMCP & Structured Output (Pydantic)",
    problem: "LLM tools historically suffered from proprietary APIs and unpredictable JSON formats. Model Context Protocol (MCP) standardizes Resources, Tools, and Prompts, while Pydantic guarantees type safety.",
    analogy: "USB-C for AI: a universal protocol connector that lets any LLM plug into enterprise tools and data sources safely with validated schemas.",
    tags: ["Model Context Protocol", "FastMCP", "Resources", "Tools", "Pydantic v2 JSON Schema"],
    tip: "Show students the live MCP JSON-RPC protocol trace and how unstructured natural language is converted into a strictly validated Pydantic object.",
    defaultQuery: "I am employee EMP-4102 and spent $1,250 on United Airlines flight tickets for the AI Summit in Chicago."
  },
  m6: {
    number: "Milestone 6",
    subcategory: "Production Safety & Evaluation Ops",
    title: "Guardrails, Hallucination Verification & LLM-as-a-Judge",
    problem: "Unguarded LLMs in production are vulnerable to prompt injections, hallucinate false citations, leak PII, and deliver silent quality degradations without automated evaluation.",
    analogy: "Airport security checkpoint and quality audit inspector: The Input Guardrail scans for weapons and unauthorized cargo at the gate. The Hallucination Judge verifies the passenger's claims against official passport stamps (the Attention paper). The LLM Judge issues a strict flight safety scorecard before clearance.",
    tags: ["Input Guardrails", "Attention Paper Corpus", "Claim-by-Claim Grounding", "LLM-as-a-Judge", "Ragas Triad", "Circuit Breakers"],
    tip: "Use the 'Prompt Injection Attack' preset to demonstrate perimeter defense, then run 'Scaled Dot-Product Attention' to see the claim-by-claim verification scorecard over Vaswani et al. (2017).",
    defaultQuery: "What is the exact formula for Scaled Dot-Product Attention in the paper, and why is it divided by sqrt(d_k)?"
  }
};

class AppController {
  constructor() {
    this.activeMilestone = "m1";
    this.viewMode = "split";
    this.isPresenterMode = false;
    this.presets = [];
    this.init();
  }

  async init() {
    this.bindEvents();
    this.initCodeSelectionExplainer();
    await this.fetchHealth();
    await this.fetchPresets();
    this.switchMilestone("m1");
  }

  bindEvents() {
    // Milestone navigation buttons
    document.querySelectorAll(".milestone-nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const m = btn.dataset.milestone;
        this.switchMilestone(m);
      });
    });

    // View mode toggle
    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setViewMode(btn.dataset.mode);
      });
    });

    // Presenter mode toggle
    document.getElementById("btnPresenterToggle").addEventListener("click", () => {
      this.togglePresenterMode();
    });

    // Results Tab buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.switchResultTab(btn.dataset.tab);
      });
    });

    // Sliders
    const sliderSize = document.getElementById("sliderChunkSize");
    const sliderOverlap = document.getElementById("sliderChunkOverlap");
    const sliderRRF = document.getElementById("sliderRRFK");

    sliderSize.addEventListener("input", (e) => {
      document.getElementById("lblChunkSize").innerText = e.target.value;
    });
    sliderOverlap.addEventListener("input", (e) => {
      document.getElementById("lblChunkOverlap").innerText = e.target.value;
    });
    sliderRRF.addEventListener("input", (e) => {
      document.getElementById("lblRRFK").innerText = e.target.value;
    });

    const sliderStrict = document.getElementById("sliderStrictness");
    sliderStrict?.addEventListener("input", (e) => {
      document.getElementById("lblStrictness").innerText = parseFloat(e.target.value).toFixed(2);
    });

    // Run Query button
    document.getElementById("btnRunQuery").addEventListener("click", () => {
      this.runActiveQuery();
    });

    // Enter key inside query input
    document.getElementById("txtQueryInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.runActiveQuery();
    });

    // Copy Code button
    document.getElementById("btnCopyCode").addEventListener("click", () => {
      const codeText = document.getElementById("codeDisplayArea").innerText;
      navigator.clipboard.writeText(codeText);
      const btn = document.getElementById("btnCopyCode");
      btn.innerText = "Copied! ✓";
      setTimeout(() => { btn.innerText = "Copy Code"; }, 2000);
    });
  }

  async fetchHealth() {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      if (data.model) {
        document.getElementById("hudModel").innerText = data.model;
      }
    } catch (e) {
      console.warn("Health check error:", e);
    }
  }

  async fetchPresets() {
    try {
      const res = await fetch("/api/presets");
      this.presets = await res.json();
    } catch (e) {
      console.warn("Failed to fetch presets:", e);
    }
  }

  switchMilestone(milestoneId) {
    this.activeMilestone = milestoneId;

    // Update active nav button
    document.querySelectorAll(".milestone-nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.milestone === milestoneId);
    });

    const cfg = MILESTONE_CONFIG[milestoneId];
    if (!cfg) return;

    // Update Header Card
    document.getElementById("mBadgePill").innerText = cfg.number;
    document.getElementById("mSubcategory").innerText = cfg.subcategory;
    document.getElementById("mTitle").innerText = cfg.title;
    document.getElementById("mProblemSolved").innerText = cfg.problem;
    document.getElementById("mMetaphorBox").innerHTML = `<strong>Real-World Analogy:</strong> ${cfg.analogy}`;
    document.getElementById("sidebarTeachingTip").innerHTML = cfg.tip;

    // Concept Tags
    const tagsContainer = document.getElementById("mConceptTags");
    tagsContainer.innerHTML = cfg.tags.map(t => `<span class="concept-tag">${t}</span>`).join("");

    // Set Default Query Input
    document.getElementById("txtQueryInput").value = cfg.defaultQuery;

    // Render Milestone Specific Knobs
    const isM1 = milestoneId === "m1" || milestoneId === "p5";
    const isM2 = milestoneId === "m2";
    const isM6 = milestoneId === "m6" || milestoneId === "p6";
    document.getElementById("sliderChunkSize").parentElement.parentElement.style.display = isM1 ? "flex" : "none";
    document.getElementById("itemRRFK").style.display = isM2 ? "flex" : "none";
    document.getElementById("itemStrictness").style.display = isM6 ? "flex" : "none";

    // Set contextual placeholder
    const queryInput = document.getElementById("txtQueryInput");
    if (milestoneId === "p1") {
      queryInput.placeholder = 'Enter JSON profile to validate or select 1-click preset...';
    } else if (milestoneId === "p2") {
      queryInput.placeholder = 'Enter Text A || Text B to compute Cosine Similarity & Vector Math...';
    } else if (milestoneId === "p3") {
      queryInput.placeholder = 'Enter concept name to trace LCEL Prompt | Model | Parser pipe...';
    } else {
      queryInput.placeholder = 'Enter query or select a teaching preset...';
    }

    // Render Presets for this milestone
    this.renderPresetsForMilestone(milestoneId);

    // Render Flow Diagram
    Visualizers.renderFlowDiagram(milestoneId);

    // Load Code Blueprint
    this.loadCodeBlueprint(milestoneId);

    // Reset Answer & Trace
    document.getElementById("answerDisplay").innerHTML = `
      Select a teaching preset above and click <strong>"Run Live Lab"</strong> to see live Gemini execution and pipeline grounding for <strong>${cfg.title}</strong>.
    `;
    document.getElementById("traceTimeline").innerHTML = `
      <div style="font-size: 12px; color: var(--text-dim); padding: 12px;">No active trace yet. Run a query to inspect live pipeline execution.</div>
    `;
    document.getElementById("visualInspectorContent").innerHTML = `
      <div style="font-size: 12px; color: var(--text-dim); padding: 12px;">Inspector updates dynamically based on the active milestone.</div>
    `;

    // Auto load M1 chunks preview if on M1
    if (isM1) {
      this.loadM1ChunkPreview();
    }
  }

  renderPresetsForMilestone(mId) {
    const container = document.getElementById("presetsContainer");
    const filtered = this.presets.filter(p => p.milestone === mId);

    if (filtered.length === 0) {
      container.innerHTML = `<span style="font-size: 11px; color: var(--text-dim);">No presets for this milestone.</span>`;
      return;
    }

    container.innerHTML = filtered.map(p => `
      <button class="preset-chip" title="${p.teaching_point}">
        ${p.title}
      </button>
    `).join("");

    container.querySelectorAll(".preset-chip").forEach((chip, idx) => {
      chip.addEventListener("click", () => {
        const item = filtered[idx];
        document.getElementById("txtQueryInput").value = item.query;
        this.runActiveQuery();
      });
    });
  }

  async loadCodeBlueprint(mId) {
    try {
      const res = await fetch(`/api/code-blueprint/${mId}`);
      const data = await res.json();
      document.getElementById("codeBlueprintTitle").innerText = data.title;
      document.getElementById("codeDisplayArea").innerText = data.code;

      const annContainer = document.getElementById("codeAnnotationsList");
      if (data.annotations) {
        annContainer.innerHTML = data.annotations.map(a => `
          <div class="ann-item">
            <span class="ann-line-badge">Line ${a.line}</span>
            <span>${a.note}</span>
          </div>
        `).join("");
      }
    } catch (e) {
      console.warn("Failed to load blueprint:", e);
    }
  }

  async loadM1ChunkPreview() {
    try {
      const cSize = parseInt(document.getElementById("sliderChunkSize").value) || 300;
      const cOverlap = parseInt(document.getElementById("sliderChunkOverlap").value) || 60;
      const res = await fetch("/api/m1/chunk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chunk_size: cSize, chunk_overlap: cOverlap }),
      });
      const data = await res.json();
      if (data.sample_chunks) {
        Visualizers.renderM1Chunks(data.sample_chunks);
      }
    } catch (e) {
      console.warn("Failed to load chunk preview:", e);
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    const container = document.getElementById("dualLensContainer");
    container.className = `dual-lens-container view-${mode}`;
  }

  togglePresenterMode() {
    this.isPresenterMode = !this.isPresenterMode;
    document.body.classList.toggle("presenter-mode", this.isPresenterMode);
    document.getElementById("btnPresenterToggle").classList.toggle("active", this.isPresenterMode);
  }

  switchResultTab(tabId) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });

    document.querySelectorAll(".tab-content").forEach(content => {
      content.classList.toggle("active", content.id === tabId);
    });
  }

  async runActiveQuery() {
    const query = document.getElementById("txtQueryInput").value.trim();
    if (!query) return;

    const btn = document.getElementById("btnRunQuery");
    btn.disabled = true;
    btn.innerHTML = `<span>⏳</span> Running...`;

    document.getElementById("hudLatency").innerText = "executing...";
    document.getElementById("answerDisplay").innerHTML = `<div style="color: var(--text-muted); font-style: italic;">Sending request to Google Gemini API & pipeline engine...</div>`;

    const mId = this.activeMilestone;

    // Start live visual animation across architecture nodes
    Visualizers.animatePipelineStages(mId);

    try {
      let endpoint = "/api/m1/query";
      let payload = { query };

      if (mId === "p1") {
        endpoint = "/api/prereq/p1/validate-pydantic";
        let jsonPayload;
        try {
          jsonPayload = JSON.parse(query);
        } catch(e) {
          jsonPayload = { name: query, experience_years: 5, skills: ["Python", "GenAI"] };
        }
        payload = { payload: jsonPayload };
      } else if (mId === "p2") {
        endpoint = "/api/prereq/p2/cosine-sim";
        const parts = query.includes("||") ? query.split("||") : [query, "Dogs are my favorite companions outdoors"];
        payload = { text_a: parts[0].trim(), text_b: (parts[1] || "").trim() };
      } else if (mId === "p3") {
        endpoint = "/api/prereq/p3/lcel-flow";
        payload = { topic: query };
      } else if (mId === "p4") {
        endpoint = "/api/m3/react";
      } else if (mId === "p5") {
        endpoint = "/api/m1/query";
        payload.top_k = 2;
      } else if (mId === "p6") {
        endpoint = "/api/m6/evaluate";
        payload.strictness_threshold = 0.80;
      } else if (mId === "m1") {
        endpoint = "/api/m1/query";
        payload.top_k = 2;
      } else if (mId === "m2") {
        endpoint = "/api/m2/hybrid";
        payload.top_k = 3;
        payload.rrf_k = parseInt(document.getElementById("sliderRRFK").value) || 60;
      } else if (mId === "m3") {
        endpoint = "/api/m3/react";
      } else if (mId === "m4") {
        endpoint = "/api/m4/multi-agent";
      } else if (mId === "m5") {
        endpoint = "/api/m5/extract-claim";
      } else if (mId === "m6") {
        endpoint = "/api/m6/evaluate";
        payload.strictness_threshold = parseFloat(document.getElementById("sliderStrictness")?.value || 0.80);
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      // Mark pipeline complete and glowing on success
      Visualizers.completePipelineStages(mId);
      this.handleQueryResponse(mId, data);
    } catch (e) {
      document.getElementById("answerDisplay").innerHTML = `<div style="color: var(--accent-rose);">Execution error: ${e.message}</div>`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span>⚡</span> Run Live Lab`;
    }
  }

  handleQueryResponse(mId, data) {
    // Update Telemetry HUD
    const lat = data.latency_ms || 12;
    document.getElementById("hudLatency").innerText = `${lat} ms`;

    // Display Answer
    let answerText = data.answer || data.final_answer;
    if (mId === "p1") {
      answerText = `<strong>${data.is_valid ? "✅ Pydantic v2 Validation Passed" : "❌ Schema Violation Intercepted"}</strong><br>${data.teaching_point}`;
    } else if (mId === "p2") {
      answerText = `<strong>Cosine Similarity:</strong> ${data.cosine_similarity} (Angle: ${data.angle_degrees}°)<br><strong>Verdict:</strong> ${data.semantic_verdict}<br><span style="font-size: 11px; color: var(--text-dim);">Formula: (A · B) / (||A|| * ||B||) across ${data.dimension} dimensions</span>`;
    } else if (mId === "p3") {
      answerText = `<strong>LCEL Pipe Output:</strong><br>${data.stage_3_parser?.final_string || "Completed"}<br><span style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">${data.lcel_expression}</span>`;
    } else if (!answerText) {
      answerText = data.parsed_schema ? "Extracted and validated structured claim." : "Completed.";
    }
    document.getElementById("answerDisplay").innerHTML = answerText.replace(/\n/g, "<br>");

    // Render Milestone & Prerequisite Specific Visuals
    if (mId === "p1") {
      Visualizers.renderP1Sandbox(data);
      this.switchResultTab("tabVisual");
    } else if (mId === "p2") {
      Visualizers.renderP2VectorMath(data);
      this.switchResultTab("tabVisual");
    } else if (mId === "p3") {
      Visualizers.renderP3LCELPipe(data);
      this.switchResultTab("tabVisual");
    } else if (mId === "p4") {
      if (data.trace) {
        Visualizers.renderM3ReActTrace(data.trace);
        this.switchResultTab("tabTrace");
      }
    } else if (mId === "p5") {
      if (data.retrieved_chunks) {
        Visualizers.renderM1Chunks(data.retrieved_chunks);
        this.renderM1Trace(data);
        this.switchResultTab("tabVisual");
      }
    } else if (mId === "p6") {
      Visualizers.renderM6Scorecard(data);
      this.renderM6Trace(data);
      this.switchResultTab("tabVisual");
    } else if (mId === "m1") {
      if (data.retrieved_chunks) {
        Visualizers.renderM1Chunks(data.retrieved_chunks);
        this.renderM1Trace(data);
      }
    } else if (mId === "m2") {
      Visualizers.renderM2RankLadder(data);
      this.renderM2Trace(data);
    } else if (mId === "m3") {
      if (data.trace) {
        Visualizers.renderM3ReActTrace(data.trace);
        this.switchResultTab("tabTrace");
      }
    } else if (mId === "m4") {
      Visualizers.renderM4RoutingTree(data);
      this.switchResultTab("tabVisual");
    } else if (mId === "m5") {
      Visualizers.renderM5MCPTrace(data);
      this.switchResultTab("tabVisual");
    } else if (mId === "m6") {
      Visualizers.renderM6Scorecard(data);
      this.renderM6Trace(data);
      this.switchResultTab("tabVisual");
    }
  }

  renderM6Trace(data) {
    const container = document.getElementById("traceTimeline");
    if (!container) return;

    if (!data.pipeline_stages || data.pipeline_stages.length === 0) {
      container.innerHTML = `<div style="font-size: 12px; color: var(--text-dim); padding: 12px;">Trace unavailable.</div>`;
      return;
    }

    container.innerHTML = data.pipeline_stages.map(st => {
      const isPass = st.status === "PASSED" || st.status === "APPROVED" || st.status === "CLEARED" || st.status === "VERIFIED_GROUNDED";
      const isWarn = st.status === "PARTIAL_HALLUCINATION" || st.status === "TRIGGERED" || st.status === "FLAGGED";
      const badgeClass = isPass ? "step-final" : (isWarn ? "step-action" : "step-thought");
      
      return `
        <div class="trace-step">
          <span class="step-badge ${badgeClass}">STAGE ${st.stage}</span>
          <div class="step-body">
            <div class="step-title">${st.name} &bull; <span style="font-size: 11px; opacity: 0.85;">${st.status}</span></div>
            <div style="font-size: 11px; color: var(--text-dim); line-height: 1.4;">${st.details || st.action || 'Stage executed.'}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  renderM1Trace(data) {
    const container = document.getElementById("traceTimeline");
    container.innerHTML = `
      <div class="trace-step">
        <span class="step-badge step-action">STEP 1</span>
        <div class="step-body">
          <div class="step-title">Qdrant Vector Similarity Retrieval</div>
          <div>Retrieved top-${data.retrieved_chunks.length} semantically similar chunks with Gemini embeddings (3072 dimensions).</div>
        </div>
      </div>
      <div class="trace-step">
        <span class="step-badge step-final">STEP 2</span>
        <div class="step-body">
          <div class="step-title">Grounded Generation (LangChain LCEL)</div>
          <div>Injected context with strict source citation prompt. Latency: ${data.latency_ms}ms.</div>
        </div>
      </div>
    `;
  }

  renderM2Trace(data) {
    const container = document.getElementById("traceTimeline");
    container.innerHTML = `
      <div class="trace-step">
        <span class="step-badge step-action">STEP 1</span>
        <div class="step-body">
          <div class="step-title">Dense Qdrant Search</div>
          <div>Retrieved candidates based on semantic meaning.</div>
        </div>
      </div>
      <div class="trace-step">
        <span class="step-badge step-action">STEP 2</span>
        <div class="step-body">
          <div class="step-title">Sparse BM25 Search (BM25Retriever)</div>
          <div>Retrieved candidates based on exact term frequency.</div>
        </div>
      </div>
      <div class="trace-step">
        <span class="step-badge step-final">STEP 3</span>
        <div class="step-body">
          <div class="step-title">Reciprocal Rank Fusion (RRF)</div>
          <div>Combined lists using score = &Sigma; 1 / (${data.rrf_k} + rank).</div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // Code Concept Explainer (Details, Analogy & Alternatives)
  // =========================================================================

  initCodeSelectionExplainer() {
    const codeArea = document.getElementById("codeDisplayArea");
    const popover = document.getElementById("codeExplainerPopover");
    if (!codeArea || !popover) return;

    this.activeConcept = null;

    const closePopover = () => {
      popover.classList.remove("active");
      setTimeout(() => {
        if (!popover.classList.contains("active")) {
          popover.style.display = "none";
        }
      }, 180);
    };

    document.getElementById("popoverCloseBtn")?.addEventListener("click", closePopover);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePopover();
    });

    document.addEventListener("mousedown", (e) => {
      if (popover.classList.contains("active")) {
        if (!popover.contains(e.target) && !codeArea.contains(e.target)) {
          closePopover();
        }
      }
    });

    document.getElementById("popoverCopyBtn")?.addEventListener("click", () => {
      const termToCopy = this.activeConcept ? this.activeConcept.term : (window.getSelection()?.toString().trim() || "");
      if (termToCopy) {
        navigator.clipboard.writeText(termToCopy);
        const btn = document.getElementById("popoverCopyBtn");
        const orig = btn.innerText;
        btn.innerText = "Copied! ✓";
        setTimeout(() => { btn.innerText = orig; }, 1800);
      }
    });

    document.getElementById("popoverPinInspectorBtn")?.addEventListener("click", () => {
      if (this.activeConcept) {
        this.switchResultTab("tabVisual");
        this.renderConceptInInspector(this.activeConcept);
        closePopover();
      }
    });

    const handleSelection = () => {
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) return;
        const text = sel.toString().trim();
        if (!text || text.length < 2) return;

        // Strip extraneous leading/trailing punctuation and quotes
        const clean = text.replace(/^['"`({\[<]+|['"`)}\]>:;,.]+$/g, '').trim();
        if (!clean || clean.length < 2) return;

        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        this.showConceptExplainer(clean, rect, text);
      }, 35);
    };

    codeArea.addEventListener("dblclick", handleSelection);
    codeArea.addEventListener("mouseup", handleSelection);
  }

  async showConceptExplainer(token, rect, rawText) {
    const popover = document.getElementById("codeExplainerPopover");
    if (!popover) return;

    // Check local pre-indexed dictionary first
    let concept = (window.CodeConcepts && typeof window.CodeConcepts.find === "function") 
      ? window.CodeConcepts.find(token) 
      : null;

    popover.style.display = "block";

    if (concept) {
      this.activeConcept = concept;
      this.renderPopoverData(concept);
    } else {
      this.activeConcept = { term: token, details: "", analogy: "", alternatives: [] };
      document.getElementById("popoverTerm").innerText = token;
      document.getElementById("popoverDetails").innerHTML = `
        <div class="popover-loading-shimmer">
          <span style="font-size: 16px;">⚙️</span>
          <span>Consulting Gemini 3.5 Flash Lite for breakdown...</span>
        </div>
      `;
      document.getElementById("popoverAnalogy").innerHTML = `<em style="color: var(--text-dim);">Formulating real-world classroom analogy...</em>`;
      document.getElementById("popoverAlternatives").innerHTML = `<div style="font-size: 11px; color: var(--text-dim);">Locating production alternatives...</div>`;
    }

    this.positionPopoverNearRect(popover, rect);
    popover.classList.add("active");

    if (!concept) {
      try {
        const res = await fetch("/api/explain-code-selection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selection: token,
            milestone: this.activeMilestone,
            code_context: document.getElementById("codeDisplayArea").innerText.slice(0, 500)
          })
        });
        const data = await res.json();
        concept = {
          term: data.term || token,
          details: data.details,
          analogy: data.analogy,
          alternatives: data.alternatives || []
        };
        // Cache in dictionary for instantaneous retrieval next time
        if (window.CodeConcepts && window.CodeConcepts.dictionary) {
          const normKey = token.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
          window.CodeConcepts.dictionary[normKey] = concept;
        }
        this.activeConcept = concept;
        this.renderPopoverData(concept);
        this.positionPopoverNearRect(popover, rect);
      } catch (err) {
        document.getElementById("popoverDetails").innerText = `Component: ${token}. Production component used in ${this.activeMilestone.toUpperCase()}.`;
      }
    }
  }

  renderPopoverData(concept) {
    document.getElementById("popoverTerm").innerText = concept.term;
    document.getElementById("popoverDetails").innerText = concept.details;
    document.getElementById("popoverAnalogy").innerHTML = concept.analogy;

    const altsContainer = document.getElementById("popoverAlternatives");
    if (concept.alternatives && concept.alternatives.length > 0) {
      altsContainer.innerHTML = concept.alternatives.map(a => `
        <div class="popover-alt-card">
          <div class="popover-alt-name">${a.name}</div>
          <div class="popover-alt-desc">${a.description}</div>
        </div>
      `).join("");
    } else {
      altsContainer.innerHTML = `<div style="font-size: 11px; color: var(--text-dim);">Standard baseline architecture.</div>`;
    }
  }

  positionPopoverNearRect(popover, rect) {
    const pRect = popover.getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.left;

    // Flip above if near viewport bottom
    if (top + pRect.height > window.innerHeight - 16) {
      top = Math.max(16, rect.top - pRect.height - 8);
    }
    // Clamp horizontally
    if (left + pRect.width > window.innerWidth - 16) {
      left = window.innerWidth - pRect.width - 16;
    }
    if (left < 16) left = 16;

    popover.style.top = `${Math.round(top)}px`;
    popover.style.left = `${Math.round(left)}px`;
  }

  renderConceptInInspector(concept) {
    const container = document.getElementById("visualInspectorContent");
    if (!container) return;

    let altsHtml = "";
    if (concept.alternatives && concept.alternatives.length) {
      altsHtml = concept.alternatives.map(a => `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 10px 14px;">
          <div style="font-family: var(--font-mono); font-weight: 700; color: #34d399; font-size: 12px; margin-bottom: 4px;">${a.name}</div>
          <div style="font-size: 11px; color: var(--text-dim); line-height: 1.4;">${a.description}</div>
        </div>
      `).join("");
    }

    container.innerHTML = `
      <div style="background: rgba(13, 18, 30, 0.95); border: 1px solid var(--accent-indigo); border-radius: 12px; padding: 22px; box-shadow: 0 4px 24px rgba(0,0,0,0.5);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">💡</span>
            <h3 style="font-size: 16px; font-weight: 800; color: #fff; font-family: var(--font-mono);">${concept.term}</h3>
          </div>
          <span style="font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 12px; background: rgba(99, 102, 241, 0.2); color: var(--accent-indigo); border: 1px solid rgba(99, 102, 241, 0.4);">PINNED FROM CODE STUDIO</span>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: var(--accent-blue); margin-bottom: 6px;">📘 Production Engineering Details</div>
          <p style="font-size: 13px; color: var(--text-main); line-height: 1.55;">${concept.details}</p>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: var(--accent-amber); margin-bottom: 6px;">💡 Real-World Teaching Analogy</div>
          <div style="background: rgba(245, 158, 11, 0.08); border-left: 3px solid var(--accent-amber); padding: 10px 14px; border-radius: 0 8px 8px 0; font-size: 13px; color: #fef3c7; line-height: 1.5;">
            ${concept.analogy}
          </div>
        </div>

        <div>
          <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: var(--accent-emerald); margin-bottom: 8px;">🔄 Industry Alternatives & Trade-offs</div>
          <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
            ${altsHtml}
          </div>
        </div>
      </div>
    `;
  }
}


// Instantiate on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new AppController();
});
