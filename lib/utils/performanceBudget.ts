/**
 * Performance Budget System
 * Monitors frame time and triggers optimizations when budget is exceeded
 */

// Logger not used in this file - removed to fix unused import warning

interface PerformanceBudget {
  targetFrameTime: number; // Target frame time in milliseconds
  maxFrameTime: number; // Maximum acceptable frame time
  budgetExceededThreshold: number; // Number of consecutive frames before action
}

interface BudgetStats {
  currentFrameTime: number;
  averageFrameTime: number;
  budgetExceeded: boolean;
  consecutiveExceeded: number;
  frameCount: number;
}

const DEFAULT_BUDGET: PerformanceBudget = {
  targetFrameTime: 16.67, // 60 FPS
  maxFrameTime: 33.33, // 30 FPS minimum
  budgetExceededThreshold: 3, // 3 consecutive frames
};

export class PerformanceBudgetManager {
  private budget: PerformanceBudget;
  private stats: BudgetStats = {
    currentFrameTime: 0,
    averageFrameTime: 0,
    budgetExceeded: false,
    consecutiveExceeded: 0,
    frameCount: 0,
  };
  private frameTimeHistory: number[] = [];
  private maxHistorySize = 60; // 1 second at 60 FPS

  constructor(budget: Partial<PerformanceBudget> = {}) {
    this.budget = { ...DEFAULT_BUDGET, ...budget };
  }

  /**
   * Record a frame time
   */
  recordFrame(frameTime: number): void {
    this.stats.currentFrameTime = frameTime;
    this.stats.frameCount++;

    // Add to history
    this.frameTimeHistory.push(frameTime);
    if (this.frameTimeHistory.length > this.maxHistorySize) {
      this.frameTimeHistory.shift();
    }

    // Calculate average
    const sum = this.frameTimeHistory.reduce((a, b) => a + b, 0);
    this.stats.averageFrameTime = sum / this.frameTimeHistory.length;

    // Check if budget is exceeded
    if (frameTime > this.budget.maxFrameTime) {
      this.stats.consecutiveExceeded++;
      this.stats.budgetExceeded =
        this.stats.consecutiveExceeded >= this.budget.budgetExceededThreshold;
    } else {
      this.stats.consecutiveExceeded = 0;
      this.stats.budgetExceeded = false;
    }
  }

  /**
   * Get current statistics
   */
  getStats(): BudgetStats {
    return { ...this.stats };
  }

  /**
   * Check if budget is exceeded
   */
  isBudgetExceeded(): boolean {
    return this.stats.budgetExceeded;
  }

  /**
   * Get recommended quality level
   */
  getRecommendedQuality(): "high" | "medium" | "low" {
    const avg = this.stats.averageFrameTime;

    if (avg > this.budget.maxFrameTime * 1.5) {
      return "low";
    } else if (avg > this.budget.maxFrameTime) {
      return "medium";
    }
    return "high";
  }

  /**
   * Reset statistics
   */
  reset(): void {
    this.stats = {
      currentFrameTime: 0,
      averageFrameTime: 0,
      budgetExceeded: false,
      consecutiveExceeded: 0,
      frameCount: 0,
    };
    this.frameTimeHistory = [];
  }

  /**
   * Update budget settings
   */
  updateBudget(budget: Partial<PerformanceBudget>): void {
    this.budget = { ...this.budget, ...budget };
  }
}

// Singleton instance
export const performanceBudget = new PerformanceBudgetManager();
