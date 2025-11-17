export interface TimeTrackerConfig {
  intervalSeconds: number;
  onTimeUpdate: (url: string, timeSpent: number) => void;
  getCurrentUrl: () => string;
  onRouteChange?: (callback: () => void) => () => void;
}

export interface TimeTrackerState {
  currentUrl: string;
  startTime: number;
  intervalId: number | null;
  routeUnsubscribe: (() => void) | null;
}

export class TimeTracker {
  private state: TimeTrackerState = {
    currentUrl: "",
    startTime: 0,
    intervalId: null,
    routeUnsubscribe: null,
  };

  private config: TimeTrackerConfig;

  constructor(config: TimeTrackerConfig) {
    this.config = config;
    this.initialize();
  }

  private initialize(): void {
    this.state.currentUrl = this.config.getCurrentUrl();
    this.startTracking();

    if (this.config.onRouteChange) {
      this.state.routeUnsubscribe = this.config.onRouteChange(() => {
        this.handleRouteChange();
      });
    }
  }

  private startTracking(): void {
    this.state.startTime = Date.now();
    this.clearInterval();

    this.state.intervalId = window.setInterval(() => {
      this.sendTimeUpdate();
      this.resetTimer();
    }, this.config.intervalSeconds * 1000);
  }

  private clearInterval(): void {
    if (this.state.intervalId !== null) {
      clearInterval(this.state.intervalId);
      this.state.intervalId = null;
    }
  }

  private resetTimer(): void {
    this.state.startTime = Date.now();
  }

  private getTimeSpent(): number {
    return Date.now() - this.state.startTime;
  }

  private sendTimeUpdate(): void {
    const timeSpent = this.getTimeSpent();
    if (timeSpent > 0) {
      this.config.onTimeUpdate(this.state.currentUrl, timeSpent);
    }
  }

  private handleRouteChange(): void {
    const newUrl = this.config.getCurrentUrl();

    if (newUrl !== this.state.currentUrl) {
      this.sendTimeUpdate();
      this.state.currentUrl = newUrl;
      this.resetTimer();
    }
  }

  public pause(): void {
    this.sendTimeUpdate();
    this.clearInterval();
  }

  public resume(): void {
    this.startTracking();
  }

  public destroy(): void {
    this.sendTimeUpdate();
    this.clearInterval();

    if (this.state.routeUnsubscribe) {
      this.state.routeUnsubscribe();
      this.state.routeUnsubscribe = null;
    }
  }

  public getCurrentUrl(): string {
    return this.state.currentUrl;
  }

  public getTimeSpentSinceLastReset(): number {
    return this.getTimeSpent();
  }
}
