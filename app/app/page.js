"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Sphere from "@/components/Sphere";

const tools = [
  ["chat", "💬 Chat"],
  ["ebook", "📘 Gerador de e-book"],
  ["book", "📚 Gerador de livro", 1],
  ["site", "🌐 Gerador de sites", 1],
  ["webapp", "🧩 Gerador de web app", 1],
  ["apk", "🤖 Ajuda com APK", 1],
];

export default function App() {
  const [tool, setTool] = useState("chat");
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex h-[100dvh] min-h-0 flex-col gap-3 p-3 md:flex-row md:gap-5 md:p-5">
      <aside className="panel flex w-full shrink-0 flex-col gap-4 p-4 md:min-h-0 md:w-72 md:p-5">
        <div className="flex items-center justify-between gap-4 px-1">
          <Link href="/" className="text-2xl font-bold tracking-widest text-jarvis-300">BRAGA</Link>
          <div className="flex items-center gap-2 md:hidden">
            <Sphere active={busy} size={52} />
            <p className="text-xs text-sky-300/70">{busy ? "Processando..." : "Online"}</p>
          </div>
        </div>
        <nav className="flex gap-3 overflow-x-auto pb-1 md:flex-1 md:flex-col md:overflow-y-auto md:pb-0">
          {tools.map(([id, l, soon]) => (
            <button
              key={id}
              type="button"
              disabled={soon}
              onClick={() => setTool(id)}
              className={`nav-item shrink-0 md:w-full ${tool === id ? "glow bg-jarvis-700" : ""} ${soon ? "cursor-not-allowed opacity-50" : "hover:bg-jarvis-700"}`}
            >
              <span>{l}</span>
              {soon && <span className="rounded bg-amber-500/30 px-2 py-0.5 text-[10px] text-amber-200">em breve</span>}
            </button>
          ))}
        </nav>
        <div className="mt-2 hidden shrink-0 flex-col items-center gap-4 border-t border-sky-400/25 pt-6 md:flex">
          <Sphere active={busy} size={156} />
          <p className="text-xs tracking-wide text-sky-300/70">{busy ? "Processando..." : "Online"}</p>
        </div>
      </aside>
      <main className="panel flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 sm:p-6">
        {tool === "chat" ? <Chat setBusy={setBusy} /> : <Ebook setBusy={setBusy} />}
      </main>
    </div>
  );
}

