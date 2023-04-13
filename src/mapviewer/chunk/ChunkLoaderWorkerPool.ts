
import { spawn, Pool, Worker, Transfer, TransferDescriptor, ModuleThread } from "threads";
import { MemoryStore } from "../../client/fs/MemoryStore";
import { ChunkData } from "./ChunkDataLoader";

export type ChunkLoaderWorker = {
    init(memoryStore: TransferDescriptor<MemoryStore>, xteasMap: Map<number, number[]>): void,

    load(regionX: number, regionY: number, minimizeDrawCalls: boolean): ChunkData | undefined,
};

export class ChunkLoaderWorkerPool {
    pool: Pool<ModuleThread<ChunkLoaderWorker>>;

    workerPromises: Promise<ModuleThread<ChunkLoaderWorker>>[];

    size: number;

    static init(size: number): ChunkLoaderWorkerPool {
        const workerPromises: Promise<ModuleThread<ChunkLoaderWorker>>[] = [];
        const pool = Pool(() => {
            const worker = new Worker(new URL("./ChunkLoaderWorker", import.meta.url) as any);
            // console.log('post init worker', performance.now());
            const workerPromise = spawn<ChunkLoaderWorker>(worker);
            workerPromises.push(workerPromise);
            return workerPromise;
        }, size);
        return new ChunkLoaderWorkerPool(pool, workerPromises, size);
    }

    constructor(pool: Pool<ModuleThread<ChunkLoaderWorker>>, workerPromises: Promise<ModuleThread<ChunkLoaderWorker>>[], size: number) {
        this.pool = pool;
        this.workerPromises = workerPromises;
        this.size = size;
    }

    init(store: MemoryStore, xteasMap: Map<number, number[]>) {
        for (const promise of this.workerPromises) {
            promise.then(worker => {
                // console.log('send init worker', performance.now());
                worker.init(Transfer(store, []), xteasMap);
                return worker;
            });
        }
    }
}
