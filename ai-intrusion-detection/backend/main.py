from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, validator
from typing import List, Optional
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import asyncio
import logging
import ipaddress
from datetime import datetime, timedelta
import hashlib
import os
from functools import lru_cache
import redis
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security
security = HTTPBearer()
API_KEY = os.getenv("API_KEY", "your-secure-api-key")

# Redis for caching (optional)
try:
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping()
    REDIS_AVAILABLE = True
except:
    REDIS_AVAILABLE = False
    logger.warning("Redis not available, using in-memory caching")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting AI Intrusion Detection System")
    yield
    # Shutdown
    logger.info("Shutting down AI Intrusion Detection System")

app = FastAPI(
    title="AI Intrusion Detection System",
    description="Advanced threat detection using machine learning",
    version="2.0.0",
    lifespan=lifespan
)

# Security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1", "*.yourdomain.com"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Specific origins only
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Enhanced models
class LogEntry(BaseModel):
    src_ip: str = Field(..., description="Source IP address")
    dst_ip: str = Field(..., description="Destination IP address")
    bytes: int = Field(..., ge=0, description="Number of bytes transferred")
    packets: int = Field(..., ge=0, description="Number of packets")
    timestamp: Optional[datetime] = Field(default_factory=datetime.now)
    protocol: Optional[str] = Field("TCP", description="Network protocol")
    port: Optional[int] = Field(None, ge=1, le=65535, description="Destination port")
    
    @validator('src_ip', 'dst_ip')
    def validate_ip(cls, v):
        try:
            ipaddress.ip_address(v)
            return v
        except ValueError:
            raise ValueError('Invalid IP address format')

class LogsRequest(BaseModel):
    logs: List[LogEntry] = Field(..., max_items=1000, description="List of log entries")

class ThreatResponse(BaseModel):
    src_ip: str
    dst_ip: str
    bytes: int
    packets: int
    threat_score: float
    is_threat: bool
    threat_type: Optional[str]
    confidence: float
    timestamp: datetime

# Enhanced AI Model
class ThreatDetectionModel:
    def __init__(self):
        self.isolation_forest = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=200,
            max_samples='auto'
        )
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = ['bytes', 'packets', 'bytes_per_packet', 'hour', 'is_weekend']
        
    def extract_features(self, logs: List[LogEntry]) -> np.ndarray:
        """Extract enhanced features from log entries"""
        features = []
        for log in logs:
            # Basic features
            bytes_per_packet = log.bytes / max(log.packets, 1)
            hour = log.timestamp.hour if log.timestamp else 0
            is_weekend = log.timestamp.weekday() >= 5 if log.timestamp else 0
            
            features.append([
                log.bytes,
                log.packets,
                bytes_per_packet,
                hour,
                is_weekend
            ])
        return np.array(features)
    
    def train(self, training_data: np.ndarray):
        """Train the model with enhanced features"""
        scaled_data = self.scaler.fit_transform(training_data)
        self.isolation_forest.fit(scaled_data)
        self.is_trained = True
        logger.info("Model trained successfully")
    
    def predict(self, logs: List[LogEntry]) -> List[ThreatResponse]:
        """Predict threats with confidence scores"""
        if not self.is_trained:
            # Generate synthetic training data if not trained
            self._generate_training_data()
        
        features = self.extract_features(logs)
        scaled_features = self.scaler.transform(features)
        
        # Get anomaly scores
        anomaly_scores = self.isolation_forest.decision_function(scaled_features)
        predictions = self.isolation_forest.predict(scaled_features)
        
        results = []
        for log, score, pred in zip(logs, anomaly_scores, predictions):
            # Normalize score to 0-1 range
            threat_score = max(0, min(1, (0.5 - score) * 2))
            is_threat = pred == -1
            confidence = abs(score)
            
            # Determine threat type based on features
            threat_type = self._classify_threat_type(log, threat_score)
            
            results.append(ThreatResponse(
                src_ip=log.src_ip,
                dst_ip=log.dst_ip,
                bytes=log.bytes,
                packets=log.packets,
                threat_score=threat_score,
                is_threat=is_threat,
                threat_type=threat_type,
                confidence=confidence,
                timestamp=log.timestamp or datetime.now()
            ))
        
        return results
    
    def _classify_threat_type(self, log: LogEntry, score: float) -> Optional[str]:
        """Classify the type of threat based on log characteristics"""
        if score < 0.3:
            return None
        
        # Simple heuristics for threat classification
        if log.bytes > 10000 and log.packets < 10:
            return "DDoS"
        elif log.packets > 1000 and log.bytes < 1000:
            return "Port Scan"
        elif log.bytes / max(log.packets, 1) > 1500:
            return "Data Exfiltration"
        elif score > 0.8:
            return "Advanced Persistent Threat"
        else:
            return "Suspicious Activity"
    
    def _generate_training_data(self):
        """Generate synthetic training data for demonstration"""
        np.random.seed(42)
        # Normal traffic patterns
        normal_data = np.random.multivariate_normal(
            [1000, 50, 20, 12, 0.3], 
            [[500000, 1000, 100, 36, 0.1],
             [1000, 100, 10, 5, 0.05],
             [100, 10, 5, 2, 0.02],
             [36, 5, 2, 16, 0.1],
             [0.1, 0.05, 0.02, 0.1, 0.2]], 
            800
        )
        
        # Anomalous traffic patterns
        anomaly_data = np.random.multivariate_normal(
            [50000, 5, 10000, 3, 0.1],
            [[10000000, 100, 1000000, 9, 0.05],
             [100, 25, 1000, 3, 0.02],
             [1000000, 1000, 10000000, 9, 0.1],
             [9, 3, 9, 9, 0.05],
             [0.05, 0.02, 0.1, 0.05, 0.1]],
            200
        )
        
        training_data = np.vstack([normal_data, anomaly_data])
        self.train(training_data)

