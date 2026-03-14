/**
 * Centralized Quota Manager to handle API Rate Limiting across the platform.
 */
class QuotaManager {
  private cooldownUntil = 0;

  block(ms: number) {
    this.cooldownUntil = Date.now() + ms;
  }

  isBlocked(): boolean {
    return Date.now() < this.cooldownUntil;
  }

  getRemainingCooldown(): number {
    return Math.max(0, this.cooldownUntil - Date.now());
  }
}

export const quotaManager = new QuotaManager();
