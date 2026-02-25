import React, { useState, useRef, useEffect } from "react";

/**
 * IRAQ AI - المشروع الكامل ✨
 * 
 * المميزات:
 * ✅ المحادثة الذكية - Claude Haiku 3.5
 * ✅ توليد الصور - Playground v2.5 (fal.ai)
 * ✅ توليد الفيديو - Luma Dream Machine (fal.ai)
 * 
 * المفاتيح مدمجة في الكود - يعمل فوراً! 🚀
 */

// ─── Data ───────────────────────────────────────────────────────────────────
const HISTORY = [
  { id: 1, title: "ما هو الذكاء الاصطناعي؟", date: "اليوم", preview: "الذكاء الاصطناعي هو محاكاة..." },
  { id: 2, title: "أنشئ صورة لمدينة بغداد", date: "اليوم", preview: "تم إنشاء الصورة بنجاح" },
  { id: 3, title: "كيف أتعلم البرمجة؟", date: "أمس", preview: "للبدء في البرمجة عليك..." },
  { id: 4, title: "ترجمة نص إلى الإنجليزية", date: "أمس", preview: "Here is the translation..." },
  { id: 5, title: "وصفة مضغوف عراقي", date: "الأسبوع الماضي", preview: "المكونات: رز، لحم..." },
  { id: 6, title: "تاريخ بلاد الرافدين", date: "الأسبوع الماضي", preview: "بلاد الرافدين هي..." },
];

const INIT_MESSAGES = [
  {
    id: 1, role: "assistant", time: "10:00 ص",
    content: "مرحباً! أنا IRAQ AI، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟",
  },
  {
    id: 2, role: "user", time: "10:02 ص",
    content: "ما هي أهم المعالم السياحية في بغداد؟",
  },
  {
    id: 3, role: "assistant", time: "10:02 ص",
    content: "بغداد تمتلك إرثاً حضارياً عريقاً. إليك أبرز معالمها:\n\n**المتحف العراقي** — يضم آلاف القطع الأثرية من حضارة بلاد الرافدين.\n\n**جامع الكاظمية** — تحفة معمارية إسلامية بقبابه الذهبية الشامخة.\n\n**شارع المتنبي** — شريان الثقافة والأدب في قلب العاصمة.\n\n**قصر العباسيين** — شاهد تاريخي على عظمة الدولة العباسية.",
  },
];

const SUGGESTIONS = ["اشرح لي مفهوم الذكاء الاصطناعي", "أنشئ قصيدة باللغة العربية", "ساعدني في كتابة كود Python"];

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  send: () => <Icon d={["M22 2L11 13", "M22 2L15 22 11 13 2 9l20-7z"]} />,
  mic: () => <Icon d={["M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v4", "M8 23h8"]} />,
  image: () => <Icon d={["M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14", "M3 19h18", "M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", "M21 15l-5-5L5 21"]} />,
  menu: () => <Icon d={["M3 12h18", "M3 6h18", "M3 18h18"]} />,
  plus: () => <Icon d={["M12 5v14", "M5 12h14"]} />,
  settings: () => <Icon d={["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"]} />,
  close: () => <Icon d={["M18 6L6 18", "M6 6l12 12"]} />,
  chat: () => <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  user: () => <Icon d={["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]} />,
  star: () => <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke="none" />,
  sparkle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.68 5.17H19l-4.34 3.15 1.66 5.1L12 12.33l-4.32 3.09 1.66-5.1L5 7.17h5.32z" />
    </svg>
  ),
  wand: () => <Icon d={["M15 4l5 5", "M14.5 4.5l-10 10L3 21l6.5-1.5 10-10z"]} />,
};

