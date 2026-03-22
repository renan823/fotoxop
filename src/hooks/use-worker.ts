// useWorker.ts
import type { TransformWorkerAPI } from "@/lib/worker";
import * as Comlink from "comlink";

let workerInstance: Comlink.Remote<TransformWorkerAPI> | null = null;

export function useWorker(): Comlink.Remote<TransformWorkerAPI> {
    if (!workerInstance) {
        const worker = new Worker(
            new URL("../lib/worker.ts", import.meta.url),
            { type: "module" }
        );

        workerInstance = Comlink.wrap<TransformWorkerAPI>(worker);
    }

    return workerInstance;
}