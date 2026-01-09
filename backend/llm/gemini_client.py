"""
LLM Client: Gemini API Wrapper
Handles all interactions with Google's Gemini API
"""

import google.generativeai as genai
import os
from typing import Optional, Dict
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)


class GeminiClient:
    """Wrapper for Gemini API interactions"""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize Gemini client with API key"""
        
        # Get API key from parameter or environment
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        
        if not self.api_key:
            raise ValueError(
                "Gemini API key not found. Set GEMINI_API_KEY in .env file "
                "or pass as parameter."
            )
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        
        # Initialize model - try to detect available model
        # Default to gemini-pro for better compatibility
        try:
            models = genai.list_models()
            available_models = [m.name for m in models]
            
            # Prefer gemini-pro for v1beta compatibility
            if "models/gemini-pro" in available_models:
                self.model = genai.GenerativeModel("gemini-pro")
                logger.info("Using gemini-pro model")
            elif "models/gemini-1.5-pro" in available_models:
                self.model = genai.GenerativeModel("gemini-1.5-pro")
                logger.info("Using gemini-1.5-pro model")
            else:
                # Use first available model
                if available_models:
                    model_name = available_models[0].replace("models/", "")
                    self.model = genai.GenerativeModel(model_name)
                    logger.info(f"Using {model_name} model")
                else:
                    # Fallback to gemini-pro
                    self.model = genai.GenerativeModel("gemini-pro")
                    logger.warning("No models listed, defaulting to gemini-pro")
        except Exception as e:
            # Fallback to gemini-pro if listing fails
            logger.warning(f"Could not list models: {e}, using gemini-pro")
            self.model = genai.GenerativeModel("gemini-pro")
        
        logger.info("Gemini client initialized successfully")
    
    def generate(
        self,
        prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> Dict:
        """
        Generate response from Gemini
        
        Args:
            prompt: The input prompt
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Maximum tokens to generate
            
        Returns:
            Dict with 'text' and 'success' keys
        """
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    temperature=temperature,
                    max_output_tokens=max_tokens,
                )
            )
            
            return {
                "success": True,
                "text": response.text,
                "model": "gemini-1.5-pro"
            }
            
        except Exception as e:
            logger.error(f"Error generating from Gemini: {e}")
            return {
                "success": False,
                "text": "",
                "error": str(e),
                "model": "gemini-1.5-pro"
            }
    
    def generate_with_fallback(
        self,
        prompt: str,
        fallback_text: str = "Unable to generate AI response. Using rule-based recommendation.",
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """
        Generate response with fallback for offline scenarios
        
        Args:
            prompt: The input prompt
            fallback_text: Text to return if generation fails
            temperature: Sampling temperature
            max_tokens: Maximum tokens
            
        Returns:
            str: Generated text or fallback
        """
        result = self.generate(prompt, temperature, max_tokens)
        
        if result["success"]:
            return result["text"]
        else:
            logger.warning(f"Using fallback response: {result.get('error')}")
            return fallback_text
    
    def check_connection(self) -> bool:
        """Test if Gemini API is accessible"""
        try:
            # Try to list available models first
            try:
                models = genai.list_models()
                available_models = [m.name for m in models]
                logger.info(f"Available Gemini models: {available_models}")
                
                # Use gemini-pro if available, otherwise try gemini-1.5-pro
                if "models/gemini-pro" in available_models:
                    self.model = genai.GenerativeModel("gemini-pro")
                    logger.info("Using gemini-pro model")
                elif "models/gemini-1.5-pro" in available_models:
                    self.model = genai.GenerativeModel("gemini-1.5-pro")
                    logger.info("Using gemini-1.5-pro model")
                else:
                    # Use first available model
                    if available_models:
                        model_name = available_models[0].replace("models/", "")
                        self.model = genai.GenerativeModel(model_name)
                        logger.info(f"Using {model_name} model")
            except Exception as list_error:
                logger.warning(f"Could not list models: {list_error}, trying default")
            
            test_response = self.model.generate_content(
                "Say 'hello' to test the connection.",
                generation_config=genai.GenerationConfig(
                    temperature=0.1,
                    max_output_tokens=10
                )
            )
            
            return test_response.text is not None
            
        except Exception as e:
            logger.error(f"Gemini connection test failed: {e}")
            # Try to use gemini-pro as fallback
            try:
                self.model = genai.GenerativeModel("gemini-pro")
                logger.info("Switched to gemini-pro model")
                return True
            except:
                return False


# Singleton instance
_gemini_client = None


def get_gemini_client(api_key: Optional[str] = None) -> GeminiClient:
    """Get or create singleton Gemini client"""
    global _gemini_client
    
    if _gemini_client is None:
        _gemini_client = GeminiClient(api_key)
    
    return _gemini_client