function Chat({ setBusy }) {
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [load, setLoad] = useState(false);
  const end = useRef();
  useEffect(() => { end.current?.scrollIntoView(); }, [msgs]);
  async function send(e) {
    e.preventDefault();
    if (!inp.trim() || load) return;
    const m = [...msgs, { role: "user", content: inp }];
    setMsgs([...m, { role: "assistant", content: "" }]);
    setInp("");
    setLoad(true);
    setBusy(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ messages: m }) });
      const rd = r.body.getReader(), dec = new TextDecoder();
      let t = "";
      for (;;) {
        const { done, value } = await rd.read();
        if (done) break;
        t += dec.decode(value, { stream: true });
        setMsgs([...m, { role: "assistant", content: t }]);
      }
    } catch (err) {
      setMsgs([...m, { role: "assistant", content: "Erro: " + err.message }]);
    }
    setLoad(false);
    setBusy(false);
  }
  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <h2 className="shrink-0 text-xl font-bold text-jarvis-300">Chat com a Braga</h2>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto pr-1">
        {msgs.length === 0 && (
          <p className="m-auto max-w-md px-4 py-8 text-center leading-relaxed text-sky-300/70">
            Pergunte qualquer coisa. Eu sou direta.
          </p>
        )}
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 leading-relaxed ${m.role === "user" ? "ml-auto bg-sky-800/60" : "bg-jarvis-700/60 glow"}`}
          >
            {m.content || "…"}
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex shrink-0 items-center gap-3 border-t border-sky-400/20 pt-4">
        <input className="inp" value={inp} onChange={(e) => setInp(e.target.value)} placeholder="Digite sua mensagem..." />
        <button className="btn shrink-0" disabled={load}>Enviar</button>
      </form>
    </div>
  );
}

function drawCover(cv, b, back) {
  const c = cv.getContext("2d"), W = cv.width, H = cv.height;
  const g = c.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#020817");
  g.addColorStop(.6, "#0b1f45");
  g.addColorStop(1, "#0369a1");
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
  c.strokeStyle = "rgba(125,211,252,.6)";
  c.lineWidth = 4;
  c.strokeRect(30, 30, W - 60, H - 60);
  for (let i = 0; i < 60; i++) {
    c.fillStyle = `rgba(125,211,252,${Math.random() * .6})`;
    c.beginPath();
    c.arc(Math.random() * W, Math.random() * H, Math.random() * 3, 0, 7);
    c.fill();
  }
  const wrap = (t, y, size, max, col) => {
    c.font = `bold ${size}px sans-serif`;
    c.fillStyle = col;
    c.textAlign = "center";
    let line = "", ys = y;
    for (const w of t.split(" ")) {
      if (c.measureText(line + w).width > max) { c.fillText(line, W / 2, ys); line = ""; ys += size * 1.25; }
      line += w + " ";
    }
    c.fillText(line, W / 2, ys);
    return ys;
  };
  if (!back) {
    let y = wrap(b.title, H * .33, 54, W - 140, "#e0f2fe");
    wrap(b.subtitle || "", y + 70, 28, W - 160, "#7dd3fc");
    c.font = "26px sans-serif";
    c.fillStyle = "#bae6fd";
    c.fillText(b.author, W / 2, H - 90);
  } else {
    c.font = "22px sans-serif";
    c.fillStyle = "#e0f2fe";
    c.textAlign = "center";
    let line = "", y = 180;
    for (const w of (b.backCover || "").split(" ")) {
      if (c.measureText(line + w).width > W - 150) { c.fillText(line, W / 2, y); line = ""; y += 34; }
      line += w + " ";
    }
    c.fillText(line, W / 2, y);
    c.font = "bold 24px sans-serif";
    c.fillStyle = "#7dd3fc";
    c.fillText(b.title.slice(0, 40), W / 2, H - 110);
    c.font = "20px sans-serif";
    c.fillText("Gerado com Braga IA", W / 2, H - 75);
  }
}

function dl(href, name) {
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.click();
}

function Ebook({ setBusy }) {
  const [f, setF] = useState({ topic: "", audience: "", chapters: 3, author: "Bruno Ricardo" });
  const [b, setB] = useState(null);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState("");
  const front = useRef(), back = useRef();
  useEffect(() => { if (b) { drawCover(front.current, b); drawCover(back.current, b, true); } }, [b]);
  async function gen(e) {
    e.preventDefault();
    setLoad(true);
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/ebook", { method: "POST", body: JSON.stringify(f) });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setB(d);
    } catch (x) { setErr(x.message); }
    setLoad(false);
    setBusy(false);
  }
  const slug = () => b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
  const md = () => `# ${b.title}\n\n_${b.subtitle || ""}_\n\n**${b.author}**\n\n## Sumário\n${b.outline.map((o, i) => `${i + 1}. ${o}`).join("\n")}\n\n${b.chapters.map((c) => `## ${c.title}\n\n${c.content}`).join("\n\n")}\n\n---\n\n## Contracapa\n\n${b.backCover}\n`;
  async function pdf() {
    const { jsPDF } = await import("jspdf");
    const d = new jsPDF({ unit: "pt", format: "a4" });
    const W = d.internal.pageSize.getWidth(), H = d.internal.pageSize.getHeight(), M = 50;
    d.addImage(front.current.toDataURL("image/png"), "PNG", 0, 0, W, H);
    let y;
    const np = () => { d.addPage(); y = M; };
    const write = (t, size, bold) => {
      d.setFont("helvetica", bold ? "bold" : "normal");
      d.setFontSize(size);
      for (const l of d.splitTextToSize(t, W - 2 * M)) {
        if (y > H - M) np();
        d.text(l, M, y);
        y += size * 1.4;
      }
      y += size * .6;
    };
    np();
    write("Sumário", 20, 1);
    b.outline.forEach((o, i) => write(`${i + 1}. ${o}`, 12));
    for (const c of b.chapters) { np(); write(c.title, 18, 1); write(c.content, 12); }
    d.addPage();
    d.addImage(back.current.toDataURL("image/png"), "PNG", 0, 0, W, H);
    d.save(slug() + ".pdf");
  }
  return (
    <div className="h-full overflow-auto pr-1">
      <h2 className="mb-5 text-xl font-bold text-jarvis-300">Gerador de e-book</h2>
      <form onSubmit={gen} className="mb-6 grid gap-4 md:grid-cols-4">
        <input required className="inp" placeholder="Tema (ex.: finanças pessoais)" value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })} />
        <input className="inp" placeholder="Público (ex.: jovens de 18 a 25)" value={f.audience} onChange={(e) => setF({ ...f, audience: e.target.value })} />
        <input className="inp" type="number" min="1" max="12" value={f.chapters} onChange={(e) => setF({ ...f, chapters: e.target.value })} title="Capítulos" />
        <input className="inp" placeholder="Autor" value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} />
        <button className="btn md:col-span-4" disabled={load}>{load ? "Gerando..." : "Gerar e-book"}</button>
      </form>
      {err && <p className="mb-4 text-red-400">{err}</p>}
      {b && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn" onClick={pdf}>Baixar PDF</button>
            <button type="button" className="btn" onClick={() => dl(URL.createObjectURL(new Blob([md()], { type: "text/markdown" })), slug() + ".md")}>Baixar Markdown</button>
            <button type="button" className="btn" onClick={() => dl(front.current.toDataURL(), "capa.png")}>Capa PNG</button>
            <button type="button" className="btn" onClick={() => dl(back.current.toDataURL(), "contracapa.png")}>Contracapa PNG</button>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm">Capa</p>
              <canvas ref={front} width={600} height={850} className="glow w-60 rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm">Contracapa</p>
              <canvas ref={back} width={600} height={850} className="glow w-60 rounded-xl" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold">{b.title}</h3>
            <p className="text-sky-300">{b.subtitle}</p>
            <h4 className="mt-2 font-bold">Sumário</h4>
            <ol className="mb-2 ml-6 list-decimal space-y-1">{b.outline.map((o) => <li key={o}>{o}</li>)}</ol>
            {b.chapters.map((c) => (
              <section key={c.title} className="mt-2 flex flex-col gap-2">
                <h4 className="font-bold text-jarvis-300">{c.title}</h4>
                <p className="whitespace-pre-wrap leading-relaxed text-sky-100/90">{c.content}</p>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
