import { TimeTracker } from "../time-tracker";
import { vi } from "vitest";

// Mock window.setInterval and clearInterval for testing
const mockSetInterval = vi.fn();
const mockClearInterval = vi.fn();

Object.defineProperty(window, "setInterval", {
  writable: true,
  value: mockSetInterval
});

Object.defineProperty(window, "clearInterval", {
  writable: true,
  value: mockClearInterval,
});

// Mock Date.now for consistent testing
const mockDateNow = vi.fn();
Date.now = mockDateNow;

describe("TimeTracker", () => {
  let mockOnTimeUpdate: any;
  let mockGetCurrentUrl: any;
  let mockOnRouteChange: any;
  let mockRouteUnsubscribe: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnTimeUpdate = vi.fn();
    mockGetCurrentUrl = vi.fn().mockReturnValue("/current-route");
    mockRouteUnsubscribe = vi.fn();
    mockOnRouteChange = vi.fn().mockReturnValue(mockRouteUnsubscribe);
    mockDateNow.mockReturnValue(1000000); // Fixed timestamp for testing
    mockSetInterval.mockReturnValue(123); // Mock interval ID
  });

  afterEach(() => {
  vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with correct state", () => {
      const tracker = new TimeTracker({
        intervalSeconds: 30,
        onTimeUpdate: mockOnTimeUpdate,
        getCurrentUrl: mockGetCurrentUrl,
        onRouteChange: mockOnRouteChange,
      });

      expect(mockGetCurrentUrl).toHaveBeenCalledTimes(1);
      expect(mockOnRouteChange).toHaveBeenCalledTimes(1);
      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 30000);

      tracker.destroy();
    });

    it("should work without onRouteChange", () => {
      const tracker = new TimeTracker({
        intervalSeconds: 10,
        onTimeUpdate: mockOnTimeUpdate,
        getCurrentUrl: mockGetCurrentUrl,
      });

      expect(mockGetCurrentUrl).toHaveBeenCalledTimes(1);
      expect(mockOnRouteChange).not.toHaveBeenCalled();

      tracker.destroy();
    });
  });

  describe("time tracking", () => {
    it("should call onTimeUpdate when interval triggers", () => {
      mockDateNow
        .mockReturnValueOnce(1000000) // Initial start time
        .mockReturnValueOnce(1005000); // 5 seconds later

      const tracker = new TimeTracker({
        intervalSeconds: 30,
        onTimeUpdate: mockOnTimeUpdate,
        getCurrentUrl: mockGetCurrentUrl,
      });

      // Simulate interval callback
      const intervalCallback = mockSetInterval.mock.calls[0][0];
      intervalCallback();

      expect(mockOnTimeUpdate).toHaveBeenCalledWith("/current-route", 5000);

      tracker.destroy();
    });

    it("should reset timer after sending update", () => {
      mockDateNow
        .mockReturnValueOnce(1000000) // Initial start time
        .mockReturnValueOnce(1005000) // When interval fires (for getTimeSpent)
        .mockReturnValueOnce(1006000) // After reset (for resetTimer)
        .mockReturnValueOnce(1006000); // When getTimeSpentSinceLastReset is called

      const tracker = new TimeTracker({
        intervalSeconds: 30,
        onTimeUpdate: mockOnTimeUpdate,
        getCurrentUrl: mockGetCurrentUrl,
      });

      const intervalCallback = mockSetInterval.mock.calls[0][0];
      intervalCallback();

      // Check that time spent is calculated from the reset point
      expect(tracker.getTimeSpentSinceLastReset()).toBe(0); // Should be 0 (1006000 - 1006000)

      tracker.destroy();
    });
  });

  describe("route changes", () => {
    it("should handle route change and send time update", () => {
      mockDateNow
        .mockReturnValueOnce(1000000) // Initial start time
        .mockReturnValueOnce(1005000); // When route changes

      mockGetCurrentUrl
        .mockReturnValueOnce("/initial-route")
        .mockReturnValueOnce("/new-route");

      const tracker = new TimeTracker({
        intervalSeconds: 30,
        onTimeUpdate: mockOnTimeUpdate,
        getCurrentUrl: mockGetCurrentUrl,
        onRouteChange: mockOnRouteChange,
      });

      // Simulate route change
      const routeChangeCallback = mockOnRouteChange.mock.calls[0][0];
      routeChangeCallback();

      expect(mockOnTimeUpdate).toHaveBeenCalledWith("/initial-route", 5000);

      tracker.destroy();
    });

    it("should not send update if route does not change", () => {
      const tracker = new TimeTracker({
        intervalSeconds: 30,
        onTimeUpdate: mockOnTimeUpdate,
        getCurrentUrl: mockGetCurrentUrl,
        onRouteChange: mockOnRouteChange,
      });

      // Simulate route change callback but URL stays the same
      const routeChangeCallback = mockOnRouteChange.mock.calls[0][0];
      routeChangeCallback();

      expect(mockOnTimeUpdate).not.toHaveBeenCalled();

      tracker.destroy();
    });
  });

  describe("pause and resume", () => {
    it("should send update and clear interval on pause", () => {
      mockDateNow.mockReturnValueOnce(1000000).mockReturnValueOnce(1003000);

      const tracker = new TimeTracker({
        intervalSeconds: 30,
        onTimeUpdate: mockOnTimeUpdate,
        getCurrentUrl: mockGetCurrentUrl,
      });

      tracker.pause();

      expect(mockOnTimeUpdate).toHaveBeenCalledWith("/current-route", 3000);
      expect(mockClearInterval).toHaveBeenCalledWith(123);

      tracker.destroy();
    });

    it("should restart tracking on resume", () => {
      const tracker = new TimeTracker({
        intervalSeconds: 30,
        onTimeUpdate: mockOnTimeUpdate,
        getCurrentUrl: mockGetCurrentUrl,
      });

      tracker.pause();
      mockSetInterval.mockClear();

      tracker.resume();

      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 30000);

      tracker.destroy();
    });
  });

  describe("cleanup", () => {
    it("should cleanup properly on destroy", () => {
      mockDateNow.mockReturnValueOnce(1000000).mockReturnValueOnce(1002000);

      const tracker = new TimeTracker({
        intervalSeconds: 30,
        onTimeUpdate: mockOnTimeUpdate,
        getCurrentUrl: mockGetCurrentUrl,
        onRouteChange: mockOnRouteChange,
      });

      tracker.destroy();

      expect(mockOnTimeUpdate).toHaveBeenCalledWith("/current-route", 2000);
      expect(mockClearInterval).toHaveBeenCalledWith(123);
      expect(mockRouteUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
