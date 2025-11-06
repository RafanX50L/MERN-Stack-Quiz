import { createClient, RedisClientType } from "redis";
import { env } from "./env.config";
import logger from "@/utils/logger.utils";

let redisClient: RedisClientType;

async function connectRedis() {
  try {
    redisClient = createClient({
      url: env.REDIS_URL,
      socket: {
        tls: true, // ✅ required for Upstash , comment it for local Redis servers
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            return new Error("Max retries reached. Exiting...");
          }
          return Math.min(retries * 100, 2000);
        },
      },
    });

    redisClient.on("connect", () => logger.info("✅ Redis client connected"));
    redisClient.on("error", (err) => logger.error("❌ Redis client error:", err));

    await redisClient.connect();
    logger.info("✅ Connected to Upstash Redis successfully");

    // optional keep-alive to prevent idle disconnects
    setInterval(() => {
      redisClient.ping().catch(() => {});
    }, 60000);
  } catch (err) {
    logger.error("❌ Failed to connect to Redis:", err);
    process.exit(1);
  }
}

export { connectRedis, redisClient };
