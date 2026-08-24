import { PerformanceBudgetManager } from "../performanceBudget";

describe("PerformanceBudgetManager", () => {
  it("tracks frames and marks consecutive budget overruns", () => {
    const manager = new PerformanceBudgetManager({
      maxFrameTime: 20,
      budgetExceededThreshold: 2,
    });

    manager.recordFrame(10);
    expect(manager.getStats()).toMatchObject({
      currentFrameTime: 10,
      averageFrameTime: 10,
      budgetExceeded: false,
      consecutiveExceeded: 0,
      frameCount: 1,
    });

    manager.recordFrame(30);
    expect(manager.isBudgetExceeded()).toBe(false);
    manager.recordFrame(40);
    expect(manager.isBudgetExceeded()).toBe(true);
    expect(manager.getStats().consecutiveExceeded).toBe(2);

    manager.recordFrame(5);
    expect(manager.isBudgetExceeded()).toBe(false);
    expect(manager.getStats().consecutiveExceeded).toBe(0);
  });

  it("keeps a bounded history and recommends quality from the average", () => {
    const manager = new PerformanceBudgetManager({ maxFrameTime: 20 });

    expect(manager.getRecommendedQuality()).toBe("high");
    manager.recordFrame(25);
    expect(manager.getRecommendedQuality()).toBe("medium");
    manager.recordFrame(40);
    expect(manager.getRecommendedQuality()).toBe("low");

    for (let index = 0; index < 61; index += 1) {
      manager.recordFrame(10);
    }

    expect(manager.getStats().frameCount).toBe(63);
    expect(manager.getStats().averageFrameTime).toBe(10);
    expect(manager.getRecommendedQuality()).toBe("high");
  });

  it("resets statistics and accepts budget updates", () => {
    const manager = new PerformanceBudgetManager({
      budgetExceededThreshold: 1,
    });

    manager.recordFrame(100);
    expect(manager.isBudgetExceeded()).toBe(true);

    manager.reset();
    expect(manager.getStats()).toEqual({
      currentFrameTime: 0,
      averageFrameTime: 0,
      budgetExceeded: false,
      consecutiveExceeded: 0,
      frameCount: 0,
    });

    manager.updateBudget({ maxFrameTime: 10, budgetExceededThreshold: 2 });
    manager.recordFrame(11);
    expect(manager.isBudgetExceeded()).toBe(false);
    manager.recordFrame(11);
    expect(manager.isBudgetExceeded()).toBe(true);
  });
});
