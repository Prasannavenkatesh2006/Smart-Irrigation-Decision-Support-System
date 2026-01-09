"""
RAG Component: Document & Data Loader
Loads CSV data and agricultural guideline documents for retrieval
"""

import pandas as pd
from pathlib import Path
from typing import List, Dict, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DocumentLoader:
    """Loads and processes documents and data for RAG pipeline"""
    
    def __init__(self, data_dir: Path):
        self.data_dir = Path(data_dir)
        self.documents = []
        self.soil_data = None
        
    def load_soil_moisture_data(self, csv_path: Optional[Path] = None) -> pd.DataFrame:
        """Load soil moisture CSV data"""
        if csv_path is None:
            csv_path = self.data_dir / "soil_moisture.csv"
        
        try:
            self.soil_data = pd.read_csv(csv_path)
            logger.info(f"Loaded soil moisture data: {len(self.soil_data)} rows")
            return self.soil_data
        except Exception as e:
            logger.error(f"Error loading soil moisture data: {e}")
            return pd.DataFrame()
    
    def get_latest_soil_moisture(self) -> Dict:
        """Get the most recent soil moisture reading"""
        if self.soil_data is None or self.soil_data.empty:
            return {
                "value": 60.0,
                "source": "default",
                "timestamp": None
            }
        
        latest = self.soil_data.iloc[-1]
        return {
            "value": float(latest.get("soilmiosture", 60.0)),
            "source": "dataset",
            "timestamp": latest.get("date", None),
            "temperature": latest.get("temperature", None),
            "class": latest.get("class", "Unknown")
        }
    
    def load_agricultural_guidelines(self) -> List[Dict]:
        """Load agricultural guideline documents from text files"""
        guidelines_dir = self.data_dir / "guidelines"
        
        if not guidelines_dir.exists():
            logger.warning(f"Guidelines directory not found: {guidelines_dir}")
            return []
        
        documents = []
        
        for txt_file in guidelines_dir.glob("*.txt"):
            try:
                with open(txt_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                documents.append({
                    "source": txt_file.stem.upper(),  # FAO, ICAR, CIMMYT
                    "content": content,
                    "path": str(txt_file),
                    "type": "guideline"
                })
                logger.info(f"Loaded guideline: {txt_file.stem}")
            except Exception as e:
                logger.error(f"Error loading {txt_file}: {e}")
        
        self.documents = documents
        return documents
    
    def get_document_by_source(self, source: str) -> Optional[Dict]:
        """Retrieve a specific guideline document by source"""
        for doc in self.documents:
            if doc["source"].lower() == source.lower():
                return doc
        return None
    
    def search_documents(self, keyword: str) -> List[Dict]:
        """Simple keyword search across all documents"""
        results = []
        keyword_lower = keyword.lower()
        
        for doc in self.documents:
            if keyword_lower in doc["content"].lower():
                # Extract relevant snippets
                lines = doc["content"].split('\n')
                relevant_lines = [
                    line for line in lines 
                    if keyword_lower in line.lower()
                ]
                
                results.append({
                    "source": doc["source"],
                    "snippets": relevant_lines[:5],  # Top 5 matches
                    "full_content": doc["content"]
                })
        
        return results
    
    def get_all_documents(self) -> List[Dict]:
        """Return all loaded documents"""
        return self.documents
    
    def get_document_summary(self) -> Dict:
        """Get summary of loaded documents"""
        return {
            "total_documents": len(self.documents),
            "sources": [doc["source"] for doc in self.documents],
            "soil_data_rows": len(self.soil_data) if self.soil_data is not None else 0
        }
