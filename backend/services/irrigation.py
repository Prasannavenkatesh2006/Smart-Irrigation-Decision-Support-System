"""
Service: Irrigation Calculation Engine
Deterministic rule-based irrigation calculations
"""

from typing import Dict
import logging

logger = logging.getLogger(__name__)


class IrrigationService:
    """Rule-based irrigation calculation service"""
    
    # Crop water requirements (liters per hectare per day)
    WATER_REQUIREMENTS = {
        "rice": {"early": 80, "vegetative": 100, "flowering": 120},
        "wheat": {"early": 40, "vegetative": 60, "flowering": 80},
        "maize": {"early": 50, "vegetative": 70, "flowering": 90},
    }
    
    # Soil moisture thresholds (percentage) - irrigate if below
    MOISTURE_THRESHOLDS = {
        "rice": {"early": 70, "vegetative": 75, "flowering": 80},
        "wheat": {"early": 50, "vegetative": 55, "flowering": 60},
        "maize": {"early": 55, "vegetative": 60, "flowering": 65},
    }
    
    # Safety limits
    MAX_WATER_PER_HECTARE = 150  # liters per hectare per day
    
    def __init__(self):
        """Initialize irrigation service"""
        pass
    
    def calculate_irrigation_need(
        self,
        crop_type: str,
        crop_stage: str,
        field_size: float,
        soil_moisture: float,
        rainfall_mm: float
    ) -> Dict:
        """
        Calculate irrigation requirements using deterministic rules
        
        Args:
            crop_type: Type of crop (rice, wheat, maize)
            crop_stage: Growth stage (early, vegetative, flowering)
            field_size: Field size in hectares
            soil_moisture: Current soil moisture percentage
            rainfall_mm: Expected rainfall in millimeters
            
        Returns:
            Dict with irrigation recommendation
        """
        
        crop_type = crop_type.lower()
        crop_stage = crop_stage.lower()
        
        # Validate inputs
        if crop_type not in self.WATER_REQUIREMENTS:
            raise ValueError(f"Unknown crop type: {crop_type}")
        if crop_stage not in self.WATER_REQUIREMENTS[crop_type]:
            raise ValueError(f"Unknown crop stage: {crop_stage}")
        
        # Get crop-specific parameters
        base_water_need = self.WATER_REQUIREMENTS[crop_type][crop_stage]
        moisture_threshold = self.MOISTURE_THRESHOLDS[crop_type][crop_stage]
        
        # Step 1: Check soil moisture
        needs_irrigation = soil_moisture < moisture_threshold
        
        # Step 2: Calculate base water requirement
        water_per_hectare = base_water_need if needs_irrigation else 0
        
        # Step 3: Adjust for rainfall
        decision = "irrigate"
        rain_adjustment = ""
        
        if rainfall_mm > 10:
            # Heavy rain - skip irrigation
            water_per_hectare = 0
            decision = "skip"
            rain_adjustment = f"Heavy rain ({rainfall_mm}mm) predicted - irrigation skipped"
        elif rainfall_mm > 5:
            # Moderate rain - reduce by 50%
            water_per_hectare = water_per_hectare * 0.5
            decision = "reduce"
            rain_adjustment = f"Moderate rain ({rainfall_mm}mm) - irrigation reduced by 50%"
        else:
            # Light or no rain
            if needs_irrigation:
                decision = "irrigate"
                rain_adjustment = "Normal irrigation recommended"
            else:
                decision = "skip"
                rain_adjustment = "Soil moisture adequate - irrigation not needed"
        
        # Step 4: Apply safety limits
        safety_applied = False
        if water_per_hectare > self.MAX_WATER_PER_HECTARE:
            water_per_hectare = self.MAX_WATER_PER_HECTARE
            safety_applied = True
        
        # Step 5: Calculate total water for field
        total_water_liters = water_per_hectare * field_size
        
        # Build reasoning
        reasoning_steps = [
            f"Soil moisture {soil_moisture}% vs threshold {moisture_threshold}%",
            f"Base water need: {base_water_need} L/ha for {crop_type} ({crop_stage})",
            rain_adjustment,
            f"Water per hectare: {water_per_hectare} L/ha",
            f"Total for {field_size} ha: {total_water_liters} L"
        ]
        
        if safety_applied:
            reasoning_steps.append(f"Safety limit applied (max {self.MAX_WATER_PER_HECTARE} L/ha)")
        
        return {
            "decision": decision,
            "needs_irrigation": needs_irrigation,
            "water_amount": round(total_water_liters, 2),
            "water_per_hectare": round(water_per_hectare, 2),
            "soil_moisture": soil_moisture,
            "moisture_threshold": moisture_threshold,
            "rainfall": rainfall_mm,
            "reasoning": " | ".join(reasoning_steps),
            "safety_applied": safety_applied,
            "calculation_method": "rule-based"
        }
    
    def get_crop_info(self, crop_type: str) -> Dict:
        """Get information about a specific crop"""
        crop_type = crop_type.lower()
        
        if crop_type not in self.WATER_REQUIREMENTS:
            return {"error": f"Unknown crop: {crop_type}"}
        
        return {
            "crop_type": crop_type,
            "water_requirements": self.WATER_REQUIREMENTS[crop_type],
            "moisture_thresholds": self.MOISTURE_THRESHOLDS[crop_type],
            "stages": list(self.WATER_REQUIREMENTS[crop_type].keys())
        }
    
    def calculate_baseline_weekly_usage(
        self,
        crop_type: str,
        crop_stage: str,
        field_size: float,
        days: int = 7
    ) -> float:
        """
        Calculate traditional fixed schedule water usage
        
        Used for comparing water savings with smart system
        """
        crop_type = crop_type.lower()
        crop_stage = crop_stage.lower()
        
        try:
            daily_water = self.WATER_REQUIREMENTS[crop_type][crop_stage]
            total_water = daily_water * field_size * days
            return round(total_water, 2)
        except KeyError:
            logger.warning(f"Unknown crop/stage: {crop_type}/{crop_stage}")
            return 0.0
