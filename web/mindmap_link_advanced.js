import { app } from "../../../scripts/app.js";

console.log("MindMap 2.9.3 loaded");

/* CSS */

function loadMindMapCSS(){

if(document.getElementById("mindmap-css")) return;

const link = document.createElement("link");

link.id = "mindmap-css";
link.rel = "stylesheet";
link.href = "/extensions/comfyui_mindmap/mindmap_style.css?v=2.9.3";

document.head.appendChild(link);

}

loadMindMapCSS();

/* preview */

function closePreview(){

if(window.__mindmapPreview){
window.__mindmapPreview.remove();
window.__mindmapPreview=null;
}

}

function createPreview(data){

closePreview();

const div=document.createElement("div");

div.className="mindmap-preview";

div.style.left="50%";
div.style.top="50%";

/* ЕТАП 1 — взяти поточний scale canvas */

const canvasScale = app.canvas.ds.scale;

div.style.transform=`translate(-50%,-50%) scale(${canvasScale})`;
div.style.transformOrigin="center";

const img=document.createElement("img");

img.src=data.image || "/extensions/comfyui_mindmap/noimage.svg";

img.onerror=()=>{
img.src="/extensions/comfyui_mindmap/noimage.svg";
};

div.appendChild(img);

const title=document.createElement("div");
title.className="mindmap-title";
title.textContent=data.title || "";
div.appendChild(title);

const desc=document.createElement("div");
desc.className="mindmap-desc";
desc.textContent=data.description || "";
div.appendChild(desc);

document.body.appendChild(div);

window.__mindmapPreview=div;

/* ЕТАП 2 — синхронізація при zoom */

if(!window.__mindmapPreviewWheelHook){

app.canvas.canvas.addEventListener("wheel", ()=>{

if(!window.__mindmapPreview) return;

const s = app.canvas.ds.scale;

window.__mindmapPreview.style.transform =
`translate(-50%,-50%) scale(${s})`;

},{passive:true});

window.__mindmapPreviewWheelHook = true;

}


setTimeout(()=>{
document.addEventListener("click",closePreview,{once:true});
},10);

}

/* fetch */

async function fetchPreview(url){

const r=await fetch(
"/mindmap/preview?url="+encodeURIComponent(url)
);

return await r.json();

}

/* PREFETCH */

async function prefetchPreview(url){

try{

await fetch(
"/mindmap/preview?url="+encodeURIComponent(url)
);

}catch(e){}

}

/* FLEX BUTTON ROW */

function addButtonRow(node,buttons,type){

const row=document.createElement("div");

/* CSS клас */

row.className = type === "advanced"
? "mindmap-toolbar-advanced"
: "mindmap-toolbar-lite";

/* flex layout */

row.style.display="flex";
row.style.gap="6px";

buttons.forEach(btnData=>{

const btn=document.createElement("button");

btn.className="comfyui-button";
btn.textContent=btnData.label;

btn.style.flex="1";
btn.style.height="20px";
btn.style.padding="0 6px";
btn.style.whiteSpace="nowrap";

btn.onclick=btnData.action;

row.appendChild(btn);

});

/* DOM widget */

const widget=node.addDOMWidget("mindmap_toolbar","",row);

widget.computeSize=()=>[null,26];

if(node.size[0] < 230){
node.size[0] = 230;
}

if(node.size[1] < 111){
node.size[1] = 111;
}

}

/* ADVANCED */

app.registerExtension({

name:"MindMap.LinkNodeAdvanced",

async beforeRegisterNodeDef(nodeType,nodeData){

if(nodeData.name!=="MindMapLinkNodeAdvanced") return;

const orig=nodeType.prototype.onNodeCreated;

nodeType.prototype.onNodeCreated=function(){

orig?.apply(this,arguments);

const node=this;

node.min_size = [260, node.size[1]];

node.onResize = function(size){
if(size[0] < 260) size[0] = 260;
};

node.size[0] = Math.max(node.size[0],260);

const url=node.widgets.find(w=>w.name==="url")?.value;

if(url){

setTimeout(()=>{
prefetchPreview(url);
},500);

}

addButtonRow(node,[

{
label:"🔗 Open",
action:()=>{

const url=node.widgets.find(w=>w.name==="url")?.value;
if(url) window.open(url,"_blank");

}
},

{
label:"📋 Copy",
action:()=>{

const url=node.widgets.find(w=>w.name==="url")?.value;
if(url) navigator.clipboard.writeText(url);

}
},

{
label:"🌐 Preview",
action:async()=>{

const url=node.widgets.find(w=>w.name==="url")?.value;
if(!url) return;

createPreview({
title:"Please wait",
description:"Content loading..."
});

try{

const data=await fetchPreview(url);
createPreview(data);

}catch(e){

createPreview({
title:"Preview error",
description:String(e)
});

}

}
}

],"advanced");

};

}

});

/* LITE */

app.registerExtension({

name:"MindMap.LinkNodeLite",

async beforeRegisterNodeDef(nodeType,nodeData){

if(nodeData.name!=="MindMapLinkNodeLite") return;

const orig=nodeType.prototype.onNodeCreated;

nodeType.prototype.onNodeCreated=function(){

orig?.apply(this,arguments);

const node=this;

node.min_size = [200, node.size[1]];

node.onResize = function(size){
if(size[0] < 200) size[0] = 200;
};

node.size[0] = Math.max(node.size[0],200);

const url=node.widgets.find(w=>w.name==="url")?.value;

if(url){

setTimeout(()=>{
prefetchPreview(url);
},500);

}

addButtonRow(node,[

{
label:"🔗 Open",
action:()=>{

const url=node.widgets.find(w=>w.name==="url")?.value;
if(url) window.open(url,"_blank");

}
},

{
label:"🌐 Preview",
action:async()=>{

const url=node.widgets.find(w=>w.name==="url")?.value;
if(!url) return;

createPreview({
title:"Please wait",
description:"Content loading..."
});

try{

const data=await fetchPreview(url);
createPreview(data);

}catch(e){

createPreview({
title:"Preview error",
description:String(e)
});

}

}
}

],"lite");

};

}

});