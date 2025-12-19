import { $ } from "./utils.js";

export function openModal(title, bodyHTML){
  $("#mTitle").textContent = title;
  $("#mBody").innerHTML = bodyHTML;
  $("#modal").classList.add("open");
}

export function closeModal(){
  $("#modal").classList.remove("open");
  $("#mBody").innerHTML = "";
}

export function initModal(){
  $("#mClose").onclick = closeModal;
  $("#modal").addEventListener("click", (e)=>{ if(e.target.id==="modal") closeModal(); });
  window.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeModal(); });
}
