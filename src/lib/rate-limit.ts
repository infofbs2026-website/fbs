import 'server-only';
import { Redis } from '@upstash/redis';
import { createHash } from 'node:crypto';
import { DomainError } from './errors';
const policies={auth:[10,60],bids:[30,10],write:[30,60],search:[120,60],admin:[60,60]} as const;
const localBuckets = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(policy: keyof typeof policies, identifier: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL, token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const [max, seconds] = policies[policy];
  const key = `fbs:rate:${policy}:${createHash('sha256').update(identifier).digest('hex')}`;

  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      throw new DomainError('SYSTEM_DEGRADED', 'الخدمة غير مفعّلة بعد. يرجى المحاولة لاحقًا.', {}, 503);
    }
    // Local in-memory fallback for development without Redis credentials
    const now = Date.now();
    const bucket = localBuckets.get(key);
    if (!bucket || now >= bucket.resetAt) {
      localBuckets.set(key, { count: 1, resetAt: now + seconds * 1000 });
      return;
    }
    bucket.count += 1;
    if (bucket.count > max) {
      throw new DomainError('RATE_LIMITED', undefined, {}, 429);
    }
    return;
  }

  try {
    const count = await new Redis({ url, token }).eval(
      "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n",
      [key],
      [seconds]
    );
    if (Number(count) > max) throw new DomainError('RATE_LIMITED', undefined, {}, 429);
  } catch (error) {
    if (error instanceof DomainError) throw error;
    throw new DomainError('SYSTEM_DEGRADED', undefined, {}, 503);
  }
}

