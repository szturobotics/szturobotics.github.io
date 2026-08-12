(() => {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-nav]");
  const navLinks = navigation ? [...navigation.querySelectorAll("a[href^='#']")] : [];

  const setHeaderState = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const closeMenu = () => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "打开导航菜单");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      menuToggle.setAttribute("aria-label", willOpen ? "关闭导航菜单" : "打开导航菜单");
      navigation.classList.toggle("is-open", willOpen);
      document.body.classList.toggle("menu-open", willOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = [...document.querySelectorAll(".reveal")];

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if ("IntersectionObserver" in window && navLinks.length) {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!active) return;
        navLinks.forEach((link) => {
          const selected = link.getAttribute("href") === `#${active.target.id}`;
          link.classList.toggle("is-active", selected);
          if (selected) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.2, 0.5] },
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }
})();
