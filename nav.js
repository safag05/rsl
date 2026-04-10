document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     ACTIVE TAB AUTO-DETECTION
  =============================== */
  const navLinks = document.querySelectorAll("nav ul li a");
  const currentPath = window.location.pathname.replace(/\/$/, "");

  navLinks.forEach(link => {
    const linkPath = link.getAttribute("href").replace(/\/$/, "");

    if (
      linkPath === currentPath ||
      (linkPath === "./rules" && currentPath.includes("rules"))
    ) {
      link.classList.add("active");
    }
  });

  /* ===============================
     HAMBURGER MENU TOGGLE
  =============================== */
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  /* ===============================
     AUTO-CLOSE MENU ON LINK CLICK
  =============================== */
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });

  /* ===============================
     CLICK OUTSIDE TO CLOSE MENU
  =============================== */
  document.addEventListener("click", (e) => {
    if (
      nav?.classList.contains("open") &&
      !nav.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      nav.classList.remove("open");
    }
  });

  /* ===============================
     DROPDOWN NAVIGATION
  =============================== */
  const dropdown = document.getElementById("myDropdown");
  if (dropdown) {
    dropdown.addEventListener("change", function () {
      if (this.value) window.location.href = this.value;
    });
  }

});
