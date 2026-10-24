"use client";
import {useEffect,useRef} from "react";
export default function Sphere({active,size=220}){
  const ref=useRef(),act=useRef(active);act.current=active;
  useEffect(()=>{const cv=ref.current,ctx=cv.getContext("2d");const N=420,pts=[];
    for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),t=i*2.39996;pts.push([Math.cos(t)*r,y,Math.sin(t)*r]);}
    let a=0,raf,e=0;const draw=()=>{e+=((act.current?1:0)-e)*.06;a+=.004+e*.02;const W=cv.width,R=W*.32*(1+e*.08*Math.sin(Date.now()/120));
      ctx.clearRect(0,0,W,W);const g=ctx.createRadialGradient(W/2,W/2,0,W/2,W/2,W/2);g.addColorStop(0,`rgba(56,189,248,${.25+e*.3})`);g.addColorStop(1,"rgba(2,8,23,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,W);
      for(const[x,y,z]of pts){const X=x*Math.cos(a)-z*Math.sin(a),Z=x*Math.sin(a)+z*Math.cos(a),j=1+e*.06*Math.sin(Date.now()/90+y*9);
        const s=(Z+2)/3;ctx.fillStyle=`rgba(125,211,252,${.25+.75*s})`;ctx.beginPath();ctx.arc(W/2+X*R*j,W/2+y*R*j,1.6*s+e,0,7);ctx.fill();}
      raf=requestAnimationFrame(draw)};draw();return()=>cancelAnimationFrame(raf);},[]);
  return <canvas ref={ref} width={size*2} height={size*2} style={{width:size,height:size}}/>;
}
