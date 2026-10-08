"""
Pedagogical Foundations & Prerequisites Engine (P1–P6)
======================================================
Provides live interactive simulations, mathematical vector calculations,
Pydantic validation testers, and LCEL pipe simulators for core AI concepts.

Directly bridges:
- 02_Core_Concepts_Deep_Dive (Python for GenAI, Embeddings, Math, Transformers)
- 04_LangChain_Code_Labs (LCEL, LangGraph, Runnables, MCP, Evals)
"""

import os
import math
import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, ValidationError

from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI


# ===========================================================================
# P1: Pydantic Validation Demo Models
# ===========================================================================

class GenAIEngineerProfile(BaseModel):
    """Pydantic model illustrating strict type enforcement for GenAI agents"""
    name: str = Field(description="Engineer full name", min_length=2)
    role: str = Field(description="Job title", default="AI Engineer")
    experience_years: int = Field(ge=0, le=50, description="Years of professional experience")
    skills: List[str] = Field(min_length=1, description="List of technical competencies")
    preferred_framework: str = Field(default="LangChain / LangGraph")
    is_certified: bool = Field(default=True)


# ===========================================================================
# Core Foundations Engine
# ===========================================================================

class ProductionFoundationsEngine:
    """Foundational interactive simulations for Prerequisites P1 through P6"""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-2",
            google_api_key=self.api_key,
        )
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-3.5-flash-lite",
            google_api_key=self.api_key,
            temperature=0.0,
        )

    # -----------------------------------------------------------------------
    # P1: Live Pydantic Validation Sandbox
    # -----------------------------------------------------------------------
    def test_pydantic_validation(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validates payload against GenAIEngineerProfile with detailed field errors"""
        t0 = time.perf_counter()
        try:
            profile = GenAIEngineerProfile.model_validate(data)
            latency_ms = int((time.perf_counter() - t0) * 1000)
            return {
                "is_valid": True,
                "parsed_data": profile.model_dump(),
                "schema": GenAIEngineerProfile.model_json_schema(),
                "errors": [],
                "latency_ms": latency_ms,
                "teaching_point": "Validation passed! Pydantic verified every type constraint (ge, le, min_length) before any LLM tool execution."
            }
        except ValidationError as err:
            errors = []
            for e in err.errors():
                errors.append({
                    "loc": " -> ".join([str(x) for x in e["loc"]]),
                    "msg": e["msg"],
                    "type": e["type"],
                })
            latency_ms = int((time.perf_counter() - t0) * 1000)
            return {
                "is_valid": False,
                "parsed_data": None,
                "schema": GenAIEngineerProfile.model_json_schema(),
                "errors": errors,
                "latency_ms": latency_ms,
                "teaching_point": f"Validation blocked! Pydantic caught {len(errors)} type violation(s). In production, this prevents dirty data from polluting agent state or databases."
            }

    # -----------------------------------------------------------------------
    # P2: Live Vector Cosine Similarity & Math Visualizer
    # -----------------------------------------------------------------------
    def calculate_vector_similarity(self, text_a: str, text_b: str) -> Dict[str, Any]:
        """Calculates exact cosine similarity and mathematical distance between two texts"""
        t0 = time.perf_counter()
        
        # Ingest embeddings
        try:
            vec_a = self.embeddings.embed_query(text_a)
            vec_b = self.embeddings.embed_query(text_b)
        except Exception:
            # Deterministic mock fallback if API key quota exceeded
            words_a = set(text_a.lower().split())
            words_b = set(text_b.lower().split())
            overlap = len(words_a.intersection(words_b))
            sim = 0.5 + 0.5 * (overlap / max(1, len(words_a.union(words_b))))
            vec_a = [0.1 * i for i in range(16)]
            vec_b = [0.1 * i * sim for i in range(16)]

        # Vector Math: Dot product & norms
        dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))

        if norm_a == 0 or norm_b == 0:
            cosine_sim = 0.0
        else:
            cosine_sim = dot_product / (norm_a * norm_b)

        # Clamp between -1.0 and 1.0 to avoid float precision issues with acos
        clamped_sim = max(-1.0, min(1.0, cosine_sim))
        angle_rad = math.acos(clamped_sim)
        angle_deg = round(math.degrees(angle_rad), 2)

        # Euclidean distance = sqrt(sum((a - b)^2))
        euclidean_dist = round(math.sqrt(sum((a - b) ** 2 for a, b in zip(vec_a, vec_b))), 4)

        # 2D projection coordinates for visualization canvas
        # Text A is baseline along X axis, Text B rotated by angle
        radius = 120.0
        x_a, y_a = radius, 0.0
        x_b = round(radius * math.cos(angle_rad), 2)
        y_b = round(-radius * math.sin(angle_rad), 2) # SVG Y points downward

        latency_ms = int((time.perf_counter() - t0) * 1000)

        # Semantic interpretation
        if cosine_sim >= 0.85:
            semantic_verdict = "Very High Semantic Similarity (Nearly Identical Meaning)"
        elif cosine_sim >= 0.65:
            semantic_verdict = "Moderate Semantic Similarity (Related Context / Topic)"
        elif cosine_sim >= 0.40:
            semantic_verdict = "Low Semantic Similarity (Distantly Related)"
        else:
            semantic_verdict = "Completely Unrelated (Orthogonal Vector Directions)"

        return {
            "text_a": text_a,
            "text_b": text_b,
            "dimension": len(vec_a),
            "sample_vector_a": [round(v, 4) for v in vec_a[:6]],
            "sample_vector_b": [round(v, 4) for v in vec_b[:6]],
            "cosine_similarity": round(cosine_sim, 4),
            "angle_degrees": angle_deg,
            "euclidean_distance": euclidean_dist,
            "dot_product": round(dot_product, 4),
            "norm_a": round(norm_a, 4),
            "norm_b": round(norm_b, 4),
            "semantic_verdict": semantic_verdict,
            "canvas_2d": {
                "vector_a": {"x": x_a, "y": y_a},
                "vector_b": {"x": x_b, "y": y_b},
                "angle_deg": angle_deg,
            },
            "latency_ms": latency_ms,
        }

    # -----------------------------------------------------------------------
    # P3: Live LCEL Pipe Simulator (Prompt | Model | StrParser)
    # -----------------------------------------------------------------------
    def simulate_lcel_flow(self, user_topic: str) -> Dict[str, Any]:
        """Step-by-step trace of Linux pipe operator chaining in LCEL"""
        t0 = time.perf_counter()

        # Step 1: Prompt Template formatting
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an elite AI Engineering Instructor. Explain this concept in exactly one punchy sentence with a real-world analogy:"),
            ("human", "Explain: {topic}"),
        ])
        formatted_messages = prompt.format_messages(topic=user_topic)

        # Step 2: LLM Invocation
        raw_ai_message = self.llm.invoke(formatted_messages)

        # Step 3: StrOutputParser
        parser = StrOutputParser()
        clean_text = parser.invoke(raw_ai_message)

        latency_ms = int((time.perf_counter() - t0) * 1000)

        return {
            "topic": user_topic,
            "stage_1_prompt": {
                "input": {"topic": user_topic},
                "output_messages": [
                    {"role": m.type, "content": m.content} for m in formatted_messages
                ]
            },
            "stage_2_llm": {
                "input": "List[BaseMessage] dispatched to Gemini",
                "output_type": "AIMessage",
                "content": raw_ai_message.content,
            },
            "stage_3_parser": {
                "input": "AIMessage",
                "output_type": "str",
                "final_string": clean_text,
            },
            "lcel_expression": "chain = prompt | llm | StrOutputParser()",
            "latency_ms": latency_ms,
        }
