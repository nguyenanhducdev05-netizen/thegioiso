"use client";

import { useChat } from "@ai-sdk/react";
import { useRef } from "react";

const HINTS = [
  "Làm landing bán khóa học AI, nền tối, nút Đăng ký nổi bật",
  "Trang portfolio nhiếp ảnh, lưới ảnh, tiếng Việt",
  "Landing quán cà phê: menu 4 món và form đặt bàn",
];

function messageText(message: {
  content: string | Array<{ type: string; text?: string }>;
}) {
  if (typeof message.content === "string") return message.content;
  return message.content
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text)
    .join("\n");
}

export function StudioApp() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewOrigin =
    process.env.NEXT_PUBLIC_PREVIEW_ORIGIN ?? "http://127.0.0.1:5173";
  const domain =
    process.env.NEXT_PUBLIC_TENANT_DOMAIN ?? "acme.app.thegioiso.vn";

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setInput,
  } = useChat({
    api: "/api/chat",
    maxSteps: 8,
  });

  function sendHint(text: string) {
    setInput(text);
  }

  function reloadPreview() {
    const node = iframeRef.current;
    if (!node) return;
    node.src = `${previewOrigin}?r=${Date.now()}`;
  }

  return (
    <div className="shell">
      <section className="chat">
        <header className="chat-head">
          <div className="brand">
            Thế Giới Số · <span>Studio</span>
          </div>
          <span style={{ color: "var(--muted)", fontSize: 12 }}>
            {isLoading ? "Đang vibe…" : "Groq / Claude / GPT"}
          </span>
        </header>

        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty">
              <h1>Xây site bằng chat</h1>
              <p>
                Kết quả chạy ngay trên tên miền bên phải. Gõ mô tả, agent sửa
                file Vite — không cần tab khác.
              </p>
              <div className="hints">
                {HINTS.map((h) => (
                  <button key={h} type="button" onClick={() => sendHint(h)}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const text = messageText(m);
              const tools = "toolInvocations" in m ? m.toolInvocations : undefined;
              return (
                <div key={m.id}>
                  {text ? (
                    <div className={`msg ${m.role}`}>{text}</div>
                  ) : null}
                  {Array.isArray(tools)
                    ? tools.map((t) => (
                        <div key={t.toolCallId} className="tool">
                          {t.toolName === "writeFile"
                            ? `Đã cập nhật ${typeof t.args === "object" && t.args && "path" in t.args ? t.args.path : "file"}`
                            : `Tool: ${t.toolName}`}
                        </div>
                      ))
                    : null}
                </div>
              );
            })
          )}
        </div>

        <div className="composer-wrap">
          {error ? <div className="err">{error.message}</div> : null}
          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Mô tả trang bạn muốn…"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <button type="submit" disabled={isLoading || !input.trim()} aria-label="Gửi">
              ↑
            </button>
          </form>
        </div>
      </section>

      <section className="preview-col">
        <div className="browser">
          <div className="dots" aria-hidden>
            <i />
            <i />
            <i />
          </div>
          <div className="address">
            https://<strong>{domain}</strong>
          </div>
          <button className="reload" type="button" onClick={reloadPreview}>
            Tải lại
          </button>
        </div>
        <iframe
          ref={iframeRef}
          className="frame"
          title="Live preview"
          src={previewOrigin}
        />
      </section>
    </div>
  );
}
