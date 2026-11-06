const dialog = document.querySelector("#wechat-dialog");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let returnFocus = null;

function openWechat(trigger) {
  if (!dialog || dialog.open) return;
  returnFocus = trigger;
  if (typeof dialog.showModal !== "function") {
    window.location.assign(dialog.querySelector(".dialog-qr").src);
    return;
  }
  dialog.showModal();
  document.body.classList.add("dialog-open");
}

function closeWechat() {
  if (dialog?.open) dialog.close();
}

document.querySelectorAll("[data-wechat]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    // 保留链接原有的打开新标签页行为。
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openWechat(trigger);
  });
});

if (dialog) {
  dialog.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", closeWechat);
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeWechat();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first) return;
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === dialog || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || active === dialog || !dialog.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (event.target === dialog && outside) closeWechat();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  });
}

document.querySelectorAll("details.disclosure").forEach((details) => {
  const summary = details.querySelector("summary");
  let animation = null;

  summary.addEventListener("click", (event) => {
    if (reducedMotion.matches || typeof details.animate !== "function") return;
    event.preventDefault();
    if (animation) return;

    const wasOpen = details.open;
    const startHeight = details.getBoundingClientRect().height;
    details.open = !wasOpen;
    const endHeight = details.getBoundingClientRect().height;
    // 收起动画结束前保留正文，避免内容突然消失。
    details.open = true;
    details.style.overflow = "hidden";
    animation = details.animate(
      [{ height: startHeight + "px" }, { height: endHeight + "px" }],
      { duration: 240, easing: "cubic-bezier(.2,.7,.2,1)" }
    );
    const finish = () => {
      details.open = !wasOpen;
      details.style.overflow = "";
      animation = null;
    };
    animation.onfinish = finish;
    animation.oncancel = finish;
  });
});


// 滚动仅影响视觉反馈，保留浏览器原生滚轮和触摸行为。
const heroArt = document.querySelector(".hero-art");
const heroSection = document.querySelector(".hero");
const sectionLinks = [...document.querySelectorAll(".desktop-nav [data-section]")];
const navSections = sectionLinks.map((link) => document.getElementById(link.dataset.section)).filter(Boolean);
const revealed = new WeakSet();
const runningReveals = new Set();
let pendingSection = null;
let frameRequested = false;

function revealElement(element, repeat = false) {
  if (!element || reducedMotion.matches || typeof element.animate !== "function") return;
  if (!repeat && revealed.has(element)) return;
  revealed.add(element);
  const isRow = element.classList.contains("topic-row");
  const animation = element.animate([
    { opacity: isRow ? 0.25 : 0.15, transform: "translateY(" + (isRow ? 10 : 16) + "px)" },
    { opacity: 1, transform: "translateY(0)" }
  ], {
    duration: isRow ? 540 : 720,
    easing: "cubic-bezier(.2,.65,.25,1)"
  });
  runningReveals.add(animation);
  animation.onfinish = () => runningReveals.delete(animation);
  animation.oncancel = () => runningReveals.delete(animation);
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1 && !reducedMotion.matches) {
        revealElement(entry.target);
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: [0, 0.1], rootMargin: "0px 0px -34px 0px" });
  document.querySelectorAll(
    ".section > .section-heading, .section > .shell > .section-heading, .about-grid, .topic-row, .approach-grid, .community-grid, .contact-copy, .qr-block"
  ).forEach((element) => revealObserver.observe(element));
}

function updateScrollFeedback() {
  frameRequested = false;
  const marker = innerHeight * 0.38;
  let current = null;
  for (const section of navSections) {
    if (section.getBoundingClientRect().top <= marker) current = section.id;
  }
  for (const link of sectionLinks) {
    if (link.dataset.section === current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }

  if (heroArt && heroSection) {
    const bounds = heroSection.getBoundingClientRect();
    if (!reducedMotion.matches && bounds.bottom > 0 && bounds.top < innerHeight) {
      const progress = Math.max(-1, Math.min(1, -bounds.top / innerHeight));
      heroArt.style.transform = "translate3d(0," + (progress * -14).toFixed(2) + "px,0)";
    } else {
      heroArt.style.transform = "";
    }
  }
  if (pendingSection) {
    const bounds = pendingSection.target.getBoundingClientRect();
    if (performance.now() > pendingSection.until) pendingSection = null;
    else if (bounds.top < innerHeight * 0.72 && bounds.bottom > 0) {
      revealElement(pendingSection.target.querySelector(".section-heading") || pendingSection.target, true);
      pendingSection = null;
    }
  }
}

function scheduleScrollFeedback() {
  if (frameRequested) return;
  frameRequested = true;
  requestAnimationFrame(updateScrollFeedback);
}

document.querySelectorAll('a[href^="#"]:not([data-wechat])').forEach((link) => {
  link.addEventListener("click", () => {
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target || target === document.body || target.id === "main") return;
    pendingSection = { target, until: performance.now() + 2200 };
    scheduleScrollFeedback();
  });
});
window.addEventListener("scroll", scheduleScrollFeedback, { passive: true });
window.addEventListener("resize", scheduleScrollFeedback, { passive: true });
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) {
    runningReveals.forEach((animation) => animation.cancel());
    runningReveals.clear();
    pendingSection = null;
  }
  scheduleScrollFeedback();
});
scheduleScrollFeedback();
