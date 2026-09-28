(() => {
  const C = window.MOHREY_CATALOGUE;
  const byCode = new Map(C.products.map(p => [p.code, p]));
  const $ = s => document.querySelector(s);
  const inr = n => "₹" + n.toLocaleString("en-IN");
  const unit = p => p.unit === "m" ? "m" : "pc";
  const setPrice = p => p.pricePerPc * p.pcsPerSet;
  const stockState = p => p.stock === 0 ? "out" : p.stock <= C.lowStockAt ? "low" : "ok";

  const state = { cat: "All", q: "", fabric: "", sort: "new", inStock: false };
  let bag = load();

  // ───────── persistence (order sheet survives a refresh) ─────────
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem("mohrey-bag") || "{}");
      // drop anything that was removed or sold out since last visit
      return Object.fromEntries(Object.entries(saved)
        .filter(([code]) => byCode.get(code)?.stock > 0)
        .map(([code, q]) => [code, Math.min(q, byCode.get(code).stock)]));
    } catch { return {}; }
  }
  function save() { try { localStorage.setItem("mohrey-bag", JSON.stringify(bag)); } catch {} }

  // ───────── header / hero numbers ─────────
  $("#minOrder").textContent = inr(C.minOrderValue);
  $("#updatedAt").textContent = new Date(C.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  $("#statNew").textContent = C.products.filter(p => p.isNew).length;
  $("#statLive").textContent = C.products.filter(p => p.stock > 0).length;
  $("#waLink").href = `https://wa.me/${C.whatsapp}`;

  // ───────── filters ─────────
  const cats = ["All", ...C.categories];
  $("#chips").innerHTML = cats.map(c => {
    const n = c === "All" ? C.products.length : C.products.filter(p => p.category === c).length;
    return `<button class="chip" role="tab" data-cat="${c}" aria-selected="${c === state.cat}">${c}<span class="n">${n}</span></button>`;
  }).join("");
  [...new Set(C.products.map(p => p.fabric))].sort()
    .forEach(f => $("#fabric").insertAdjacentHTML("beforeend", `<option>${f}</option>`));

  $("#chips").addEventListener("click", e => {
    const chip = e.target.closest(".chip"); if (!chip) return;
    state.cat = chip.dataset.cat;
    document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-selected", c === chip));
    render();
  });
  $("#search").addEventListener("input", e => { state.q = e.target.value.trim().toLowerCase(); render(); });
  $("#fabric").addEventListener("change", e => { state.fabric = e.target.value; render(); });
  $("#sort").addEventListener("change", e => { state.sort = e.target.value; render(); });
  $("#inStock").addEventListener("change", e => { state.inStock = e.target.checked; render(); });
  $("#clearFilters").addEventListener("click", () => {
    Object.assign(state, { cat: "All", q: "", fabric: "", inStock: false });
    $("#search").value = ""; $("#fabric").value = ""; $("#inStock").checked = false;
    document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-selected", c.dataset.cat === "All"));
    render();
  });

  function visible() {
    const q = state.q.replace(/^mh-?/, "");
    const list = C.products.filter(p =>
      (state.cat === "All" || p.category === state.cat) &&
      (!state.fabric || p.fabric === state.fabric) &&
      (!state.inStock || p.stock > 0) &&
      (!q || [p.code, p.name, p.fabric, p.category].join(" ").toLowerCase().includes(q)));
    const sorters = {
      new: (a, b) => (b.isNew - a.isNew) || ((b.stock > 0) - (a.stock > 0)),
      low: (a, b) => a.pricePerPc - b.pricePerPc,
      high: (a, b) => b.pricePerPc - a.pricePerPc,
      code: (a, b) => a.code.localeCompare(b.code),
    };
    return list.sort(sorters[state.sort]);
  }

  // ───────── product cards ─────────
  const swatch = (p, color = p.colors[0], cls = "") =>
    `<div class="swatch pat-${p.pattern} ${cls}" style="--c1:${color};--c2:${p.colors[1] || "#d8c09a"}"></div>`;

  function badges(p) {
    const s = stockState(p);
    return [
      p.isNew && `<span class="badge new">New</span>`,
      s === "low" && `<span class="badge low">Only ${p.stock} sets</span>`,
      s === "out" && `<span class="badge out">Sold out</span>`,
    ].filter(Boolean).join("");
  }

  function card(p) {
    const inBag = bag[p.code];
    const out = p.stock === 0;
    return `
      <article class="card ${out ? "soldout" : ""}" data-code="${p.code}">
        <div class="swatch-wrap" data-detail>
          ${swatch(p)}
          <div class="badges">${badges(p)}</div>
          <span class="code-tag">${p.code}</span>
        </div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <div class="meta"><span>${p.fabric}</span><span>${p.pcsPerSet} ${p.unit === "m" ? "m" : "pcs"} / set</span>${p.sizes ? `<span>${p.sizes}</span>` : ""}</div>
          <div class="colors">${p.colors.map(c => `<i style="background:${c}"></i>`).join("")}</div>
          <div class="price-row">
            <div class="price">${inr(p.pricePerPc)}<small> / ${unit(p)}</small></div>
            <div class="set-price">Set <b>${inr(setPrice(p))}</b></div>
          </div>
          ${out
            ? `<button class="btn-ghost notify" data-notify>Notify when back</button>`
            : `<div class="order-row">
                 <div class="stepper" aria-label="Sets">
                   <button data-step="-1" aria-label="One set less">−</button>
                   <input type="number" min="1" max="${p.stock}" value="${inBag || 1}" aria-label="Number of sets">
                   <button data-step="1" aria-label="One set more">+</button>
                 </div>
                 <button class="btn-primary add-btn ${inBag ? "in-bag" : ""}" data-add>${inBag ? "✓ In sheet" : "Add sets"}</button>
               </div>`}
        </div>
      </article>`;
  }

  function render() {
    const list = visible();
    $("#grid").innerHTML = list.map(card).join("");
    $("#empty").hidden = list.length > 0;
    $("#resultCount").textContent = `${list.length} design${list.length === 1 ? "" : "s"}` +
      (state.cat !== "All" ? ` in ${state.cat}` : "") + (state.q ? ` matching “${state.q}”` : "");
  }

  const clampQty = (p, n) => Math.max(1, Math.min(p.stock, n || 1));

  $("#grid").addEventListener("click", e => {
    const el = e.target.closest(".card"); if (!el) return;
    const p = byCode.get(el.dataset.code);
    const input = el.querySelector(".stepper input");
    if (e.target.closest("[data-detail]")) return openDetail(p);
    if (e.target.closest("[data-notify]")) return toast(`We'll tell you on WhatsApp when ${p.code} is back`);
    const step = e.target.closest("[data-step]");
    if (step) {
      input.value = clampQty(p, +input.value + +step.dataset.step);
      if (bag[p.code]) setQty(p.code, +input.value, false);
      if (+step.dataset.step > 0 && +input.value === p.stock) toast(`Only ${p.stock} sets of ${p.code} in stock`);
    }
    if (e.target.closest("[data-add]")) {
      setQty(p.code, clampQty(p, +input.value));
      toast(`${p.code} · ${bag[p.code]} set${bag[p.code] > 1 ? "s" : ""} added to order sheet`);
    }
  });
  $("#grid").addEventListener("change", e => {
    const el = e.target.closest(".card"); if (!el || !e.target.matches("input")) return;
    const p = byCode.get(el.dataset.code);
    e.target.value = clampQty(p, +e.target.value);
    if (bag[p.code]) setQty(p.code, +e.target.value, false);
  });

  // ───────── product detail ─────────
  function openDetail(p) {
    const out = p.stock === 0;
    $("#productDetail").innerHTML = `
      <button class="close" data-close aria-label="Close">×</button>
      <div>${swatch(p, p.colors[0], "detail-swatch")}</div>
      <div class="detail-info">
        <p class="eyebrow">${p.category} · ${p.code}</p>
        <h2>${p.name}</h2>
        <div class="badges" style="position:static">${badges(p)}</div>
        <div class="price">${inr(p.pricePerPc)}<small> / ${unit(p)} · ${inr(setPrice(p))} per set</small></div>
        <dl class="spec">
          <dt>Fabric</dt><dd>${p.fabric}</dd>
          <dt>Set contains</dt><dd>${p.pcsPerSet} ${p.unit === "m" ? "metres" : "pieces"}${p.colors.length > 1 ? `, assorted in ${p.colors.length} colours` : ""}</dd>
          ${p.sizes ? `<dt>Sizes</dt><dd>${p.sizes} (1 of each per set)</dd>` : ""}
          <dt>Available</dt><dd>${out ? "Sold out — restocking soon" : `${p.stock} sets`}</dd>
        </dl>
        <div>
          <p class="stepper-label">Colours in this design</p>
          <div class="variant-row">${p.colors.map((c, i) =>
            `<button class="variant" style="background:${c}" data-color="${c}" aria-pressed="${i === 0}" aria-label="Colour ${i + 1}"></button>`).join("")}</div>
        </div>
        ${out ? `<button class="btn-ghost block" data-close>Notify when back</button>`
              : `<button class="btn-primary block" data-detail-add="${p.code}">${bag[p.code] ? "Add 1 more set" : "Add 1 set to order sheet"}</button>`}
      </div>`;
    $("#productModal").showModal();
  }
  $("#productDetail").addEventListener("click", e => {
    const v = e.target.closest(".variant");
    if (v) {
      document.querySelectorAll(".variant").forEach(b => b.setAttribute("aria-pressed", b === v));
      $(".detail-swatch").style.setProperty("--c1", v.dataset.color);
    }
    const add = e.target.closest("[data-detail-add]");
    if (add) {
      const p = byCode.get(add.dataset.detailAdd);
      setQty(p.code, Math.min(p.stock, (bag[p.code] || 0) + 1));
      $("#productModal").close();
      toast(`${p.code} added — ${bag[p.code]} set${bag[p.code] > 1 ? "s" : ""} in sheet`);
    }
  });

  // ───────── quick order (the WhatsApp habit, kept) ─────────
  function parseQuick(text) {
    return text.split(/\n|,/).map(l => l.trim()).filter(Boolean).map(line => {
      const m = line.match(/(?:mh-?)?\s*(\d{3,5})\s*(?:[x×*:\-]|sets?|\s)?\s*(\d+)?/i);
      if (!m) return { line, error: "Couldn't read this line" };
      const code = "MH-" + m[1], qty = +(m[2] || 1), p = byCode.get(code);
      if (!p) return { line, error: `${code} not in current catalogue` };
      if (p.stock === 0) return { line, error: `${code} is sold out` };
      return { line, code, qty: Math.min(qty, p.stock), capped: qty > p.stock, p };
    });
  }
  $("#quickText").addEventListener("input", e => {
    const rows = parseQuick(e.target.value);
    $("#quickPreview").innerHTML = rows.map(r => r.error
      ? `<div class="bad">✕ ${r.line} — ${r.error}</div>`
      : `<div class="ok">✓ ${r.code} ${r.p.name} × ${r.qty} set${r.qty > 1 ? "s" : ""}${r.capped ? ` (only ${r.p.stock} in stock)` : ""} — ${inr(setPrice(r.p) * r.qty)}</div>`).join("");
    $("#quickAdd").disabled = !rows.some(r => !r.error);
  });
  $("#quickAdd").addEventListener("click", () => {
    const ok = parseQuick($("#quickText").value).filter(r => !r.error);
    ok.forEach(r => setQty(r.code, Math.min(r.p.stock, (bag[r.code] || 0) + r.qty), false));
    save(); render(); updateBag(true);
    $("#quickModal").close(); $("#quickText").value = ""; $("#quickPreview").innerHTML = ""; $("#quickAdd").disabled = true;
    openBag();
  });

  // ───────── order sheet ─────────
  function setQty(code, qty, rerender = true) {
    if (qty <= 0) delete bag[code]; else bag[code] = qty;
    save(); updateBag(true);
    if (rerender) render();
  }
  function totals() {
    return Object.entries(bag).reduce((t, [code, q]) => {
      const p = byCode.get(code);
      t.sets += q; t.pcs += q * p.pcsPerSet; t.value += q * setPrice(p); return t;
    }, { sets: 0, pcs: 0, value: 0 });
  }
  function updateBag(bump) {
    const t = totals(), lines = Object.keys(bag).length;
    for (const el of [$("#bagCount"), $("#bagCountMobile")]) {
      el.textContent = lines;
      if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    }
    $("#bagEmpty").hidden = lines > 0;
    $("#bagFoot").hidden = lines === 0;
    $("#bagLines").innerHTML = Object.entries(bag).map(([code, q]) => {
      const p = byCode.get(code);
      return `<div class="line" data-code="${code}">
        ${swatch(p)}
        <div><span class="code">${code}</span><h4>${p.name}</h4>
          <div class="sub">${inr(setPrice(p))} / set · ${p.pcsPerSet * q} ${p.unit === "m" ? "m" : "pcs"}</div></div>
        <div class="line-right">
          <div class="stepper"><button data-step="-1" aria-label="One set less">−</button><input type="number" value="${q}" readonly aria-label="Sets"><button data-step="1" aria-label="One set more">+</button></div>
          <span class="line-total">${inr(setPrice(p) * q)}</span>
          <button class="remove" data-remove>Remove</button>
        </div></div>`;
    }).join("");
    const pct = Math.min(100, t.value / C.minOrderValue * 100);
    $("#moqFill").style.width = pct + "%";
    $(".moq").classList.toggle("met", pct >= 100);
    $("#moqText").textContent = pct >= 100 ? "✓ Minimum wholesale order reached"
      : `Add ${inr(C.minOrderValue - t.value)} more to reach the ${inr(C.minOrderValue)} minimum`;
    $("#toCheckout").disabled = pct < 100;
    $("#totSets").textContent = t.sets;
    $("#totPcs").textContent = t.pcs;
    $("#totValue").textContent = inr(t.value);
  }
  $("#bagLines").addEventListener("click", e => {
    const line = e.target.closest(".line"); if (!line) return;
    const code = line.dataset.code, p = byCode.get(code);
    const step = e.target.closest("[data-step]");
    if (step) setQty(code, Math.min(p.stock, bag[code] + +step.dataset.step));
    if (e.target.closest("[data-remove]")) setQty(code, 0);
  });

  const steps = { bag: $("#stepBag"), details: $("#stepDetails"), done: $("#stepDone") };
  function showStep(name, title) {
    Object.entries(steps).forEach(([k, el]) => el.hidden = k !== name);
    $("#drawerTitle").textContent = title;
  }
  function openBag() { showStep("bag", "Review order"); $("#bag").classList.add("open"); $("#bag").setAttribute("aria-hidden", "false"); }
  function closeBag() { $("#bag").classList.remove("open"); $("#bag").setAttribute("aria-hidden", "true"); }

  $("#toCheckout").addEventListener("click", () => {
    const t = totals();
    $("#summarySets").textContent = `${t.sets} sets · ${Object.keys(bag).length} designs`;
    $("#summaryValue").textContent = inr(t.value);
    showStep("details", "Your details");
  });
  $("#backToBag").addEventListener("click", () => showStep("bag", "Review order"));
  $("#stepDetails").addEventListener("submit", e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const orderNo = "MO-" + C.updatedAt.slice(2).replace(/-/g, "") + "-" + Math.floor(1000 + Math.random() * 9000);
    const t = totals();
    const msg = [
      `*New order ${orderNo}*`, `${f.shop} — ${f.name}, ${f.city}`, "",
      ...Object.entries(bag).map(([code, q]) => `${code} ${byCode.get(code).name} × ${q} sets`),
      "", `Total: ${t.sets} sets · ${inr(t.value)}`, f.note ? `Note: ${f.note}` : "",
    ].join("\n");
    // TODO(backend): POST the order here; WhatsApp stays as a backup channel.
    $("#orderNo").textContent = orderNo;
    $("#sendWa").href = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
    showStep("done", "Thank you");
    bag = {}; save(); updateBag(); render();
  });
  $("#newOrder").addEventListener("click", () => { closeBag(); $("#stepDetails").reset(); });

  // ───────── open/close wiring ─────────
  document.addEventListener("click", e => {
    const open = e.target.closest("[data-open]")?.dataset.open;
    if (open === "bag") openBag();
    if (open === "quick") { $("#quickModal").showModal(); $("#quickText").focus(); }
    if (e.target.closest("[data-close]")) e.target.closest("dialog")?.close();
    if (e.target.closest("[data-close-bag]")) closeBag();
    if (e.target.matches("dialog")) e.target.close(); // click on backdrop
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeBag(); });

  let toastTimer;
  function toast(text) {
    const t = $("#toast"); t.textContent = text; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  render();
  updateBag();
})();