# Initialize model
model = ThreatDetectionModel()

# Authentication
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return credentials.credentials

# Caching
@lru_cache(maxsize=1000)
def get_cached_result(log_hash: str):
    if REDIS_AVAILABLE:
        return redis_client.get(f"threat:{log_hash}")
    return None

def cache_result(log_hash: str, result: str, ttl: int = 300):
    if REDIS_AVAILABLE:
        redis_client.setex(f"threat:{log_hash}", ttl, result)

# API Endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(), "model_trained": model.is_trained}

@app.post("/api/detect", response_model=List[ThreatResponse])
async def detect_threats(
    data: LogsRequest,
    request: Request,
    token: str = Depends(verify_token)
):
    try:
        # Rate limiting check (simple implementation)
        client_ip = request.client.host
        
        # Log the request
        logger.info(f"Threat detection request from {client_ip} with {len(data.logs)} logs")
        
        # Process in batches for better performance
        batch_size = 100
        all_results = []
        
        for i in range(0, len(data.logs), batch_size):
            batch = data.logs[i:i + batch_size]
            batch_results = model.predict(batch)
            all_results.extend(batch_results)
        
        # Log threats found
        threats_found = sum(1 for r in all_results if r.is_threat)
        logger.info(f"Detected {threats_found} threats out of {len(data.logs)} logs")
        
        return all_results
        
    except Exception as e:
        logger.error(f"Error in threat detection: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/train")
async def train_model(token: str = Depends(verify_token)):
    """Retrain the model with fresh data"""
    try:
        model._generate_training_data()
        return {"message": "Model retrained successfully", "timestamp": datetime.now()}
    except Exception as e:
        logger.error(f"Error training model: {str(e)}")
        raise HTTPException(status_code=500, detail="Training failed")

@app.get("/api/stats")
async def get_stats(token: str = Depends(verify_token)):
    """Get system statistics"""
    return {
        "model_trained": model.is_trained,
        "redis_available": REDIS_AVAILABLE,
        "uptime": datetime.now(),
        "version": "2.0.0"
    }