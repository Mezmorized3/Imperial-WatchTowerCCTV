
# Imperial Scanner Setup Guide

This guide will help you set up the Imperial Scanner with all its dependencies and components.

## 1. Server Setup

### Prerequisites
- Node.js v16+ installed
- FFmpeg installed (see FFmpeg section below)
- Git installed
- Python 3.8+ installed
- Proper network permissions and access

### Setting up the Imperial Server

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install server dependencies:
   ```bash
   npm install
   ```

3. Configure server settings in `config.json`:
   - Set a secure `adminToken`
   - Configure ports as needed
   - Set up SSL if required

4. Start the server:
   ```bash
   npm start
   ```

For production, use:
```bash
npm run start:production
```

## 2. External Tool Dependencies

The application relies on several external security tools. Here's how to install them:

### FFmpeg Installation
FFmpeg is critical for media streaming and RTSP conversion.

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**On macOS:**
```bash
brew install ffmpeg
```

**On Windows:**
1. Download from [FFmpeg.org](https://ffmpeg.org/download.html)
2. Add to PATH

Verify installation:
```bash
ffmpeg -version
```

### Security Tools Installation

#### Cameradar (for camera discovery)
```bash
# Clone the repository
git clone https://github.com/Ullaakut/cameradar.git

# Build from source
cd cameradar
go build

# Move to a directory in your PATH
sudo mv cameradar /usr/local/bin/
```

#### Sherlock (for username search)
```bash
# Clone the repository
git clone https://github.com/sherlock-project/sherlock.git

# Install dependencies
cd sherlock
pip install -r requirements.txt
```

#### Web-Check (for web analysis)
```bash
# Clone the repository
git clone https://github.com/Lissy93/web-check.git

# Install dependencies
cd web-check
npm install
```

#### Other Tools
Follow similar patterns for these tools:
- Twint: `pip install twint`
- TorBot: Clone from GitHub and install dependencies
- Photon: Clone from GitHub and install dependencies

For all Python-based tools, consider creating a virtual environment:
```bash
python -m venv imperial-env
source imperial-env/bin/activate  # On Windows: imperial-env\Scripts\activate
```

## 3. Authentication Setup

The Imperial Scanner uses a token-based authentication system:

1. Edit the `server/config.json` file:
   ```json
   {
     "adminToken": "YOUR_SECURE_TOKEN_HERE",
     "securitySettings": {
       "tokenExpiration": "24h"
     }
   }
   ```

2. Use this same token in the frontend application when authenticating.

3. For production environments, consider using proper JWTs with encryption.

## 4. Media Streaming Setup

### RTSP to HLS Conversion

1. Ensure FFmpeg is properly installed

2. Configure the media server in `server/config.json`:
   ```json
   "mediaServerSettings": {
     "rtmpPort": 1935,
     "httpPort": 8000,
     "ffmpegPath": "/usr/bin/ffmpeg",
     "enableTrans": true,
     "enableAuth": false,
     "mediaRoot": "./media"
   }
   ```

3. Create the media directory:
   ```bash
   mkdir -p server/media
   ```

### Viewing Streams

The application uses HLS.js to display streams in the browser. No additional setup is required
for the frontend, but ensure the backend media server is running correctly.

## 5. Tool Paths Configuration

Create a `.toolpaths` file in the root directory to specify the paths to your installed tools:

```json
{
  "cameradar": "/usr/local/bin/cameradar",
  "sherlock": "/path/to/sherlock/sherlock",
  "ffmpeg": "/usr/bin/ffmpeg",
  "ffprobe": "/usr/bin/ffprobe",
  "webcheck": "/path/to/web-check/web-check",
  "twint": "/path/to/twint/twint"
}
```

## 6. Permissions

Ensure your user has sufficient permissions to:
- Access network interfaces (for scanning)
- Execute the external tools
- Write to the media directory

On Linux/macOS, you might need to run as sudo for some operations.

## 7. Troubleshooting

### Common Issues

1. **Tool not found errors**:
   - Check that all tools are properly installed
   - Verify paths in the `.toolpaths` file

2. **RTSP streaming issues**:
   - Confirm FFmpeg is installed and working
   - Check network connectivity to the cameras
   - Verify camera credentials

3. **Authentication failures**:
   - Ensure the token in the application matches `config.json`
   - Check for expired tokens

4. **Permission errors**:
   - Run with appropriate privileges
   - Check filesystem permissions for media directory

### Logs

Check logs in these locations:
- Server logs: `server/imperial-server.log`
- Application logs: Browser console

## 8. Security Considerations

- **Change default credentials**: Modify the admin token
- **Network isolation**: Consider running in a segregated network
- **Update tools regularly**: Security tools need updates
- **Ethical use**: Only scan networks you have permission to scan
