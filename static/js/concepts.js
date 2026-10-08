/**
 * Pedagogical AI Engineering Concept Dictionary
 * Pre-indexed with deep-dive technical specs, classroom analogies, and production alternatives.
 */

const CodeConcepts = {
  // Exact and normalized lookup dictionary
  dictionary: {
    "recursivecharactertextsplitter": {
      term: "RecursiveCharacterTextSplitter",
      details: "LangChain text splitter that recursively tries splitting on paragraphs (\\n\\n), newlines (\\n), spaces (' '), and characters ('') until chunks fit within chunk_size while maintaining semantic sentence unity.",
      analogy: "Like cutting a long manuscript along natural section breaks and paragraphs first, rather than blindly cutting with scissors straight through the middle of words.",
      alternatives: [
        { name: "SemanticChunker", description: "Splits text dynamically when the cosine distance between consecutive sentence embeddings exceeds a threshold; preserves topical unity at higher compute cost." },
        { name: "TokenTextSplitter", description: "Splits strictly by model token count (tiktoken); best for guaranteeing strict context-window budgets." },
        { name: "MarkdownHeaderTextSplitter", description: "Splits along #, ##, and ### header boundaries; best for structured technical documentation." }
      ]
    },
    "chunk_size": {
      term: "chunk_size (Hyperparameter)",
      details: "The maximum character or token count allowed in each document passage. Direct trade-off: large chunks capture broader context but dilute semantic focus; tiny chunks preserve fine details but break facts across boundaries.",
      analogy: "The size of an index card in your research box—too small and ideas are split; too large and the card is too noisy to find the exact fact.",
      alternatives: [
        { name: "ParentDocumentRetriever", description: "Indexes small chunks (100 chars) for search precision, but pulls the larger parent passage (1000 chars) to give the LLM full context." },
        { name: "Contextual Compression", description: "Retrieves larger chunks and uses an LLM to extract only the relevant sentences before generation." }
      ]
    },
    "chunk_overlap": {
      term: "chunk_overlap (Hyperparameter)",
      details: "The number of characters or tokens shared between consecutive chunks. Prevents critical facts, entity names, or numerical tables from being split across chunk boundaries.",
      analogy: "Like overlapping roof shingles—each shingle overlaps the next so water (critical context) cannot leak between the seams.",
      alternatives: [
        { name: "Sentence Window Retrieval", description: "Stores single sentences in the index and expands by +k surrounding sentences at retrieval time without fixed character duplication." }
      ]
    },
    "qdrantvectorstore": {
      term: "QdrantVectorStore",
      details: "LangChain wrapper for Qdrant, an ultra-fast vector database written in Rust. Indexes high-dimensional vectors with HNSW graphs and supports payload metadata filtering and in-memory execution via location=':memory:'.",
      analogy: "An AI library catalog that arranges books not alphabetically by title, but by their exact coordinates in thought-space, letting you pinpoint closest semantic neighbors in under 2ms.",
      alternatives: [
        { name: "Pinecone", description: "Fully managed, cloud-native vector database; zero infrastructure maintenance, but proprietary and vendor-locked." },
        { name: "ChromaDB", description: "Lightweight open-source vector store; great for local Python prototyping and smaller embedded collections." },
        { name: "pgvector", description: "PostgreSQL extension adding vector indexing; ideal when enterprise user data and embeddings must live in the same ACID relational DB." }
      ]
    },
    "qdrantclient": {
      term: "QdrantClient",
      details: "Official Python client connecting to the Qdrant vector engine. Can connect to local in-memory instances (':memory:'), local Docker containers ('http://localhost:6333'), or Qdrant Cloud clusters.",
      analogy: "The database driver (like psycopg2 for Postgres) that opens the connection socket and executes vector queries.",
      alternatives: [
        { name: "REST API Client", description: "Direct HTTP JSON calls to Qdrant's REST endpoints without Python SDK abstractions." },
        { name: "gRPC Client", description: "High-throughput binary wire protocol for microsecond-scale vector ingestion." }
      ]
    },
    "googlegenerativeaiembeddings": {
      term: "GoogleGenerativeAIEmbeddings",
      details: "LangChain integration for Google Gemini embedding models (e.g. models/gemini-embedding-2). Encodes arbitrary text into dense 3072-dimensional floating-point vectors representing semantic meaning.",
      analogy: "A multi-dimensional compass that converts complex human prose into exact numerical GPS coordinates.",
      alternatives: [
        { name: "text-embedding-3-large (OpenAI)", description: "OpenAI's top embedding model (3072 dimensions) with native MRL dimension truncation support." },
        { name: "BAAI/bge-m3", description: "Leading open-source multilingual embedding model runnable locally on private GPUs." },
        { name: "Cohere Embed v3", description: "Enterprise embedding model with built-in compression and search-intent optimization." }
      ]
    },
    "chatgooglegenerativeai": {
      term: "ChatGoogleGenerativeAI",
      details: "LangChain chat model wrapper for Google Gemini (e.g. gemini-3.5-flash-lite, gemini-flash-latest). Supports massive context windows, native tool calling, and structured output parsing.",
      analogy: "A lightning-fast research analyst with an eidetic memory who synthesizes documents and executes tools in the blink of an eye.",
      alternatives: [
        { name: "ChatAnthropic (Claude 3.5 Sonnet)", description: "Industry leader for nuanced reasoning, complex code generation, and computer use." },
        { name: "ChatOpenAI (GPT-4o)", description: "OpenAI's flagship multimodal model with strong function calling and reasoning performance." },
        { name: "ChatOllama (Llama 3.3)", description: "Run open-weights models completely offline on local hardware for data sovereignty." }
      ]
    },
    "chatprompttemplate": {
      term: "ChatPromptTemplate",
      details: "LangChain factory for constructing structured, multi-role conversation turns (system, human, ai) with parameterized variables like {context} and {question}.",
      analogy: "A legal contract template with fill-in-the-blank brackets for client name, terms, and context.",
      alternatives: [
        { name: "Jinja2 Templates", description: "Full-featured Python templating supporting loops, filters, and conditional branches." },
        { name: "Standard f-strings", description: "Plain Python string formatting; simple but lacks message role separation and serializability." }
      ]
    },
    "stroutputparser": {
      term: "StrOutputParser",
      details: "LCEL streaming parser that extracts the raw string from the AIMessage.content attribute and pipes it downstream.",
      analogy: "A postal delivery agent who unpacks the shipping carton and hands you just the clean product inside.",
      alternatives: [
        { name: "JsonOutputParser", description: "Streams and parses LLM tokens directly into JSON objects as they arrive." },
        { name: "PydanticOutputParser", description: "Validates string outputs against strict Pydantic models with auto-retry prompts on error." }
      ]
    },
    "bm25retriever": {
      term: "BM25Retriever (Sparse Lexical Search)",
      details: "Lexical retrieval algorithm based on probabilistic Term Frequency - Inverse Document Frequency (TF-IDF). Excels at finding exact part numbers, error codes ('E-4502'), and technical acronyms that dense vectors miss.",
      analogy: "The index at the back of a textbook: you look up the exact word or error code ('E-4502') and flip straight to every page containing it.",
      alternatives: [
        { name: "Elasticsearch / OpenSearch", description: "Enterprise Lucene-based search engines supporting BM25, sharding, and fuzzy token analyzers." },
        { name: "SPLADE", description: "Learned sparse representations that expand queries with relevant keywords using neural networks." },
        { name: "Tantivy", description: "Blazing-fast embedded full-text search engine written in Rust." }
      ]
    },
    "reciprocal_rank_fusion": {
      term: "Reciprocal Rank Fusion (RRF)",
      details: "Rank aggregation algorithm that merges rankings from dense and sparse search: score(d) = sum(1 / (k + rank(d))). Bypasses the difficult problem of normalizing incompatible vector cosine distances and BM25 scores.",
      analogy: "Combining movie rankings from critics and audiences—movies that appear near the top of both lists bubble straight to #1, regardless of whether scores were stars or percentages.",
      alternatives: [
        { name: "Cross-Encoder Re-ranker (Cohere / BGE)", description: "Jointly scores query and candidate pairs using full self-attention; highest accuracy but slower." },
        { name: "Linear Score Blending", description: "Calculates alpha * vector_score + (1 - alpha) * bm25_score (requires MinMax normalization)." }
      ]
    },
    "rrf": {
      term: "Reciprocal Rank Fusion (RRF)",
      details: "Rank aggregation algorithm that merges rankings from dense and sparse search: score(d) = sum(1 / (k + rank(d))). Bypasses the difficult problem of normalizing incompatible vector cosine distances and BM25 scores.",
      analogy: "Combining movie rankings from critics and audiences—movies that appear near the top of both lists bubble straight to #1, regardless of whether scores were stars or percentages.",
      alternatives: [
        { name: "Cross-Encoder Re-ranker (Cohere / BGE)", description: "Jointly scores query and candidate pairs using full self-attention; highest accuracy but slower." },
        { name: "Linear Score Blending", description: "Calculates alpha * vector_score + (1 - alpha) * bm25_score (requires MinMax normalization)." }
      ]
    },
    "stategraph": {
      term: "StateGraph (LangGraph Orchestration)",
      details: "Core LangGraph class that compiles a state machine with nodes (computations) and edges (transitions). Supports cyclical loops, branching, checkpoints, and human-in-the-loop validation.",
      analogy: "A smart factory assembly line with quality-control conveyor belts that can loop parts back to a specialist station if inspection fails.",
      alternatives: [
        { name: "CrewAI", description: "High-level role-playing multi-agent framework with predefined agent hierarchies." },
        { name: "Microsoft AutoGen", description: "Multi-agent conversational framework using agent dialog loops." },
        { name: "LlamaIndex Workflows", description: "Event-driven asynchronous agent workflow engine using Python event emitters." }
      ]
    },
    "toolnode": {
      term: "ToolNode (LangGraph)",
      details: "Pre-built LangGraph node that inspects AIMessage.tool_calls, executes the requested Python functions, and returns ToolMessage results into the graph state.",
      analogy: "An operating room technician who hands the surgeon the exact instrument (scalpel, clamp) the surgeon calls out for.",
      alternatives: [
        { name: "Manual Dispatch Switch", description: "Custom if-else router function mapping tool names to callable Python functions." },
        { name: "FastMCP Client Dispatcher", description: "Invokes tools over standard Model Context Protocol JSON-RPC sockets." }
      ]
    },
    "tool": {
      term: "@tool Decorator (LangChain)",
      details: "Decorator that inspects a Python function's type hints and docstring to generate a standardized JSON Schema that LLMs can understand and call.",
      analogy: "Registering an app in the smartphone app store with a clear description and permission manifest so the phone's assistant knows how to run it.",
      alternatives: [
        { name: "StructuredTool.from_function", description: "Explicit tool construction with a custom Pydantic args_schema model." },
        { name: "Raw Function Calling Dict", description: "Passing manual JSON Schema dictionaries directly to model API requests." }
      ]
    },
    "bind_tools": {
      term: "bind_tools (Dynamic Tool Attachment)",
      details: "Attaches a list of tools or Pydantic schemas to an LLM instance so the model knows which functions it can invoke during conversation.",
      analogy: "Equipping a handyman with a customized tool belt before sending them out to a repair job.",
      alternatives: [
        { name: "llm.with_structured_output()", description: "Forces the model to respond in a single strict schema instead of choosing between tools." }
      ]
    },
    "should_continue": {
      term: "should_continue (Conditional Routing Edge)",
      details: "Routing function in LangGraph that checks whether the latest message contains tool_calls. If yes, routes to 'tools'; if no, routes to END.",
      analogy: "A project manager checking if a task is finished: if sub-tasks remain, dispatch workers; if done, sign off on the delivery.",
      alternatives: [
        { name: "Supervisor Node", description: "An LLM router agent deciding next steps based on natural language reasoning." }
      ]
    },
    "with_structured_output": {
      term: "with_structured_output (Guaranteed Schema)",
      details: "Forces the model to produce output conforming strictly to a Pydantic schema or JSON schema using API-level constrained decoding.",
      analogy: "A tax software form that won't let you submit until every required box is valid and numbers match required formats.",
      alternatives: [
        { name: "Instructor", description: "Pydantic-first library for structured outputs with automatic retry validation." },
        { name: "Outlines", description: "Guided generation library that enforces regex/CFG grammar token masks during decoding." }
      ]
    },
    "fastmcp": {
      term: "FastMCP (Model Context Protocol Server)",
      details: "High-level framework for Anthropic's Model Context Protocol (MCP). Standardizes tools, resources, and prompt templates over JSON-RPC 2.0.",
      analogy: "USB-C for AI: a universal plug allowing any LLM client to safely access enterprise databases, files, and actions without custom glue code.",
      alternatives: [
        { name: "OpenAPI / Swagger REST", description: "Standard HTTP REST APIs with OpenAPI specs." },
        { name: "gRPC Microservices", description: "High-performance protobuf services for distributed backends." }
      ]
    },
    "basemodel": {
      term: "BaseModel (Pydantic v2)",
      details: "Core data validation model using Python type annotations. Parses, coerces, and validates incoming data at runtime, raising ValidationError on bad inputs.",
      analogy: "A security scanner at a high-security gate that checks every incoming passport and credential before granting entry.",
      alternatives: [
        { name: "dataclasses", description: "Built-in Python classes with type hints, but lacks runtime coercion and validation." },
        { name: "msgspec", description: "Ultra-fast JSON and MessagePack library with type validation in C." }
      ]
    },
    "field": {
      term: "Field (Pydantic)",
      details: "Pydantic field configurator used to define schema descriptions, constraints (ge=0.0, max_length=50), and default values.",
      analogy: "The fine-print rules on an official form (e.g. 'Must be 18 or older', 'Cannot exceed $10,000').",
      alternatives: [
        { name: "dataclasses.field", description: "Standard library field customization." }
      ]
    },
    "end": {
      term: "END (LangGraph Constant)",
      details: "Special node in LangGraph signifying that execution has finished and the final state should be returned to the caller.",
      analogy: "The checkered finish line of a race track.",
      alternatives: [
        { name: "return statement in sequential scripts", description: "Exiting execution flow in standard procedural code." }
      ]
    },
    "as_retriever": {
      term: "as_retriever (VectorStore Method)",
      details: "Converts a vector store into a LangChain Runnable retriever that can be chained in LCEL pipelines using search_kwargs like k=2.",
      analogy: "Hiring a full-time search assistant who sits between your database and your pipeline ready to answer queries.",
      alternatives: [
        { name: "similarity_search", description: "Direct function call returning documents without LCEL Runnable interface." }
      ]
    },
    "temperature": {
      term: "temperature (Sampling Parameter)",
      details: "Controls randomness of LLM token selection. 0.0–0.2 is factual and deterministic (ideal for RAG/Agent tools); 0.8+ is creative and exploratory.",
      analogy: "A dial adjusting an assistant from a strict, factual legal auditor (0.0) to a brainstorming poet (0.9).",
      alternatives: [
        { name: "top_p (Nucleus Sampling)", description: "Selects tokens from smallest pool whose cumulative probability exceeds p." }
      ]
    },
    "humanmessage": {
      term: "HumanMessage",
      details: "LangChain message object representing text or multimodal prompts sent by the human user.",
      analogy: "A user's message bubble in a chat application.",
      alternatives: [
        { name: "{'role': 'user', 'content': '...'}", description: "Raw OpenAI dictionary format." }
      ]
    },
    "aimessage": {
      term: "AIMessage",
      details: "LangChain message object representing responses from the AI model, containing text content and optional tool_calls list.",
      analogy: "The assistant's spoken answer and the actions it decides to perform.",
      alternatives: [
        { name: "{'role': 'assistant', ...}", description: "Raw API completion payload." }
      ]
    },
    "toolmessage": {
      term: "ToolMessage",
      details: "LangChain message object containing the output of a tool execution, referenced back to the corresponding tool_call_id.",
      analogy: "The lab test report handed back to the doctor after ordering blood work.",
      alternatives: [
        { name: "{'role': 'tool', ...}", description: "Raw API tool message dictionary." }
      ]
    },
    "routedecision": {
      term: "RouteDecision (Supervisor Pattern)",
      details: "Pydantic schema used by the Multi-Agent Supervisor to classify queries into specialized agents (rag_specialist, search_specialist, reasoning_specialist) with confidence scores.",
      analogy: "A triage nurse writing an official referral note directing a patient to Cardiology or Orthopedics with an assessment level.",
      alternatives: [
        { name: "Semantic Router", description: "Embeds query and compares cosine distance against pre-defined route centroids." },
        { name: "Rule-Based Regex Router", description: "Static keyword matching for simple intent classification." }
      ]
    },
    "expenseclaim": {
      term: "ExpenseClaim (FastMCP Schema)",
      details: "Pydantic v2 schema defining business validation rules for enterprise expenses (employee_id, category, amount_usd, requires_vp_approval).",
      analogy: "A standardized corporate expense claim voucher that prevents fraudulent or incomplete submissions before hitting finance.",
      alternatives: [
        { name: "JSON Schema Draft 7", description: "Raw JSON schema specification without Python binding." }
      ]
    },
    "inputguardrail": {
      term: "Input Guardrail Shield",
      details: "Perimeter firewall inspecting raw user prompts before vector retrieval or LLM execution. Detects adversarial jailbreaks, prompt injections, and redacts sensitive PII (SSNs, credit cards).",
      analogy: "An airport security scanner inspecting baggage before passengers board the aircraft—dangerous items are confiscated immediately at the perimeter.",
      alternatives: [
        { name: "NeMo Guardrails (NVIDIA)", description: "Programmable guardrail system using Colang modeling rails for conversational dialog flows." },
        { name: "Llama Guard (Meta)", description: "Open fine-tuned safety classifier model dedicated to detecting harmful inputs/outputs." },
        { name: "Lakera Guard", description: "Cloud API specialized in prompt injection and LLM vulnerability defense." }
      ]
    },
    "hallucinationjudge": {
      term: "Hallucination Judge (Claim Grounding)",
      details: "System 2 verification pattern that decomposes generated text into atomic statements and verifies each against retrieved source context, returning SUPPORTED, UNSUPPORTED, or CONTRADICTORY verdicts.",
      analogy: "A fact-checker at a newspaper cross-referencing every single assertion in a draft against primary source interview tapes before publication.",
      alternatives: [
        { name: "SelfCheckGPT", description: "Zero-resource hallucination detection sampling multiple stochastic generations and measuring consistency." },
        { name: "Cleanlab Trustworthy AI", description: "Automated data-centric scoring detecting ungrounded tokens and hallucinations." }
      ]
    },
    "llmasajudge": {
      term: "LLM-as-a-Judge Evaluation",
      details: "Using a strong foundation model with strict Rubric prompts and structured output schemas to score candidate answers across standardized quality dimensions.",
      analogy: "An expert Olympic gymnastics referee who holds a rigorous scorecard assessing execution and deductions rather than giving a vague thumbs-up.",
      alternatives: [
        { name: "Ragas Framework", description: "Standardized evaluation suite calculating Faithfulness, Answer Relevancy, and Context Recall." },
        { name: "DeepEval", description: "Production testing and CI/CD evaluation framework for LLM applications." },
        { name: "Promptfoo", description: "CLI tool for automated prompt testing, red-teaming, and evaluation benchmarks." }
      ]
    },
    "faithfulness": {
      term: "Faithfulness (Ragas Triad Metric)",
      details: "Measures whether all factual claims asserted in the generated response can be inferred directly from the provided source context chunks. Score ranges from 0.0 (total hallucination) to 1.0 (100% grounded).",
      analogy: "A student writing an open-book exam: answering using ONLY verified passages from the textbook without inventing outside facts.",
      alternatives: [
        { name: "Hallucination Rate (1 - Faithfulness)", description: "Inverse error metric tracking percent of unsupported claims." },
        { name: "BERTScore", description: "Token-level semantic similarity score comparing generation against ground-truth reference text." }
      ]
    },
    "circuitbreaker": {
      term: "Production Circuit Breaker",
      details: "Software architecture pattern that halts normal execution and gracefully falls back to a safe deflection response when safety guardrails trip or faithfulness falls below an SLA threshold.",
      analogy: "An electrical fuse in a home: if voltage spikes dangerously, the fuse blows instantly to protect expensive appliances from burning out.",
      alternatives: [
        { name: "Human-in-the-Loop Queue", description: "Reroutes flagged responses to human moderators for review before releasing to users." },
        { name: "Iterative Refinement Loop", description: "Prompts the LLM to rewrite only the unsupported statements until the judge approves." }
      ]
    }
  },

  // Lookup function supporting exact, lowercase, and fuzzy matching
  find(query) {
    if (!query) return null;
    const clean = query.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    
    // 1. Direct key match
    if (this.dictionary[clean]) {
      return this.dictionary[clean];
    }

    // 2. Exact word search inside keys
    for (const [key, val] of Object.entries(this.dictionary)) {
      if (key === clean || clean.includes(key) || key.includes(clean)) {
        return val;
      }
    }

    return null;
  }
};
