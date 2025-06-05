
// Consolidated type exports - explicit named exports to avoid conflicts

// Base types (primary source for common interfaces)
export type { 
  ToolParams, 
  UsernameResult, 
  ScanResult, 
  ThreatIntelData 
} from './baseTypes';

// Core OSINT types (primary source for tool execution) - comprehensive export
export type { 
  BaseToolParams,
  HackingToolResult,
  HackingToolSuccessData,
  HackingToolErrorData,
  ToolResult,
  ProxyConfig,
  EncoderDecoderParams,
  EncoderDecoderData,
  ReverseShellParams,
  ReverseShellData,
  RapidPayloadParams,
  RapidPayloadData,
  SqliPayloadParams,
  SqliPayloadData,
  XssPayloadParams,
  XssPayloadsSuccessData,
  PasswordCrackerParams,
  PasswordCrackerSuccessData,
  PasswordGeneratorParams,
  PasswordGeneratorSuccessData,
  IpInfoParams,
  IpInfoData,
  DnsLookupParams,
  DnsLookupData,
  PortScanParams,
  PortScanData,
  TracerouteParams,
  TracerouteData,
  SubnetScanParams,
  SubnetScanData,
  WhoisLookupParams,
  WhoisLookupData,
  HttpHeadersParams,
  HttpHeadersData,
  BotExploitsParams,
  BotExploitsData,
  CCTVCamera,
  CCTVScanData,
  CCTVScanParams,
  CCTVHackedCamera,
  CCTVHackedData,
  CCTVHackedParams,
  WebhackData,
  BackHackData,
  OpenCVParams,
  DeepstackParams,
  FaceRecognitionParams,
  MotionParams,
  TwintData,
  UsernameSearchData,
  SecurityAdminParams,
  ShieldAIParams,
  FFmpegParams
} from './osintToolTypes';

// Camera types (unique to camera operations)
export type { 
  CameraStatus,
  AccessLevel,
  Credentials,
  Vulnerability,
  Geolocation,
  CCTVParams,
  CameraResult,
  BackHackParams,
  SpeedCameraParams,
  CamerattackParams,
  CamDumperParams,
  HackCCTVParams,
  OpenCCTVParams,
  EyePwnParams,
  IngramParams
} from './cameraTypes';

// Streaming types  
export type { 
  StreamedianParams,
  JSMpegParams,
  WebRTCStreamerParams,
  LiveStreamParams,
  RTSPServerParams,
  RTSPProxyParams,
  FFmpegStreamParams
} from './streamingToolTypes';

// RTSP brute types
export type { 
  RtspBruteParams,
  RtspCredential,
  RtspBruteResult
} from './rtspBruteTypes';

// ONVIF tool types (non-conflicting)
export type { 
  MotionParams as ONVIFMotionParams,
  MotionData,
  MotionEyeParams,
  MotionEyeData,
  DeepstackParams as ONVIFDeepstackParams,
  DeepstackData,
  FaceRecognitionParams as ONVIFFaceRecognitionParams,
  FaceRecognitionData,
  RtspServerParams as ONVIFRtspServerParams,
  RtspServerData,
  ZoneMinderParams,
  ZoneMinderData,
  NmapONVIFParams,
  NmapONVIFData as ONVIFNmapData,
  OpenCVParams as ONVIFOpenCVParams,
  OpenCVData
} from './onvifToolTypes';

// Security tool types (unique exports only)
export type { 
  ShieldAIData,
  SecurityAdminData
} from './securityToolTypes';

// Network tool types (non-conflicting exports)
export type { 
  ScapyParams, ScapyData,
  ZMapParams, ZMapData,
  ZGrabParams, ZGrabData,
  MasscanParams, MasscanData as NetworkMasscanData,
  HydraParams, HydraData,
  GSoapParams, GSoapData,
  GstRTSPServerParams, GstRTSPServerData,
  GortsplibParams, GortsplibData,
  RtspSimpleServerParams, RtspSimpleServerData,
  SenseCamDiscoParams, SenseCamDiscoData,
  ONVIFScanParams, ONVIFScanData, ONVIFDevice,
  ONVIFFuzzerParams, ONVIFFuzzerData
} from './networkToolTypes';

// Social tool types (non-conflicting)
export type {
  TwitterParams,
  SocialSearchParams,
  TwintParams,
  UsernameSearchParams,
  InstagramParams,
  OsintParams
} from './socialToolTypes';

// Threat intel types (non-conflicting)
export type {
  FirmwareData,
  FirmwareAnalysisResult,
  ThreatAssessment
} from './threatIntelTypes';

// Advanced tool types (non-conflicting)
export type {
  RapidPayloadParams as AdvancedRapidPayloadParams,
  HackingToolParams,
  FFmpegParams as AdvancedFFmpegParams
} from './advancedToolTypes';

// Web tool types (unique to web operations)
export type { 
  WebCheckParams,
  WebCheckData,
  WebCheckResult,
  WebhackParams,
  WebhackResult,
  BackHackParams as WebBackHackParams,
  BackHackData as WebBackHackData,
  BackHackResult,
  PhotonParams,
  PhotonData,
  TorBotParams,
  TorBotData,
  UsernameSearchParams as WebUsernameSearchParams,
  UsernameSearchResult,
  TwintParams as WebTwintParams,
  TwintResult,
  OSINTParams,
  OSINTResult
} from './webToolTypes';
