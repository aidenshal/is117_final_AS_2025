(function () {
    // GitHub Pages project URL looks like: /REPO_NAME/whatever...
    const parts = window.location.pathname.split("/").filter(Boolean);
    const repoRoot = parts.length > 0 ? `/${parts[0]}/` : "/";
  
    const links = [
      { label: "Hub", href: `${repoRoot}index.html`, key: "index.html" },
      { label: "Portfolio", href: `${repoRoot}portfolio/`, key: "portfolio" },
      { label: "Client Site", href: `${repoRoot}client_site/`, key: "client_site" },
      { label: "Design Style", href: `${repoRoot}design_style/`, key: "design_style" },
    ];
  
    // Inject banner CSS from the computed repo root
    const cssHref = `${repoRoot}shared/banner.css`;
    if (!document.querySelector(`link[href="${cssHref}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssHref;
      document.head.appendChild(link);
    }
  
    const currentPath = window.location.pathname;
  
    const banner = document.createElement("div");
    banner.className = "universal-banner";
    banner.innerHTML = `
      <div class="universal-banner__inner">
        <a class="universal-banner__brand" href="${links[0].href}">
          <span class="universal-banner__dot" aria-hidden="true"></span>
          <span>IS117 Final • Aiden Shalaby</span>
        </a>
  
        <div class="universal-banner__chip">
          3 sites • Shared nav • GitHub Pages
        </div>
  
        <nav class="universal-banner__nav" aria-label="Site switcher">
          ${links.map((l) => {
            const active =
              currentPath.includes(`/${l.key}`) ||
              (l.key === "index.html" && (currentPath.endsWith(`/${parts[0]}/`) || currentPath.endsWith(`/index.html`)));
            return `<a class="universal-banner__link ${active ? "is-active" : ""}" href="${l.href}">${l.label}</a>`;
          }).join("")}
        </nav>
      </div>
    `;
  
    document.addEventListener("DOMContentLoaded", () => {
      document.body.insertBefore(banner, document.body.firstChild);
    });
  })();
  