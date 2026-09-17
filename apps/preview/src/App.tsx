export default function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 32,
        background:
          "radial-gradient(circle at top left, #dbeafe, transparent 40%), #f8fafc",
      }}
    >
      <section style={{ maxWidth: 560, textAlign: "center" }}>
        <p style={{ letterSpacing: "0.12em", fontSize: 12, color: "#2563eb" }}>
          THEGIOISO · LIVE PREVIEW
        </p>
        <h1 style={{ fontSize: 40, margin: "12px 0 16px" }}>
          Site của bạn sẽ hiện ở đây
        </h1>
        <p style={{ color: "#475569", marginBottom: 24 }}>
          Gõ bên trái, ví dụ: “Làm landing bán khóa học AI, nền tối, nút Đăng
          ký”. Agent sẽ sửa file trong workspace và trang này đổi ngay.
        </p>
        <button
          type="button"
          style={{
            background: "#2563eb",
            color: "white",
            border: 0,
            borderRadius: 8,
            padding: "12px 20px",
            cursor: "pointer",
          }}
        >
          Bắt đầu
        </button>
      </section>
    </main>
  );
}
