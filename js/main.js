/* =========================================================
   RoncoMed · Interacciones y animaciones
   ========================================================= */
(() => {
  // ⚠️ Cambia este número por el WhatsApp real de la clínica
  // Formato: 52 + número a 10 dígitos (sin espacios ni signos)
  const WHATSAPP = "522290000000";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Año del footer ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Scroll: barra de progreso, nav, botón subir, línea del proceso ---------- */
  const nav = $("#nav");
  const bar = $("#progressBar");
  const toTop = $("#toTop");
  const steps = $("#steps");
  const stepsFill = $("#stepsFill");
  let lastY = 0;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    nav.classList.toggle("is-scrolled", y > 30);
    // Oculta la barra al bajar y la muestra al subir
    const menuOpen = $("#navLinks").classList.contains("is-open");
    nav.classList.toggle("is-hidden", !menuOpen && y > lastY && y > 500);
    lastY = y;

    toTop.classList.toggle("is-visible", y > 700);

    if (steps) {
      const r = steps.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight * 0.75 - r.top) / (r.height + innerHeight * 0.25), 0), 1);
      stepsFill.style.transform = `scaleX(${p})`;
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Menú móvil ---------- */
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$("a", links).forEach(a => a.addEventListener("click", () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  /* ---------- Resaltar sección activa en el menú ---------- */
  const navMap = new Map($$(".nav__links a[href^='#']").map(a => [a.getAttribute("href").slice(1), a]));
  const secObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const link = navMap.get(e.target.id);
      if (link && e.isIntersecting) {
        navMap.forEach(l => l.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach(s => secObserver.observe(s));

  /* ---------- Aparición al hacer scroll ---------- */
  const revealEls = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(el => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("is-visible");
        // Al terminar, se quita .reveal para que el hover use su propia transición
        el.addEventListener("transitionend", function done(ev) {
          if (ev.target !== el || ev.propertyName !== "transform") return;
          el.classList.remove("reveal");
          el.removeEventListener("transitionend", done);
        });
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Texto rotativo del hero ---------- */
  const rot = $("#rotator");
  const words = ["tranquilo", "sin ronquidos", "sin pausas", "mejor"];
  let wi = 0;
  if (!reduceMotion) {
    setInterval(() => {
      rot.classList.add("is-out");
      setTimeout(() => {
        wi = (wi + 1) % words.length;
        rot.textContent = words[wi];
        rot.classList.remove("is-out");
      }, 350);
    }, 2600);
  }

  /* ---------- Luz que sigue al cursor en tarjetas ---------- */
  $$(".spot").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Inclinación 3D de la foto del hero ---------- */
  const tilt = $(".tilt");
  if (tilt && !reduceMotion && matchMedia("(hover: hover)").matches) {
    const wrap = tilt.parentElement;
    wrap.addEventListener("pointermove", e => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    wrap.addEventListener("pointerleave", () => { tilt.style.transform = ""; });
  }

  /* ---------- Test de síntomas ---------- */
  const checks = $$("#sintomas input[type='checkbox']");
  const ring = $("#ringFg");
  const count = $("#quizCount");
  const result = $("#quizResult");
  const quizCta = $("#quizCta");
  const CIRC = 2 * Math.PI * 52;
  const messages = [
    "Selecciona las señales que reconozcas.",
    "Una señal aislada puede ser pasajera, pero obsérvala.",
    "Dos señales: vale la pena comentarlo con un especialista.",
    "Varias señales coinciden con un posible trastorno del sueño. Te recomendamos una valoración.",
    "Varias señales coinciden con un posible trastorno del sueño. Te recomendamos una valoración.",
    "Muchas señales presentes: agenda una valoración pronto.",
    "Muchas señales presentes: agenda una valoración pronto."
  ];
  function updateQuiz() {
    const n = checks.filter(c => c.checked).length;
    count.textContent = n;
    ring.style.strokeDashoffset = CIRC * (1 - n / checks.length);
    ring.style.stroke = n >= 3 ? "#0b3d5f" : "#7fb3ba";
    result.textContent = messages[n];
    quizCta.classList.toggle("is-ready", n >= 2);
  }
  checks.forEach(c => c.addEventListener("change", updateQuiz));

  /* ---------- Visor de publicaciones ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  const closeLb = () => lb.classList.remove("is-open");
  $$(".post").forEach(p => p.addEventListener("click", () => {
    lbImg.src = p.dataset.full;
    lbImg.alt = p.dataset.caption;
    lbCap.textContent = p.dataset.caption;
    lb.classList.add("is-open");
    $("#lbClose").focus();
  }));
  $("#lbClose").addEventListener("click", closeLb);
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });

  /* ---------- Formulario → WhatsApp ---------- */
  const form = $("#citaForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = $("#fNombre"), tel = $("#fTel"), motivo = $("#fMotivo"), msg = $("#fMsg");
    let ok = true;
    [nombre, tel, motivo].forEach(f => {
      const bad = !f.value.trim();
      f.parentElement.classList.toggle("is-error", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      $("#formNote").textContent = "Por favor completa los campos marcados.";
      return;
    }
    const texto =
      `Hola RoncoMed, me gustaría agendar una cita.%0A%0A` +
      `*Nombre:* ${encodeURIComponent(nombre.value.trim())}%0A` +
      `*Teléfono:* ${encodeURIComponent(tel.value.trim())}%0A` +
      `*Motivo:* ${encodeURIComponent(motivo.value)}` +
      (msg.value.trim() ? `%0A*Comentario:* ${encodeURIComponent(msg.value.trim())}` : "");
    window.open(`https://wa.me/${WHATSAPP}?text=${texto}`, "_blank", "noopener");
    $("#formNote").textContent = "¡Listo! Se abrió WhatsApp con tu mensaje.";
    form.reset();
  });
  $$(".field input, .field select").forEach(f =>
    f.addEventListener("input", () => f.parentElement.classList.remove("is-error"))
  );
})();
