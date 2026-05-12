"""
Assignments Module AI Service
Python microservice for handling AI-powered features
Run with: python -m uvicorn ai_service:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
from datetime import datetime, timedelta
import httpx
import os

app = FastAPI(title="Assignments AI Service", version="1.0.0")

# Configuration
API_KEY = os.getenv("OPENAI_API_KEY", "your-key-here")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8080")

# Request/Response models

class RiskAssessmentRequest(BaseModel):
    assignment_id: str
    client_id: str
    status: str
    due_days: int
    task_completion: int
    document_completion: int

class RiskAssessmentResponse(BaseModel):
    risk_score: int
    status: str
    factors: List[str]
    recommendations: List[str]
    confidence: float

class TimelinePredictionRequest(BaseModel):
    assignment_id: str
    template_type: str
    client_complexity: str
    current_progress: Optional[int] = 0

class TimelinePredictionResponse(BaseModel):
    predicted_days: int
    confidence: float
    risk_factors: List[str]
    milestones: List[Dict[str, Any]]

class DocumentAnalysisRequest(BaseModel):
    document_id: str
    file_url: str
    document_type: str

class DocumentAnalysisResponse(BaseModel):
    extracted_data: Dict[str, Any]
    confidence: float
    validation_status: str
    missing_fields: List[str]

# Endpoints

@app.health_check()
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/risk-assessment", response_model=RiskAssessmentResponse)
async def perform_risk_assessment(request: RiskAssessmentRequest):
    """
    Perform AI-powered risk assessment on an assignment
    """
    try:
        # Calculate risk score based on multiple factors
        risk_score = calculate_risk_score(
            task_completion=request.task_completion,
            document_completion=request.document_completion,
            due_days=request.due_days,
            status=request.status
        )

        # Identify risk factors
        factors = identify_risk_factors(
            document_completion=request.document_completion,
            due_days=request.due_days,
            task_completion=request.task_completion
        )

        # Generate recommendations
        recommendations = generate_recommendations(risk_score, factors)

        return RiskAssessmentResponse(
            risk_score=risk_score,
            status="low" if risk_score < 3 else "medium" if risk_score < 7 else "high",
            factors=factors,
            recommendations=recommendations,
            confidence=0.88
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/timeline-prediction", response_model=TimelinePredictionResponse)
async def predict_timeline(request: TimelinePredictionRequest):
    """
    Predict assignment completion timeline using historical data and current progress
    """
    try:
        # Get historical data for similar assignments
        historical_avg = get_historical_average(request.template_type)
        
        # Calculate predicted days based on progress
        remaining_percent = 100 - (request.current_progress or 0)
        predicted_days = int(historical_avg * (remaining_percent / 100.0))

        # Identify risk factors affecting timeline
        risk_factors = identify_timeline_risk_factors(
            template_type=request.template_type,
            client_complexity=request.client_complexity
        )

        # Generate milestone dates
        milestones = generate_milestones(predicted_days)

        return TimelinePredictionResponse(
            predicted_days=predicted_days,
            confidence=0.87,
            risk_factors=risk_factors,
            milestones=milestones
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/document-analysis", response_model=DocumentAnalysisResponse)
async def analyze_document(request: DocumentAnalysisRequest):
    """
    Analyze uploaded document using OCR and AI to extract key information
    """
    try:
        # This would integrate with Google Vision API or similar
        extracted_data = {
            "status": "mock",
            "name": "Sample Name from OCR",
            "id": "ID123456",
            "address": "Sample Address"
        }

        validation_status = validate_document(
            document_type=request.document_type,
            extracted_data=extracted_data
        )

        missing_fields = identify_missing_fields(
            document_type=request.document_type,
            extracted_data=extracted_data
        )

        return DocumentAnalysisResponse(
            extracted_data=extracted_data,
            confidence=0.95,
            validation_status=validation_status,
            missing_fields=missing_fields
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/next-action-suggestion")
async def suggest_next_action(assignment_id: str):
    """
    Suggest the next best action for an assignment based on its current state
    """
    try:
        # Get assignment details
        assignment = await get_assignment_details(assignment_id)
        
        # Analyze current state
        pending_tasks = [t for t in assignment.get("tasks", []) if t["status"] != "COMPLETED"]
        pending_docs = [d for d in assignment.get("documents", []) if d["status"] != "COLLECTED"]

        # Determine next action
        if pending_docs:
            action = f"Request {pending_docs[0]['name']} from client"
            reason = "Unblocks downstream tasks"
        elif pending_tasks:
            action = f"Start {pending_tasks[0]['name']}"
            reason = "Next in sequence"
        else:
            action = "Request final approval"
            reason = "All tasks completed"

        return {
            "action": action,
            "reason": reason,
            "time_impact_days": 5,
            "confidence": 0.92
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions

def calculate_risk_score(
    task_completion: int,
    document_completion: int,
    due_days: int,
    status: str
) -> int:
    """Calculate risk score from 1-10 based on multiple factors"""
    score = 5  # Base score
    
    # Adjust based on task completion
    score -= (task_completion // 20)
    
    # Adjust based on document completion
    score -= (document_completion // 20)
    
    # Adjust based on timeline
    if due_days < 7:
        score += 3
    if due_days < 3:
        score += 2
    
    # Adjust based on status
    if status == "BLOCKED":
        score += 3
    elif status == "WAITING_FOR_CLIENT":
        score += 1
    
    return max(1, min(10, score))

def identify_risk_factors(
    document_completion: int,
    due_days: int,
    task_completion: int
) -> List[str]:
    """Identify specific risk factors"""
    factors = []
    
    if document_completion < 50:
        factors.append(f"{100-document_completion}% documents still pending")
    
    if due_days < 7 and task_completion < 80:
        factors.append(f"Only {due_days} days left with {100-task_completion}% tasks incomplete")
    
    if task_completion < 30:
        factors.append("Less than 30% of tasks complete")
    
    return factors if factors else ["On track"]

def generate_recommendations(risk_score: int, factors: List[str]) -> List[str]:
    """Generate mitigation recommendations"""
    recommendations = []
    
    if risk_score >= 7:
        recommendations.append("Escalate to team lead immediately")
    
    if "pending" in " ".join(factors).lower():
        recommendations.append("Send reminders for pending documents/tasks")
    
    if "days left" in " ".join(factors).lower():
        recommendations.append("Consider prioritizing high-impact tasks")
    
    return recommendations if recommendations else ["Continue monitoring"]

def get_historical_average(template_type: str) -> int:
    """Get average duration for template type from historical data"""
    # In real implementation, query database for historical data
    historical_data = {
        "INCORPORATION": 45,
        "MGT-7": 30,
        "DIR-3": 14,
        "AOC-4": 21,
        "RBI_FILING": 35,
    }
    return historical_data.get(template_type, 30)

def identify_timeline_risk_factors(template_type: str, client_complexity: str) -> List[str]:
    """Identify factors that might affect timeline"""
    factors = []
    
    if client_complexity == "HIGH":
        factors.append("Client complexity: HIGH")
    
    if template_type in ["RBI_FILING", "TRADEMARK_FILING"]:
        factors.append("Regulatory approval delays possible")
    
    return factors

def generate_milestones(predicted_days: int) -> List[Dict[str, Any]]:
    """Generate milestone dates"""
    milestones = []
    today = datetime.now()
    
    milestone_percentages = [25, 50, 75, 100]
    for percent in milestone_percentages:
        days = int(predicted_days * percent / 100)
        date = today + timedelta(days=days)
        milestones.append({
            "name": f"{percent}% Complete",
            "days": days,
            "date": date.isoformat()
        })
    
    return milestones

def validate_document(document_type: str, extracted_data: Dict[str, Any]) -> str:
    """Validate extracted document data"""
    required_fields = {
        "AADHAAR": ["name", "uid", "dob"],
        "PAN": ["name", "pan", "dob"],
        "MOA": ["company_name", "object"],
    }
    
    fields = required_fields.get(document_type, [])
    if all(field in extracted_data for field in fields):
        return "VERIFIED"
    return "PENDING_VERIFICATION"

def identify_missing_fields(document_type: str, extracted_data: Dict[str, Any]) -> List[str]:
    """Identify missing required fields"""
    required_fields = {
        "AADHAAR": ["name", "uid", "dob", "address"],
        "PAN": ["name", "pan", "dob"],
    }
    
    fields = required_fields.get(document_type, [])
    return [f for f in fields if f not in extracted_data]

async def get_assignment_details(assignment_id: str) -> Dict[str, Any]:
    """Fetch assignment details from backend"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{BACKEND_URL}/api/v1/assignments/{assignment_id}",
                headers={"Authorization": f"Bearer {API_KEY}"}
            )
            return response.json()
    except Exception as e:
        print(f"Error fetching assignment: {e}")
        return {}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
