(() => {
  const NS = "http://www.w3.org/2000/svg";
  const el = (name, attrs = {}) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };

  // Place beads along an SVG path, evenly spaced, cycling through the colours.
  function strand(svg, d, colors, r, { thread = true, gap = 1.05, start = 0, end = 1 } = {}) {
    const path = el("path", { d, fill: "none", stroke: thread ? "#b9a893" : "none", "stroke-width": 1.5 });
    svg.appendChild(path);
    const len = path.getTotalLength();
    const step = r * 2 * gap;
    const count = Math.max(1, Math.floor((len * (end - start)) / step));
    for (let i = 0; i < count; i++) {
      const p = path.getPointAtLength(len * start + (i + 0.5) * step);
      const c = colors[i % colors.length];
      const g = el("g", { transform: `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})` });
      g.appendChild(el("circle", { r, fill: c }));
      g.appendChild(el("circle", { r, fill: "none", stroke: "#000", "stroke-opacity": 0.12, "stroke-width": 1 }));
      g.appendChild(el("ellipse", { cx: -r * 0.3, cy: -r * 0.35, rx: r * 0.32, ry: r * 0.2, fill: "#fff", "fill-opacity": 0.5, transform: "rotate(-30)" }));
      svg.appendChild(g);
    }
  }

  const palettes = [
    { name: "Sunset on the Beach", colors: ["#f07a2b", "#f6c9a8", "#d6453d", "#ffd36a", "#a74601"] },
    { name: "Deep Ocean", colors: ["#2b6f8e", "#8fd0e0", "#1d4e6b", "#e8f6f8", "#5aa9c0"] },
    { name: "Secret Garden", colors: ["#5f8a67", "#a9cdaf", "#f08aa8", "#f6ead9", "#3f6a4a"] },
    { name: "Berry Good", colors: ["#8a2c5a", "#d96a9a", "#f6c9d8", "#5a1a3a", "#c0467f"] },
    { name: "Midnight Plum", colors: ["#2a2050", "#6c58b8", "#c9b8f0", "#1a1432", "#9a86e0"] },
  ];

  // Bracelet builder
  const builderSvg = document.getElementById("builderSvg");
  const swatchBox = document.getElementById("swatches");
  const nameEl = document.getElementById("builderName");

  function drawBracelet(svg, colors, r) {
    svg.replaceChildren();
    const cx = 160, cy = 160, R = 108;
    const d = `M ${cx - R} ${cy} a ${R} ${R} 0 1 1 ${R * 2} 0 a ${R} ${R} 0 1 1 ${-R * 2} 0`;
    strand(svg, d, colors, r, { gap: 1.02 });
  }

  function select(i) {
    drawBracelet(builderSvg, palettes[i].colors, 15);
    nameEl.textContent = `"${palettes[i].name}"`;
    swatchBox.querySelectorAll(".swatch").forEach((b, j) => b.setAttribute("aria-pressed", String(i === j)));
  }

  palettes.forEach((p, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "swatch";
    b.setAttribute("aria-label", p.name);
    b.title = p.name;
    p.colors.slice(0, 3).forEach((c) => {
      const s = document.createElement("span");
      s.style.background = c;
      b.appendChild(s);
    });
    b.addEventListener("click", () => select(i));
    swatchBox.appendChild(b);
  });
  select(0);

  // Product card art
  const art = {
    bracelet(svg) {
      strand(svg, "M 120 36 a 64 64 0 1 1 0 128 a 64 64 0 1 1 0 -128", palettes[0].colors, 9);
    },
    necklace(svg) {
      strand(svg, "M 36 40 C 56 190, 184 190, 204 40", palettes[2].colors, 8);
      const g = el("g", { transform: "translate(120 150)" });
      g.appendChild(el("path", { d: "M0 -10 C-14 -26 -28 -6 0 14 C28 -6 14 -26 0 -10z", fill: "#d6453d" }));
      svg.appendChild(g);
    },
    earrings(svg) {
      [70, 170].forEach((x, k) => {
        svg.appendChild(el("circle", { cx: x, cy: 30, r: 5, fill: "none", stroke: "#b9a893", "stroke-width": 2 }));
        strand(svg, `M ${x} 36 L ${x} 150`, palettes[k === 0 ? 1 : 3].colors, 8);
      });
    },
    anklet(svg) {
      strand(svg, "M 28 100 C 28 40, 212 40, 212 100 C 212 160, 28 160, 28 100", palettes[4].colors, 8, { gap: 1.02 });
    },
  };
  document.querySelectorAll("[data-art]").forEach((svg) => art[svg.dataset.art]?.(svg));

  // Floating beads in the hero
  const floaters = document.getElementById("floaters");
  if (floaters) {
    const cols = ["#f07a2b", "#f6c9a8", "#8fb894", "#f08aa8", "#ffd36a"];
    for (let i = 0; i < 16; i++) {
      const s = 10 + Math.random() * 26;
      const f = document.createElement("span");
      f.className = "floater";
      f.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${s}px;height:${s}px;` +
        `background:radial-gradient(circle at 32% 30%,#fff9 0 12%,${cols[i % cols.length]} 45%,#0006 140%);` +
        `--t:${5 + Math.random() * 5}s;--dl:${-Math.random() * 6}s;opacity:${0.25 + Math.random() * 0.5}`;
      floaters.appendChild(f);
    }
  }

  // Header: solid after scrolling, mobile menu
  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((n) => io.observe(n));
  } else {
    revealEls.forEach((n) => n.classList.add("in"));
  }

  // Joke order form: nothing is sent anywhere
  const form = document.getElementById("orderForm");
  const msg = document.getElementById("formMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim() || "friend";
    msg.textContent = `Thanks ${name}! Marion has NOT been notified, because this is a joke website. Message her directly and she'll sort you out. 💛`;
  });
})();
