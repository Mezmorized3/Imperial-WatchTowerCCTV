
# Imperial Server Guide

This guide explains how to run the Imperial Server alongside your Imperial Scanner React application.

## Overview

The Imperial Server provides backend services for the Imperial Scanner application, handling:

- Multiple network services on different ports
- Security camera scanning and analysis
- Administrative controls through a secure API
- Monitoring and metrics collection

## Installation & Setup

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Configure the Server

The `server/config.json` file contains all configuration options. You can modify:

- Port assignments
- Admin access token
- HTTPS settings
- Tracing parameters

### 3. Start the Server

```bash
cd server
npm start
```

For enhanced security mode:

```bash
npm run start:secure
```

## Accessing the Administrative Interface

### Option 1: Web UI

The admin UI is available at `http://localhost:7443/v1/court/` after starting the server.

### Option 2: In-App Interface

The Imperial Scanner app includes an integrated server management interface in the "Imperial Server" tab.

To access, you'll need to authenticate using your admin token (configured in `server/config.json`).

## API Authentication

All administrative API endpoints are protected with JWT authentication. 

When using the in-app interface, the token is stored securely in your browser's local storage after successful authentication.

## Server Ports

The Imperial Server manages several services:

- **7443**: Administrative API and control panel
- **8080**: Main web application
- **8000**: Ticker HTML server
- **5000**: SocketIO/ticker server
- **5001**: Control panel API server
- **3000**: HLS Restream Server

## Monitoring & Metrics

The server exposes Prometheus-compatible metrics at:

```
http://localhost:7443/v1/admin/metrics
```

These metrics include:
- Request latency
- Error rates
- Legion (service) health

## Security

- All administrative APIs require authentication
- HTTPS can be enabled in `config.json`
- Security level can be configured when starting the server
