(() => {
"use strict";
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug = s => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const money = n => "₹" + Number(n || 0).toLocaleString("en-IN",{maximumFractionDigits:2});
function parseCSV(text){
 const rows=[];let row=[],cell="",quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else quoted=false;}else cell+=c;}
 else if(c==='"')quoted=true;else if(c===","){row.push(cell);cell="";}else if(c==="\n"||c==="\r"){if(c==="\r"&&text[i+1]==="\n")i++;row.push(cell);rows.push(row);row=[];cell="";}else cell+=c;}
 if(cell||row.length){row.push(cell);rows.push(row);}return rows;
}
function load(){
 return fetch("products-template.csv",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error();return r.text();}).then(text=>{
 const rows=parseCSV(text.replace(/^\uFEFF/,""));if(rows.length<2)return [];
 const heads=rows[0].map(x=>x.trim().toLowerCase().replace(/\s+/g,"_"));
 return rows.slice(1).map(row=>{const get=k=>{const i=heads.indexOf(k);return i<0?"":String(row[i]||"").trim();};
 const imgs=(get("images")||get("image")).split(/[|;]/).map(x=>x.trim()).filter(Boolean);
 return {id:get("product_id")||slug(get("name")),category:get("category"),name:get("name"),description:get("long_description")||get("description"),price:Number(get("price"))||0,basePrice:Number(get("base_price"))||Number(get("price"))||0,pricePerInch:Number(get("price_per_inch"))||0,pricingUnit:get("pricing_unit")||"fixed",minInches:Number(get("min_inches"))||1,maxInches:Number(get("max_inches"))||12,dimensions:get("dimensions"),material:get("material"),finish:get("finish"),care:get("care_instructions"),shipping:get("shipping_info"),returns:get("return_policy"),images:imgs,active:!/^(no|n|false|0|hidden)$/i.test(get("active"))};
 }).filter(p=>p.name&&p.active);
 });
}
function imageURL(v){v=String(v||"").trim();return /^https?:\/\//i.test(v)?v:"images/"+v.replace(/^\/+/, "");}
function render(p,all){
 $("#productTitle").textContent=p.name;$("#productSubtitle").textContent=p.category||"Thoughtfully designed. Precisely made.";
 const pics=[...new Set(p.images.map(imageURL))];
 const hasPics=pics.length>0;
 $("#productDetail").innerHTML='<div class="product-breadcrumb"><a href="index.html">Home</a> / <a href="collections.html?category='+encodeURIComponent(slug(p.category))+'">'+esc(p.category)+'</a> / <span>'+esc(p.name)+'</span></div><div class="product-detail-layout"><div class="detail-gallery"><div class="detail-main-image" id="detailMain">'+(hasPics?'<img id="mainProductImage" src="'+esc(pics[0])+'" alt="'+esc(p.name)+'">':'<div class="detail-image-placeholder">Images coming soon</div>')+'</div>'+(pics.length>1?'<div class="detail-thumbnails">'+pics.map((src,i)=>'<button class="detail-thumb '+(!i?'active':'')+'" data-src="'+esc(src)+'" aria-label="View image '+(i+1)+'"><img src="'+esc(src)+'" alt=""></button>').join("")+'</div>':'')+'</div><div class="detail-copy"><div class="eyebrow" style="color:#9b7449">'+esc(p.category)+'</div><h1>'+esc(p.name)+'</h1><div class="detail-price" id="detailPrice">'+money(p.basePrice)+'</div><p class="detail-description">'+esc(p.description||"Thoughtfully designed 3D printed product.")+'</p>'+(p.dimensions?'<p class="detail-meta"><strong>Dimensions</strong> '+esc(p.dimensions)+'</p>':'')+(p.material?'<p class="detail-meta"><strong>Material</strong> '+esc(p.material)+'</p>':'')+(p.finish?'<p class="detail-meta"><strong>Finish</strong> '+esc(p.finish)+'</p>':'')+(true?'<div class="size-choice"><label>Choose size</label><div class="size-preset-grid">'+[1,2,3,4,5,6,7,8,9,10].map(n=>'<button type="button" class="size-preset '+(n===1?'active':'')+'" data-size="'+n+'">'+n+'″</button>').join('')+'<button type="button" class="size-preset size-custom" data-size="custom">Custom</button></div><div class="custom-size-wrap" id="customSizeWrap" hidden><label for="productSize">Custom size (inches)</label><input id="productSize" type="number" min="1" max="12" step="1" placeholder="Enter size"></div><p class="detail-note" id="sizePriceNote">Price adjusts to the selected size.</p></div>':'')+'<div class="detail-actions detail-primary-actions"><button class="btn btn-dark add-btn" id="detailAddCart" data-add="'+esc(p.name)+'" data-price="'+p.basePrice+'">Add to Cart</button><button class="btn btn-primary product-buy-now" id="detailBuyNow" data-buy-now="'+esc(p.name)+'" data-price="'+p.basePrice+'">Buy Now ↗</button></div><button class="detail-enquire-link" id="enquireProduct">Ask a question on WhatsApp ↗</button><p class="detail-note">Availability, custom dimensions and delivery charges are confirmed by our team.</p></div></div><div class="product-extra-details"><section class="product-extra-block"><h3>Care instructions</h3><p>'+esc(p.care||"Handle with care. Keep away from excessive heat and clean gently with a soft, dry cloth.")+'</p></section><section class="product-extra-block"><h3>Production & shipping</h3><p>'+esc(p.shipping||"Estimated delivery: 7–10 days. Delivery time may vary depending on your area and location.")+'</p></section><section class="product-extra-block"><h3>Returns & exchange</h3><p>'+esc(p.returns||"Please contact our team before placing an order to confirm the applicable return or exchange terms for this product.")+'</p></section><section class="product-extra-block"><h3>Need help?</h3><p>Ask us about product details, customisation or delivery.</p><p><a href="mailto:itsshailesh0414@gmail.com">itsshailesh0414@gmail.com</a> · <a href="https://wa.me/918948681254" target="_blank" rel="noopener">WhatsApp: +91 89486 81254</a></p></section></div></div>';
 let selectedSize=1;let isCustomSize=false;
 const updatePrice=()=>{
   const size=$("#productSize"), priceEl=$("#detailPrice"), add=$("#detailAddCart"), buy=$("#detailBuyNow");
   if(isCustomSize){
     const raw=Number(size?.value);
     if(!size||!size.value||!Number.isFinite(raw)||raw<1||raw>12){priceEl.textContent="Enter 1–12 inches";if(add){add.dataset.price="";add.dataset.add=p.name+" (custom size)";}if(buy){buy.dataset.price="";buy.dataset.buyNow=p.name+" (custom size)";}$("#sizePriceNote").textContent="Choose a whole-number size from 1 to 12 inches.";return null;}
     selectedSize=Math.round(raw);size.value=String(selectedSize);
     const customPrice=p.basePrice+Math.max(0,selectedSize-1)*(p.pricePerInch||120);
     priceEl.textContent=money(customPrice);
     if(add){add.dataset.price=String(customPrice);add.dataset.add=p.name+" ("+selectedSize+" inch)";}
     if(buy){buy.dataset.price=String(customPrice);buy.dataset.buyNow=p.name+" ("+selectedSize+" inch)";}
     $("#sizePriceNote").textContent=selectedSize+" inch · "+money(p.basePrice)+" base + "+money(Math.max(0,selectedSize-1)*(p.pricePerInch||120))+" size adjustment.";
     return customPrice;
   }
   const perInch=p.pricePerInch||120;
   const price=p.basePrice+Math.max(0,selectedSize-1)*perInch;
   priceEl.textContent=money(price);
   if(add){add.dataset.price=String(price);add.dataset.add=p.name+" ("+selectedSize+" inch)";}if(buy){buy.dataset.price=String(price);buy.dataset.buyNow=p.name+" ("+selectedSize+" inch)";}
   $("#sizePriceNote").textContent="1 inch = ₹500; each additional inch adds ₹120.";
   return price;
 };
 $("#productSize")?.addEventListener("input",updatePrice);
 document.querySelectorAll(".size-preset").forEach(b=>b.addEventListener("click",()=>{
   document.querySelectorAll(".size-preset").forEach(x=>x.classList.toggle("active",x===b));
   isCustomSize=b.dataset.size==="custom";
   $("#customSizeWrap").hidden=!isCustomSize;
   if(isCustomSize){$("#productSize").focus();updatePrice();}
   else{selectedSize=Number(b.dataset.size);updatePrice();}
 }));
if($("#productSize")){$("#productSize").addEventListener("input",updatePrice);$("#productSize").addEventListener("change",updatePrice);}

 document.addEventListener("click",e=>{const b=e.target.closest(".detail-thumb");if(!b)return;const im=$("#mainProductImage");if(im){im.src=b.dataset.src;document.querySelectorAll(".detail-thumb").forEach(x=>x.classList.toggle("active",x===b));}});
 $("#enquireProduct").addEventListener("click",()=>{const size=$("#productSize");const price=updatePrice();const details=size?"Size: "+size.value+" inches\nCalculated price: "+money(price):"Listed price: "+money(price);const msg="Hello PROTOFLOW 3D, I'm interested in "+p.name+".\n"+details+"\nPlease confirm availability and delivery.";window.open("https://wa.me/918948681254?text="+encodeURIComponent(msg),"_blank","noopener");});
 const rec=all.filter(x=>x.id!==p.id).filter(x=>x.category===p.category||x.images.length).slice(0,4);
 $("#recommendedGrid").innerHTML=rec.length?rec.map(x=>'<a class="product-card product-detail-link" href="product.html?id='+encodeURIComponent(x.id)+'"><div class="product-image">'+(x.images.length?'<img src="'+esc(imageURL(x.images[0]))+'" alt="'+esc(x.name)+'" onerror="this.style.display=\'none\'">':'<div class="product-fallback">IMAGES COMING SOON</div>')+'</div><div class="product-info"><div><h3>'+esc(x.name)+'</h3><p>'+esc(x.description)+'</p></div><span class="price">'+money(x.basePrice)+'</span></div></a>').join(""):Array(4).fill('<div class="product-card recommendation-placeholder"><div class="product-image"><div class="product-fallback">NEW DESIGN<br>COMING SOON</div></div><div class="product-info"><div><h3>Coming soon</h3><p>We are preparing another design for this collection.</p></div><span class="price">To be announced</span></div></div>').join("");
}
const params=new URLSearchParams(location.search);
const id=slug(params.get("id")||"");
const requestedName=params.get("name")||"";
load().then(all=>{const p=all.find(x=>slug(x.id)===slug(id)||slug(x.name)===slug(id))||all.find(x=>requestedName&&slug(x.name)===slug(requestedName));if(!p){$("#productDetail").innerHTML='<div class="empty-state"><h2>Product coming soon</h2><p>This product is not available yet.</p><a class="btn btn-dark" href="collections.html">Browse collections</a></div>';return;}render(p,all);}).catch(()=>{$("#productDetail").innerHTML='<div class="empty-state"><h2>Product details coming soon</h2><p>Our catalogue will be available here shortly.</p><a class="btn btn-dark" href="collections.html">Browse collections</a></div>';});
})();