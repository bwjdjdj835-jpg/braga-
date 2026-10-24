import Link from "next/link";
const plans=[["Grátis","R$ 0","20 mensagens/dia","1 e-book demo"],["Pro","R$ 29,90/mês","Chat ilimitado","E-books ilimitados com PDF","Capas em PNG"],["Criador","R$ 59,90/mês","Tudo do Pro","Gerador de livros, sites e web apps (em breve)","Ajuda com APK (em breve)"]];
export default function Home(){return <main className="max-w-5xl mx-auto px-6 py-14">
  <nav className="flex justify-between items-center mb-16"><b className="text-2xl text-jarvis-300 tracking-widest">BRAGA</b><Link href="/app" className="btn">Abrir a Braga</Link></nav>
  <h1 className="text-5xl font-bold mb-4">A IA brasileira que <span className="text-jarvis-400">cria com você</span>.</h1>
  <p className="text-lg text-sky-200/80 mb-8 max-w-2xl">Converse sem enrolação, gere e-books completos com capa e contracapa, e em breve crie livros, sites, web apps e APKs.</p>
  <Link href="/app" className="btn text-lg">Começar agora</Link>
  <h2 className="text-3xl font-bold mt-20 mb-2">Planos</h2>
  <p className="mb-6 text-amber-300 text-sm">⚠️ Página de demonstração: os pagamentos ainda não estão ativos. Nenhuma cobrança é feita.</p>
  <div className="grid md:grid-cols-3 gap-5">{plans.map(([n,p,...f])=><div key={n} className="panel p-6 glow"><h3 className="text-xl font-bold text-jarvis-300">{n}</h3><p className="text-3xl font-bold my-3">{p}</p><ul className="space-y-1 text-sm mb-5">{f.map(x=><li key={x}>✓ {x}</li>)}</ul><button disabled className="btn w-full">Assinar (em breve)</button></div>)}</div>
</main>}
