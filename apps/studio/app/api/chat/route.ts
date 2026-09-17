import { streamText, tool, type CoreMessage } from "ai";
import { z } from "zod";
import { getModel } from "@/lib/model";
import {
  listWorkspace,
  readWorkspaceFile,
  writeWorkspaceFile,
} from "@/lib/workspace";

const SYSTEM = `Bạn là agent vibe-code của Thế Giới Số.
Khách chat bên trái; website live nằm trong iframe bên phải (app Vite + React tại apps/preview).

Quy tắc:
- Luôn dùng tool để đọc/sửa file. Đừng chỉ mô tả code nếu khách muốn thấy kết quả.
- File chính cần sửa: src/App.tsx, src/index.css. Giữ src/main.tsx và index.html trừ khi thật sự cần.
- Viết React function component, CSS thuần (inline style hoặc index.css). Không thêm package npm mới.
- Sau khi ghi file, tóm tắt ngắn tiếng Việt những gì đã đổi — khách sẽ thấy ngay bên phải nhờ hot reload.
- Trang phải đẹp, đủ nội dung (hero, CTA, vài mục), tiếng Việt trừ khi khách yêu cầu ngôn ngữ khác.
- Path tool luôn tương đối từ gốc preview, ví dụ src/App.tsx.`;

export async function POST(req: Request) {
  let messages: CoreMessage[];
  try {
    const body = (await req.json()) as { messages?: CoreMessage[] };
    if (!Array.isArray(body.messages)) {
      return new Response("Invalid messages", { status: 400 });
    }
    messages = body.messages;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  let model;
  try {
    model = getModel();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "No model";
    return new Response(msg, { status: 500 });
  }

  const result = streamText({
    model,
    system: SYSTEM,
    messages,
    maxSteps: 8,
    tools: {
      listFiles: tool({
        description: "Liệt kê file/thư mục trong workspace preview",
        parameters: z.object({
          path: z.string().describe("Thư mục tương đối; dùng . cho thư mục gốc."),
        }),
        execute: async ({ path: rel }) => listWorkspace(rel || "."),
      }),
      readFile: tool({
        description: "Đọc một file trong workspace preview",
        parameters: z.object({
          path: z.string().describe("Ví dụ src/App.tsx"),
        }),
        execute: async ({ path: rel }) => ({
          path: rel,
          content: await readWorkspaceFile(rel),
        }),
      }),
      writeFile: tool({
        description: "Ghi đè hoặc tạo file. Dùng để cập nhật UI khách thấy bên phải.",
        parameters: z.object({
          path: z.string().describe("Ví dụ src/App.tsx"),
          content: z.string().describe("Toàn bộ nội dung file"),
        }),
        execute: async ({ path: rel, content }) => writeWorkspaceFile(rel, content),
      }),
    },
  });

  return result.toDataStreamResponse({
    getErrorMessage: (err) =>
      err instanceof Error ? err.message : "AI provider request failed",
  });
}
