
/**
 * Imperial Server Service
 * Provides communication with the Imperial Server for various operations
 * This is a facade that re-exports functionality from more focused services
 */

import { imperialAuthService, ImperialAuthService } from "./imperial/authService";
import { 
  imperialStatusService, 
  ImperialStatusService,
  ImperialServerStatus,
  DiagnosticsResponse,
  DecreeResponse
} from "./imperial/statusService";
import { imperialOsintService, ImperialOsintService } from "./imperial/osintService";
import { executeImperialShinobi } from "./pythonIntegration";

// Re-export interfaces
export {
  ImperialServerStatus,
  DiagnosticsResponse,
  DecreeResponse
};

/**
 * Imperial Server Service - Main Facade
 * This class combines functionality from the specialized services
 */
class ImperialServerService {
  // Auth methods
  authenticate = imperialAuthService.authenticate.bind(imperialAuthService);
  isAuthenticated = imperialAuthService.isAuthenticated.bind(imperialAuthService);
  logout = imperialAuthService.logout.bind(imperialAuthService);

  // Status and diagnostics methods
  getImperialStatus = imperialStatusService.getImperialStatus.bind(imperialStatusService);
  getImperialDiagnostics = imperialStatusService.getImperialDiagnostics.bind(imperialStatusService);
  issueDecree = imperialStatusService.issueDecree.bind(imperialStatusService);
  getImperialMetrics = imperialStatusService.getImperialMetrics.bind(imperialStatusService);

  // OSINT tools methods
  executeOsintTool = imperialOsintService.executeOsintTool.bind(imperialOsintService);
  executeImperialPawn = imperialOsintService.executeImperialPawn.bind(imperialOsintService);
  executeImperialShinobi = imperialOsintService.executeImperialShinobi.bind(imperialOsintService);
  initiateCameraScan = imperialOsintService.initiateCameraScan.bind(imperialOsintService);
  initiateWebCheck = imperialOsintService.initiateWebCheck.bind(imperialOsintService);
  searchUsername = imperialOsintService.searchUsername.bind(imperialOsintService);
  searchIPCameras = imperialOsintService.searchIPCameras.bind(imperialOsintService);
}

// Export a singleton instance
export const imperialServerService = new ImperialServerService();
