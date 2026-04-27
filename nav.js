/* ============================================================
   RSL — nav.js
   Injects the shared navigation into every page automatically.
   To update the nav, edit ONLY this file.
   ============================================================ */

(function () {

  /* ── NAV HTML TEMPLATE ──────────────────────────────── */
  const NAV_HTML = `
    <button class="menu-toggle" id="menuToggle">☰ <span>Menu</span> ⚽</button>
    <nav>
      <ul>
        <li class="always-show"><a href="/">🏠 HOME</a></li>
        <li class="menu-only"><a href="/rules">📜 RULES</a></li>
        <li class="always-show"><a href="/fixtures">📅 FIXTURES</a></li>
        <li class="menu-only"><a href="/league_points">🏆 POINTS</a></li>
        <li class="menu-only"><a href="/teams">👥 TEAMS</a></li>
        <li class="menu-only">
          <select id="myDropdown" aria-label="Archive">
            <option value="" selected disabled>🗂️ ARCHIVE</option>
            <optgroup label="Archive - 2024">
              <option value="/archive/2024_league_points">League</option>
              <option value="/archive/2024_group_a_points">Group A</option>
              <option value="/archive/2024_group_b_points">Group B</option>
            </optgroup>
            <optgroup label="Archive - 2023">
              <option value="/archive/2023">League</option>
            </optgroup>
          </select>
        </li>
      </ul>
    </nav>`;

  /* ── INJECT INTO HEADER ─────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    if (header) {
      // Keep the existing <h1>, append nav after it
      const h1 = header.querySelector("h1");
      const navWrapper = document.createElement("div");
      navWrapper.innerHTML = NAV_HTML;
      // Insert all nav children after h1 (or at end of header)
      Array.from(navWrapper.children).forEach(el => header.appendChild(el));
    }

    /* ── ACTIVE TAB AUTO-DETECTION ──────────────────── */
    const navLinks = document.querySelectorAll("nav ul li a");
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/";

    navLinks.forEach(link => {
      const href = link.getAttribute("href").replace(/\/$/, "") || "/";
      if (href === currentPath || (href !== "/" && currentPath.startsWith(href))) {
        link.classList.add("active");
      }
    });

    /* ── HAMBURGER TOGGLE ───────────────────────────── */
    const menuToggle = document.getElementById("menuToggle");
    const nav = document.querySelector("nav");

    if (menuToggle && nav) {
      menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
    }

    /* ── AUTO-CLOSE ON LINK CLICK ───────────────────── */
    document.querySelectorAll("nav a").forEach(link => {
      link.addEventListener("click", () => nav?.classList.remove("open"));
    });

    /* ── CLICK OUTSIDE TO CLOSE ─────────────────────── */
    document.addEventListener("click", (e) => {
      if (
        nav?.classList.contains("open") &&
        !nav.contains(e.target) &&
        !menuToggle?.contains(e.target)
      ) {
        nav.classList.remove("open");
      }
    });

    /* ── ARCHIVE DROPDOWN NAVIGATION ───────────────── */
    const dropdown = document.getElementById("myDropdown");
    if (dropdown) {
      dropdown.addEventListener("change", function () {
        if (this.value) window.location.href = this.value;
      });
    }
  });

})();
