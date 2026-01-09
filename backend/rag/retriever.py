"""
RAG Component: Information Retriever
Retrieves relevant agricultural guidelines and data based on context
"""

from typing import List, Dict, Optional
import re
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)


class GuidelineRetriever:
    """Retrieves relevant agricultural information for RAG"""
    
    def __init__(self, documents: List[Dict]):
        self.documents = documents
        self.crop_keywords = {
            "rice": ["rice", "paddy", "oryza", "flooded"],
            "wheat": ["wheat", "triticum", "cereal", "grain"],
            "maize": ["maize", "corn", "zea mays"]
        }
        
        self.stage_keywords = {
            "early": ["establishment", "initial", "germination", "seedling", "early"],
            "vegetative": ["vegetative", "tillering", "growth", "development"],
            "flowering": ["flowering", "reproductive", "heading", "anthesis"]
        }
    
    def retrieve_for_crop(self, crop_type: str, crop_stage: str, top_k: int = 3) -> List[Dict]:
        """Retrieve relevant guidelines for specific crop and stage"""
        
        # Get keywords for this crop and stage
        crop_keys = self.crop_keywords.get(crop_type.lower(), [crop_type.lower()])
        stage_keys = self.stage_keywords.get(crop_stage.lower(), [crop_stage.lower()])
        
        all_keywords = crop_keys + stage_keys
        
        results = []
        
        for doc in self.documents:
            content_lower = doc["content"].lower()
            
            # Calculate relevance score
            score = 0
            matches = []
            
            for keyword in all_keywords:
                count = content_lower.count(keyword)
                score += count
                if count > 0:
                    matches.append(keyword)
            
            if score > 0:
                # Extract relevant sections
                sections = self._extract_relevant_sections(
                    doc["content"], 
                    all_keywords
                )
                
                results.append({
                    "source": doc["source"],
                    "score": score,
                    "matches": matches,
                    "sections": sections,
                    "full_content": doc["content"]
                })
        
        # Sort by relevance score
        results.sort(key=lambda x: x["score"], reverse=True)
        
        return results[:top_k]
    
    def _extract_relevant_sections(self, content: str, keywords: List[str], 
                                   context_lines: int = 3) -> List[str]:
        """Extract relevant sections around keywords"""
        lines = content.split('\n')
        relevant_sections = []
        seen_indices = set()
        
        for i, line in enumerate(lines):
            line_lower = line.lower()
            
            # Check if any keyword is in this line
            if any(keyword in line_lower for keyword in keywords):
                # Get context around this line
                start_idx = max(0, i - context_lines)
                end_idx = min(len(lines), i + context_lines + 1)
                
                # Avoid duplicates
                if i not in seen_indices:
                    section = '\n'.join(lines[start_idx:end_idx])
                    relevant_sections.append(section)
                    seen_indices.update(range(start_idx, end_idx))
        
        return relevant_sections[:5]  # Top 5 sections
    
    def retrieve_water_requirements(self, crop_type: str, crop_stage: str) -> Dict:
        """Retrieve specific water requirement information"""
        
        results = self.retrieve_for_crop(crop_type, crop_stage)
        
        water_info = {
            "crop_type": crop_type,
            "crop_stage": crop_stage,
            "requirements": [],
            "sources": []
        }
        
        # Pattern to find water requirements (mm/day, liters/ha, etc.)
        water_pattern = r'(\d+(?:\.\d+)?)\s*(mm|l|liters?|m3)(?:/|\s*per\s*)(day|hectare|ha)'
        
        for result in results:
            content = result["full_content"]
            
            # Find water requirement numbers
            matches = re.findall(water_pattern, content, re.IGNORECASE)
            
            if matches:
                water_info["requirements"].extend([
                    {
                        "value": float(m[0]),
                        "unit": f"{m[1]}/{m[2]}",
                        "source": result["source"]
                    }
                    for m in matches
                ])
            
            water_info["sources"].append({
                "source": result["source"],
                "sections": result["sections"][:2]  # Top 2 sections
            })
        
        return water_info
    
    def retrieve_soil_moisture_thresholds(self, crop_type: str) -> Dict:
        """Retrieve soil moisture threshold information"""
        
        threshold_info = {
            "crop_type": crop_type,
            "thresholds": [],
            "sources": []
        }
        
        # Pattern for moisture percentages
        moisture_pattern = r'(\d+(?:\.\d+)?)\s*%?\s*(moisture|water\s*content)'
        
        for doc in self.documents:
            content_lower = doc["content"].lower()
            
            # Check if document discusses this crop
            if any(keyword in content_lower for keyword in self.crop_keywords.get(crop_type.lower(), [])):
                matches = re.findall(moisture_pattern, doc["content"], re.IGNORECASE)
                
                if matches:
                    threshold_info["thresholds"].extend([
                        {
                            "value": float(m[0]),
                            "type": m[1],
                            "source": doc["source"]
                        }
                        for m in matches
                    ])
                    
                    threshold_info["sources"].append(doc["source"])
        
        return threshold_info
    
    def retrieve_rain_guidelines(self) -> List[Dict]:
        """Retrieve guidelines about rainfall and irrigation"""
        
        rain_keywords = ["rain", "rainfall", "precipitation", "skip irrigation", "reduce water"]
        
        results = []
        
        for doc in self.documents:
            content_lower = doc["content"].lower()
            
            score = sum(content_lower.count(kw) for kw in rain_keywords)
            
            if score > 0:
                sections = self._extract_relevant_sections(
                    doc["content"],
                    rain_keywords
                )
                
                results.append({
                    "source": doc["source"],
                    "sections": sections
                })
        
        return results
    
    def get_context_for_llm(self, crop_type: str, crop_stage: str, 
                           soil_moisture: float, rainfall: float) -> str:
        """Build comprehensive context for LLM prompt"""
        
        # Retrieve relevant information
        crop_guidelines = self.retrieve_for_crop(crop_type, crop_stage, top_k=2)
        water_reqs = self.retrieve_water_requirements(crop_type, crop_stage)
        
        context_parts = []
        
        # Add crop-specific guidelines
        context_parts.append(f"=== Agricultural Guidelines for {crop_type.title()} ({crop_stage} stage) ===\n")
        
        for guide in crop_guidelines:
            context_parts.append(f"\nSource: {guide['source']}")
            context_parts.append(f"Matched keywords: {', '.join(guide['matches'])}")
            context_parts.append("Relevant sections:")
            for section in guide['sections'][:2]:
                context_parts.append(f"  {section}\n")
        
        # Add water requirements if found
        if water_reqs['requirements']:
            context_parts.append("\n=== Water Requirements Found ===")
            for req in water_reqs['requirements'][:3]:
                context_parts.append(
                    f"  - {req['value']} {req['unit']} (Source: {req['source']})"
                )
        
        # Add current conditions
        context_parts.append(f"\n=== Current Field Conditions ===")
        context_parts.append(f"  - Soil Moisture: {soil_moisture}%")
        context_parts.append(f"  - Predicted Rainfall: {rainfall} mm")
        
        return '\n'.join(context_parts)
