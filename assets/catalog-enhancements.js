(() => {
"use strict";
const slug=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
document.addEventListener("click",e=>{
 const card=e.target.closest(".product-card");
 if(card&&!e.target.closest("button")&&!e.target.closest("a")){
 const link=card.querySelector("a.product-detail-link");if(link)location.href=link.href;
 }
});
function filterRequestedCategory(){
 const category=new URLSearchParams(location.search).get("category");if(!category)return;
 const sections=[...document.querySelectorAll(".cat-section")];if(!sections.length)return;
 sections.forEach(s=>s.style.display=s.dataset.cat===category?"":"none");
 const chips=[...document.querySelectorAll(".chip")];chips.forEach(c=>c.classList.toggle("active",c.dataset.filter===category));
 const title=sections.find(s=>s.dataset.cat===category);if(title){const banner=document.querySelector(".page-banner h1");if(banner)banner.textContent=title.querySelector("h2")?.textContent||"Collection";}
}
const observer=new MutationObserver(filterRequestedCategory);observer.observe(document.body,{childList:true,subtree:true});filterRequestedCategory();
})();