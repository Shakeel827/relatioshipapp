import mongoose from "mongoose";

let lastError: Error | null = null;
export function getMongoStatus() {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  return {
    connected: state === 1,
    state,
    error: lastError ? String(lastError.message || lastError) : null,
  } as const;
}

export async function connectMongo(uri: string) {
  if (!uri) {
    console.warn("⚠️  MONGO_URI not provided. Backend will run without DB.");
    return;
  }
  if (uri.startsWith("mongodb+srv://")) {
    console.warn(
      "SRV URI detected. Please convert it to a standard seedlist URI (mongodb://host1:27017,host2:27017,host3:27017/?replicaSet=<name>&tls=true&authSource=admin). You can set MONGO_URI_SEEDLIST to override."
    );
    const seed = process.env.MONGO_URI_SEEDLIST;
    if (seed) uri = seed;
    else return; // Skip connecting; API should degrade gracefully
  }

  if (mongoose.connection.readyState === 1) return;
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      heartbeatFrequencyMS: 10000,
    } as any);
    console.log("✅ MongoDB connected");
    lastError = null;
  } catch (err: any) {
    lastError = err;
    console.error("⚠️  MongoDB connection failed. Running in degraded mode:", err?.message || err);
  }
}
