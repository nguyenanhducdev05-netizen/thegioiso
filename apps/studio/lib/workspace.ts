import path from "node:path";
import { promises as fs } from "node:fs";

const PREVIEW_ROOT = path.resolve(process.cwd(), "..", "preview");

function resolveSafe(relPath: string) {
  const cleaned = relPath.replaceAll("\\", "/").replace(/^\/+/, "");
  if (!cleaned || cleaned.includes("..")) {
    throw new Error("Đường dẫn không hợp lệ");
  }
  const abs = path.resolve(PREVIEW_ROOT, cleaned);
  const root = path.resolve(PREVIEW_ROOT);
  if (!abs.startsWith(root + path.sep) && abs !== root) {
    throw new Error("Không được ghi ngoài workspace preview");
  }
  return abs;
}

export async function listWorkspace(rel = ".") {
  const dir = resolveSafe(rel);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.name !== "node_modules" && e.name !== "dist")
    .map((e) => ({
      name: e.name,
      type: e.isDirectory() ? "dir" : "file",
      path: path.posix.join(rel.replaceAll("\\", "/"), e.name),
    }));
}

export async function readWorkspaceFile(relPath: string) {
  const abs = resolveSafe(relPath);
  const content = await fs.readFile(abs, "utf8");
  if (content.length > 80_000) {
    return content.slice(0, 80_000) + "\n… (cắt bớt)";
  }
  return content;
}

export async function writeWorkspaceFile(relPath: string, content: string) {
  const abs = resolveSafe(relPath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, content, "utf8");
  return { ok: true, path: relPath };
}

export { PREVIEW_ROOT };
