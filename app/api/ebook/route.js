import {llm,isMock} from "@/lib/llm";
export async function POST(req){
  const {topic="",audience="",chapters=3,author="Braga IA"}=await req.json();
  const n=Math.min(Math.max(+chapters||3,1),12);
  if(isMock()){
    const chs=Array.from({length:n},(_,i)=>({title:`Capítulo ${i+1}: ${["Os fundamentos","Primeiros passos","Indo além","Erros comuns","Estratégias avançadas","Casos reais","Ferramentas","Mentalidade","Plano de ação","Escalando","Mantendo o ritmo","Conclusão"][i]} de ${topic}`,
      content:`[MODO DEMO] Este é um texto simulado do capítulo ${i+1} sobre "${topic}", escrito para ${audience||"o leitor"}.\n\nAqui a Braga vai desenvolver o assunto com exemplos práticos, explicações claras e dicas acionáveis. Com a chave de API configurada, cada capítulo terá conteúdo real e completo gerado pelo modelo Llama.\n\nPontos-chave:\n- Entender o porquê antes do como.\n- Praticar um pouco todos os dias.\n- Medir resultados e ajustar.`}));
    return Response.json({mock:true,title:`O Guia Definitivo de ${topic}`,subtitle:`Para ${audience||"todos"}`,author,outline:chs.map(c=>c.title),chapters:chs,
      backCover:`Descubra tudo sobre ${topic} de forma direta e prática. Escrito para ${audience||"você"}, este e-book reúne ${n} capítulos com o que realmente importa. (texto de demonstração)`});
  }
  try{
    const prompt=`Crie um e-book em português do Brasil. Tema: "${topic}". Público: "${audience}". Número de capítulos: ${n}. Autor: "${author}".
Responda APENAS com JSON no formato: {"title":"","subtitle":"","outline":["..."],"chapters":[{"title":"","content":"texto do capítulo com 4 a 6 parágrafos"}],"backCover":"sinopse de contracapa com 60-90 palavras"}`;
    const r=await llm([{role:"user",content:prompt}],{json:true});
    const j=await r.json();const d=JSON.parse(j.choices[0].message.content);
    return Response.json({...d,author});
  }catch(e){return Response.json({error:e.message},{status:500});}
}
