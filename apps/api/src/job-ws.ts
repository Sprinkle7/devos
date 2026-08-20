import type { Server } from "node:http";
import { WebSocketServer } from "ws";
import { getJob, mapJob } from "./jobs.js";

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Attach WebSocket job progress at ws://host/jobs/:id/ws (Milestone 09).
 */
export function attachJobWebSocket(server: Server): void {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    const url = request.url ?? "";
    const match = url.match(/^\/jobs\/([^/?]+)\/ws$/);
    if (!match) return;

    wss.handleUpgrade(request, socket, head, (ws) => {
      const jobId = match[1]!;
      void (async () => {
        try {
          for (let i = 0; i < 120; i++) {
            const job = await getJob(jobId);
            if (!job) {
              ws.send(JSON.stringify({ type: "error", text: "not_found" }));
              ws.close();
              return;
            }
            ws.send(JSON.stringify({ type: "status", job: mapJob(job) }));
            if (job.status === "completed" || job.status === "failed") {
              ws.send(JSON.stringify({ type: "done", job: mapJob(job) }));
              ws.close();
              return;
            }
            await sleep(1000);
          }
          ws.close();
        } catch (err) {
          ws.send(JSON.stringify({ type: "error", text: String(err) }));
          ws.close();
        }
      })();
    });
  });
}
