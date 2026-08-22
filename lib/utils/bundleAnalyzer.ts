/**
 * Bundle Analysis Utilities
 * Helps identify bundle size issues and optimization opportunities
 */

import { log } from "./logger";

export interface BundleStats {
  name: string;
  size: number;
  gzippedSize?: number;
  chunks: string[];
}

export class BundleAnalyzer {
  /**
   * Analyze bundle sizes from webpack stats
   */

  static analyzeBundle(stats: any): BundleStats[] {
    const bundles: BundleStats[] = [];

    if (stats.assets) {
      stats.assets.forEach((asset: any) => {
        if (asset.name.endsWith(".js") || asset.name.endsWith(".css")) {
          bundles.push({
            name: asset.name,
            size: asset.size,
            chunks: asset.chunks || [],
          });
        }
      });
    }

    return bundles.sort((a, b) => b.size - a.size);
  }

  /**
   * Get recommendations for bundle optimization
   */
  static getRecommendations(bundles: BundleStats[]): string[] {
    const recommendations: string[] = [];
    const largeBundles = bundles.filter((b) => b.size > 500 * 1024); // > 500KB

    if (largeBundles.length > 0) {
      recommendations.push(
        `Found ${largeBundles.length} large bundle(s). Consider code splitting.`,
      );
    }

    const totalSize = bundles.reduce((sum, b) => sum + b.size, 0);
    if (totalSize > 2 * 1024 * 1024) {
      // > 2MB
      recommendations.push(
        `Total bundle size is ${(totalSize / 1024 / 1024).toFixed(2)}MB. Consider lazy loading.`,
      );
    }

    const duplicateChunks = this.findDuplicateChunks(bundles);
    if (duplicateChunks.length > 0) {
      recommendations.push(
        `Found ${duplicateChunks.length} duplicate chunk(s). Consider optimizing split chunks.`,
      );
    }

    return recommendations;
  }

  /**
   * Find duplicate chunks across bundles
   */
  private static findDuplicateChunks(bundles: BundleStats[]): string[] {
    const chunkCounts = new Map<string, number>();

    bundles.forEach((bundle) => {
      bundle.chunks.forEach((chunk) => {
        chunkCounts.set(chunk, (chunkCounts.get(chunk) || 0) + 1);
      });
    });

    return Array.from(chunkCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([chunk, _]) => chunk);
  }

  /**
   * Log bundle analysis
   */
  static logAnalysis(bundles: BundleStats[]): void {
    log.info("Bundle Analysis:");
    bundles.slice(0, 10).forEach((bundle) => {
      log.info(`  ${bundle.name}: ${(bundle.size / 1024).toFixed(2)}KB`);
    });

    const recommendations = this.getRecommendations(bundles);
    if (recommendations.length > 0) {
      log.warn("Optimization Recommendations:");
      recommendations.forEach((rec) => log.warn(`  - ${rec}`));
    }
  }
}
