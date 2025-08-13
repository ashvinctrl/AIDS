# AI Intrusion Detection System v2.0

An advanced, production-ready AI-based Intrusion Detection System with real-time threat monitoring, machine learning-powered detection, and comprehensive security features.

## 🚀 Features

### Core Functionality
- **Real-time threat monitoring** with WebSocket support
- **Advanced ML-powered detection** using Isolation Forest and ensemble methods
- **Interactive dashboard** with real-time charts and statistics
- **Intelligent threat classification** (DDoS, Port Scan, Data Exfiltration, APT, etc.)
- **Automated blocking** with confidence-based decision making
- **Performance monitoring** and system health tracking

### Security Features
- **API authentication** with JWT tokens
- **Rate limiting** and DDoS protection
- **Input validation** and sanitization
- **CORS protection** with specific origin allowlisting
- **Security headers** (CSP, X-Frame-Options, etc.)
- **IP validation** and geolocation tracking

### Performance Optimizations
- **Memoized components** for optimal React rendering
- **Lazy loading** and code splitting
- **Efficient data structures** (Sets for O(1) lookups)
- **Batch processing** for large datasets
- **Redis caching** for frequently accessed data
- **Gzip compression** and asset optimization

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  FastAPI Backend │    │   Redis Cache   │
│                 │◄──►│                 │◄──►│                 │
│ • Dashboard     │    │ • ML Detection  │    │ • Session Store │
│ • Real-time UI  │    │ • API Endpoints │    │ • Rate Limiting │
│ • Charts        │    │ • Authentication│    │ • Caching       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technologies

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Query** for data fetching

### Backend
- **FastAPI** with async/await support
- **Scikit-learn** for machine learning
- **Redis** for caching and session management
- **Pydantic** for data validation
- **Uvicorn** ASGI server

### DevOps
- **Docker** with multi-stage builds
- **Nginx** reverse proxy with security headers
- **Docker Compose** for orchestration

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ai-intrusion-detection.git
   cd ai-intrusion-detection
   ```

2. **Set up environment variables:**
   ```bash
   cp ai-intrusion-detection/backend/.env.example ai-intrusion-detection/backend/.env
   # Edit .env with your secure keys
   ```

3. **Start with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Installation

#### Prerequisites
- Node.js 18+
- Python 3.11+
- Redis server

#### Frontend Setup
```bash
npm install
npm run dev
```

#### Backend Setup
```bash
cd ai-intrusion-detection/backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📊 API Documentation

### Authentication
All API endpoints require authentication using Bearer tokens:
```bash
curl -H "Authorization: Bearer your-api-key" http://localhost:8000/api/detect
```

### Key Endpoints

#### POST /api/detect
Detect threats in network logs:
```json
{
  "logs": [
    {
      "src_ip": "192.168.1.100",
      "dst_ip": "10.0.0.1",
      "bytes": 1500,
      "packets": 10,
      "timestamp": "2024-01-01T12:00:00Z",
      "protocol": "TCP",
      "port": 80
    }
  ]
}
```

#### GET /health
System health check:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "model_trained": true
}
```

## 🔒 Security Best Practices

### Environment Variables
Never commit sensitive data. Use environment variables:
```bash
API_KEY=your-secure-random-key-here
SECRET_KEY=your-jwt-secret-key-here
REDIS_HOST=localhost
```

### Rate Limiting
The system implements intelligent rate limiting:
- 100 requests per minute per IP
- Exponential backoff for repeated violations
- Automatic IP blocking for severe abuse

### Input Validation
All inputs are validated and sanitized:
- IP address format validation
- SQL injection prevention
- XSS protection
- File upload restrictions

## 📈 Performance Monitoring

### Built-in Metrics
- Memory usage tracking
- Render time monitoring
- Network latency measurement
- Component count optimization

### Optimization Features
- Memoized React components
- Efficient data structures
- Batch processing
- Lazy loading
- Code splitting

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd ai-intrusion-detection/backend
pytest

# Security audit
npm audit
```

## 📦 Production Deployment

### Docker Production Build
```bash
docker build -t ai-intrusion-detection .
docker run -p 80:80 ai-intrusion-detection
```

### Environment Configuration
```bash
# Production environment variables
NODE_ENV=production
API_KEY=your-production-api-key
REDIS_HOST=your-redis-host
LOG_LEVEL=INFO
```

## 🔧 Configuration

### Frontend Configuration (vite.config.ts)
- Security headers
- CORS settings
- Build optimizations
- Code splitting

### Backend Configuration (.env)
- API security settings
- ML model parameters
- Database connections
- Logging configuration

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow security guidelines
- Optimize for performance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Machine learning model improvements
- [ ] Real-time WebSocket notifications
- [ ] Advanced threat intelligence integration
- [ ] Mobile application
- [ ] Kubernetes deployment
- [ ] Advanced analytics dashboard
