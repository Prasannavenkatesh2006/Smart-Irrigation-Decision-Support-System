"""
FastAPI Backend: Main Entry Point
RAG-Enhanced Smart Irrigation System with Gemini AI
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from typing import Optional, Dict
from datetime import datetime
import logging

# Import RAG components
from backend.rag.loader import DocumentLoader
from backend.rag.retriever import GuidelineRetriever
from backend.rag.memory import IrrigationMemory
from backend.rag.prompt_builder import PromptBuilder

# Import LLM client
from backend.llm.gemini_client import get_gemini_client

# Import services
from backend.services.weather import WeatherService
from backend.services.irrigation import IrrigationService

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="Smart Irrigation RAG System",
    description="AI-powered irrigation scheduling with RAG pipeline and Gemini LLM",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
MEMORY_FILE = BASE_DIR / "irrigation_memory.json"

# Initialize components
loader = None
retriever = None
memory = None
prompt_builder = None
gemini_client = None
weather_service = None
irrigation_service = None


# Data models
class IrrigationRequest(BaseModel):
    crop_type: str
    crop_stage: str
    field_size: float
    rainfall_mm: Optional[float] = None  # Optional, will use weather service if not provided
    location: Optional[str] = None


class IrrigationResponse(BaseModel):
    decision: str
    water_amount: float
    water_per_hectare: float
    soil_moisture: float
    rainfall: float
    reasoning: str
    llm_explanation: str
    sources_cited: list
    timestamp: str
    rag_context_used: bool
    rain_alert: Optional[Dict] = None  # Proactive rain alert


class RainAlertRequest(BaseModel):
    location: Optional[str] = None
    days_ahead: int = 3  # Check next N days for rain


@app.on_event("startup")
async def startup_event():
    """Initialize all components on startup"""
    global loader, retriever, memory, prompt_builder, gemini_client, weather_service, irrigation_service
    
    logger.info("🌱 Starting Smart Irrigation RAG System...")
    
    # Initialize data loader
    logger.info(f"📊 Loading data from: {DATA_DIR}")
    loader = DocumentLoader(DATA_DIR)
    loader.load_soil_moisture_data()
    documents = loader.load_agricultural_guidelines()
    
    # Initialize retriever
    retriever = GuidelineRetriever(documents)
    logger.info(f"📚 Loaded {len(documents)} agricultural guideline documents")
    
    # Initialize memory
    memory = IrrigationMemory(MEMORY_FILE)
    logger.info(f"💾 Memory system initialized")
    
    # Initialize prompt builder
    prompt_builder = PromptBuilder()
    
    # Initialize Gemini client
    try:
        gemini_client = get_gemini_client()
        if gemini_client.check_connection():
            logger.info("🤖 Gemini AI connected successfully")
        else:
            logger.warning("⚠️ Gemini connection test failed - will use fallback")
    except Exception as e:
        logger.error(f"❌ Gemini initialization failed: {e}")
        gemini_client = None
    
    # Initialize services
    # Weather service will use fallback data if API key not configured
    # Set WEATHER_API_KEY (for WeatherAPI) or OPENWEATHER_API_KEY (for OpenWeatherMap)
    weather_service = WeatherService(use_mock=False, api_provider="openweathermap")
    if weather_service.api_key:
        logger.info("✅ Weather service initialized with real API")
    else:
        logger.warning("⚠️ Weather service using fallback data (API key not configured)")
    
    irrigation_service = IrrigationService()
    
    logger.info("✅ System ready!")


@app.get("/")
def read_root():
    """Health check and system info"""
    return {
        "status": "running",
        "system": "Smart Irrigation RAG System",
        "version": "2.0.0",
        "ai_model": "Gemini 1.5 Pro",
        "rag_enabled": True,
        "documents_loaded": len(loader.documents) if loader else 0,
        "gemini_connected": gemini_client is not None
    }


@app.post("/irrigation-plan", response_model=IrrigationResponse)
async def create_irrigation_plan(request: IrrigationRequest):
    """
    Generate irrigation plan using RAG pipeline
    
    Flow:
    1. Get current soil moisture from data
    2. Get weather forecast
    3. Calculate rule-based recommendation
    4. Retrieve relevant agricultural guidelines (RAG)
    5. Get irrigation history from memory (RAG)
    6. Build RAG-enhanced prompt
    7. Get Gemini AI reasoning and validation
    8. Store decision in memory
    9. Return comprehensive recommendation
    """
    
    try:
        # Step 1: Get soil moisture
        soil_data = loader.get_latest_soil_moisture()
        soil_moisture = soil_data["value"]
        
        # Step 2: Get weather data
        if request.rainfall_mm is None:
            try:
                rainfall = weather_service.get_rainfall_prediction(request.location)
            except ValueError as e:
                logger.error(f"Weather API configuration error: {e}")
                raise HTTPException(
                    status_code=503, 
                    detail=f"Weather API unavailable: {str(e)}. Please check your API key in .env file."
                )
            except Exception as e:
                logger.error(f"Weather API error: {e}")
                raise HTTPException(
                    status_code=503, 
                    detail=f"Weather API error: {str(e)}"
                )
        else:
            rainfall = request.rainfall_mm
        
        # Step 3: Calculate rule-based recommendation
        calculation = irrigation_service.calculate_irrigation_need(
            crop_type=request.crop_type,
            crop_stage=request.crop_stage,
            field_size=request.field_size,
            soil_moisture=soil_moisture,
            rainfall_mm=rainfall
        )
        
        # Step 4: Retrieve agricultural guidelines (RAG)
        guideline_context = retriever.get_context_for_llm(
            crop_type=request.crop_type,
            crop_stage=request.crop_stage,
            soil_moisture=soil_moisture,
            rainfall=rainfall
        )
        
        # Step 5: Get memory context (RAG)
        memory_context = memory.get_context_for_llm()
        
        # Step 6: Build RAG-enhanced prompt
        prompt = prompt_builder.build_irrigation_prompt(
            crop_type=request.crop_type,
            crop_stage=request.crop_stage,
            field_size=request.field_size,
            soil_moisture=soil_moisture,
            rainfall=rainfall,
            guideline_context=guideline_context,
            memory_context=memory_context,
            calculated_recommendation=calculation
        )
        
        # Step 7: Get Gemini AI reasoning
        llm_explanation = "Rule-based recommendation (AI offline)"
        sources_cited = []
        
        if gemini_client:
            try:
                llm_response = gemini_client.generate(prompt, temperature=0.7, max_tokens=1500)
                if llm_response["success"]:
                    llm_explanation = llm_response["text"]
                    
                    # Extract sources from response
                    if "SOURCES CONSULTED:" in llm_explanation:
                        sources_section = llm_explanation.split("SOURCES CONSULTED:")[1]
                        sources_section = sources_section.split("DISCLAIMER:")[0] if "DISCLAIMER:" in sources_section else sources_section
                        sources_cited = [line.strip() for line in sources_section.split('\n') if line.strip() and line.strip() != ""]
            except Exception as e:
                logger.error(f"Gemini generation failed: {e}")
                llm_explanation = f"Rule-based recommendation: {calculation['reasoning']}"
        
        # Step 8: Store in memory
        memory.add_irrigation_decision({
            "crop_type": request.crop_type,
            "crop_stage": request.crop_stage,
            "field_size": request.field_size,
            "soil_moisture": soil_moisture,
            "rainfall": rainfall,
            "water_applied": calculation["water_amount"],
            "decision": calculation["decision"],
            "reasoning": llm_explanation[:200]  # Store abbreviated version
        })
        
        # Step 9: Check for proactive rain alerts (next 3 days)
        rain_alert = None
        try:
            future_forecast = weather_service.get_forecast(request.location, days=3)
            for day_forecast in future_forecast.get("forecasts", [])[1:]:  # Skip today, check next 2 days
                future_rain = day_forecast.get("rainfall_mm", 0)
                if future_rain > 5:
                    rain_alert = {
                        "has_upcoming_rain": True,
                        "next_rain_date": day_forecast.get("date"),
                        "predicted_rainfall": future_rain,
                        "alert_level": "high" if future_rain > 10 else "medium",
                        "message": f"Rain ({future_rain:.1f}mm) predicted for {day_forecast.get('date')}. Plan irrigation accordingly."
                    }
                    break
        except Exception as e:
            logger.warning(f"Could not check future rain alerts: {e}")
        
        # Step 10: Return response
        return IrrigationResponse(
            decision=calculation["decision"],
            water_amount=calculation["water_amount"],
            water_per_hectare=calculation["water_per_hectare"],
            soil_moisture=soil_moisture,
            rainfall=rainfall,
            reasoning=calculation["reasoning"],
            llm_explanation=llm_explanation,
            sources_cited=sources_cited,
            timestamp=datetime.now().isoformat(),
            rag_context_used=True,
            rain_alert=rain_alert
        )
        
    except Exception as e:
        logger.error(f"Error in irrigation planning: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/weekly-report")
async def get_weekly_report():
    """Generate weekly irrigation report with water savings"""
    
    try:
        # Get weekly summary from memory
        summary = memory.get_weekly_summary()
        savings = memory.calculate_water_savings()
        
        # Generate AI report if Gemini available
        report_text = ""
        if gemini_client and summary["total_irrigations"] > 0:
            prompt = prompt_builder.build_weekly_report_prompt(
                weekly_summary=summary,
                water_savings=savings,
                crop_type="mixed"  # Could be enhanced to track crop types
            )
            
            response = gemini_client.generate_with_fallback(
                prompt,
                fallback_text="Weekly report: Check statistics below",
                temperature=0.8,
                max_tokens=800
            )
            
            report_text = response
        
        return {
            "summary": summary,
            "savings": savings,
            "ai_report": report_text,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating weekly report: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/weather-forecast")
async def get_weather_forecast(location: Optional[str] = None, days: int = 7):
    """Get weather forecast"""
    
    try:
        forecast = weather_service.get_forecast(location, days)
        return forecast
    except Exception as e:
        logger.error(f"Weather forecast error: {e}")
        # Return fallback forecast instead of error
        return weather_service._get_fallback_forecast(location or "Unknown", days)


@app.get("/system-info")
async def get_system_info():
    """Get detailed system information"""
    
    return {
        "rag_components": {
            "documents_loaded": loader.get_document_summary() if loader else {},
            "memory_entries": len(memory.memory) if memory else 0,
            "retriever_active": retriever is not None
        },
        "llm": {
            "model": "gemini-1.5-pro",
            "connected": gemini_client is not None,
            "provider": "Google Gemini API"
        },
        "services": {
            "weather": "real",  # Always uses real API (no mock data)
            "irrigation": "rule-based"
        }
    }


@app.post("/weekly-schedule")
async def generate_weekly_schedule(request: IrrigationRequest):
    """
    Generate 7-day irrigation schedule
    
    Returns a week's worth of daily irrigation plans
    """
    try:
        # Get current soil moisture (will be updated daily in real scenario)
        soil_data = loader.get_latest_soil_moisture()
        base_soil_moisture = soil_data["value"]
        
        # Get 7-day weather forecast
        forecast = weather_service.get_forecast(request.location, days=7)
        
        weekly_plans = []
        
        for i, day_forecast in enumerate(forecast.get("forecasts", [])):
            # Simulate soil moisture changes (in real scenario, this would come from sensors)
            # For demo: soil moisture decreases slightly each day if no rain
            daily_rainfall = day_forecast.get("rainfall_mm", 0)
            simulated_moisture = base_soil_moisture - (i * 2) + (daily_rainfall * 3)
            simulated_moisture = max(30, min(100, simulated_moisture))  # Keep in reasonable range
            
            # Calculate irrigation for this day
            calculation = irrigation_service.calculate_irrigation_need(
                crop_type=request.crop_type,
                crop_stage=request.crop_stage,
                field_size=request.field_size,
                soil_moisture=simulated_moisture,
                rainfall_mm=daily_rainfall
            )
            
            weekly_plans.append({
                "date": day_forecast.get("date"),
                "day": i + 1,
                "decision": calculation["decision"],
                "water_amount": calculation["water_amount"],
                "water_per_hectare": calculation["water_per_hectare"],
                "soil_moisture": round(simulated_moisture, 1),
                "rainfall": daily_rainfall,
                "temperature": day_forecast.get("temperature_c"),
                "conditions": day_forecast.get("conditions"),
                "reasoning": calculation["reasoning"]
            })
        
        return {
            "crop_type": request.crop_type,
            "crop_stage": request.crop_stage,
            "field_size": request.field_size,
            "schedule": weekly_plans,
            "total_water_week": sum(plan["water_amount"] for plan in weekly_plans),
            "irrigation_days": sum(1 for plan in weekly_plans if plan["decision"] == "irrigate"),
            "skip_days": sum(1 for plan in weekly_plans if plan["decision"] == "skip"),
            "reduce_days": sum(1 for plan in weekly_plans if plan["decision"] == "reduce"),
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating weekly schedule: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/export/weekly-report")
async def export_weekly_report(format: str = "json"):
    """
    Export weekly report in JSON or CSV format
    
    Args:
        format: 'json' or 'csv'
    """
    try:
        summary = memory.get_weekly_summary()
        savings = memory.calculate_water_savings()
        
        if format.lower() == "csv":
            from fastapi.responses import Response
            import csv
            import io
            
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write header
            writer.writerow(["Weekly Irrigation Report"])
            writer.writerow([])
            writer.writerow(["Period", summary.get("period", "Last 7 days")])
            writer.writerow(["Total Irrigations", summary.get("total_irrigations", 0)])
            writer.writerow(["Total Water Used (L)", summary.get("total_water_used", 0)])
            writer.writerow(["Skipped Due to Rain", summary.get("skipped_due_to_rain", 0)])
            writer.writerow(["Average Soil Moisture (%)", summary.get("average_soil_moisture", 0)])
            writer.writerow([])
            writer.writerow(["Water Savings"])
            writer.writerow(["Smart System Usage (L)", savings.get("smart_system_usage", 0)])
            writer.writerow(["Traditional Schedule (L)", savings.get("traditional_schedule", 0)])
            writer.writerow(["Water Saved (L)", savings.get("water_saved", 0)])
            writer.writerow(["Savings Percentage (%)", savings.get("savings_percentage", 0)])
            writer.writerow([])
            writer.writerow(["Daily Decisions"])
            writer.writerow(["Date", "Decision", "Water (L)"])
            
            for decision in summary.get("decisions", []):
                writer.writerow([
                    decision.get("date", ""),
                    decision.get("decision", ""),
                    decision.get("water", 0)
                ])
            
            return Response(
                content=output.getvalue(),
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename=weekly_report_{datetime.now().strftime('%Y%m%d')}.csv"}
            )
        else:
            # JSON format
            return {
                "summary": summary,
                "savings": savings,
                "exported_at": datetime.now().isoformat()
            }
            
    except Exception as e:
        logger.error(f"Error exporting weekly report: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/rain-alert")
async def check_rain_alert(location: Optional[str] = None, days_ahead: int = 3):
    """
    Check for proactive rain alerts in the next N days
    
    Returns alerts if significant rain is predicted that would affect irrigation
    """
    try:
        forecast = weather_service.get_forecast(location, days=days_ahead)
        
        alerts = []
        
        for day_forecast in forecast.get("forecasts", []):
            rainfall = day_forecast.get("rainfall_mm", 0)
            date = day_forecast.get("date")
            
            # Generate alert if significant rain predicted
            if rainfall > 5:
                alert_level = "high" if rainfall > 10 else "medium"
                alert_message = ""
                
                if rainfall > 10:
                    alert_message = f"Heavy rain ({rainfall:.1f}mm) predicted for {date}. Skip scheduled irrigation."
                elif rainfall > 5:
                    alert_message = f"Moderate rain ({rainfall:.1f}mm) predicted for {date}. Consider reducing irrigation by 50%."
                
                alerts.append({
                    "date": date,
                    "rainfall_mm": rainfall,
                    "alert_level": alert_level,
                    "message": alert_message,
                    "recommendation": "skip" if rainfall > 10 else "reduce"
                })
        
        return {
            "has_alerts": len(alerts) > 0,
            "alerts": alerts,
            "checked_days": days_ahead,
            "location": location or "Default",
            "checked_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error checking rain alerts: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/export/irrigation-history")
async def export_irrigation_history(format: str = "json"):
    """
    Export full irrigation history in JSON or CSV format
    """
    try:
        history = memory.get_recent_history(days=30)
        
        if format.lower() == "csv":
            from fastapi.responses import Response
            import csv
            import io
            
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write header
            writer.writerow(["Timestamp", "Crop Type", "Crop Stage", "Field Size (ha)", 
                            "Soil Moisture (%)", "Rainfall (mm)", "Water Applied (L)", 
                            "Decision", "Reasoning"])
            
            for entry in history:
                writer.writerow([
                    entry.get("timestamp", ""),
                    entry.get("crop_type", ""),
                    entry.get("crop_stage", ""),
                    entry.get("field_size", 0),
                    entry.get("soil_moisture", 0),
                    entry.get("rainfall", 0),
                    entry.get("water_applied", 0),
                    entry.get("decision", ""),
                    entry.get("reasoning", "")[:100]  # Truncate long reasoning
                ])
            
            return Response(
                content=output.getvalue(),
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename=irrigation_history_{datetime.now().strftime('%Y%m%d')}.csv"}
            )
        else:
            # JSON format
            return {
                "history": history,
                "total_entries": len(history),
                "exported_at": datetime.now().isoformat()
            }
            
    except Exception as e:
        logger.error(f"Error exporting irrigation history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
