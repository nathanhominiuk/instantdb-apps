import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function corsProxyPlugin(): Plugin {
  return {
    name: "cors-proxy",
    configureServer(server) {
      server.middlewares.use("/api/cors-proxy", async (req, res) => {
        const parsed = new URL(req.url!, `http://${req.headers.host}`);
        const targetUrl = parsed.searchParams.get("url");

        if (!targetUrl) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Missing url parameter" }));
          return;
        }

        try {
          const response = await fetch(targetUrl, {
            headers: { Accept: "text/calendar, text/plain, */*" },
          });

          if (!response.ok) {
            res.statusCode = response.status;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: `Upstream returned ${response.status}`,
              })
            );
            return;
          }

          const text = await response.text();
          res.setHeader("Content-Type", "text/calendar; charset=utf-8");
          res.end(text);
        } catch (err: unknown) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error:
                err instanceof Error ? err.message : "Failed to fetch feed",
            })
          );
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), corsProxyPlugin()],
});
