(() => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;
  const labels = document.documentElement.lang.startsWith("zh")
    ? ["打开导航菜单", "关闭导航菜单"]
    : ["Open navigation", "Close navigation"];
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", labels[open ? 1 : 0]);
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setOpen(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 900) setOpen(false); });
})();
