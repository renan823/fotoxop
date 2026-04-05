import type { TransformWorkerAPI } from "@/lib/worker";
import * as Comlink from "comlink";

let workerInstance: Comlink.Remote<TransformWorkerAPI> | null = null;

/*
Hook para utilizar o worker de trasnformações.

Como a atrefa de criar um worker é cara (e seria
utilizada frequentemente), um singleton foi utilizado.
*/
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