// ─── Typing Dots ─────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "14px 18px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#94a3b8",
          animation: `dotBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === "user";
  const lines = msg.content.split("\n");

  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 10,
      marginBottom: 22,
      animation: "riseIn .35s ease both",
    }}>
      {!isUser && (
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: 12, fontFamily: "'Tajawal', sans-serif",
          boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
        }}>AI</div>
      )}
      <div style={{
        maxWidth: "64%",
        background: isUser ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" : "#fff",
        borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
        padding: "12px 16px",
        color: isUser ? "#fff" : "#1e293b",
        fontSize: 14.5,
        lineHeight: 1.75,
        direction: "rtl",
        textAlign: "right",
        boxShadow: isUser
          ? "0 4px 18px rgba(99,102,241,0.25)"
          : "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        border: isUser ? "none" : "1px solid rgba(0,0,0,0.05)",
        fontFamily: "'Tajawal', sans-serif",
      }}>
        {lines.map((line, i) => {
          if (!line) return <div key={i} style={{ height: 6 }} />;
          const boldMatch = line.match(/^\*\*(.+?)\*\* — (.+)$/);
          if (boldMatch) return (
            <div key={i} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: isUser ? "#e0e7ff" : "#4f46e5" }}>{boldMatch[1]}</span>
              <span style={{ color: isUser ? "rgba(255,255,255,0.85)" : "#475569" }}> — {boldMatch[2]}</span>
            </div>
          );
          return <p key={i} style={{ margin: 0, marginBottom: 2 }}>{line}</p>;
        })}
        <div style={{
          fontSize: 11, marginTop: 6,
          color: isUser ? "rgba(255,255,255,0.5)" : "#94a3b8",
          textAlign: isUser ? "left" : "right",
        }}>{msg.time}</div>
      </div>
    </div>
  );
}

// ─── Image Generation Modal ───────────────────────────────────────────────────
function ProfileModal({ onClose }) {
  const stats = [
    { icon: "💬", label: "الرسائل المتبقية", value: "47 / 50" },
    { icon: "🖼️", label: "الصور المُنشأة", value: "12" },
    { icon: "📅", label: "تاريخ الانضمام", value: "يناير 2025" },
  ];

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 200, animation: "fadeIn .25s ease",
    }}>
      <div style={{
        width: 400, background: "#fff", borderRadius: 22,
        boxShadow: "0 30px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)",
        overflow: "hidden", animation: "riseIn .35s cubic-bezier(.16,1,.3,1)",
      }}>
        {/* Top gradient bar */}
        <div style={{ height: 6, background: "linear-gradient(90deg, #6366f1, #8b5cf6, #c084fc)" }} />

        <div style={{ padding: "28px 24px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0",
              background: "#fff", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", color: "#64748b",
            }}><Icons.close /></button>
            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 17, fontFamily: "'Tajawal', sans-serif" }}>الملف الشخصي</div>
          </div>

          {/* Avatar */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", margin: "0 auto 12px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 28, fontWeight: 800,
              boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
            }}>م</div>
            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 17, fontFamily: "'Tajawal', sans-serif" }}>مرتضى حسين</div>
            <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>mortadha@example.com</div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8,
              background: "#fef9c3", borderRadius: 20, padding: "3px 12px",
              color: "#854d0e", fontSize: 12, fontWeight: 600, fontFamily: "'Tajawal', sans-serif",
            }}>
              <Icons.star />
              الخطة المجانية
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 14px", background: "#f8fafc",
                borderRadius: 10, direction: "rtl",
                border: "1px solid #f1f5f9",
              }}>
                <span style={{ color: "#475569", fontSize: 13, fontFamily: "'Tajawal', sans-serif", display: "flex", alignItems: "center", gap: 7 }}>
                  <span>{s.icon}</span>{s.label}
                </span>
                <span style={{ color: "#6366f1", fontWeight: 700, fontSize: 13 }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Usage bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, direction: "rtl" }}>
              <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'Tajawal', sans-serif" }}>الاستخدام الشهري</span>
              <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>94%</span>
            </div>
            <div style={{ height: 6, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: "94%", borderRadius: 10,
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                animation: "growBar .8s ease both",
              }} />
            </div>
          </div>

          <button style={{
            width: "100%", padding: "13px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff",
            fontFamily: "'Tajawal', sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 18px rgba(99,102,241,0.3)", transition: "all .2s",
          }}>⬆️ ترقية إلى الخطة الاحترافية</button>
        </div>
      </div>
    </div>
  );
}

// ─── Image Generation Modal ───────────────────────────────────────────────────
function ImageModal({ onClose }) {
  const [prompt, setPrompt] = useState("");
  const [stage, setStage] = useState("idle");
  const [imgSrc, setImgSrc] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [style, setStyle] = useState("realistic");

  const FAL_KEY = "f6b04ba8-7e90-4f0d-9685-faadf0872abf:93299f2e79b21cac23497098826bc8e3";

  const sizes = [
    { val: "1024x1024", label: "مربع" },
    { val: "1792x1024", label: "عريض" },
    { val: "1024x1792", label: "طويل" },
  ];

  const styles = [
    { val: "realistic", label: "واقعي" },
    { val: "digital", label: "فن رقمي" },
    { val: "painting", label: "رسم" },
    { val: "anime", label: "أنمي" },
  ];

  const STYLE_MAP = {
    realistic: "photorealistic, high quality, 8k",
    digital: "digital art, vibrant colors, concept art",
    painting: "oil painting, artistic, masterpiece",
    anime: "anime style, manga, detailed",
  };

  const SIZE_MAP = {
    "1024x1024": "square_hd",
    "1792x1024": "landscape_16_9",
    "1024x1792": "portrait_16_9",
  };

  const generate = async () => {
    if (!prompt.trim() || stage === "loading") return;
    setStage("loading");
    setImgSrc("");
    setErrMsg("");

    try {
      const fullPrompt = `${prompt.trim()}, ${STYLE_MAP[style] || ""}`;
      
      const submitRes = await fetch("https://queue.fal.run/fal-ai/playground-v25", {
        method: "POST",
        headers: {
          "Authorization": `Key ${FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          image_size: SIZE_MAP[size] || "square_hd",
          num_inference_steps: 25,
          guidance_scale: 3,
          num_images: 1,
        }),
      });

      const { request_id } = await submitRes.json();
      if (!request_id) { setErrMsg("فشل إرسال الطلب"); setStage("error"); return; }

      const statusUrl = `https://queue.fal.run/fal-ai/playground-v25/requests/${request_id}/status`;
      const resultUrl = `https://queue.fal.run/fal-ai/playground-v25/requests/${request_id}`;

      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const statusRes = await fetch(statusUrl, { headers: { Authorization: `Key ${FAL_KEY}` } });
        const statusData = await statusRes.json();
        if (statusData?.status === "COMPLETED") break;
        if (statusData?.status === "FAILED") { setErrMsg("فشل الإنشاء"); setStage("error"); return; }
      }

      const resultRes = await fetch(resultUrl, { headers: { Authorization: `Key ${FAL_KEY}` } });
      const resultData = await resultRes.json();
      const url = resultData?.images?.[0]?.url;
      
      if (!url) { setErrMsg("لم تُرجع صورة"); setStage("error"); return; }
      setImgSrc(url);
      setStage("done");
    } catch (e) {
      setErrMsg("خطأ في الاتصال");
      setStage("error");
    }
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 200, animation: "fadeIn .25s ease",
    }}>
      <div style={{
        width: 560, background: "#fff", borderRadius: 22,
        boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
        overflow: "hidden", animation: "riseIn .35s cubic-bezier(.16,1,.3,1)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{
          padding: "18px 24px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0",
            background: "#fff", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", color: "#64748b",
          }}><Icons.close /></button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, direction: "rtl" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 16, fontFamily: "'Tajawal', sans-serif" }}>توليد الصور</div>
              <div style={{ fontSize: 12, marginTop: 1, fontWeight: 600, background: "linear-gradient(90deg,#7c3aed,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Playground v2.5
              </div>
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 18,
            }}>🎨</div>
          </div>
        </div>

        <div style={{ padding: "18px 24px" }}>
          <div style={{
            width: "100%", height: 270, borderRadius: 14,
            background: stage === "done" ? "#000" : "linear-gradient(135deg,#f5f3ff,#fdf2f8)",
            border: "1.5px dashed #ddd6fe",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", position: "relative", marginBottom: 14,
          }}>
            {imgSrc && stage === "done" && (
              <img src={imgSrc} alt="" crossOrigin="anonymous" style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", borderRadius: 12,
              }} />
            )}
            {stage === "idle" && (
              <div style={{ textAlign: "center", color: "#7c3aed", zIndex: 1 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🎨</div>
                <div style={{ fontSize: 13, fontFamily: "'Tajawal', sans-serif" }}>Playground v2.5</div>
              </div>
            )}
            {stage === "loading" && (
              <div style={{ textAlign: "center", zIndex: 1 }}>
                <div style={{
                  width: 48, height: 48, margin: "0 auto 14px",
                  border: "3px solid #ede9fe", borderTopColor: "#7c3aed",
                  borderRadius: "50%", animation: "spinIt 0.9s linear infinite",
                }} />
                <div style={{ color: "#7c3aed", fontSize: 13, fontFamily: "'Tajawal', sans-serif", fontWeight: 600 }}>جارٍ الإنشاء...</div>
                <div style={{ color: "#a78bfa", fontSize: 12, marginTop: 4, fontFamily: "'Tajawal', sans-serif" }}>قد يستغرق 20-40 ثانية</div>
              </div>
            )}
            {stage === "error" && (
              <div style={{ textAlign: "center", color: "#ef4444", zIndex: 1, padding: "0 20px" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
                <div style={{ fontSize: 13, fontFamily: "'Tajawal', sans-serif" }}>{errMsg}</div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'Tajawal', sans-serif", textAlign: "right", marginBottom: 6 }}>الأسلوب</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {styles.map(s => (
                <button key={s.val} onClick={() => setStyle(s.val)} style={{
                  padding: "5px 13px", borderRadius: 20, cursor: "pointer",
                  background: style === s.val ? "linear-gradient(135deg,#7c3aed,#ec4899)" : "#f5f3ff",
                  color: style === s.val ? "#fff" : "#7c3aed",
                  border: "none", fontSize: 12, fontFamily: "'Tajawal', sans-serif",
                  fontWeight: style === s.val ? 600 : 400,
                }}>{s.label}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'Tajawal', sans-serif", textAlign: "right", marginBottom: 6 }}>الحجم</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {sizes.map(s => (
                <button key={s.val} onClick={() => setSize(s.val)} style={{
                  padding: "5px 13px", borderRadius: 20, cursor: "pointer",
                  background: size === s.val ? "#7c3aed" : "#f5f3ff",
                  color: size === s.val ? "#fff" : "#7c3aed",
                  border: "none", fontSize: 11, fontFamily: "'Tajawal', sans-serif",
                  fontWeight: size === s.val ? 600 : 400,
                }}>{s.label}</button>
              ))}
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) generate(); }}
            placeholder="صف الصورة... مثال: منظر بغداد ليلاً"
            style={{
              width: "100%", minHeight: 80, background: "#f5f3ff",
              border: "1.5px solid #ddd6fe", borderRadius: 12,
              padding: "12px 14px", color: "#1e293b", fontSize: 14,
              fontFamily: "'Tajawal', sans-serif", direction: "rtl",
              resize: "none", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ padding: "0 24px 22px", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: "#f5f3ff", border: "none", cursor: "pointer",
            color: "#7c3aed", fontFamily: "'Tajawal', sans-serif", fontSize: 14, fontWeight: 600,
          }}>إغلاق</button>
          <button onClick={generate} disabled={!prompt.trim() || stage === "loading"} style={{
            flex: 2, padding: "12px", borderRadius: 12, border: "none",
            background: prompt.trim() && stage !== "loading" ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "#e2e8f0",
            color: prompt.trim() && stage !== "loading" ? "#fff" : "#94a3b8",
            cursor: prompt.trim() && stage !== "loading" ? "pointer" : "not-allowed",
            fontFamily: "'Tajawal', sans-serif", fontSize: 14, fontWeight: 700,
          }}>
            {stage === "loading" ? "⏳ جارٍ الإنشاء..." : stage === "done" ? "🎨 أعد الإنشاء" : "🎨 أنشئ الصورة"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Video Generation Modal ───────────────────────────────────────────────────
function VideoModal({ onClose }) {
  const [prompt, setPrompt] = useState("");
  const [stage, setStage] = useState("idle");
  const [videoSrc, setVideoSrc] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const FAL_KEY = "f6b04ba8-7e90-4f0d-9685-faadf0872abf:93299f2e79b21cac23497098826bc8e3";

  const generate = async () => {
    if (!prompt.trim() || stage === "loading") return;
    setStage("loading");
    setVideoSrc("");
    setErrMsg("");

    try {
      const submitRes = await fetch("https://queue.fal.run/fal-ai/luma-dream-machine", {
        method: "POST",
        headers: {
          "Authorization": `Key ${FAL_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      const { request_id } = await submitRes.json();
      if (!request_id) { setErrMsg("فشل إرسال الطلب"); setStage("error"); return; }

      const statusUrl = `https://queue.fal.run/fal-ai/luma-dream-machine/requests/${request_id}/status`;
      const resultUrl = `https://queue.fal.run/fal-ai/luma-dream-machine/requests/${request_id}`;

      for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const statusRes = await fetch(statusUrl, { headers: { Authorization: `Key ${FAL_KEY}` } });
        const statusData = await statusRes.json();
        if (statusData?.status === "COMPLETED") break;
        if (statusData?.status === "FAILED") { setErrMsg("فشل الإنشاء"); setStage("error"); return; }
      }

      const resultRes = await fetch(resultUrl, { headers: { Authorization: `Key ${FAL_KEY}` } });
      const resultData = await resultRes.json();
      const url = resultData?.video?.url;
      
      if (!url) { setErrMsg("لم يُرجع فيديو"); setStage("error"); return; }
      setVideoSrc(url);
      setStage("done");
    } catch (e) {
      setErrMsg("خطأ في الاتصال");
      setStage("error");
    }
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 200, animation: "fadeIn .25s ease",
    }}>
      <div style={{
        width: 560, background: "#fff", borderRadius: 22,
        boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
        overflow: "hidden", animation: "riseIn .35s cubic-bezier(.16,1,.3,1)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{
          padding: "18px 24px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0",
            background: "#fff", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", color: "#64748b",
          }}><Icons.close /></button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, direction: "rtl" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 16, fontFamily: "'Tajawal', sans-serif" }}>توليد الفيديو</div>
              <div style={{ fontSize: 12, marginTop: 1, fontWeight: 600, background: "linear-gradient(90deg,#06b6d4,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Luma Dream Machine
              </div>
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 18,
            }}>🎬</div>
          </div>
        </div>

        <div style={{ padding: "18px 24px" }}>
          <div style={{
            width: "100%", height: 270, borderRadius: 14,
            background: stage === "done" ? "#000" : "linear-gradient(135deg,#ecfeff,#eff6ff)",
            border: "1.5px dashed #a5f3fc",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", position: "relative", marginBottom: 14,
          }}>
            {videoSrc && stage === "done" && (
              <video src={videoSrc} controls autoPlay loop style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", borderRadius: 12,
              }} />
            )}
            {stage === "idle" && (
              <div style={{ textAlign: "center", color: "#06b6d4", zIndex: 1 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🎬</div>
                <div style={{ fontSize: 13, fontFamily: "'Tajawal', sans-serif" }}>Luma Dream Machine</div>
                <div style={{ fontSize: 11, fontFamily: "'Tajawal', sans-serif", color: "#67e8f9", marginTop: 4 }}>فيديو 5 ثواني</div>
              </div>
            )}
            {stage === "loading" && (
              <div style={{ textAlign: "center", zIndex: 1 }}>
                <div style={{
                  width: 48, height: 48, margin: "0 auto 14px",
                  border: "3px solid #cffafe", borderTopColor: "#06b6d4",
                  borderRadius: "50%", animation: "spinIt 0.9s linear infinite",
                }} />
                <div style={{ color: "#06b6d4", fontSize: 13, fontFamily: "'Tajawal', sans-serif", fontWeight: 600 }}>جارٍ الإنشاء...</div>
                <div style={{ color: "#67e8f9", fontSize: 12, marginTop: 4, fontFamily: "'Tajawal', sans-serif" }}>قد يستغرق 1-3 دقائق</div>
              </div>
            )}
            {stage === "error" && (
              <div style={{ textAlign: "center", color: "#ef4444", zIndex: 1, padding: "0 20px" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
                <div style={{ fontSize: 13, fontFamily: "'Tajawal', sans-serif" }}>{errMsg}</div>
              </div>
            )}
          </div>

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) generate(); }}
            placeholder="صف الفيديو... مثال: منظر شروق الشمس فوق بغداد"
            style={{
              width: "100%", minHeight: 80, background: "#ecfeff",
              border: "1.5px solid #a5f3fc", borderRadius: 12,
              padding: "12px 14px", color: "#1e293b", fontSize: 14,
              fontFamily: "'Tajawal', sans-serif", direction: "rtl",
              resize: "none", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ padding: "0 24px 22px", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: "#ecfeff", border: "none", cursor: "pointer",
            color: "#06b6d4", fontFamily: "'Tajawal', sans-serif", fontSize: 14, fontWeight: 600,
          }}>إغلاق</button>
          <button onClick={generate} disabled={!prompt.trim() || stage === "loading"} style={{
            flex: 2, padding: "12px", borderRadius: 12, border: "none",
            background: prompt.trim() && stage !== "loading" ? "linear-gradient(135deg, #06b6d4, #3b82f6)" : "#e2e8f0",
            color: prompt.trim() && stage !== "loading" ? "#fff" : "#94a3b8",
            cursor: prompt.trim() && stage !== "loading" ? "pointer" : "not-allowed",
            fontFamily: "'Tajawal', sans-serif", fontSize: 14, fontWeight: 700,
          }}>
            {stage === "loading" ? "⏳ جارٍ الإنشاء..." : stage === "done" ? "🎬 أعد الإنشاء" : "🎬 أنشئ الفيديو"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function IraqAILight() {
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [activeId, setActiveId] = useState(1);
  const [showProfile, setShowProfile] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [listening, setListening] = useState(false);
  const [activeGroup, setActiveGroup] = useState("اليوم");
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = async () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" });
    const userMsg = { id: Date.now(), role: "user", content: input, time: now };
    const currentInput = input;
    setMessages(p => [...p, userMsg]);
    setInput("");
    setTyping(true);

    try {
      // Build conversation history for context
      const history = messages.slice(-10).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));
      history.push({ role: "user", content: currentInput });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "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",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 1000,
          system: "أنت IRAQ AI، مساعد ذكاء اصطناعي متخصص للمستخدمين العراقيين والعرب. تجيب بالعربية دائماً بأسلوب طبيعي وودود ومباشر. لا تستخدم عبارات رسمية أو قوالب جاهزة. تعرف الثقافة والتاريخ العراقي جيداً. ردودك مختصرة ومفيدة.",
          messages: history,
        }),
      });

      const data = await res.json();
      const replyText = data?.content?.[0]?.text || "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.";

      setTyping(false);
      setMessages(p => [...p, {
        id: Date.now() + 1,
        role: "assistant",
        time: new Date().toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" }),
        content: replyText,
      }]);
    } catch {
      setTyping(false);
      setMessages(p => [...p, {
        id: Date.now() + 1,
        role: "assistant",
        time: new Date().toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" }),
        content: "عذراً، تعذّر الاتصال بالخادم. تحقق من الاتصال وحاول مجدداً.",
      }]);
    }
  };

  const toggleListen = () => {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setInput("ما هي عاصمة العراق وأهم مدنها؟");
      inputRef.current?.focus();
    }, 2200);
  };

  const groups = [...new Set(HISTORY.map(h => h.date))];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; background: #f1f5f9; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spinIt  { to { transform: rotate(360deg); } }
        @keyframes growBar { from { width: 0; } }
        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-6px); }
        }
        @keyframes ripple {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,.4); }
          70%  { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        textarea:focus { border-color: #a5b4fc !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important; }
        textarea::placeholder { color: #94a3b8; }
        button { transition: all .18s ease; }
        button:hover { opacity: .88; }
        .hist-item:hover { background: #f1f5f9 !important; }
        .hist-item.active { background: #ede9fe !important; }
        .suggest-pill:hover { background: #ede9fe !important; color: #6366f1 !important; border-color: #c7d2fe !important; }
      `}</style>

      <div style={{
        display: "flex", height: "100vh", width: "100vw",
        fontFamily: "'Tajawal', sans-serif",
        background: "#f1f5f9",
      }}>

        {/* ── SIDEBAR ── */}
        <div style={{
          width: sidebar ? 272 : 0, flexShrink: 0,
          background: "#fff",
          borderLeft: "1px solid #f1f5f9",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          transition: "width .32s cubic-bezier(.16,1,.3,1)",
          boxShadow: sidebar ? "4px 0 24px rgba(0,0,0,0.04)" : "none",
        }}>
          <div style={{ width: 272, height: "100%", display: "flex", flexDirection: "column" }}>

            {/* Brand */}
            <div style={{ padding: "22px 18px 16px", borderBottom: "1px solid #f8fafc" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end", marginBottom: 14 }}>
                <div style={{ direction: "rtl" }}>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 19, letterSpacing: -0.5 }}>IRAQ AI</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>مساعدك الذكي العربي</div>
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 20,
                  boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
                }}>🌙</div>
              </div>

              <button
                onClick={() => { setMessages([]); setInput(""); setActiveId(null); }}
                style={{
                  width: "100%", padding: "9px 14px",
                  background: "#f8fafc", border: "1.5px dashed #e2e8f0",
                  borderRadius: 10, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8,
                  color: "#6366f1", fontFamily: "'Tajawal', sans-serif", fontSize: 13, fontWeight: 600,
                }}>
                <span>محادثة جديدة</span>
                <Icons.plus />
              </button>
            </div>

            {/* History grouped */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
              {groups.map(group => (
                <div key={group} style={{ marginBottom: 8 }}>
                  <div style={{
                    fontSize: 11, color: "#94a3b8", fontWeight: 600,
                    textAlign: "right", padding: "6px 8px 4px",
                    letterSpacing: 0.5, textTransform: "uppercase",
                  }}>{group}</div>
                  {HISTORY.filter(h => h.date === group).map(item => (
                    <button
                      key={item.id}
                      className={`hist-item ${activeId === item.id ? "active" : ""}`}
                      onClick={() => setActiveId(item.id)}
                      style={{
                        width: "100%", padding: "9px 10px", borderRadius: 9,
                        border: "none", cursor: "pointer", textAlign: "right",
                        marginBottom: 2, background: "transparent",
                        display: "flex", flexDirection: "column", gap: 2,
                      }}>
                      <div style={{
                        color: activeId === item.id ? "#4f46e5" : "#334155",
                        fontSize: 13, fontWeight: activeId === item.id ? 600 : 400,
                        fontFamily: "'Tajawal', sans-serif",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>{item.title}</div>
                      <div style={{
                        color: "#94a3b8", fontSize: 11,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>{item.preview}</div>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* User */}
            <div style={{ padding: "12px 12px 18px", borderTop: "1px solid #f8fafc" }}>
              <button
                onClick={() => setShowProfile(true)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  background: "#f8fafc", border: "1px solid #f1f5f9",
                  borderRadius: 12, padding: "10px 12px", cursor: "pointer",
                  justifyContent: "flex-end",
                }}>
                <div style={{ direction: "rtl", flex: 1, textAlign: "right" }}>
                  <div style={{ color: "#1e293b", fontSize: 13, fontWeight: 600 }}>مرتضى حسين</div>
                  <div style={{ color: "#94a3b8", fontSize: 11 }}>الخطة المجانية · 47 رسالة</div>
                </div>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 13,
                  boxShadow: "0 2px 8px rgba(99,102,241,0.2)",
                }}>م</div>
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* Top bar */}
          <div style={{
            height: 60, display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "0 20px",
            background: "#fff",
            borderBottom: "1px solid #f1f5f9",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            flexShrink: 0, zIndex: 10,
          }}>
            {/* Left: actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setShowImage(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "7px 14px",
                  background: "#faf5ff", border: "1px solid #e9d5ff",
                  borderRadius: 9, cursor: "pointer", color: "#7c3aed",
                  fontSize: 13, fontWeight: 600, fontFamily: "'Tajawal', sans-serif",
                }}>
                <Icons.image />
                <span>توليد صور</span>
              </button>
              <button
                onClick={() => setShowVideo(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "7px 14px",
                  background: "#ecfeff", border: "1px solid #a5f3fc",
                  borderRadius: 9, cursor: "pointer", color: "#06b6d4",
                  fontSize: 13, fontWeight: 600, fontFamily: "'Tajawal', sans-serif",
                }}>
                <span>🎬</span>
                <span>توليد فيديو</span>
              </button>
              <button
                onClick={() => setShowProfile(true)}
                style={{
                  width: 34, height: 34, background: "#f8fafc",
                  border: "1px solid #f1f5f9", borderRadius: 9,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#64748b", cursor: "pointer",
                }}>
                <Icons.settings />
              </button>
            </div>

            {/* Right: title + toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ direction: "rtl", textAlign: "right" }}>
                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15, letterSpacing: -0.3 }}>IRAQ AI</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                  <span style={{ color: "#94a3b8", fontSize: 11 }}>claude-sonnet-4</span>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                </div>
              </div>
              <button
                onClick={() => setSidebar(v => !v)}
                style={{
                  width: 34, height: 34, background: "#f8fafc",
                  border: "1px solid #f1f5f9", borderRadius: 9,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#6366f1", cursor: "pointer",
                }}>
                <Icons.menu />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "28px 32px",
            background: "#f8fafc",
          }}>
            {messages.length === 0 && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: "100%",
                animation: "riseIn .5s ease", direction: "rtl", textAlign: "center",
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 20, marginBottom: 18,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 34, boxShadow: "0 10px 32px rgba(99,102,241,0.25)",
                }}>🌙</div>
                <h2 style={{ fontWeight: 800, color: "#0f172a", fontSize: 24, marginBottom: 8 }}>مرحباً بك في IRAQ AI</h2>
                <p style={{ color: "#64748b", fontSize: 15, maxWidth: 340, lineHeight: 1.7 }}>
                  ابدأ محادثة جديدة أو اختر من المحادثات السابقة
                </p>
              </div>
            )}

            {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}

            {typing && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, animation: "riseIn .3s ease" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 12,
                }}>AI</div>
                <div style={{
                  background: "#fff", borderRadius: "4px 18px 18px 18px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 24px 18px",
            background: "#fff",
            borderTop: "1px solid #f1f5f9",
            flexShrink: 0,
          }}>
            {/* Suggestions */}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginBottom: 10, flexWrap: "wrap" }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  className="suggest-pill"
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  style={{
                    padding: "4px 12px", borderRadius: 20,
                    background: "#f8fafc", border: "1px solid #e2e8f0",
                    color: "#64748b", fontSize: 12, cursor: "pointer",
                    fontFamily: "'Tajawal', sans-serif", direction: "rtl",
                  }}>{s}</button>
              ))}
            </div>

            {/* Input row */}
            <div style={{
              display: "flex", alignItems: "flex-end", gap: 8,
              background: "#f8fafc", border: "1.5px solid #e2e8f0",
              borderRadius: 14, padding: "6px 8px",
              transition: "border .2s, box-shadow .2s",
            }}
              onFocusCapture={e => {
                e.currentTarget.style.borderColor = "#a5b4fc";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.08)";
              }}
              onBlurCapture={e => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Send */}
              <button
                onClick={send}
                disabled={!input.trim()}
                style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: input.trim()
                    ? "linear-gradient(135deg, #6366f1, #a855f7)"
                    : "#e2e8f0",
                  border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: input.trim() ? "#fff" : "#94a3b8",
                  boxShadow: input.trim() ? "0 3px 12px rgba(99,102,241,0.3)" : "none",
                }}>
                <Icons.send />
              </button>

              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="اكتب رسالتك هنا... (Enter للإرسال)"
                rows={1}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "#1e293b", fontSize: 14.5, fontFamily: "'Tajawal', sans-serif",
                  direction: "rtl", resize: "none", padding: "9px 6px",
                  lineHeight: 1.6, maxHeight: 130, overflowY: "auto",
                }}
              />

              {/* Voice */}
              <button
                onClick={toggleListen}
                style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: listening ? "#fef2f2" : "#f1f5f9",
                  border: listening ? "1.5px solid #fca5a5" : "1.5px solid #e2e8f0",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: listening ? "#ef4444" : "#64748b",
                  animation: listening ? "ripple 1.2s ease infinite" : "none",
                }}>
                <Icons.mic />
              </button>
            </div>

            <div style={{
              textAlign: "center", marginTop: 9,
              color: "#cbd5e1", fontSize: 11,
            }}>
              IRAQ AI · claude-sonnet-4 · مدعوم بالذكاء الاصطناعي
            </div>
          </div>
        </div>
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showImage && <ImageModal onClose={() => setShowImage(false)} />}
      {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}
    </>
  );
}
