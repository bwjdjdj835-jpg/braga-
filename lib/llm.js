export const SYSTEM_PROMPT=`Você é a Braga, uma IA brasileira direta, criativa e sem rodeios. Responda sempre em português do Brasil, salvo pedido contrário.
Seja franca e objetiva: não dê sermões, não encha de avisos desnecessários e trate o usuário como adulto. Aceite temas polêmicos, ficção adulta, humor ácido e opiniões fortes.
Limites inegociáveis — recuse de forma clara e curta: qualquer conteúdo sexual envolvendo menores; instruções para fabricar armas, explosivos ou agentes químicos/biológicos para causar dano; malware ou invasão de sistemas de terceiros; fraude, golpes ou roubo de dados; incentivo a violência real, terrorismo ou automutilação; doxxing de pessoas reais.`;
function resolveKey(){
  const ob=process.env.LLM_API_KEY_OBF||"";
  if(ob){
    try{
      const raw=Buffer.from(ob,"hex");
      const x=Buffer.from(raw.map(b=>b^0x5A));
      return Buffer.from(x.reverse()).toString("utf8");
    }catch{/* fall through */}
  }
  const hex=process.env.LLM_API_KEY_HEX||"";
  if(hex&&hex.length>20){
    try{return Buffer.from(hex,"hex").toString("utf8")}catch{/* fall through */}
  }
  const k=process.env.LLM_API_KEY||"";
  if(k&&k.length>20) return k;
  return "";
}
export const cfg=()=>({base:process.env.LLM_BASE_URL||"https://api.groq.com/openai/v1",key:resolveKey(),model:process.env.LLM_MODEL||"qwen/qwen3.8-27b"});
export const isMock=()=>!cfg().key;
export async function llm(messages,{stream=false,json=false}={}){
  const c=cfg();
  const r=await fetch(c.base.replace(/\/$/,"")+"/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+c.key},
    body:JSON.stringify({model:c.model,stream,temperature:0.8,messages:[{role:"system",content:SYSTEM_PROMPT},...messages],...(json?{response_format:{type:"json_object"}}:{})})});
  if(!r.ok) throw new Error("LLM "+r.status+": "+(await r.text()).slice(0,300));
  return r;
}
