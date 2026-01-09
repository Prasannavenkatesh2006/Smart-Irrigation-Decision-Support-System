"""
RAG Component: Prompt Builder
Constructs prompts with retrieved context for Gemini LLM
"""

from typing import Dict, List


class PromptBuilder:
    """Builds RAG-enhanced prompts for the LLM"""
    
    def __init__(self):
        self.system_role = """You are an expert agricultural AI assistant specializing in irrigation management and water conservation. Your role is to:

1. Analyze soil moisture, weather data, and crop requirements
2. Provide evidence-based irrigation recommendations
3. Cite specific agricultural guidelines (FAO, ICAR, CIMMYT) when making decisions
4. Explain your reasoning clearly for farmers
5. Prioritize water conservation while protecting crop health

IMPORTANT GUIDELINES:
- Base all decisions on retrieved agricultural guidelines and data
- Do NOT make medical or chemical prescriptions
- Include disclaimers for extreme conditions
- Cite specific sources when referencing guidelines
- Explain technical terms in farmer-friendly language"""
    
    def build_irrigation_prompt(
        self,
        crop_type: str,
        crop_stage: str,
        field_size: float,
        soil_moisture: float,
        rainfall: float,
        guideline_context: str,
        memory_context: str,
        calculated_recommendation: Dict
    ) -> str:
        """Build complete prompt for irrigation decision"""
        
        prompt = f"""{self.system_role}

================================================================================
RETRIEVED AGRICULTURAL GUIDELINES
================================================================================

{guideline_context}

================================================================================
HISTORICAL IRRIGATION CONTEXT
================================================================================

{memory_context}

================================================================================
CURRENT REQUEST
================================================================================

Farmer Input:
- Crop: {crop_type.title()}
- Growth Stage: {crop_stage.title()}
- Field Size: {field_size} hectares
- Current Soil Moisture: {soil_moisture}%
- Predicted Rainfall (next 24h): {rainfall} mm

Rule-Based System Calculation:
- Recommendation: {calculated_recommendation.get('decision', 'unknown')}
- Suggested Water Amount: {calculated_recommendation.get('water_amount', 0)} liters
- Water per Hectare: {calculated_recommendation.get('water_per_hectare', 0)} L/ha
- Reasoning: {calculated_recommendation.get('reasoning', 'N/A')}

================================================================================
YOUR TASK
================================================================================

Based on the retrieved agricultural guidelines, historical data, and current conditions:

1. VALIDATE the rule-based calculation against agricultural guidelines
2. EXPLAIN the irrigation decision in clear, farmer-friendly language
3. CITE specific guideline sources (FAO, ICAR, CIMMYT) that support your recommendation
4. PROVIDE a detailed recommendation with:
   - Whether to irrigate, skip, or reduce irrigation
   - Exact water amount if irrigating
   - Timing considerations
   - Precautions or warnings if needed

5. FORMAT your response as follows:

DECISION: [irrigate / skip / reduce]

REASONING:
[2-3 sentences explaining why, citing retrieved guidelines]

RECOMMENDATION:
[Specific actionable advice for the farmer]

SOURCES CONSULTED:
[List the guideline sources you referenced]

DISCLAIMER:
[Any important warnings or limitations]

Remember: Your response will help the farmer make a critical decision. Be clear, evidence-based, and actionable."""

        return prompt
    
    def build_weekly_report_prompt(
        self,
        weekly_summary: Dict,
        water_savings: Dict,
        crop_type: str
    ) -> str:
        """Build prompt for generating weekly irrigation report"""
        
        prompt = f"""{self.system_role}

================================================================================
WEEKLY IRRIGATION SUMMARY
================================================================================

Period: {weekly_summary.get('period', 'Last 7 days')}
Crop Type: {crop_type.title()}

Statistics:
- Total Irrigations: {weekly_summary.get('total_irrigations', 0)}
- Total Water Used: {weekly_summary.get('total_water_used', 0)} liters
- Irrigations Skipped (Rain): {weekly_summary.get('skipped_due_to_rain', 0)}
- Average Soil Moisture: {weekly_summary.get('average_soil_moisture', 0)}%

Water Conservation:
- Smart System Usage: {water_savings.get('smart_system_usage', 0)} liters
- Traditional Schedule Would Use: {water_savings.get('traditional_schedule', 0)} liters
- Water Saved: {water_savings.get('water_saved', 0)} liters
- Savings Percentage: {water_savings.get('savings_percentage', 0)}%

Daily Decisions:
"""
        
        for decision in weekly_summary.get('decisions', []):
            prompt += f"\n  - {decision['date']}: {decision['decision']} ({decision['water']}L)"
        
        prompt += """

================================================================================
YOUR TASK
================================================================================

Generate a farmer-friendly weekly report that:

1. SUMMARIZES the week's irrigation activity
2. HIGHLIGHTS water conservation achievements
3. PROVIDES insights and recommendations for next week
4. CONGRATULATES the farmer on good water management
5. SUGGESTS any improvements or adjustments

Keep the tone positive, informative, and motivating."""

        return prompt
    
    def build_rain_alert_prompt(
        self,
        rainfall: float,
        crop_type: str,
        scheduled_water: float
    ) -> str:
        """Build prompt for rain alert generation"""
        
        prompt = f"""{self.system_role}

================================================================================
RAIN ALERT SITUATION
================================================================================

Expected Rainfall: {rainfall} mm
Crop: {crop_type.title()}
Originally Scheduled Water: {scheduled_water} liters

================================================================================
YOUR TASK
================================================================================

Generate a brief rain alert message for the farmer that:

1. States the predicted rainfall amount
2. Recommends whether to skip or reduce irrigation
3. Explains how the rain will benefit the crop
4. Suggests when to resume normal irrigation

Keep it very concise - 2-3 sentences maximum."""

        return prompt
    
    def extract_decision_from_response(self, llm_response: str) -> str:
        """Parse LLM response to extract irrigation decision"""
        
        response_lower = llm_response.lower()
        
        # Look for decision markers
        if any(marker in response_lower for marker in ["decision: skip", "skip irrigation", "do not irrigate"]):
            return "skip"
        elif any(marker in response_lower for marker in ["decision: reduce", "reduce irrigation"]):
            return "reduce"
        elif any(marker in response_lower for marker in ["decision: irrigate", "irrigate", "proceed"]):
            return "irrigate"
        else:
            # Default to the content after "DECISION:" if present
            if "decision:" in response_lower:
                decision_line = llm_response.split("DECISION:")[1].split("\n")[0].strip().lower()
                if "skip" in decision_line:
                    return "skip"
                elif "reduce" in decision_line:
                    return "reduce"
                else:
                    return "irrigate"
            
            return "unknown"
