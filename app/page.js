import Link from "next/link";

const plans = [
  ["Grátis", "R$ 0", "20 mensagens/dia", "1 e-book demo"],
  ["Pro", "R$ 29,90/mês", "Chat ilimitado", "E-books ilimitados com PDF", "Capas em PNG"],
  ["Criador", "R$ 59,90/mês", "Tudo do Pro", "Gerador de livros, sites e web apps (em breve)", "Ajuda com APK (em breve)"],
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <nav className="mb-14 flex items-center justify-between gap-6 sm:mb-20">
        <b className="text-2xl tracking-widest text-jarvis-300">BRAGA</b>
        <Link href="/app" className="btn">Abrir a Braga</Link>
      </nav>
      <h1 className="mb-5 text-4xl font-bold leading-tight sm:text-5xl">
        A IA brasileira que <span className="text-jarvis-400">cria com você</span>.
      </h1>
      <p className="mb-10 max-w-2xl text-lg leading-relaxed text-sky-200/80">
        Converse sem enrolação, gere e-books completos com capa e contracapa, e em breve crie livros, sites, web apps e APKs.
      </p>
      <Link href="/app" className="btn text-lg">Começar agora</Link>
      <h2 className="mb-3 mt-20 text-3xl font-bold sm:mt-24">Planos</h2>
      <p className="mb-8 text-sm text-amber-300">
        ⚠️ Página de demonstração: os pagamentos ainda não estão ativos. Nenhuma cobrança é feita.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map(([n, p, ...f]) => (
          <div key={n} className="panel glow flex flex-col p-6 sm:p-7">
            <h3 className="text-xl font-bold text-jarvis-300">{n}</h3>
            <p className="my-4 text-3xl font-bold">{p}</p>
            <ul className="mb-6 space-y-2 text-sm">
              {f.map((x) => <li key={x}>✓ {x}</li>)}
            </ul>
            <button disabled className="btn mt-auto w-full">Assinar (em breve)</button>
          </div>
        ))}
      </div>
    </main>
  );
}
