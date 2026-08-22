/**
 * Performance Analytics and Monitoring
 * Tracks performance metrics and sends to analytics service (optional)
 */

import { log } from "./logger";

export interface PerformanceMetrics {
  loadTime: number;
  firstPaint: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  frameRate: number;
  memoryUsage: number;
  modelSize: number;
  triangleCount: number;
  drawCalls: number;
}

export class PerformanceAnalytics {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  /**
   * Initialize performance monitoring
   */
  init(): void {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }

    // Observe paint timing
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-paint") {
            this.recordMetric("firstPaint", entry.startTime);
          } else if (entry.name === "first-contentful-paint") {
            this.recordMetric("firstContentfulPaint", entry.startTime);
          }
        }
      });
      paintObserver.observe({ entryTypes: ["paint"] });
      this.observers.push(paintObserver);
    } catch (e) {
      log.warn("Paint timing not supported:", e);
    }

    // Observe navigation timing
    try {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "navigation") {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric(
              "loadTime",
              navEntry.loadEventEnd - navEntry.fetchStart,
            );
            this.recordMetric(
              "timeToInteractive",
              navEntry.domInteractive - navEntry.fetchStart,
            );
          }
        }
      });
      navObserver.observe({ entryTypes: ["navigation"] });
      this.observers.push(navObserver);
    } catch (e) {
      log.warn("Navigation timing not supported:", e);
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric<K extends keyof PerformanceMetrics>(
    key: K,
    value: PerformanceMetrics[K],
  ): void {
    const latest =
      this.metrics[this.metrics.length - 1] || this.createEmptyMetrics();
    latest[key] = value;

    if (
      this.metrics.length === 0 ||
      this.metrics[this.metrics.length - 1] !== latest
    ) {
      this.metrics.push(latest);
    }
  }

  /**
   * Record complete metrics
   */
  recordMetrics(metrics: Partial<PerformanceMetrics>): void {
    const latest =
      this.metrics[this.metrics.length - 1] || this.createEmptyMetrics();
    Object.assign(latest, metrics);

    if (
      this.metrics.length === 0 ||
      this.metrics[this.metrics.length - 1] !== latest
    ) {
      this.metrics.push(latest);
    }
  }

  /**
   * Get latest metrics
   */
  getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0
      ? { ...this.metrics[this.metrics.length - 1] }
      : null;
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Send metrics to analytics service (optional)
   */
  sendToAnalytics(endpoint?: string): void {
    const latest = this.getLatestMetrics();
    if (!latest) return;

    // Log metrics (can be replaced with actual analytics service)
    log.info("Performance metrics:", latest);

    // Example: Send to analytics endpoint
    if (endpoint && typeof fetch !== "undefined") {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics: latest,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        }),
      }).catch((err) => log.warn("Failed to send analytics:", err));
    }
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Cleanup observers
   */
  disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  private createEmptyMetrics(): PerformanceMetrics {
    return {
      loadTime: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      timeToInteractive: 0,
      frameRate: 0,
      memoryUsage: 0,
      modelSize: 0,
      triangleCount: 0,
      drawCalls: 0,
    };
  }
}

// Singleton instance
export const performanceAnalytics = new PerformanceAnalytics();

// Auto-initialize
if (typeof window !== "undefined") {
  performanceAnalytics.init();
}
