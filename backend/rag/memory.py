"""
RAG Component: Memory System
Stores and retrieves irrigation history for context-aware decisions
"""

import json
from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class IrrigationMemory:
    """Manages historical irrigation data for RAG context"""
    
    def __init__(self, memory_file: Path):
        self.memory_file = Path(memory_file)
        self.memory = self._load_memory()
    
    def _load_memory(self) -> List[Dict]:
        """Load memory from JSON file"""
        if self.memory_file.exists():
            try:
                with open(self.memory_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading memory: {e}")
                return []
        return []
    
    def _save_memory(self):
        """Save memory to JSON file"""
        try:
            # Keep only last 30 days
            if len(self.memory) > 30:
                self.memory = self.memory[-30:]
            
            with open(self.memory_file, 'w') as f:
                json.dump(self.memory, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving memory: {e}")
    
    def add_irrigation_decision(self, decision_data: Dict):
        """Store a new irrigation decision"""
        entry = {
            "timestamp": datetime.now().isoformat(),
            "crop_type": decision_data.get("crop_type"),
            "crop_stage": decision_data.get("crop_stage"),
            "field_size": decision_data.get("field_size"),
            "soil_moisture": decision_data.get("soil_moisture"),
            "rainfall": decision_data.get("rainfall"),
            "water_applied": decision_data.get("water_applied"),
            "decision": decision_data.get("decision"),
            "reasoning": decision_data.get("reasoning", "")
        }
        
        self.memory.append(entry)
        self._save_memory()
        logger.info(f"Stored irrigation decision: {entry['decision']}")
    
    def get_recent_history(self, days: int = 7) -> List[Dict]:
        """Get irrigation history for the last N days"""
        cutoff_date = datetime.now() - timedelta(days=days)
        
        recent = []
        for entry in reversed(self.memory):
            try:
                entry_date = datetime.fromisoformat(entry["timestamp"])
                if entry_date >= cutoff_date:
                    recent.append(entry)
            except:
                continue
        
        return list(reversed(recent))
    
    def get_weekly_summary(self) -> Dict:
        """Generate a weekly summary for reporting"""
        week_data = self.get_recent_history(days=7)
        
        if not week_data:
            return {
                "period": "Last 7 days",
                "total_irrigations": 0,
                "total_water_used": 0.0,
                "skipped_due_to_rain": 0,
                "average_soil_moisture": 0.0,
                "decisions": []
            }
        
        total_water = sum(entry.get("water_applied", 0) for entry in week_data)
        skip_count = sum(1 for entry in week_data if entry.get("decision") == "skip")
        avg_moisture = sum(entry.get("soil_moisture", 0) for entry in week_data) / len(week_data)
        
        return {
            "period": "Last 7 days",
            "total_irrigations": len(week_data),
            "total_water_used": round(total_water, 2),
            "skipped_due_to_rain": skip_count,
            "average_soil_moisture": round(avg_moisture, 1),
            "decisions": [
                {
                    "date": entry["timestamp"][:10],
                    "decision": entry["decision"],
                    "water": entry.get("water_applied", 0)
                }
                for entry in week_data
            ]
        }
    
    def calculate_water_savings(self, baseline_daily_water: float = 100) -> Dict:
        """Calculate water saved vs traditional fixed schedule"""
        week_data = self.get_recent_history(days=7)
        
        if not week_data:
            return {
                "smart_system_usage": 0.0,
                "traditional_schedule": 0.0,
                "water_saved": 0.0,
                "savings_percentage": 0.0
            }
        
        smart_usage = sum(entry.get("water_applied", 0) for entry in week_data)
        traditional_usage = len(week_data) * baseline_daily_water
        
        savings = traditional_usage - smart_usage
        savings_pct = (savings / traditional_usage * 100) if traditional_usage > 0 else 0
        
        return {
            "smart_system_usage": round(smart_usage, 2),
            "traditional_schedule": round(traditional_usage, 2),
            "water_saved": round(savings, 2),
            "savings_percentage": round(savings_pct, 1)
        }
    
    def get_context_for_llm(self) -> str:
        """Build memory context for LLM prompts"""
        recent = self.get_recent_history(days=7)
        
        if not recent:
            return "No recent irrigation history available."
        
        context_lines = [
            "=== Recent Irrigation History (Last 7 Days) ===\n"
        ]
        
        for entry in recent[-5:]:  # Last 5 entries
            date = entry["timestamp"][:10]
            decision = entry.get("decision", "unknown")
            water = entry.get("water_applied", 0)
            moisture = entry.get("soil_moisture", "N/A")
            
            context_lines.append(
                f"  [{date}] Decision: {decision}, "
                f"Water: {water}L, Soil Moisture: {moisture}%"
            )
        
        summary = self.get_weekly_summary()
        context_lines.append(f"\n  Total water used this week: {summary['total_water_used']}L")
        context_lines.append(f"  Irrigations skipped (rain): {summary['skipped_due_to_rain']}")
        
        return '\n'.join(context_lines)
    
    def get_crop_patterns(self, crop_type: str) -> Dict:
        """Analyze historical patterns for a specific crop"""
        crop_history = [
            entry for entry in self.memory 
            if entry.get("crop_type", "").lower() == crop_type.lower()
        ]
        
        if not crop_history:
            return {"crop_type": crop_type, "entries": 0, "patterns": None}
        
        total_water = sum(entry.get("water_applied", 0) for entry in crop_history)
        avg_water = total_water / len(crop_history) if crop_history else 0
        
        return {
            "crop_type": crop_type,
            "entries": len(crop_history),
            "average_water_per_irrigation": round(avg_water, 2),
            "total_water_historical": round(total_water, 2)
        }
