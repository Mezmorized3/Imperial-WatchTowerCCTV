
# Imperial Server

The Imperial Server is a powerful Node.js Express server that provides backend services for the Imperial Scanner application. It's designed with enterprise-grade features including clustering, monitoring, security, and graceful degradation.

## Features

- **Multiple Services**: Manages multiple services on different ports
- **Monitoring**: Prometheus metrics for performance tracking
- **Security**: JWT authentication for administrative endpoints
- **Clustering**: Utilizes all available CPU cores for improved performance
- **Tracing**: Distributed tracing support via Jaeger
- **Graceful Shutdown**: Proper cleanup on server shutdown

## Installation

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Starting the Server

### Basic Start

```
npm start
```

### Development Mode

```
npm run start:dev
```

### Enhanced Security Mode

```
npm run start:secure
```

### Custom Options

You can also start the server with custom options:

```
node imperialServer.js --security-level=max --encryption=military
```

## Available Options

- `--security-level`: Sets the security policy level (normal, max)
- `--encryption`: Sets the encryption mode (standard, military)

## Administrative API

The server provides administrative APIs accessible at port 7443 (configurable in config.json):

- `/v1/admin/status`: Current status of all managed services
- `/v1/admin/decree/:port`: Send commands to specific services
- `/v1/admin/metrics`: Prometheus metrics endpoint
- `/v1/admin/diagnostics`: Detailed system diagnostics

## Security

All administrative endpoints are protected by JWT authentication. 
You must provide a valid token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Configuration

The server is configured via the `config.json` file. This allows you to:

- Configure ports for different services
- Set the admin JWT token
- Configure HTTPS settings
- Set tracing parameters

## Logs

Logs are written to `imperial-audit.log` and also output to the console.
