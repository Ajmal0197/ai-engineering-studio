/**
 * AI Engineering Teaching Playground — Main Application Controller (Milestones 1–6)
 */

const MILESTONE_CONFIG = {
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
    // Mobile Hamburger & Backdrop toggle
    const btnHamburger = document.getElementById("btnHamburger");
    if (btnHamburger) {
      btnHamburger.addEventListener("click", () => {
        this.toggleMobileSidebar();
      });
    }

    const backdrop = document.getElementById("sidebarBackdrop");
    if (backdrop) {
      backdrop.addEventListener("click", () => {
        this.closeMobileSidebar();
      });
    }

    // Milestone navigation buttons
    document.querySelectorAll(".milestone-nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const m = btn.dataset.milestone;
        this.switchMilestone(m);
        this.closeMobileSidebar();
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeMobileSidebar();
      }
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

    // Initialize Milestone 2 Custom Document & Corpus Manager
    this.initM2CorpusManager();
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

    const prereqContainer = document.getElementById("prerequisitesContainer");
    const milestoneHeader = document.getElementById("milestoneHeaderCard");
    const dualLens = document.getElementById("dualLensContainer");

    if (milestoneId === "prerequisites") {
      if (prereqContainer) prereqContainer.style.display = "flex";
      if (milestoneHeader) milestoneHeader.style.display = "none";
      if (dualLens) dualLens.style.display = "none";
      const m2CorpusPanel = document.getElementById("m2CorpusPanel");
      if (m2CorpusPanel) m2CorpusPanel.style.display = "none";
      document.getElementById("sidebarTeachingTip").innerHTML = "Explore core prerequisites with interactive code blueprints and exact output samples before diving into Milestones 1–6.";
      this.initPrerequisitesView();
      return;
    }

    if (prereqContainer) prereqContainer.style.display = "none";
    if (milestoneHeader) milestoneHeader.style.display = "block";
    if (dualLens) dualLens.style.display = "flex";

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
    const isM1 = milestoneId === "m1";
    const isM2 = milestoneId === "m2";
    const isM6 = milestoneId === "m6";
    document.getElementById("sliderChunkSize").parentElement.parentElement.style.display = isM1 ? "flex" : "none";
    document.getElementById("itemRRFK").style.display = isM2 ? "flex" : "none";
    document.getElementById("itemStrictness").style.display = isM6 ? "flex" : "none";

    // Milestone 2 Custom Document & Corpus Manager Panel
    const m2CorpusPanel = document.getElementById("m2CorpusPanel");
    if (m2CorpusPanel) {
      m2CorpusPanel.style.display = isM2 ? "flex" : "none";
      if (isM2) {
        this.fetchM2CorpusStatus();
      }
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

      if (mId === "m1") {
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
    const answer = data.answer || data.final_answer || (data.parsed_schema ? "Extracted and validated structured claim." : "Completed.");
    document.getElementById("answerDisplay").innerHTML = answer.replace(/\n/g, "<br>");

    // Render Milestone Specific Visuals
    if (mId === "m1") {
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
    const isCustom = data.corpus_info && data.corpus_info.is_custom;
    const corpusDesc = isCustom
      ? `Queried custom user document: <strong>${data.corpus_info.title}</strong> (${data.corpus_info.chunk_count} chunks indexed in Qdrant & BM25)`
      : `Queried default enterprise knowledge base (HR PTO, Travel Expense, IT Error Codes E-4502/E-9011)`;

    container.innerHTML = `
      <div class="trace-step">
        <span class="step-badge step-action">CORPUS</span>
        <div class="step-body">
          <div class="step-title">${isCustom ? "Custom Document Source" : "Enterprise Corpus Source"}</div>
          <div>${corpusDesc}</div>
        </div>
      </div>
      <div class="trace-step">
        <span class="step-badge step-action">STEP 1</span>
        <div class="step-body">
          <div class="step-title">Dense Qdrant Search</div>
          <div>Retrieved semantically relevant candidates using high-dimensional vector embeddings.</div>
        </div>
      </div>
      <div class="trace-step">
        <span class="step-badge step-action">STEP 2</span>
        <div class="step-body">
          <div class="step-title">Sparse BM25 Search (BM25Retriever)</div>
          <div>Retrieved exact keyword matches using Okapi BM25 token statistics.</div>
        </div>
      </div>
      <div class="trace-step">
        <span class="step-badge step-final">STEP 3</span>
        <div class="step-body">
          <div class="step-title">Reciprocal Rank Fusion (RRF)</div>
          <div>Merged rankings using formula <code>score = &Sigma; 1 / (${data.rrf_k} + rank)</code> and synthesized grounded response.</div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // Milestone 2: Custom Document & Corpus Manager Methods
  // =========================================================================

  initM2CorpusManager() {
    const btnToggle = document.getElementById("btnToggleAddDoc");
    const drawer = document.getElementById("m2CustomDocDrawer");
    const btnClose = document.getElementById("btnCloseDocDrawer");
    const btnReset = document.getElementById("btnResetDefaultCorpus");
    const btnIndex = document.getElementById("btnIndexCustomDoc");
    const tabPaste = document.getElementById("btnDocTabPaste");
    const tabUpload = document.getElementById("btnDocTabUpload");
    const contentText = document.getElementById("txtDocContent");
    const charCounter = document.getElementById("txtDocCharCount");
    const dropzone = document.getElementById("fileDropzone");
    const fileInput = document.getElementById("fileDocInput");

    if (!btnToggle || !drawer) return;

    // Toggle custom doc drawer
    btnToggle.addEventListener("click", () => {
      const isVisible = drawer.style.display === "flex";
      drawer.style.display = isVisible ? "none" : "flex";
    });

    if (btnClose) {
      btnClose.addEventListener("click", () => {
        drawer.style.display = "none";
      });
    }

    // Tab switching (Paste vs Upload)
    if (tabPaste && tabUpload) {
      tabPaste.addEventListener("click", () => {
        tabPaste.classList.add("active");
        tabUpload.classList.remove("active");
        document.getElementById("tabDocPaste").style.display = "block";
        document.getElementById("tabDocUpload").style.display = "none";
      });
      tabUpload.addEventListener("click", () => {
        tabUpload.classList.add("active");
        tabPaste.classList.remove("active");
        document.getElementById("tabDocPaste").style.display = "none";
        document.getElementById("tabDocUpload").style.display = "block";
      });
    }

    // Character counter for pasted text
    if (contentText && charCounter) {
      contentText.addEventListener("input", () => {
        charCounter.innerText = `${contentText.value.length.toLocaleString()} characters`;
      });
    }

    // 1-Click sample pills
    document.querySelectorAll(".sample-doc-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const sId = pill.dataset.sample;
        this.loadM2SampleDoc(sId);
      });
    });

    // File dropzone click & drag
    if (dropzone && fileInput) {
      dropzone.addEventListener("click", () => fileInput.click());
      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      });
      dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          fileInput.files = e.dataTransfer.files;
          this.handleSelectedFile(fileInput.files[0]);
        }
      });
      fileInput.addEventListener("change", () => {
        if (fileInput.files && fileInput.files[0]) {
          this.handleSelectedFile(fileInput.files[0]);
        }
      });
    }

    // Index Document button
    if (btnIndex) {
      btnIndex.addEventListener("click", () => {
        this.indexM2CustomDocument();
      });
    }

    // Reset default corpus button
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        this.resetM2DefaultCorpus();
      });
    }
  }

  handleSelectedFile(file) {
    const fileNameDisplay = document.getElementById("selectedFileName");
    if (fileNameDisplay) {
      fileNameDisplay.style.display = "inline-block";
      fileNameDisplay.innerText = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    }
    const txtTitle = document.getElementById("txtDocTitle");
    if (txtTitle && !txtTitle.value.trim()) {
      txtTitle.value = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    }
  }

  async loadM2SampleDoc(sampleId) {
    try {
      const res = await fetch("/api/m2/sample-documents");
      const samples = await res.json();
      const sample = samples.find(s => s.id === sampleId);
      if (sample) {
        document.getElementById("btnDocTabPaste").click();
        const txtTitle = document.getElementById("txtDocTitle");
        const txtContent = document.getElementById("txtDocContent");
        const charCounter = document.getElementById("txtDocCharCount");
        if (txtTitle) txtTitle.value = sample.title;
        if (txtContent) {
          txtContent.value = sample.content;
          if (charCounter) charCounter.innerText = `${sample.content.length.toLocaleString()} characters`;
        }
      }
    } catch (e) {
      console.warn("Failed to load sample doc:", e);
    }
  }

  async indexM2CustomDocument() {
    const btn = document.getElementById("btnIndexCustomDoc");
    const drawer = document.getElementById("m2CustomDocDrawer");
    const fileInput = document.getElementById("fileDocInput");
    const isUploadTab = document.getElementById("btnDocTabUpload")?.classList.contains("active");

    btn.disabled = true;
    btn.innerHTML = `<span>⏳</span> Indexing into Qdrant & BM25...`;

    try {
      let data;
      if (isUploadTab && fileInput && fileInput.files && fileInput.files[0]) {
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);
        const res = await fetch("/api/m2/upload", {
          method: "POST",
          body: formData,
        });
        data = await res.json();
      } else {
        const title = document.getElementById("txtDocTitle").value.trim() || "Custom Document";
        const content = document.getElementById("txtDocContent").value.trim();
        if (!content) {
          alert("Please enter or paste some document content to index.");
          btn.disabled = false;
          btn.innerHTML = `<span>⚡</span> Index Document for Hybrid Search`;
          return;
        }
        const res = await fetch("/api/m2/document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        data = await res.json();
      }

      if (data.status === "success") {
        this.updateM2CorpusUI(data);
        if (drawer) drawer.style.display = "none";
      } else {
        alert(data.detail || "Failed to index document.");
      }
    } catch (e) {
      alert(`Error indexing document: ${e.message}`);
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span>⚡</span> Index Document for Hybrid Search`;
    }
  }

  async resetM2DefaultCorpus() {
    const btn = document.getElementById("btnResetDefaultCorpus");
    if (btn) btn.innerHTML = `<span>⏳</span> Resetting...`;
    try {
      const res = await fetch("/api/m2/reset-documents", { method: "POST" });
      const data = await res.json();
      await this.fetchM2CorpusStatus();
      this.renderPresetsForMilestone("m2");
      document.getElementById("txtQueryInput").value = "How do I resolve Error code E-4502?";
    } catch (e) {
      console.warn("Failed to reset corpus:", e);
    } finally {
      if (btn) btn.innerHTML = `<span>↺</span> Restore Default Docs`;
    }
  }

  async fetchM2CorpusStatus() {
    try {
      const res = await fetch("/api/m2/corpus-status");
      const data = await res.json();
      this.updateM2CorpusUI(data);
    } catch (e) {
      console.warn("Failed to fetch corpus status:", e);
    }
  }

  updateM2CorpusUI(data) {
    const panel = document.getElementById("m2CorpusPanel");
    const dot = document.getElementById("m2CorpusDot");
    const label = document.getElementById("m2CorpusActiveLabel");
    const chunkBadge = document.getElementById("m2CorpusChunkBadge");
    const desc = document.getElementById("m2CorpusDesc");
    const suggRow = document.getElementById("m2CustomSuggestionsRow");
    const suggChips = document.getElementById("m2CustomSuggChips");

    if (!panel) return;

    const isCustom = data.mode === "custom" || data.is_custom;
    panel.classList.toggle("is-custom", isCustom);

    if (dot) {
      dot.className = isCustom ? "corpus-status-dot custom" : "corpus-status-dot default";
    }

    if (label) {
      label.innerText = isCustom ? `Active Corpus: ${data.title}` : "Active Corpus: Default Enterprise Docs";
    }

    if (chunkBadge) {
      chunkBadge.innerText = `${data.chunk_count || 0} Chunks`;
    }

    if (desc) {
      desc.innerText = isCustom
        ? `Custom document indexed into Qdrant Vector Store & BM25 Keyword Retriever with Reciprocal Rank Fusion.`
        : `Pre-indexed enterprise knowledge base (HR Leave, Travel Policies, IT Error Codes).`;
    }

    // Render suggested questions chips if available
    if (suggRow && suggChips) {
      if (isCustom && data.suggested_questions && data.suggested_questions.length > 0) {
        suggRow.style.display = "flex";
        suggChips.innerHTML = data.suggested_questions.map(q => `
          <button type="button" class="custom-sugg-chip" data-query="${this.escapeHtml(q)}">${this.escapeHtml(q)}</button>
        `).join("");

        suggChips.querySelectorAll(".custom-sugg-chip").forEach(chip => {
          chip.addEventListener("click", () => {
            const q = chip.dataset.query;
            document.getElementById("txtQueryInput").value = q;
            this.runActiveQuery();
          });
        });

        // Pre-fill query input with first suggested question
        if (data.suggested_questions[0]) {
          document.getElementById("txtQueryInput").value = data.suggested_questions[0];
        }
      } else {
        suggRow.style.display = "none";
      }
    }
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

  initPrerequisitesView() {
    if (this._prereqInitialized) {
      this.renderPrerequisites();
      return;
    }
    this._prereqInitialized = true;
    this._prereqActiveCat = "all";
    this._prereqSearchTerm = "";

    const searchInput = document.getElementById("prereqSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this._prereqSearchTerm = e.target.value.trim().toLowerCase();
        this.renderPrerequisites();
      });
    }

    this.renderPrerequisites();
  }

  renderPrerequisites() {
    const filterRow = document.getElementById("prereqFilterRow");
    const cardsGrid = document.getElementById("prereqCardsGrid");
    if (!filterRow || !cardsGrid || typeof PREREQUISITES_DATA === "undefined") return;

    // 1. Render Categories Filter Pills
    filterRow.innerHTML = PREREQUISITES_CATEGORIES.map(cat => `
      <button class="prereq-filter-pill ${cat.id === (this._prereqActiveCat || 'all') ? 'active' : ''}" data-cat="${cat.id}">
        <span>${cat.icon}</span> ${cat.label}
      </button>
    `).join("");

    filterRow.querySelectorAll(".prereq-filter-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        this._prereqActiveCat = pill.dataset.cat;
        this.renderPrerequisites();
      });
    });

    // 2. Filter Data
    const activeCat = this._prereqActiveCat || "all";
    const term = this._prereqSearchTerm || "";

    const filtered = PREREQUISITES_DATA.filter(item => {
      const matchCat = activeCat === "all" || item.module === activeCat;
      const matchSearch = !term || 
        item.title.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.details.toLowerCase().includes(term) ||
        item.analogy.toLowerCase().includes(term) ||
        item.code.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      cardsGrid.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 28px; margin-bottom: 8px;">🔍</div>
          <div style="font-size: 14px; font-weight: 600; color: #fff;">No concepts found matching "${term}"</div>
          <div style="font-size: 12px; margin-top: 4px;">Try a different keyword or select another category filter.</div>
        </div>
      `;
      return;
    }

    // 3. Render Cards
    cardsGrid.innerHTML = filtered.map(item => `
      <div class="prereq-card" id="card_${item.id}">
        <div class="prereq-card-top">
          <div class="prereq-card-header-left">
            <div class="prereq-card-meta">
              <span class="prereq-badge-cat">${item.moduleTitle}</span>
              <span class="prereq-badge-type">${item.badge}</span>
            </div>
            <h2 class="prereq-card-title">${item.title}</h2>
          </div>
        </div>

        <div class="prereq-card-analogy">
          <strong>💡 Intuitive Analogy:</strong> ${item.analogy}
        </div>

        <p class="prereq-card-desc">${item.details}</p>

        <div class="prereq-panes-row">
          <!-- Code Blueprint Pane -->
          <div class="prereq-pane">
            <div class="prereq-pane-header">
              <div class="prereq-pane-title">
                <span>💻</span> Minimal Production Python Code
              </div>
              <button class="btn-pane-action" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(item.code)}')); this.innerText='✓ Copied!'; setTimeout(() => this.innerText='📋 Copy Code', 1500)">
                📋 Copy Code
              </button>
            </div>
            <pre class="prereq-code-content"><code>${this.escapeHtml(item.code)}</code></pre>
          </div>

          <!-- Output Sample Pane -->
          <div class="prereq-pane">
            <div class="prereq-pane-header">
              <div class="prereq-pane-title">
                <div class="terminal-dots">
                  <span class="dot-red"></span>
                  <span class="dot-yellow"></span>
                  <span class="dot-green"></span>
                </div>
                <span style="margin-left: 6px;">🖥️ Exact Execution Output</span>
              </div>
              <button class="btn-pane-action" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(item.output)}')); this.innerText='✓ Copied!'; setTimeout(() => this.innerText='📋 Copy Output', 1500)">
                📋 Copy Output
              </button>
            </div>
            <pre class="prereq-output-content"><div class="prereq-output-prompt">❯ python -u script.py</div><code>${this.escapeHtml(item.output)}</code></pre>
          </div>
        </div>
      </div>
    `).join("");
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  toggleMobileSidebar() {
    const sidebar = document.getElementById("appSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    const hamburger = document.getElementById("btnHamburger");
    if (!sidebar) return;
    const isOpen = sidebar.classList.toggle("open");
    if (backdrop) backdrop.classList.toggle("open", isOpen);
    if (hamburger) hamburger.classList.toggle("open", isOpen);
    document.body.classList.toggle("sidebar-open", isOpen);
  }

  closeMobileSidebar() {
    const sidebar = document.getElementById("appSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    const hamburger = document.getElementById("btnHamburger");
    if (sidebar) sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
    if (hamburger) hamburger.classList.remove("open");
    document.body.classList.remove("sidebar-open");
  }
}


// Instantiate on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new AppController();
});
