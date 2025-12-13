import { openDB, DBSchema, IDBPDatabase } from "idb";

export interface QueuedRequest {
  id: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  data?: unknown;
  timestamp: number;
  retries: number;
}

interface OfflineQueueDB extends DBSchema {
  requests: {
    key: string;
    value: QueuedRequest;
    indexes: { timestamp: number };
  };
}

const DB_NAME = "offline-queue";
const DB_VERSION = 1;
const STORE_NAME = "requests";

class OfflineQueue {
  private db: IDBPDatabase<OfflineQueueDB> | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<OfflineQueueDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("timestamp", "timestamp");
        }
      },
    });
  }

  async add(request: Omit<QueuedRequest, "id" | "timestamp" | "retries">): Promise<string> {
    await this.init();
    
    const queuedRequest: QueuedRequest = {
      ...request,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retries: 0,
    };

    await this.db!.add(STORE_NAME, queuedRequest);
    return queuedRequest.id;
  }

  async getAll(): Promise<QueuedRequest[]> {
    await this.init();
    return this.db!.getAll(STORE_NAME);
  }

  async getAllSorted(): Promise<QueuedRequest[]> {
    await this.init();
    const tx = this.db!.transaction(STORE_NAME, "readonly");
    const index = tx.store.index("timestamp");
    return index.getAll();
  }

  async get(id: string): Promise<QueuedRequest | undefined> {
    await this.init();
    return this.db!.get(STORE_NAME, id);
  }

  async remove(id: string): Promise<void> {
    await this.init();
    await this.db!.delete(STORE_NAME, id);
  }

  async update(id: string, updates: Partial<QueuedRequest>): Promise<void> {
    await this.init();
    const request = await this.get(id);
    if (request) {
      await this.db!.put(STORE_NAME, { ...request, ...updates });
    }
  }

  async incrementRetries(id: string): Promise<void> {
    await this.init();
    const request = await this.get(id);
    if (request) {
      await this.db!.put(STORE_NAME, { ...request, retries: request.retries + 1 });
    }
  }

  async clear(): Promise<void> {
    await this.init();
    await this.db!.clear(STORE_NAME);
  }

  async count(): Promise<number> {
    await this.init();
    return this.db!.count(STORE_NAME);
  }
}

export const offlineQueue = new OfflineQueue();
export default offlineQueue;
