
# Imperial Control System Guide

This guide explains how to use the Imperial Control System which combines the Imperial Scanner frontend with the Imperial Server backend.

## System Overview

The Imperial System consists of:

1. **Imperial Server**: A Node.js server that manages multiple services and provides an API for OSINT and camera discovery tools
2. **Imperial Scanner**: A React application for visual reconnaissance of surveillance cameras 
3. **Imperial Control Unit**: A command and control interface for managing server operations

## Setup Instructions

### 1. Start the Imperial Server

```bash
cd server
npm install
npm start
```

This will launch the Imperial Server on port 7443 and spawn several "legions" (services) on different ports:
- 8080: Main web application 
- 8000: Ticker HTML server
- 5000: SocketIO/ticker server
- 5001: Control panel API server (OSINT tools)
- 3000: HLS Restream Server

The server uses a default admin token configured in `server/config.json`.

### 2. Launch the Imperial Scanner App

In a separate terminal:

```bash
npm start
```

This will start the React application. Navigate to:
- http://localhost:3000/imperial - Imperial Scanner for visual reconnaissance
- http://localhost:3000/imperial-control - Imperial Control Unit for server operations

## Using the Imperial Control System

### Authentication

1. Access the Imperial Control Unit at /imperial-control
2. Enter the admin token from `server/config.json` (default: "imperial-scanner-admin-token")
3. This will authenticate your session with the Imperial Server

### Imperial Registry

The Imperial Registry tab shows the status of all server components (legions) and allows you to:
- Mobilize (start) specific legions
- Stand Down (stop) specific legions 
- View server metrics and diagnostics

### Imperial Compliance Check

Use this feature to analyze a target IP for security vulnerabilities:
1. Enter a target IP address
2. Click "Initiate Compliance Check" 
3. View the full compliance report including open ports, protocols, and vulnerabilities

### Commence Siege

This feature discovers cameras on a specified network:
1. Enter a target subnet (e.g., 192.168.1.0/24)
2. Click "Commence Siege"
3. View all discovered cameras and their details

### Secure Loot

Gather intelligence about websites and domains:
1. Enter a target URL
2. Click "Secure Loot"
3. View comprehensive information about the site including:
   - Technologies used
   - Security headers
   - DNS records
   - HTTP headers

## Imperial OSINT Tools

The system integrates with several open-source intelligence tools:

- **Sherlock**: Username search across multiple platforms
- **Cameradar**: RTSP stream discovery and access
- **IPCam Search Protocol**: Camera discovery using various protocols
- **WebCheck**: Website security and information analysis

## Security Note

The Imperial Scanner system includes powerful reconnaissance capabilities. Always use these tools ethically and legally. Unauthorized scanning or access to systems you don't own may violate laws and regulations.
