/**
 * Dynamic Visualizers for Milestones 1 through 5
 * Renders SVG flowcharts, chunk inspection cards, rank comparison ladders,
 * LangGraph execution traces, and interactive node deep-dives.
 */

const Visualizers = {
  // Definition of flow nodes per milestone
  flows: {
    m1: [
      { id: "docs", name: "Corpus", icon: "📚", sub: "Enterprise Docs" },
      { id: "chunk", name: "Chunker", icon: "✂️", sub: "TextSplitter" },
      { id: "embed", name: "Embeddings", icon: "🧬", sub: "Gemini 3072-d" },
      { id: "vector", name: "Qdrant", icon: "📐", sub: "In-Memory DB" },
      { id: "llm", name: "LCEL Chain", icon: "✨", sub: "Grounded QA" }
    ],
    m2: [
      { id: "query", name: "User Query", icon: "💬", sub: "Text Input" },
      { id: "dense", name: "Dense Vector", icon: "🧬", sub: "Qdrant Semantic" },
      { id: "bm25", name: "Sparse BM25", icon: "🔍", sub: "BM25Retriever" },
      { id: "rrf", name: "RRF Fusion", icon: "⚖️", sub: "1 / (k + rank)" },
      { id: "llm", name: "Synthesizer", icon: "✨", sub: "Fused Output" }
    ],
    m3: [
      { id: "user", name: "Goal", icon: "🎯", sub: "Task Request" },
      { id: "agent", name: "ReAct Agent", icon: "🧠", sub: "bind_tools" },
      { id: "tools", name: "ToolNode", icon: "🛠️", sub: "Calc / KB / AD" },
      { id: "obs", name: "Observation", icon: "👁️", sub: "ToolMessage" },
      { id: "final", name: "Final Answer", icon: "🏁", sub: "Completed" }
    ],
    m4: [
      { id: "user", name: "User Query", icon: "💬", sub: "Input" },
      { id: "router", name: "Supervisor", icon: "🚦", sub: "Structured Router" },
      { id: "specialist", name: "Specialist", icon: "👥", sub: "RAG / Search / Reason" },
      { id: "synthesis", name: "Synthesizer", icon: "📝", sub: "Unified Response" }
    ],
    m5: [
      { id: "client", name: "Client", icon: "💻", sub: "Host App" },
      { id: "protocol", name: "FastMCP", icon: "🔌", sub: "JSON-RPC Protocol" },
      { id: "server", name: "Resources & Tools", icon: "🏛️", sub: "travel_limits" },
      { id: "schema", name: "Pydantic v2", icon: "📐", sub: "Type-Safe Model" }
    ],
    m6: [
      { id: "guard", name: "Input Shield", icon: "🛡️", sub: "Injection & PII" },
      { id: "rag", name: "Attention RAG", icon: "📄", sub: "Vaswani et al." },
      { id: "judge", name: "Hallucination Judge", icon: "🔍", sub: "Claim Grounding" },
      { id: "eval", name: "LLM Judge", icon: "⚖️", sub: "Ragas Triad" },
      { id: "breaker", name: "Circuit Breaker", icon: "⚡", sub: "Deflection / Pass" }
    ]
  },

  // Pedagogical deep-dives for each node when clicked
  nodeDetails: {
    m1: {
      docs: {
        title: "1. Enterprise Document Corpus",
        badge: "SOURCE DOCUMENTS",
        desc: "Ingests raw enterprise documents (markdown, PDF, text). Contains raw corporate knowledge without embeddings.",
        input: "Raw corporate policies & IT manuals",
        output: "List[Document(page_content, metadata)]",
        code: "Document(page_content='...', metadata={'title': 'Corporate PTO Policy'})"
      },
      chunk: {
        title: "2. LangChain RecursiveCharacterTextSplitter",
        badge: "CHUNKING",
        desc: "Splits long documents into semantically coherent passages using hierarchical separators (\\n\\n, \\n, period, space). Chunk overlap prevents breaking critical facts across boundaries.",
        input: "Full Document (e.g. 5,000 characters)",
        output: "List of chunk Documents (e.g. 300 chars each with 60 overlap)",
        code: "RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=60)"
      },
      embed: {
        title: "3. Gemini Embeddings (gemini-embedding-2)",
        badge: "VECTOR ENCODER",
        desc: "Converts text chunks into dense, continuous high-dimensional coordinates (3072 dimensions) capturing semantic meaning.",
        input: "Text chunk string",
        output: "Vector [0.021, -0.048, ..., 0.013] (3072 floats)",
        code: "GoogleGenerativeAIEmbeddings(model='models/gemini-embedding-2')"
      },
      vector: {
        title: "4. Qdrant Vector Store",
        badge: "SIMILARITY INDEX",
        desc: "Indexes embedding vectors using in-memory HNSW graphs. Computes exact Cosine Distance to return top-k nearest semantic neighbors in <2ms.",
        input: "Query vector + top_k parameter",
        output: "Top-k nearest chunk documents + similarity scores",
        code: "QdrantVectorStore.from_documents(chunks, embeddings, location=':memory:')"
      },
      llm: {
        title: "5. Grounded LCEL Chain (Gemini 3.5 Flash Lite)",
        badge: "GROUNDED GENERATION",
        desc: "Injects retrieved chunks directly into a prompt template. Instructs the model to answer using ONLY verified facts and cite source chunk IDs.",
        input: "User Question + Retrieved Context passages",
        output: "Grounded Answer with exact source citations",
        code: "rag_chain = ({'context': retriever, 'question': lambda x: x} | prompt | llm | StrOutputParser())"
      }
    },
    m2: {
      query: {
        title: "1. User Query Intake",
        badge: "INPUT",
        desc: "Dispatches the query simultaneously to both dense semantic and sparse lexical search systems.",
        input: "Natural language query or exact technical identifier",
        output: "Query string passed to both retrievers",
        code: "query = 'How do I resolve Error code E-4502?'"
      },
      dense: {
        title: "2. Dense Vector Search (Qdrant)",
        badge: "SEMANTIC SEARCH",
        desc: "Finds documents with matching conceptual meaning, regardless of whether exact keywords appear.",
        input: "Query embedded via gemini-embedding-2",
        output: "Ranked list of semantic matches: [Rank 1, Rank 2...]",
        code: "vector_store.similarity_search_with_score(query, k=6)"
      },
      bm25: {
        title: "3. Sparse Lexical Search (BM25Retriever)",
        badge: "KEYWORD SEARCH",
        desc: "BM25Okapi algorithm scores documents by exact term frequency (TF) and inverse document frequency (IDF). Catches exact codes like 'E-4502'.",
        input: "Tokenized query terms ('error', 'code', 'e-4502')",
        output: "Ranked list of exact token matches: [Rank 1, Rank 2...]",
        code: "bm25_retriever.invoke(query)"
      },
      rrf: {
        title: "4. Reciprocal Rank Fusion (RRF)",
        badge: "FUSION FORMULA",
        desc: "Merges both ranked lists using score(d) = sum(1 / (k + rank(d))). Operates purely on ordinal ranks, eliminating score normalization issues.",
        input: "Dense ranks + BM25 ranks + constant k (default 60)",
        output: "Combined unified ranking with fused scores",
        code: "score(d) = 1/(60 + dense_rank) + 1/(60 + bm25_rank)"
      },
      llm: {
        title: "5. Grounded Synthesizer",
        badge: "SYNTHESIS",
        desc: "Synthesizes an accurate answer combining both keyword precision and semantic context from the top fused documents.",
        input: "Top-k RRF fused passages",
        output: "Final answer resolving the query",
        code: "prompt | llm | StrOutputParser()"
      }
    },
    m3: {
      user: {
        title: "1. User Goal / Request",
        badge: "OBJECTIVE",
        desc: "The agent receives a goal requiring dynamic reasoning (e.g. salary math or employee directory lookup).",
        input: "User prompt",
        output: "HumanMessage(content=query)",
        code: "inputs = {'messages': [HumanMessage(content=user_query)]}"
      },
      agent: {
        title: "2. ReAct Agent Brain (llm.bind_tools)",
        badge: "REASONING",
        desc: "The LLM inspects the goal, decides what tool to use, and emits a structured tool_calls invocation.",
        input: "Conversation message history",
        output: "AIMessage with tool_calls (name, arguments)",
        code: "llm_with_tools = llm.bind_tools(tools)"
      },
      tools: {
        title: "3. ToolNode Execution",
        badge: "ACTION",
        desc: "Executes the requested tool safely (Calculator, Active Directory, Weather, or Knowledge Base).",
        input: "Tool name & parsed arguments",
        output: "Tool execution result string",
        code: "output = tool_fn.invoke(targs)"
      },
      obs: {
        title: "4. Tool Observation (ToolMessage)",
        badge: "OBSERVATION",
        desc: "The tool output is wrapped into a ToolMessage and fed back into the LangGraph state to continue the ReAct loop.",
        input: "Raw tool result",
        output: "ToolMessage(content=str(output), tool_call_id=...)",
        code: "StateGraph edge: tools -> agent (loops back for next thought)"
      },
      final: {
        title: "5. Final Response",
        badge: "COMPLETION",
        desc: "When no more tool calls are needed, conditional edge routes to END and delivers the answer.",
        input: "Final synthesized answer",
        output: "Completed response to user",
        code: "should_continue: return '__end__' if no tool_calls else 'tools'"
      }
    },
    m4: {
      user: {
        title: "1. User Query Intake",
        badge: "INPUT",
        desc: "Complex user request submitted to the multi-agent system.",
        input: "User query string",
        output: "State initialized with query",
        code: "MultiAgentState(query=query)"
      },
      router: {
        title: "2. LangGraph Supervisor Node",
        badge: "INTENT CLASSIFIER",
        desc: "Supervisor analyzes the query and classifies intent into rag_specialist, search_specialist, or reasoning_specialist with confidence score.",
        input: "User query",
        output: "RouteDecision(specialist, confidence, reasoning)",
        code: "supervisor_llm = llm.with_structured_output(RouteDecision)"
      },
      specialist: {
        title: "3. Specialized Worker Agent",
        badge: "EXECUTION",
        desc: "Selected expert executes tailored system prompt and focused retrieval strategy.",
        input: "Targeted domain task",
        output: "Domain-specific findings and synthesis",
        code: "workflow.add_conditional_edges('supervisor', lambda s: s.specialist)"
      },
      synthesis: {
        title: "4. Response Synthesizer",
        badge: "SYNTHESIS",
        desc: "Validates specialist output and formats the final verified response for the client.",
        input: "Specialist output",
        output: "Dispatched response with supervisor audit trail",
        code: "workflow.add_edge('specialist', END)"
      }
    },
    m5: {
      client: {
        title: "1. MCP Host Client",
        badge: "CLIENT",
        desc: "The host AI application connecting to the standardized FastMCP server.",
        input: "User instruction (e.g. 'File expense of $1,250 for EMP-4102')",
        output: "JSON-RPC request",
        code: "mcp_client.call_tool('submit_expense_claim', {...})"
      },
      protocol: {
        title: "2. FastMCP JSON-RPC Wire Protocol",
        badge: "COMMUNICATION BUS",
        desc: "Standardized JSON-RPC 2.0 packet protocol handling tools, resources, and prompt templates.",
        input: "Method + Params packet",
        output: "JSON-RPC response packet",
        code: "{'jsonrpc': '2.0', 'method': 'tools/call', 'id': 1}"
      },
      server: {
        title: "3. FastMCP Server Registry",
        badge: "RESOURCES & TOOLS",
        desc: "Exposes corporate read-only Resources (travel limits) and executable Tools (submit claim).",
        input: "Resource URIs and tool schemas",
        output: "Available capabilities manifest",
        code: "@mcp.tool() / @mcp.resource('policies://travel_limits')"
      },
      schema: {
        title: "4. Pydantic v2 Type-Safe Validation",
        badge: "SCHEMA ENFORCEMENT",
        desc: "Enforces strict JSON schema validation. Ensures zero missing fields or invalid types before data reaches business logic.",
        input: "Raw LLM JSON output",
        output: "Validated ProductionExpenseClaim instance",
        code: "class ProductionExpenseClaim(BaseModel): amount_usd: float..."
      }
    },
    m6: {
      guard: {
        title: "1. Input Guardrail Shield",
        badge: "PERIMETER FIREWALL",
        desc: "Inspects inbound prompts before core LLM or vector execution. Detects adversarial jailbreaks, prompt injections ('ignore previous instructions'), and redacts sensitive PII (SSNs, credit cards).",
        input: "Raw user prompt string",
        output: "InputSafetyVerdict(is_safe: bool, threat_type, sanitized_prompt)",
        code: "safety = safety_guardrail_llm.invoke(prompt)\nif not safety.is_safe: return circuit_breaker_deflect(safety.threat_type)"
      },
      rag: {
        title: "2. Ground Truth Paper RAG (Vaswani et al., 2017)",
        badge: "DOMAIN RETRIEVAL",
        desc: "Retrieves top passages from the 11 pages of 'Attention Is All You Need' indexed in Qdrant. Supplies verifiable mathematical and architectural context to Gemini 3.5 Flash Lite.",
        input: "Sanitized query string",
        output: "Raw generated answer + top-k paper passages with page numbers",
        code: "retriever = vector_store.as_retriever(search_kwargs={'k': 3})\nraw_answer = rag_chain.invoke(sanitized_query)"
      },
      judge: {
        title: "3. Hallucination Judge (Claim-Level Grounding)",
        badge: "SYSTEM 2 AUDITOR",
        desc: "Deconstructs generated answers into atomic factual propositions and cross-verifies each statement against retrieved paper context. Classifies each claim as SUPPORTED, UNSUPPORTED, or CONTRADICTORY.",
        input: "Generated text + retrieved paper context passages",
        output: "GroundingAudit(claims, faithfulness_score, verdict)",
        code: "audit = grounding_audit_llm.invoke(audit_prompt)\nfaithfulness = len(supported_claims) / len(total_claims)"
      },
      eval: {
        title: "4. LLM-as-a-Judge Evaluation (Ragas Triad)",
        badge: "QUALITY METRICS",
        desc: "Evaluates production response quality across the standardized Ragas Triad: Faithfulness (factual fidelity), Answer Relevancy (direct question answering), and Safety / Policy compliance.",
        input: "User query + Paper context + Model answer",
        output: "Scorecard(faithfulness: 0.0-1.0, relevancy: 0.0-1.0, safety: 0.0-1.0, overall_pass: bool)",
        code: "scorecard = judge_llm.invoke(ragas_evaluation_prompt)"
      },
      breaker: {
        title: "5. Production Circuit Breaker & Fallback",
        badge: "SAFETY POLICY",
        desc: "Enforces production SLA rules. If faithfulness drops below threshold or injection threat is detected, trips circuit breaker to suppress hallucinations and safely deliver a structured audit trail.",
        input: "Safety verdict + Faithfulness scorecard + SLA threshold",
        output: "Delivered verified answer OR suppressed safe fallback explanation",
        code: "if scorecard.faithfulness_score < threshold:\n    return suppress_and_explain(scorecard.audit_reasoning)"
      }
    }
  },

  renderFlowDiagram(milestoneId) {
    const container = document.getElementById("flowDiagramNodes");
    if (!container) return;
    
    const nodes = this.flows[milestoneId] || this.flows.m1;
    let html = "";

    nodes.forEach((node, index) => {
      html += `
        <div class="flow-node" id="flowNode_${node.id}" title="Click to inspect ${node.name}">
          <span class="node-icon">${node.icon}</span>
          <span class="node-name">${node.name}</span>
          <span class="node-sub">${node.sub}</span>
        </div>
      `;
      if (index < nodes.length - 1) {
        html += `<span class="flow-arrow" id="flowArrow_${index}">➔</span>`;
      }
    });

    container.innerHTML = html;

    // Attach click handlers to all nodes
    nodes.forEach(node => {
      const el = document.getElementById(`flowNode_${node.id}`);
      if (el) {
        el.addEventListener("click", () => {
          this.highlightSingleNode(node.id);
          this.showNodeDeepDive(milestoneId, node.id);
        });
      }
    });
  },

  highlightSingleNode(nodeId) {
    document.querySelectorAll(".flow-node").forEach(n => {
      n.classList.remove("active", "executing");
    });
    const target = document.getElementById(`flowNode_${nodeId}`);
    if (target) {
      target.classList.add("active");
    }
  },

  showNodeDeepDive(milestoneId, nodeId) {
    const detailsMap = this.nodeDetails[milestoneId] || this.nodeDetails.m1;
    const detail = detailsMap[nodeId];
    if (!detail) return;

    // Switch to Visual Inspector tab
    if (window.app && typeof window.app.switchResultTab === "function") {
      window.app.switchResultTab("tabVisual");
    }

    const container = document.getElementById("visualInspectorContent");
    if (!container) return;

    container.innerHTML = `
      <div style="background: rgba(13, 18, 29, 0.95); border: 1px solid var(--accent-indigo); border-radius: 12px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="font-size: 16px; font-weight: 800; color: #fff;">${detail.title}</h3>
          <span style="font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 12px; background: rgba(99, 102, 241, 0.2); color: var(--accent-indigo); border: 1px solid rgba(99, 102, 241, 0.4);">${detail.badge}</span>
        </div>
        <p style="font-size: 13px; color: var(--text-main); line-height: 1.5; margin-bottom: 16px;">
          ${detail.desc}
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div style="background: rgba(0,0,0,0.4); padding: 10px 12px; border-radius: 6px; font-size: 11px;">
            <div style="color: var(--text-dim); text-transform: uppercase; font-size: 10px; margin-bottom: 4px;">Input Contract</div>
            <div style="color: var(--accent-blue); font-family: var(--font-mono);">${detail.input}</div>
          </div>
          <div style="background: rgba(0,0,0,0.4); padding: 10px 12px; border-radius: 6px; font-size: 11px;">
            <div style="color: var(--text-dim); text-transform: uppercase; font-size: 10px; margin-bottom: 4px;">Output Contract</div>
            <div style="color: var(--accent-emerald); font-family: var(--font-mono);">${detail.output}</div>
          </div>
        </div>
        <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase; margin-bottom: 6px;">Production Code Usage</div>
        <pre style="background: rgba(0,0,0,0.5); padding: 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 11px; color: #e2e8f0; overflow-x: auto; border: 1px solid var(--border-subtle);">${detail.code}</pre>
      </div>
    `;
  },

  resetFlowNodes(milestoneId) {
    const nodes = this.flows[milestoneId] || this.flows.m1;
    nodes.forEach((n, idx) => {
      const el = document.getElementById(`flowNode_${n.id}`);
      if (el) el.className = "flow-node";
      const arrow = document.getElementById(`flowArrow_${idx}`);
      if (arrow) arrow.className = "flow-arrow";
    });
  },

  // Animate stages step-by-step while execution is underway
  async animatePipelineStages(milestoneId) {
    this.resetFlowNodes(milestoneId);
    const nodes = this.flows[milestoneId] || this.flows.m1;
    
    for (let i = 0; i < nodes.length; i++) {
      const el = document.getElementById(`flowNode_${nodes[i].id}`);
      if (el) {
        el.classList.add("executing");
      }
      if (i > 0) {
        const prevArrow = document.getElementById(`flowArrow_${i - 1}`);
        if (prevArrow) prevArrow.classList.add("active");
        const prevEl = document.getElementById(`flowNode_${nodes[i - 1].id}`);
        if (prevEl) {
          prevEl.classList.remove("executing");
          prevEl.classList.add("completed");
        }
      }
      await new Promise(r => setTimeout(r, 280));
    }
  },

  // Mark all nodes completed and final node glowing upon execution finish
  completePipelineStages(milestoneId) {
    const nodes = this.flows[milestoneId] || this.flows.m1;
    nodes.forEach((n, idx) => {
      const el = document.getElementById(`flowNode_${n.id}`);
      if (el) {
        el.classList.remove("executing");
        el.classList.add("completed");
      }
      const arrow = document.getElementById(`flowArrow_${idx}`);
      if (arrow) arrow.classList.add("active");
    });
    // Final node glows active
    const finalNode = document.getElementById(`flowNode_${nodes[nodes.length - 1].id}`);
    if (finalNode) {
      finalNode.classList.add("active");
    }
  },

  renderM1Chunks(chunks) {
    const container = document.getElementById("visualInspectorContent");
    if (!container) return;

    let html = `<div class="flow-diagram-title">LangChain RecursiveCharacterTextSplitter Chunks (with Overlap)</div>`;
    html += `<div class="chunk-visualizer-grid">`;

    chunks.forEach(chunk => {
      html += `
        <div class="chunk-card">
          <span class="chunk-badge">Chunk #${chunk.chunk_id} (${chunk.length || 0} chars)</span>
          <div style="margin-bottom: 6px; font-weight: 600; color: #fff;">${chunk.title || 'Document'}</div>
          <div>${chunk.text}</div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  renderM2RankLadder(data) {
    const container = document.getElementById("visualInspectorContent");
    if (!container) return;

    const isCustom = data.corpus_info && data.corpus_info.is_custom;
    const corpusBadge = data.corpus_info ? `
      <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
        <span class="m-pill" style="background: ${isCustom ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)'}; border-color: ${isCustom ? 'var(--accent-blue)' : 'var(--accent-emerald)'}; color: ${isCustom ? 'var(--accent-blue)' : 'var(--accent-emerald)'};">
          ${isCustom ? '🔵 Custom Document' : '🟢 Enterprise Corpus'}: ${data.corpus_info.title} (${data.corpus_info.chunk_count} Chunks)
        </span>
      </div>
    ` : "";

    let html = `
      <div class="flow-diagram-title">Reciprocal Rank Fusion (RRF) Comparison (k = ${data.rrf_k})</div>
      ${corpusBadge}
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
        BM25 catches exact identifiers and error codes, while Qdrant catches semantic intent.
        Formula: <code>score = &Sigma; 1 / (k + rank)</code>.
      </p>
      <table class="rank-ladder-table">
        <thead>
          <tr>
            <th>Fused Rank</th>
            <th>Document Passage</th>
            <th>Qdrant Rank</th>
            <th>BM25 Rank</th>
            <th>RRF Formula & Score</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.fused_results.forEach((item, index) => {
      const rankBadgeClass = index === 0 ? "rank-1" : index === 1 ? "rank-2" : "rank-3";
      const snippet = item.text ? `<div style="font-size: 11px; color: var(--text-muted); font-weight: normal; margin-top: 3px; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.text}</div>` : "";
      html += `
        <tr>
          <td><span class="rank-pill ${rankBadgeClass}">#${index + 1}</span></td>
          <td style="font-weight: 600; color: #fff;">
            ${item.title || ('Chunk #' + item.chunk_id)}
            ${snippet}
          </td>
          <td><span style="color: var(--accent-blue);">${item.dense_rank !== "—" ? '#' + item.dense_rank : '—'}</span></td>
          <td><span style="color: var(--accent-amber);">${item.bm25_rank !== "—" ? '#' + item.bm25_rank : '—'}</span></td>
          <td><code>${item.calculation}</code></td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  },

  renderM3ReActTrace(trace) {
    const container = document.getElementById("traceTimeline");
    if (!container) return;

    let html = "";
    trace.forEach(step => {
      let badgeClass = "step-thought";
      let badgeText = "THOUGHT";

      if (step.type === "action") {
        badgeClass = "step-action";
        badgeText = "ACTION";
      } else if (step.type === "observation") {
        badgeClass = "step-obs";
        badgeText = "OBSERVATION";
      } else if (step.type === "final_answer") {
        badgeClass = "step-final";
        badgeText = "FINAL ANSWER";
      }

      html += `
        <div class="trace-step">
          <span class="step-badge ${badgeClass}">${badgeText}</span>
          <div class="step-body">
            <div class="step-title">${step.title}</div>
            <div>${step.content || (step.tool ? `Tool: <code>${step.tool}</code> (${JSON.stringify(step.args)})` : '')}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  renderM4RoutingTree(data) {
    const container = document.getElementById("visualInspectorContent");
    if (!container) return;

    const routing = data.routing || {};
    const steps = data.orchestration_steps || [];

    let html = `
      <div class="flow-diagram-title">LangGraph Supervisor Routing Decision</div>
      <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; margin-bottom: 16px; border-left: 3px solid var(--accent-indigo);">
        <div style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 4px;">
          Delegated to: <span style="color: var(--accent-blue);">${routing.specialist}</span> (${Math.round((routing.confidence || 0) * 100)}% Confidence)
        </div>
        <div style="font-size: 12px; color: var(--text-muted);">${routing.reasoning}</div>
      </div>
      <div class="trace-timeline">
    `;

    steps.forEach((st, idx) => {
      html += `
        <div class="trace-step">
          <span class="step-badge step-action">STAGE ${idx + 1}</span>
          <div class="step-body">
            <div class="step-title">${st.title || st.agent_name}</div>
            <div style="color: var(--text-muted);">${st.detail}</div>
            ${st.output ? `<div style="margin-top: 6px; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; font-size: 12px;">${st.output}</div>` : ''}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  renderM5MCPTrace(data) {
    const container = document.getElementById("visualInspectorContent");
    if (!container) return;

    let html = `
      <div class="flow-diagram-title">FastMCP JSON-RPC Packets & Pydantic v2 Schema Validation</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <div style="font-size: 12px; font-weight: 700; color: var(--accent-amber); margin-bottom: 8px;">
            📐 Validated Pydantic Schema Model:
          </div>
          <pre style="background: rgba(0,0,0,0.4); padding: 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 11px; color: #38bdf8; overflow-x: auto;">${JSON.stringify(data.parsed_schema, null, 2)}</pre>
        </div>
        <div>
          <div style="font-size: 12px; font-weight: 700; color: var(--accent-emerald); margin-bottom: 8px;">
            🔌 FastMCP JSON-RPC Wire Trace:
          </div>
          <pre style="background: rgba(0,0,0,0.4); padding: 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 11px; color: #a855f7; overflow-x: auto;">${JSON.stringify(data.mcp_rpc_trace, null, 2)}</pre>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  renderM6Scorecard(data) {
    const container = document.getElementById("visualInspectorContent");
    if (!container) return;

    const faithScore = (data.faithfulness_score !== undefined ? data.faithfulness_score : 1.0) * 100;
    const relScore = (data.answer_relevancy_score !== undefined ? data.answer_relevancy_score : 0.95) * 100;
    const safeScore = (data.safety_score !== undefined ? data.safety_score : 1.0) * 100;

    let claimsHtml = "";
    if (data.claims_audit && data.claims_audit.length > 0) {
      claimsHtml = data.claims_audit.map(c => {
        const isSupported = c.status === "SUPPORTED";
        const badgeColor = isSupported ? "var(--accent-emerald)" : (c.status === "CONTRADICTORY" ? "var(--accent-rose)" : "var(--accent-amber)");
        const badgeBg = isSupported ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)";
        const icon = isSupported ? "✓" : "⚠️";

        return `
          <div style="background: rgba(0,0,0,0.35); border-left: 3px solid ${badgeColor}; padding: 10px 14px; border-radius: 0 8px 8px 0; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 11px; font-weight: 700; color: #fff;">${c.statement}</span>
              <span style="font-size: 10px; font-weight: 800; background: ${badgeBg}; color: ${badgeColor}; padding: 2px 8px; border-radius: 10px; border: 1px solid ${badgeColor};">${icon} ${c.status}</span>
            </div>
            <div style="font-size: 11px; color: var(--text-dim); line-height: 1.4;">
              ${c.citation ? `<strong style="color: var(--accent-blue);">Citation:</strong> ${c.citation} &bull; ` : ""}
              ${c.reason}
            </div>
          </div>
        `;
      }).join("");
    } else {
      claimsHtml = `<div style="font-size: 12px; color: var(--text-dim); padding: 10px;">Input was intercepted at perimeter; no claims reached grounding stage.</div>`;
    }

    let chunksHtml = "";
    if (data.retrieved_chunks && data.retrieved_chunks.length > 0) {
      chunksHtml = data.retrieved_chunks.map(chunk => `
        <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: var(--accent-indigo); margin-bottom: 4px;">
            <span>📄 Attention Is All You Need — Page ${chunk.page}</span>
            <span>Cosine Similarity: ${(1.0 - (chunk.score || 0)).toFixed(3)}</span>
          </div>
          <div style="font-size: 11px; color: var(--text-main); font-family: var(--font-mono); line-height: 1.4;">${chunk.content.slice(0, 320)}...</div>
        </div>
      `).join("");
    }

    const breakerColor = data.circuit_breaker_tripped ? "var(--accent-rose)" : "var(--accent-emerald)";
    const breakerBg = data.circuit_breaker_tripped ? "rgba(244, 63, 94, 0.12)" : "rgba(16, 185, 129, 0.12)";
    const breakerText = data.circuit_breaker_tripped 
      ? `🚨 CIRCUIT BREAKER TRIPPED (${data.threat_type || 'HALLUCINATION DETECTED'})`
      : `🛡️ ALL GUARDRAILS & EVALUATIONS PASSED (100% PRODUCTION READY)`;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Ground Truth Corpus Banner -->
        <div style="background: rgba(99, 102, 241, 0.12); border: 1px solid var(--accent-indigo); border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">📚</span>
            <span style="font-size: 12px; font-weight: 700; color: #fff;">Ground Truth: Attention Is All You Need (Vaswani et al., 2017)</span>
          </div>
          <span style="font-size: 10px; font-weight: 700; color: var(--accent-indigo); background: rgba(99, 102, 241, 0.2); padding: 3px 8px; border-radius: 10px;">11 Pages &bull; 45 Vector Chunks</span>
        </div>

        <!-- Circuit Breaker Status Banner -->
        <div style="background: ${breakerBg}; border: 1px solid ${breakerColor}; border-radius: 8px; padding: 10px 14px; font-size: 12px; font-weight: 800; color: ${breakerColor}; display: flex; align-items: center; justify-content: space-between;">
          <span>${breakerText}</span>
          <span style="font-size: 10px; font-weight: 600;">SLA Strictness: &gt;= 0.80</span>
        </div>

        <!-- Ragas Triad Metric Cards -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div style="background: rgba(13, 18, 30, 0.85); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 10px; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Faithfulness</div>
            <div style="font-size: 22px; font-weight: 800; color: ${faithScore >= 80 ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">${Math.round(faithScore)}%</div>
            <div style="font-size: 10px; color: var(--text-dim);">Context Fidelity</div>
          </div>
          <div style="background: rgba(13, 18, 30, 0.85); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 10px; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Answer Relevancy</div>
            <div style="font-size: 22px; font-weight: 800; color: var(--accent-blue);">${Math.round(relScore)}%</div>
            <div style="font-size: 10px; color: var(--text-dim);">Intent Alignment</div>
          </div>
          <div style="background: rgba(13, 18, 30, 0.85); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 10px; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Perimeter Safety</div>
            <div style="font-size: 22px; font-weight: 800; color: ${safeScore >= 90 ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">${Math.round(safeScore)}%</div>
            <div style="font-size: 10px; color: var(--text-dim);">Zero Injection / PII</div>
          </div>
        </div>

        <!-- Claim-by-Claim Grounding Breakdown -->
        <div>
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: var(--accent-amber); margin-bottom: 8px;">
            🔍 Claim-by-Claim Hallucination Audit (System 2 Verifier)
          </div>
          ${claimsHtml}
        </div>

        <!-- Retrieved Paper Passages Accordion -->
        ${chunksHtml ? `
          <div>
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: var(--accent-indigo); margin-bottom: 8px;">
              📄 Retrieved Attention Paper Source Passages
            </div>
            ${chunksHtml}
          </div>
        ` : ''}

      </div>
    `;
  }
};

