
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ImperialShinobi from '../ImperialShinobi';
import { imperialServerService } from '@/utils/imperialServerService';
import { toast } from 'sonner';
import '@testing-library/jest-dom'; // Import jest-dom for DOM assertions

// Mock the Imperial Server Service
vi.mock('@/utils/imperialServerService', () => ({
  imperialServerService: {
    executeOsintTool: vi.fn(),
    executeImperialShinobi: vi.fn(),
  }
}));

// Mock the toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

describe('ImperialShinobi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(<ImperialShinobi />);
    
    expect(screen.getByText('Imperial Shinobi Control')).toBeInTheDocument();
    expect(screen.getByText('Reconnaissance')).toBeInTheDocument();
    expect(screen.getByText('Exploitation')).toBeInTheDocument();
    expect(screen.getByText('Surveillance')).toBeInTheDocument();
  });

  it('shows error toast when no target is provided', async () => {
    render(<ImperialShinobi />);
    
    // Try to start operation without a target
    const startButton = screen.getByText('Start Reconnaissance');
    fireEvent.click(startButton);
    
    // Should show error toast
    expect(toast.error).toHaveBeenCalledWith('Please provide a target IP or range');
  });

  it('executes the selected module correctly', async () => {
    // Mock successful response
    vi.mocked(imperialServerService.executeOsintTool).mockResolvedValue({
      success: true,
      data: {
        findings: ['Camera vulnerability found', 'Default credentials detected'],
        status: 'success'
      }
    });

    render(<ImperialShinobi />);
    
    // Fill in the target
    const targetInput = screen.getByPlaceholderText('e.g. 192.168.1.100');
    fireEvent.change(targetInput, { target: { value: '192.168.1.100' } });
    
    // Start the operation
    const startButton = screen.getByText('Start Reconnaissance');
    fireEvent.click(startButton);
    
    // Should call the service with correct params
    await waitFor(() => {
      expect(imperialServerService.executeOsintTool).toHaveBeenCalledWith(
        'imperial-shinobi',
        expect.objectContaining({
          module: 'camerattack',
          target: '192.168.1.100',
          scanType: 'standard'
        })
      );
    });
    
    // Should show success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('completed'));
    });
  });
});
