import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("./dist/", import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8", ".xml": "application/xml; charset=utf-8"
};

const server = http.createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (pathname.includes("\0")) throw new Error("Invalid path");
    const relative = pathname.endsWith("/") ? pathname + "index.html" : pathname;
    const filename = path.resolve(root, "." + relative);
    if (!filename.startsWith(root)) {
      response.writeHead(403); response.end("Forbidden"); return;
    }
    const info = await stat(filename);
    if (!info.isFile()) throw new Error("Not a file");
    const body = await readFile(filename);
    response.writeHead(200, {
      "Content-Type": types[path.extname(filename).toLowerCase()] || "application/octet-stream",
      "Content-Length": body.length,
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff"
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("页面或文件不存在");
  }
});
server.on("error", (error) => {
  console.error(error.code === "EADDRINUSE"
    ? "端口已被占用。请设置 PORT 环境变量后重试。"
    : error.message);
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () => {
  console.log("春枝心理本地预览：http://127.0.0.1:" + port);
  console.log("按 Ctrl+C 停止。域名绑定和公网部署需另行配置。");
});
