import {llm,isMock} from "@/lib/llm";
export const runtime="edge";
const enc=new TextEncoder();
export async function POST(req){
  const {messages=[]}=await req.json();
  if(isMock()){
    const last=messages.at(-1)?.content||"";
    const txt=`[MODO DEMO] Oi! Eu sou a Braga. Ainda não tenho uma chave de API configurada (LLM_API_KEY), então esta é uma resposta simulada.\n\nVocê disse: "${last.slice(0,200)}"\n\nQuando a chave do Groq (Llama) for configurada, eu respondo de verdade, com streaming, direto e sem enrolação.`;
    return new Response(new ReadableStream({async start(c){for(const w of txt.split(/(\s+)/)){c.enqueue(enc.encode(w));await new Promise(r=>setTimeout(r,25));}c.close();}}),{headers:{"Content-Type":"text/plain; charset=utf-8"}});
  }
  try{
    const r=await llm(messages.slice(-20),{stream:true});
    const dec=new TextDecoder();let buf="";
    const out=r.body.pipeThrough(new TransformStream({transform(chunk,c){buf+=dec.decode(chunk,{stream:true});const lines=buf.split("\n");buf=lines.pop();
      for(const l of lines){const d=l.replace(/^data:\s*/,"").trim();if(!d||d==="[DONE]")continue;try{const t=JSON.parse(d).choices?.[0]?.delta?.content;if(t)c.enqueue(enc.encode(t));}catch{}}}}));
    return new Response(out,{headers:{"Content-Type":"text/plain; charset=utf-8"}});
  }catch(e){return new Response("Erro: "+e.message,{status:500});}
}
