(() => {
  "use strict";

  /* =====================================================================
     SETTINGS — change these in ONE place, they apply to every page
     ===================================================================== */
  const CONFIG = {
    businessEmail: "itsshailesh0414@gmail.com",   // your real email
    whatsappNumber: "918948681254",           // country code 91 + number, no + or spaces
    sheetCsvUrl: ""                           // Google Sheet "Publish to web" CSV link (optional)
  };

  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const PAGE = document.body.dataset.page || "home";
  const money = n => "₹" + Number(n).toLocaleString("en-IN");
  const escapeHTML = v => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const waLink = text => "https://wa.me/" + CONFIG.whatsappNumber + (text ? "?text=" + encodeURIComponent(text) : "");

  /* =====================================================================
     HEADER, FOOTER, CART, POPUP — written once, shown on every page
     ===================================================================== */
  const NAV = [
    ["home", "index.html", "Home"],
    ["collections", "collections.html", "Collection"],
    ["about", "about.html", "About Us"],
    ["contact", "contact.html", "Contact Us"]
  ];
  const logo = '<span class="brand-mark"></span><span>PROTOFLOW <span>3D</span></span>';

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="site-header">
      <div class="container navbar">
        <a class="brand" href="index.html" aria-label="PROTOFLOW 3D home">${logo}</a>
        <nav class="nav-links" id="navLinks" aria-label="Main navigation">
          <a href="index.html"${PAGE === "home" ? ' class="active" aria-current="page"' : ""}>Home</a>
          <div class="nav-dropdown">
            <a href="collections.html"${PAGE === "collections" ? ' class="active" aria-current="page"' : ""}>Collection</a>
            <button class="nav-dropdown-toggle" id="collectionsToggle" aria-label="Open collection categories" aria-expanded="false" aria-controls="collectionsMenu"></button>
            <div class="nav-dropdown-menu" id="collectionsMenu">
              <a href="divine-creations.html">Divine Creations</a>
              <a href="home-decor.html">Home Decor</a>
              <a href="miniatures-collectibles.html">Miniatures &amp; Collectibles</a>
              <a href="functional-utility.html">Functional &amp; Utility</a>
              <a href="gifts-personalised.html">Gifts &amp; Personalised</a>
            </div>
          </div>
          <a href="about.html"${PAGE === "about" ? ' class="active" aria-current="page"' : ""}>About Us</a>
          <a href="contact.html"${PAGE === "contact" ? ' class="active" aria-current="page"' : ""}>Contact Us</a>
        </nav>
        <div class="nav-actions">
          <a class="icon-btn" id="searchLink" href="collections.html?search=1" aria-label="Search products"><svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4 4"/></svg></a>
          <button class="icon-btn" id="cartButton" aria-label="Shopping cart"><svg viewBox="0 0 24 24"><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span class="count" id="cartCount">0</span></button>
          <button class="icon-btn menu-toggle" id="menuToggle" aria-label="Toggle navigation" aria-expanded="false"><svg viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></svg></button>
        </div>
      </div>
    </header>`);

  document.body.insertAdjacentHTML("beforeend", `
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <a class="brand" href="index.html">${logo}</a>
            <p>Thoughtful design, modern 3D printing and objects that bring a little more character to everyday spaces.</p>
          </div>
          <div class="footer-col"><h4>Explore</h4><a href="index.html">Home</a><a href="collections.html">Collections</a><a href="about.html">About us</a><a href="contact.html">Custom orders</a></div>
          <div class="footer-col"><h4>Customer care</h4><a href="contact.html">Contact us</a><a data-wa="Hello PROTOFLOW 3D, I have a question.">Order on WhatsApp</a></div>
          <div class="footer-col"><h4>Get in touch</h4><a data-mail>Email us</a><a data-wa="Hello PROTOFLOW 3D, I have a question.">WhatsApp</a></div>
        </div>
        <div class="footer-bottom"><span>© ${new Date().getFullYear()} PROTOFLOW 3D. All rights reserved.</span><span>Designed with care. Created with precision.</span></div>
      </div>
    </footer>

    <div class="overlay" id="overlay"></div>
    <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping cart" aria-hidden="true">
      <div class="drawer-head"><h2>Your cart</h2><button class="close-btn" id="closeCart" aria-label="Close cart">×</button></div>
      <div class="cart-items" id="cartItems"></div>
      <div class="cart-footer">
        <div class="cart-total"><span>Subtotal</span><span id="cartTotal">₹0</span></div>
        <button class="btn btn-dark" style="width:100%" id="checkoutButton">Order on WhatsApp →</button>
        <p class="cart-note">Your order is sent to us on WhatsApp. We will confirm availability, delivery charges and payment details with you there.</p>
      </div>
    </aside>
    <div class="modal" id="infoModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <button class="close-btn" id="closeModal" aria-label="Close dialog">×</button>
      <div class="eyebrow" style="color:#9b7449">PROTOFLOW 3D</div>
      <h2 id="modalTitle">Product details</h2>
      <p id="modalText"></p>
      <div class="modal-actions" id="modalActions"></div>
    </div>
    <div class="toast" id="toast" role="status"></div>`);

  // links that depend on settings
  $$("[data-wa]").forEach(a => { a.href = waLink(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-mail]").forEach(a => { a.href = "mailto:" + CONFIG.businessEmail; });

  // Mobile menu and Collections dropdown
  $("#menuToggle").addEventListener("click", () => {
    const nav = $("#navLinks");
    nav.classList.toggle("open");
    $("#menuToggle").setAttribute("aria-expanded", String(nav.classList.contains("open")));
  });
  // Home selected from the header should skip only the intro animation for this navigation.
  // A normal browser reload still plays the intro as before.
  const headerHomeLink = $("#navLinks a[href=\"index.html\"]");
  if (headerHomeLink) {
    headerHomeLink.addEventListener("click", () => {
      try { sessionStorage.setItem("pfSkipIntroOnce", "1"); } catch (e) {}
    });
  }
  const collectionsToggle = $("#collectionsToggle");
  const collectionsMenu = $("#collectionsMenu");
  if (collectionsToggle && collectionsMenu) {
    collectionsToggle.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      const open = !collectionsMenu.classList.contains("open");
      collectionsMenu.classList.toggle("open", open);
      collectionsToggle.setAttribute("aria-expanded", String(open));
    });
    collectionsMenu.addEventListener("click", e => e.stopPropagation());
    document.addEventListener("click", e => {
      if (!e.target.closest(".nav-dropdown")) {
        collectionsMenu.classList.remove("open");
        collectionsToggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        collectionsMenu.classList.remove("open");
        collectionsToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- toast + popup ---------- */
  let toastTimer;
  function toast(msg){
    const el = $("#toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }
  function openModal(title, message, actions = []){
    $("#modalTitle").textContent = title;
    $("#modalText").textContent = message;
    $("#modalActions").replaceChildren();
    actions.forEach(a => {
      const b = document.createElement("button");
      b.className = "btn " + (a.primary ? "btn-dark" : "btn-outline");
      b.textContent = a.label;
      b.addEventListener("click", a.run);
      $("#modalActions").append(b);
    });
    $("#overlay").classList.add("open");
    $("#infoModal").classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closePanels(){
    $("#overlay").classList.remove("open");
    $("#cartDrawer").classList.remove("open");
    $("#cartDrawer").setAttribute("aria-hidden", "true");
    $("#infoModal").classList.remove("open");
    document.body.style.overflow = "";
  }
  $("#closeModal").addEventListener("click", closePanels);
  $("#overlay").addEventListener("click", closePanels);
  $("#closeCart").addEventListener("click", closePanels);

  /* =====================================================================
     CART — saved in the browser, shared between all pages, ordered on WhatsApp
     ===================================================================== */
  const cart = [];
  const emptyCart = '<p style="font-size:12px;color:#88745e;padding:20px 0">Your cart is waiting for something special.</p>';

  function saveCart(){ try { localStorage.setItem("protoflowCart", JSON.stringify(cart)); } catch(e){} }
  function loadCart(){
    try {
      const saved = JSON.parse(localStorage.getItem("protoflowCart") || "[]");
      if (Array.isArray(saved)) saved.forEach(i => {
        if (i && i.name && i.price >= 0 && i.qty > 0) cart.push({name:String(i.name), price:Number(i.price), qty:Number(i.qty)});
      });
    } catch(e){}
  }
  function addToCart(name, price){
    const ex = cart.find(i => i.name === name);
    if (ex) ex.qty++; else cart.push({name, price:Number(price), qty:1});
    renderCart(); toast(name + " added to cart");
  }
  function renderCart(){
    saveCart();
    $("#cartCount").textContent = cart.reduce((s, i) => s + i.qty, 0);
    $("#cartTotal").textContent = money(cart.reduce((s, i) => s + i.price * i.qty, 0));
    if (!cart.length){ $("#cartItems").innerHTML = emptyCart; return; }
    $("#cartItems").innerHTML = cart.map((item, idx) => `
      <div class="cart-row">
        <div class="cart-thumb">3D</div>
        <div style="flex:1">
          <h4>${escapeHTML(item.name)}</h4><p>${money(item.price)}</p>
          <div class="quantity-controls">
            <button data-qty="${idx}" data-change="-1" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button data-qty="${idx}" data-change="1" aria-label="Increase quantity">+</button>
            <button data-remove="${idx}" style="margin-left:auto;width:auto;padding:0 7px" aria-label="Remove item">Remove</button>
          </div>
        </div>
      </div>`).join("");
  }
  $("#cartItems").addEventListener("click", e => {
    const q = e.target.closest("[data-qty]"), r = e.target.closest("[data-remove]");
    if (q){
      const idx = Number(q.dataset.qty), item = cart[idx];
      if (!item) return;
      item.qty += Number(q.dataset.change);
      if (item.qty <= 0) cart.splice(idx, 1);
      renderCart();
    }
    if (r){ cart.splice(Number(r.dataset.remove), 1); renderCart(); }
  });
  $("#cartButton").addEventListener("click", () => {
    $("#overlay").classList.add("open");
    $("#cartDrawer").classList.add("open");
    $("#cartDrawer").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
  $("#checkoutButton").addEventListener("click", () => {
    if (!cart.length){ toast("Your cart is empty"); return; }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const lines = cart.map((i, n) => (n + 1) + ". " + i.name + " x " + i.qty + " = " + money(i.price * i.qty));
    const msg = "Hello PROTOFLOW 3D, I would like to place an order:\n\n" + lines.join("\n") +
      "\n\nTotal: " + money(total) + "\n\nName:\nDelivery address & pincode:\nPhone:";
    const w = window.open(waLink(msg), "_blank");
    if (w) { try { w.opener = null; } catch(e){} }
    else window.location.href = waLink(msg);   // popup blocked: open in same tab
    toast("Opening WhatsApp to send your order…");
  });

  /* =====================================================================
     PRODUCT CATALOG
     Built-in sample products below. If sheetCsvUrl is set, products come
     from your Google Sheet instead (categories are created automatically).
     ===================================================================== */
  const DEFAULT_CATEGORIES = [
    {id:"divine-creations", title:"Divine Creations", blurb:"Detailed idols and meaningful designs crafted to bring peace and presence to your space.", products:[
      {name:"Divine Creation", desc:"Detailed statement piece", price:1499, img:"product-divine-sculpture.jpg", badge:"Bestseller"},
      {name:"Lord Ganesha Idol", desc:"Home temple & desk", price:999, img:"product-ganesha.jpg"},
      {name:"Meditating Buddha", desc:"Calm, minimal form", price:1299, img:"product-buddha.jpg"},
      {name:"Krishna Flute Statue", desc:"Fine detailed finish", price:1199, img:"product-krishna.jpg", badge:"New"}
    ]},
    {id:"decor", title:"Home Decor", blurb:"Vases, planters, lamps and wall pieces with a modern contemporary touch.", products:[
      {name:"Arc Form Vase", desc:"Minimal modern decor", price:899, img:"product-arc-vase.jpg"},
      {name:"Geometric Planter", desc:"For small indoor plants", price:599, img:"product-planter.jpg"},
      {name:"Abstract Wall Art", desc:"Textured 3D wall piece", price:1199, img:"product-wall-art.jpg"},
      {name:"Designer Lamp Shade", desc:"Soft patterned light", price:1399, img:"product-lamp.jpg"}
    ]},
    {id:"miniatures", title:"Miniatures & Collectibles", blurb:"Small-scale models, figurines and collectibles for shelves and desks.", products:[
      {name:"Miniature Landmark", desc:"Small-scale collectible", price:1199, img:"product-miniature.jpg", badge:"New"},
      {name:"Vintage Car Model", desc:"Detailed desk model", price:799, img:"product-car.jpg"},
      {name:"Desk Figurine", desc:"Character collectible", price:549, img:"product-figurine.jpg"},
      {name:"Chess Piece Set", desc:"Hand-finished pieces", price:1499, img:"product-chess.jpg"}
    ]},
    {id:"functional", title:"Functional & Utility", blurb:"Useful everyday objects, designed well and printed to last.", products:[
      {name:"Phone Stand", desc:"Sturdy, angled, minimal", price:399, img:"product-phone-stand.jpg"},
      {name:"Desk Organizer", desc:"Pens, cards and clips", price:699, img:"product-organizer.jpg", badge:"Popular"},
      {name:"Cable Holder", desc:"Keeps your desk tidy", price:249, img:"product-cable.jpg"},
      {name:"Headphone Stand", desc:"Clean modern design", price:799, img:"product-headphone.jpg"}
    ]},
    {id:"gifts", title:"Gifts & Personalised", blurb:"Name plates, keychains and keepsakes made for someone special.", products:[
      {name:"Custom Name Plate", desc:"Your name, your style", price:499, img:"product-nameplate.jpg", badge:"Custom"},
      {name:"Custom Keychain", desc:"Name or initials", price:199, img:"product-keychain.jpg"},
      {name:"Photo Lithophane Lamp", desc:"Your photo, lit from within", price:1299, img:"product-lithophane.jpg"},
      {name:"Couple Figurine", desc:"Personalised keepsake", price:1599, img:"product-couple.jpg"}
    ]}
  ];

  function imgSrc(v){
    v = String(v || "").trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;     // full link
    if (v.includes(":")) return "";            // block anything unusual
    return "images/" + v.replace(/^\/+/, "");  // file name inside /images
  }

  /*CSV-START*/
  function parseCSV(text){
    const rows = []; let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i++){
      const c = text[i];
      if (q){
        if (c === '"'){ if (text[i+1] === '"'){ cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ","){ row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r"){
        if (c === "\r" && text[i+1] === "\n") i++;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += c;
    }
    row.push(cell); rows.push(row);
    return rows;
  }
  function categoriesFromCSV(text){
    const rows = parseCSV(text.replace(/^\uFEFF/, "")).filter(r => r.some(c => c.trim()));
    if (rows.length < 2) return [];
    const head = rows[0].map(x => x.trim().toLowerCase().replace(/\s+/g, "_"));
    const map = new Map(), usedIds = new Set();
    rows.slice(1).forEach(r => {
      const get = n => { const i = head.indexOf(n); return i < 0 ? "" : (r[i] || "").trim(); };
      const category = get("category"), name = get("name");
      if (!category || !name) return;
      if (/^(no|n|false|0|hidden)$/i.test(get("active"))) return;
      const price = parseFloat(get("price").replace(/[^0-9.]/g, ""));
      if (!(price >= 0)) return;
      if (!map.has(category)){
        let id = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "category";
        while (usedIds.has(id)) id += "-x";
        usedIds.add(id);
        map.set(category, {id, title:category, blurb:"", image:"", products:[]});
      }
      const c = map.get(category);
      if (!c.blurb) c.blurb = get("category_description");
      if (!c.image) c.image = get("category_image");
      c.products.push({name, desc:get("description"), price, img:get("image"), badge:get("badge")});
    });
    return [...map.values()];
  }
  /*CSV-END*/

  async function loadCatalog(){
    const sources = CONFIG.sheetCsvUrl ? [CONFIG.sheetCsvUrl, "products-template.csv"] : ["products-template.csv"];
    for (const source of sources) {
      try {
        const res = await fetch(source, {cache:"no-store"});
        if (!res.ok) continue;
        const cats = categoriesFromCSV(await res.text());
        if (!cats.length) continue;
        try { localStorage.setItem("protoflowCatalog", JSON.stringify(cats)); } catch(e){}
        return cats;
      } catch(e) {}
    }
    let cached = null;
    try { cached = JSON.parse(localStorage.getItem("protoflowCatalog") || "null"); } catch(_){}
    return Array.isArray(cached) && cached.length ? cached : DEFAULT_CATEGORIES;
  }

  function categoryPageUrl(id){
    const pages = {"divine-creations":"divine-creations.html","home-decor":"home-decor.html","miniatures-collectibles":"miniatures-collectibles.html","functional-utility":"functional-utility.html","gifts-personalised":"gifts-personalised.html"};
    return pages[id] || ("collections.html#cat-" + encodeURIComponent(id));
  }

  function productCard(p, index){
    const n = escapeHTML(p.name);
    const href = "product.html?id=" + encodeURIComponent(String(p.name || "").toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));
    return `
      <article class="product-card" data-name="${n}" data-price="${p.price}" data-index="${index}">
        <a class="product-card-main product-detail-link" href="${href}" aria-label="View ${n} details">
          <div class="product-image">
            <span class="product-fallback"${p.img ? " hidden" : ""}>PRODUCT IMAGE COMING SOON</span>
            ${p.img ? `<img src="${escapeHTML(imgSrc(p.img))}" alt="${n}" loading="lazy" onerror="this.style.display='none';this.previousElementSibling.hidden=false">` : ""}
            ${p.badge ? `<span class="product-badge">${escapeHTML(p.badge)}</span>` : ""}
          </div>
          <div class="product-info"><div><h3>${n}</h3><p>${escapeHTML(p.desc || "")}</p></div><span class="price">From ${money(p.price)}</span></div>
        </a>
        <div class="product-actions">
          <button class="add-btn" data-add="${n}" data-price="${p.price}">Add to cart</button>
          <button class="icon-btn quick-view" data-name="${n}" data-price="${p.price}" data-desc="${escapeHTML(p.desc || "")}" aria-label="Quick view">↗</button>
          <a class="icon-btn" href="${href}" aria-label="View product details">Details</a>
        </div>
        <div class="product-actions product-actions-secondary">
          <button class="product-action-link" data-enquire-product="${n}" data-price="${p.price}">WhatsApp Enquiry</button>
          <button class="product-action-link product-buy-now" data-buy-now="${n}" data-price="${p.price}">Buy Now ↗</button>
        </div>
      </article>`;
  }

  // add to cart / wishlist / quick view — works on every page
  document.addEventListener("click", e => {
    const add = e.target.closest(".add-btn");
    const wish = e.target.closest(".wishlist-btn");
    const quick = e.target.closest(".quick-view");
    const enquiry = e.target.closest("[data-enquire-product]");
    const buyNow = e.target.closest("[data-buy-now]");
    if (add) addToCart(add.dataset.add, add.dataset.price);
    if (enquiry || buyNow) {
      const name = (enquiry || buyNow).dataset.enquireProduct || (enquiry || buyNow).dataset.buyNow;
      const price = (enquiry || buyNow).dataset.price;
      const purpose = enquiry ? "I would like to know more about" : "I would like to order";
      const message = "Hello PROTOFLOW 3D, " + purpose + " " + name + ". Listed price: " + money(price) + ". Please confirm availability, size options and delivery charges.";
      const url = waLink(message);
      const win = window.open(url, "_blank");
      if (win) { try { win.opener = null; } catch(err){} }
      else window.location.href = url;
    }
    if (wish){
      const on = wish.classList.toggle("active");
      wish.textContent = on ? "♥" : "♡";
      toast(on ? "Added to wishlist" : "Removed from wishlist");
    }
    if (quick){
      const {name, price, desc} = quick.dataset;
      openModal(name, (desc ? desc + ". " : "") + "Price: " + money(price) + ". Add it to your cart and send your order on WhatsApp.", [
        {label:"Add to cart", primary:true, run:() => { addToCart(name, price); closePanels(); }},
        {label:"Continue browsing", run:closePanels}
      ]);
    }
  });

  /* =====================================================================
     PAGE: HOME
     ===================================================================== */
  function initHome(){
    // hero background slider (uses only the images that actually exist)
    let slides = $$(".hero-bg-slide");
    let active = 0, timer;
    const showSlide = i => {
      active = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle("active", n === active));
      $("#slideCurrent").textContent = String(active + 1).padStart(2, "0");
    };
    const restart = () => { clearInterval(timer); if (slides.length > 1) timer = setInterval(() => showSlide(active + 1), 5000); };
    const refresh = () => {
      slides = $$(".hero-bg-slide");
      $("#slideTotal").textContent = String(slides.length).padStart(2, "0");
      $("#sliderControls").style.visibility = slides.length > 1 ? "visible" : "hidden";
      showSlide(0); restart();
    };
    $$(".hero-bg-slide img").forEach(img => {
      const drop = () => { const s = img.closest(".hero-bg-slide"); if (s) { s.remove(); refresh(); } };
      img.addEventListener("error", drop);
      if (img.complete && img.naturalWidth === 0) drop();
    });
    $("#slidePrev").addEventListener("click", () => { showSlide(active - 1); restart(); });
    $("#slideNext").addEventListener("click", () => { showSlide(active + 1); restart(); });
    document.addEventListener("visibilitychange", () => document.hidden ? clearInterval(timer) : restart());
    refresh();

    // collections + featured products
    loadCatalog().then(cats => {
      const num = n => String(n).padStart(2, "0");
      $("#collectionGrid").innerHTML = cats.map((cat, i) => `
        <article class="collection-card collection-card-clickable" role="link" tabindex="0" aria-label="Open ${escapeHTML(cat.title)} collection" data-collection-url="${categoryPageUrl(cat.id)}">
          <div class="collection-placeholder"></div>
          ${cat.image ? `<img src="${escapeHTML(imgSrc(cat.image))}" alt="${escapeHTML(cat.title)}" onerror="this.style.display='none'">` : ""}
          <div class="collection-info"><small>Collection ${num(i + 1)}</small><h3>${escapeHTML(cat.title)}</h3></div>
        </article>`).join("") + `
        <article class="collection-card collection-card-clickable" role="link" tabindex="0" aria-label="Open custom creations contact page" data-collection-url="contact.html">
          <div class="collection-placeholder"></div>
          <img src="images/category-custom.jpg" alt="Custom creations" onerror="this.style.display='none'">
          <div class="collection-info"><small>Collection ${num(cats.length + 1)}</small><h3>Custom Creations</h3><a href="contact.html">Make it yours ↗</a></div>
        </article>`;

      // Make the entire collection tile (including its image/placeholder) open the collection.
      const collectionGrid = $("#collectionGrid");
      collectionGrid.addEventListener("click", e => {
        if (e.target.closest("a")) return;
        const card = e.target.closest("[data-collection-url]");
        if (card) location.href = card.dataset.collectionUrl;
      });
      collectionGrid.addEventListener("keydown", e => {
        if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-collection-url]")) {
          e.preventDefault();
          location.href = e.target.dataset.collectionUrl;
        }
      });

      // Keep the homepage concise: show only four products per collection.
      // The collection page remains the destination for the complete product list.
      const categorySections = cats.map((cat, i) => {
        const preview = cat.products.slice(0, 4);
        const moreLink = cat.products.length > 4
          ? `<div class="section-link category-view-all"><a class="text-link" href="${categoryPageUrl(cat.id)}">View all ${escapeHTML(cat.title)} (${cat.products.length}) →</a></div>`
          : "";
        return `<section class="section home-category-section">
          <div class="container">
            <div class="section-head reveal">
              <div><div class="eyebrow" style="color:#9b7449">Collection ${num(i + 1)}</div><h2>${escapeHTML(cat.title)}</h2></div>
              <p>${escapeHTML(cat.blurb || "")}</p>
            </div>
            <div class="product-grid">${preview.map(productCard).join("")}</div>
            ${moreLink}
          </div>
        </section>`;
      }).join("");
      const categoryMount = $("#homeCategorySections");
      if (categoryMount) categoryMount.innerHTML = categorySections;

      const all = cats.flatMap(c => c.products);
      const picks = [...all.filter(p => p.badge), ...all.filter(p => !p.badge)].slice(0, 4);
      $("#featuredGrid").innerHTML = picks.map(productCard).join("");
    });
  }

  /* =====================================================================
     PAGE: COLLECTIONS  (search, sort, category buttons, one section per category)
     ===================================================================== */
  function initCollections(){
    let CATS = [], activeFilter = "all";

    function filterProducts(){
      const term = $("#productSearch").value.trim().toLowerCase();
      const sort = $("#sortProducts").value;
      let anyVisible = false;
      $$(".cat-section").forEach(section => {
        const grid = $(".product-grid", section);
        const cards = $$(".product-card", section);
        const inCategory = activeFilter === "all" || section.dataset.cat === activeFilter;
        cards.forEach(c => { c.style.display = (inCategory && c.dataset.name.toLowerCase().includes(term)) ? "" : "none"; });
        const visible = cards.filter(c => c.style.display !== "none");
        visible.sort((a, b) => {
          if (sort === "low") return a.dataset.price - b.dataset.price;
          if (sort === "high") return b.dataset.price - a.dataset.price;
          if (sort === "name") return a.dataset.name.localeCompare(b.dataset.name);
          return a.dataset.index - b.dataset.index;
        });
        visible.forEach(c => grid.append(c));
        section.style.display = visible.length ? "" : "none";
        if (visible.length) anyVisible = true;
      });
      $("#emptyState").style.display = anyVisible ? "none" : "block";
    }

    function render(){
      const directory = $("#collectionDirectory");
    if (directory) directory.innerHTML = CATS.map((cat, i) => `
      <a class="category-directory-card" href="${categoryPageUrl(cat.id)}">
        <span class="category-directory-number">${String(i + 1).padStart(2, "0")}</span>
        <span class="category-directory-copy"><strong>${escapeHTML(cat.title)}</strong><small>${cat.products.length} products</small></span>
        <span class="category-directory-arrow" aria-hidden="true">↗</span>
      </a>`).join("");

    $("#categorySections").innerHTML = CATS.map((cat, i) => `
        <section class="section cat-section" id="cat-${cat.id}" data-cat="${cat.id}">
          <div class="container">
            <div class="section-head">
              <div><div class="eyebrow" style="color:#9b7449">Collection ${String(i + 1).padStart(2, "0")}</div><h2>${escapeHTML(cat.title)}</h2></div>
              <p>${escapeHTML(cat.blurb || "")}</p>
            </div>
            <div class="product-grid">${cat.products.map(productCard).join("")}</div>
          </div>
        </section>`).join("");
      $("#chips").innerHTML =
        '<button class="chip active" data-filter="all">All</button>' +
        CATS.map(c => `<button class="chip" data-filter="${c.id}">${escapeHTML(c.title)}</button>`).join("");
      activeFilter = "all";
      filterProducts();
    }

    $("#loadingState").style.display = "block";
    loadCatalog().then(cats => {
      CATS = cats;
      $("#loadingState").style.display = "none";
      render();
      const hash = location.hash.slice(1);
      if (hash && document.getElementById(hash)) document.getElementById(hash).scrollIntoView();
      if (new URLSearchParams(location.search).has("search")){
        $("#shop").scrollIntoView();
        $("#productSearch").focus();
      }
    });

    $("#productSearch").addEventListener("input", filterProducts);
    $("#sortProducts").addEventListener("change", filterProducts);
    $("#chips").addEventListener("click", e => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      activeFilter = chip.dataset.filter;
      $$(".chip").forEach(c => c.classList.toggle("active", c === chip));
      filterProducts();
      if (activeFilter !== "all") $("#cat-" + activeFilter).scrollIntoView({behavior:"smooth"});
    });
    $("#searchLink").addEventListener("click", e => {
      e.preventDefault();
      $("#shop").scrollIntoView({behavior:"smooth"});
      setTimeout(() => $("#productSearch").focus(), 400);
    });
  }

  /* =====================================================================
     PAGE: CATEGORY — one dedicated page per product category
     ===================================================================== */
  function initCategory(){
    const slug = document.body.dataset.category || "";
    const title = $("#categoryTitle"), description = $("#categoryDescription");
    const grid = $("#categoryProductGrid"), loading = $("#categoryLoading");
    const empty = $("#categoryEmpty"), search = $("#categorySearch"), sort = $("#categorySort");
    loadCatalog().then(cats => {
      const cat = cats.find(c => c.id === slug);
      if (!cat) {
        if (title) title.textContent = "Collection not found";
        if (description) description.textContent = "Please browse all collections to find the category you need.";
        if (loading) loading.style.display = "none";
        if (empty) { empty.textContent = "This category is not available yet."; empty.style.display = "block"; }
        return;
      }
      document.title = cat.title + " — PROTOFLOW 3D";
      if (title) title.textContent = cat.title;
      if (description) description.textContent = cat.blurb || "Explore thoughtfully designed pieces from this collection.";
      if (loading) loading.style.display = "none";
      grid.innerHTML = cat.products.map(productCard).join("");
      const apply = () => {
        const term = search.value.trim().toLowerCase();
        const cards = $(".product-card", grid);
        cards.forEach(card => { card.style.display = card.dataset.name.toLowerCase().includes(term) ? "" : "none"; });
        const visible = cards.filter(card => card.style.display !== "none");
        visible.sort((a,b) => {
          if (sort.value === "low") return Number(a.dataset.price) - Number(b.dataset.price);
          if (sort.value === "high") return Number(b.dataset.price) - Number(a.dataset.price);
          if (sort.value === "name") return a.dataset.name.localeCompare(b.dataset.name);
          return Number(a.dataset.index) - Number(b.dataset.index);
        }).forEach(card => grid.append(card));
        if (empty) empty.style.display = visible.length ? "none" : "block";
      };
      search.addEventListener("input", apply);
      sort.addEventListener("change", apply);
      apply();
    });
  }

  /* =====================================================================
     PAGE: CONTACT  (form opens WhatsApp with the message filled in)
     ===================================================================== */
  function initContact(){
    loadCatalog().then(cats => {
      $("#enquiryType").innerHTML =
        cats.map(c => `<option>${escapeHTML(c.title)}</option>`).join("") +
        "<option>Custom creation</option><option>Something else</option>";
      $("#enquiryType").value = "Custom creation";
    });
    $("#enquiryForm").addEventListener("submit", e => {
      e.preventDefault();
      const name = $("#enqName").value.trim(), phone = $("#enqPhone").value.trim();
      const type = $("#enquiryType").value, message = $("#enqMessage").value.trim();
      if (!name || !message){ toast("Please add your name and message"); return; }
      const text = "Hello PROTOFLOW 3D,\n\nName: " + name + (phone ? "\nPhone: " + phone : "") +
        "\nInterested in: " + type + "\n\nMessage:\n" + message;
      const w = window.open(waLink(text), "_blank");
      if (w) { try { w.opener = null; } catch(err){} }
      else window.location.href = waLink(text);
      toast("Opening WhatsApp to send your message…");
    });
  }

  /* =====================================================================
     START
     ===================================================================== */
  if (PAGE === "home") initHome();
  if (PAGE === "collections") initCollections();
  if (PAGE === "category") initCategory();
  if (PAGE === "contact") initContact();

  // fade-in on scroll
  if ("IntersectionObserver" in window){
    const obs = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting){ en.target.classList.add("visible"); obs.unobserve(en.target); }
    }), {threshold:.12});
    $$(".reveal").forEach(el => obs.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("visible"));
  }

  loadCart();
  renderCart();
})();
