
# 🛡️ Imperial Watchtower - Advanced Surveillance & Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-%5E19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue)](https://www.typescriptlang.org/)

> **⚠️ LEGAL DISCLAIMER**: This tool is designed for authorized security testing, research, and educational purposes only. Users are responsible for compliance with all applicable laws and regulations. Unauthorized surveillance or network scanning may be illegal in your jurisdiction.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Security Considerations](#security-considerations)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Imperial Watchtower is a comprehensive surveillance and intelligence gathering platform that combines multiple OSINT (Open Source Intelligence) tools, camera discovery systems, and security assessment capabilities into a unified web application.

### Core Capabilities

- **📹 Camera Discovery**: Advanced ONVIF, RTSP, and IP camera reconnaissance
- **🌐 Network Scanning**: Comprehensive network enumeration and service discovery
- **🔍 OSINT Tools**: Open source intelligence gathering and social media analysis
- **🛡️ Security Assessment**: Vulnerability scanning and compliance checking
- **⚡ Real-time Monitoring**: Live stream viewing and surveillance management
- **🎯 Penetration Testing**: Security testing framework with payload generation

## ✨ Features

### Imperial Scanner Module
- Multi-protocol camera discovery (ONVIF, RTSP, HTTP)
- Geographic filtering and country-specific searches
- Proxy chain support for anonymous scanning
- Vulnerability assessment and firmware analysis
- Real-time progress tracking with WebSocket updates

### Camera Viewer
- Live RTSP/HTTP stream viewing
- Multi-camera grid display
- Stream recording and playback
- Camera metadata and geolocation display
- Security credential testing

### OSINT Tools Suite
- **Social Media Intelligence**: Username enumeration across platforms
- **Website Analysis**: Technology stack detection and security headers
- **Document Search**: Metadata extraction and content analysis
- **Network Reconnaissance**: DNS enumeration and subdomain discovery

### Imperial Control Center
- Centralized command and control interface
- Server status monitoring and management
- Automated threat intelligence integration
- Compliance reporting and audit trails

### Hacking Tools Framework
- SQL injection payload generation
- XSS testing vectors and payloads
- Reverse shell generators
- Password cracking utilities
- Encoding/decoding tools

## 🏗️ Architecture

### Frontend Stack
- **React 19.1.0**: Modern UI framework with hooks and context
- **TypeScript 5.0+**: Type-safe development environment
- **Tailwind CSS**: Utility-first styling framework
- **Shadcn/UI**: Premium component library
- **React Router**: Client-side routing and navigation
- **TanStack Query**: Data fetching and caching
- **Three.js**: 3D visualizations and globe rendering

### Backend Integration
- **Node.js Server**: RESTful API and WebSocket services
- **Express.js**: Web application framework
- **Socket.IO**: Real-time bidirectional communication
- **Redis**: Session management and caching
- **PostgreSQL**: Persistent data storage

### External Tool Integration
- **Sherlock**: Username search across social platforms
- **Cameradar**: RTSP stream discovery and brute force
- **WebCheck**: Website security analysis
- **FFMPEG**: Video processing and transcoding
- **Photon**: Web crawler and data extraction

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Git for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 1-Minute Setup
```bash
# Clone the repository
git clone https://github.com/your-org/imperial-watchtower.git
cd imperial-watchtower

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Docker Quick Start
```bash
# Build and run with Docker Compose
docker-compose up -d

# Access application at http://localhost:8080
```

## 📦 Installation

### Development Environment

1. **Clone Repository**
```bash
git clone https://github.com/your-org/imperial-watchtower.git
cd imperial-watchtower
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start Development Server**
```bash
npm run dev
```

### Production Deployment

1. **Build Application**
```bash
npm run build
```

2. **Preview Production Build**
```bash
npm run preview
```

3. **Deploy to Production**
```bash
# Deploy built files from dist/ directory
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application Configuration
VITE_APP_TITLE="Imperial Watchtower"
VITE_API_BASE_URL="http://localhost:5001"
VITE_WS_URL="ws://localhost:5000"

# Imperial Server Configuration
IMPERIAL_SERVER_PORT=7443
IMPERIAL_ADMIN_TOKEN="your-secure-admin-token"

# API Keys (Optional - for enhanced features)
VITE_SHODAN_API_KEY="your-shodan-api-key"
VITE_VIRUSTOTAL_API_KEY="your-virustotal-api-key"
VITE_CENSYS_API_KEY="your-censys-api-key"

# Security Configuration
VITE_ENABLE_PROXY_CHAINS=true
VITE_MAX_CONCURRENT_SCANS=10
VITE_SCAN_TIMEOUT=30000

# UI Configuration
VITE_THEME="dark"
VITE_DEFAULT_COUNTRY="US"
VITE_ENABLE_ANALYTICS=false
```

### Server Configuration

The Imperial Server uses `server/config.json` for configuration:

```json
{
  "ports": {
    "8080": "Main web application",
    "5000": "SocketIO server",
    "5001": "API server"
  },
  "adminToken": "your-secure-admin-token",
  "apiServices": {
    "virusTotal": {
      "enabled": true,
      "apiKey": "your-api-key"
    }
  },
  "securitySettings": {
    "rateLimits": {
      "apiRequests": 100,
      "authAttempts": 5
    }
  }
}
```

## 📖 Usage Guide

### Getting Started

1. **Launch Application**
   - Open browser to `http://localhost:5173`
   - Navigate through the main dashboard

2. **Imperial Scanner**
   - Go to `/imperial` route
   - Configure scan parameters
   - Select target IP ranges or countries
   - Initiate scan and monitor progress

3. **Camera Viewer**
   - Access discovered cameras at `/viewer`
   - View live streams in grid layout
   - Test authentication credentials

4. **OSINT Tools**
   - Navigate to `/osint-tools`
   - Select appropriate tool category
   - Input target information
   - Analyze results

### Advanced Features

#### Proxy Chain Configuration
```typescript
// Configure proxy settings
const proxyConfig = {
  enabled: true,
  chains: [
    { host: "proxy1.example.com", port: 8080 },
    { host: "proxy2.example.com", port: 3128 }
  ],
  rotation: "random"
};
```

#### Custom Scan Profiles
```typescript
// Create custom scan configurations
const scanProfile = {
  name: "Corporate Network Audit",
  targets: ["192.168.1.0/24"],
  ports: [80, 443, 554, 8080],
  protocols: ["onvif", "rtsp", "http"],
  timeout: 5000
};
```

## 🔌 API Documentation

### REST Endpoints

#### Scan Management
```http
POST /api/scan/start
Content-Type: application/json

{
  "type": "ip_range",
  "target": "192.168.1.0/24",
  "options": {
    "ports": [80, 554, 8080],
    "timeout": 5000
  }
}
```

#### Camera Discovery
```http
GET /api/cameras?country=US&limit=100
```

#### OSINT Queries
```http
POST /api/osint/search
Content-Type: application/json

{
  "tool": "sherlock",
  "target": "username",
  "platforms": ["twitter", "instagram", "github"]
}
```

### WebSocket Events

#### Real-time Scan Updates
```javascript
socket.on('scan:progress', (data) => {
  console.log(`Scan progress: ${data.percentage}%`);
});

socket.on('scan:result', (camera) => {
  console.log('Camera discovered:', camera);
});
```

## 🔒 Security Considerations

### Ethical Usage Guidelines

1. **Authorization Required**: Only scan networks you own or have explicit permission to test
2. **Rate Limiting**: Respect target systems and implement appropriate delays
3. **Data Privacy**: Handle discovered information responsibly
4. **Legal Compliance**: Ensure usage complies with local laws and regulations

### Security Features

- **Token-based Authentication**: Secure API access with JWT tokens
- **Rate Limiting**: Prevent abuse with configurable limits
- **Input Validation**: Comprehensive sanitization of user inputs
- **Encrypted Storage**: Sensitive data encryption at rest
- **Audit Logging**: Comprehensive activity logging

### Recommended Security Practices

```bash
# Use strong authentication tokens
openssl rand -hex 32

# Configure firewall rules
sudo ufw allow 5173/tcp
sudo ufw enable

# Regular security updates
npm audit
npm audit fix
```

## 👨‍💻 Development

### Project Structure

```
imperial-watchtower/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route components
│   ├── utils/              # Utility functions and services
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   └── contexts/           # React context providers
├── server/                 # Backend server code
├── public/                 # Static assets
├── docs/                   # Documentation
└── tests/                  # Test suites
```

### Component Architecture

```typescript
// Example component structure
export interface ScannerProps {
  onScanComplete: (results: CameraResult[]) => void;
  configuration: ScanConfiguration;
}

export const Scanner: React.FC<ScannerProps> = ({
  onScanComplete,
  configuration
}) => {
  // Component implementation
};
```

### Development Commands

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing Strategy

```bash
# Unit tests with Vitest
npm run test:unit

# Component tests with React Testing Library
npm run test:components

# End-to-end tests with Playwright
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Code Quality

```json
// .eslintrc.json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

## 🚢 Deployment

### Production Deployment Options

#### 1. Traditional VPS/Server
```bash
# Build application
npm run build

# Copy dist/ to web server
rsync -av dist/ user@server:/var/www/imperial-watchtower/

# Configure nginx
sudo nano /etc/nginx/sites-available/imperial-watchtower
```

#### 2. Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

#### 3. CDN Deployment
```bash
# Deploy to Netlify
npm run build
npx netlify deploy --prod --dir=dist

# Deploy to Vercel
npm run build
npx vercel --prod
```

### Environment-Specific Configuration

#### Production Environment
```env
NODE_ENV=production
VITE_API_BASE_URL=https://api.imperial-watchtower.com
VITE_WS_URL=wss://ws.imperial-watchtower.com
```

#### Staging Environment
```env
NODE_ENV=staging
VITE_API_BASE_URL=https://staging-api.imperial-watchtower.com
VITE_WS_URL=wss://staging-ws.imperial-watchtower.com
```

### Performance Optimization

```typescript
// Code splitting with React.lazy
const CameraViewer = React.lazy(() => import('./pages/Viewer'));
const OSINTTools = React.lazy(() => import('./pages/OsintTools'));

// Bundle analysis
npm run build -- --analyze
```

## 🔧 Troubleshooting

### Common Issues

#### 1. White Screen on Load
```bash
# Check for React version conflicts
npm ls react react-dom

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. WebSocket Connection Errors
```javascript
// Check WebSocket URL configuration
console.log('WebSocket URL:', import.meta.env.VITE_WS_URL);

// Verify server is running
curl -I http://localhost:5000/socket.io/
```

#### 3. API Connection Issues
```typescript
// Debug API calls
const debugApi = async () => {
  try {
    const response = await fetch('/api/health');
    console.log('API Status:', response.status);
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

### Debug Mode

```typescript
// Enable debug logging
localStorage.setItem('debug', 'imperial:*');

// Component debugging
const DebugComponent = () => {
  console.log('Component rendered');
  return <div>Debug Output</div>;
};
```

## 🤝 Contributing

### Contribution Guidelines

1. **Fork the Repository**
```bash
git fork https://github.com/your-org/imperial-watchtower.git
```

2. **Create Feature Branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Commit Changes**
```bash
git commit -m "Add amazing feature"
```

4. **Push to Branch**
```bash
git push origin feature/amazing-feature
```

5. **Open Pull Request**

### Development Standards

- **Code Style**: Follow ESLint configuration
- **Testing**: Maintain >80% test coverage
- **Documentation**: Update README for new features
- **Security**: Security review for all changes

### Issue Reporting

When reporting issues, include:
- Browser and version
- Node.js version
- Steps to reproduce
- Error messages and logs
- Expected vs actual behavior

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Imperial Watchtower Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Support

### Community Support
- **Discord**: [Join our community](https://discord.gg/imperial-watchtower)
- **GitHub Discussions**: [Ask questions](https://github.com/your-org/imperial-watchtower/discussions)
- **Stack Overflow**: Tag questions with `imperial-watchtower`

### Professional Support
- **Enterprise Support**: enterprise@imperial-watchtower.com
- **Security Issues**: security@imperial-watchtower.com
- **General Inquiries**: info@imperial-watchtower.com

### Documentation
- **API Documentation**: [https://docs.imperial-watchtower.com/api](https://docs.imperial-watchtower.com/api)
- **User Guide**: [https://docs.imperial-watchtower.com/guide](https://docs.imperial-watchtower.com/guide)
- **Developer Docs**: [https://docs.imperial-watchtower.com/dev](https://docs.imperial-watchtower.com/dev)

---

**Built with ❤️ by the Imperial Watchtower Team**

*"Knowledge is power, but responsibility is wisdom."*
