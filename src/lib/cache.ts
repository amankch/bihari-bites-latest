// High-performance In-Memory Cache with TTL and selective invalidation
type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

// Global cache store attached to globalThis to persist across Next.js dev reloads and serverless hot lambdas
const globalCache = (globalThis as unknown as {
  __bihari_cache__?: Map<string, CacheEntry<any>>;
});

if (!globalCache.__bihari_cache__) {
  globalCache.__bihari_cache__ = new Map();
}

const store = globalCache.__bihari_cache__;

/**
 * Retrieve cached item if valid and not expired.
 */
export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

/**
 * Set cache item with time-to-live in seconds (default: 120s / 2 minutes).
 */
export function setCached<T>(key: string, data: T, ttlSeconds: number = 120): T {
  store.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
  return data;
}

/**
 * Invalidate specific keys or all keys matching a prefix.
 * e.g., invalidateCache("products") will wipe "products:all", "products:featured", etc.
 */
export function invalidateCache(prefix?: string): void {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}
