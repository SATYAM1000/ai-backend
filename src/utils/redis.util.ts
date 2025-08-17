/**
 * Build a Redis key from parts
 * Ensures consistent namespacing: namespace:subnamespace:id
 *
 * Example:
 * createRedisKey('user', userId, 'session') -> "user:123:session"
 */

function createRedisKey(...parts: (string | number | undefined | null)[]): string {
  return parts
    .filter(Boolean) // remove null undefined
    .map(String) // convert numbers to strings
    .join(':') // join with colons
    .toLowerCase(); // normalize case
}
export const redisUtils = { createRedisKey };
