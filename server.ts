import express from "express";
import path from "path";
import { app } from "./app";

const PORT = parseInt(process.env.PORT || "3000", 10);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const listenOnPort = (portToTry: number) => {
    const server = app.listen(portToTry, "0.0.0.0", () => {
      const address = server.address();
      const actualPort = typeof address === "object" && address ? address.port : portToTry;
      console.log(`Server running on http://localhost:${actualPort}`);
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${portToTry} is in use, finding an available free port...`);
        listenOnPort(0);
      } else {
        console.error("Server error:", err);
      }
    });
  };

  listenOnPort(PORT);
}

if (!process.env.VERCEL) {
  startServer();
}
