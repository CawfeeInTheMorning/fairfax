(function () {
  "use strict";

  const CATEGORY_ORDER = ["weapon", "vitality", "spirit"];
  const TIER_ORDER = [800, 1600, 3200, 6400];

  const shopEl = document.getElementById("shop-panels");
  const tabsEl = document.getElementById("category-tabs");
  const tooltipEl = document.getElementById("item-tooltip");
  const searchTab = document.getElementById("tab-search");

  let searchInputEl = null;
  let activeCategory = "weapon";

  function iconPath(category, file) {
    return SHOP_DATA[category].folder + "/" + file;
  }

  function buildTabs() {
    CATEGORY_ORDER.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "category-tab is-" + cat;
      btn.dataset.category = cat;
      btn.setAttribute("aria-label", SHOP_DATA[cat].label);
      btn.innerHTML = '<img class="tab-icon" src="frontend_assets/shop_icon_' + cat + '.png" alt="">';
      btn.addEventListener("click", () => setActiveCategory(cat));
      tabsEl.appendChild(btn);
    });

    searchTab.addEventListener("click", () => setActiveCategory("search"));
  }

  function setActiveCategory(cat) {
    activeCategory = cat;
    document.querySelectorAll(".category-tab").forEach((el) => {
      el.classList.toggle("active", el.dataset.category === cat);
    });
    document.querySelectorAll(".shop-panel").forEach((el) => {
      el.classList.toggle("active", el.id === "panel-" + cat);
    });
    searchTab.classList.toggle("is-open", cat === "search");
    if (cat === "search") {
      if (searchInputEl) searchInputEl.focus();
    } else if (searchInputEl) {
      searchInputEl.value = "";
      applySearchFilter("");
    }
    hideTooltip();
  }

  function buildPanels() {
    CATEGORY_ORDER.forEach((cat) => {
      const data = SHOP_DATA[cat];
      const panel = document.createElement("div");
      panel.className = "shop-panel category-" + cat;
      panel.id = "panel-" + cat;
      panel.style.backgroundImage = 'url("frontend_assets/shop_bg_' + cat + '.webp")';

      TIER_ORDER.forEach((tier) => {
        panel.appendChild(buildTierQuadrant(cat, tier));
      });

      shopEl.appendChild(panel);
    });

    setActiveCategory(activeCategory);
  }

  function buildSearchPanel() {
    const panel = document.createElement("div");
    panel.className = "shop-panel category-search";
    panel.id = "panel-search";
    panel.style.backgroundImage = 'url("frontend_assets/shop_bg_search.png")';

    const inputWrap = document.createElement("div");
    inputWrap.className = "search-input-wrap";
    const input = document.createElement("input");
    input.type = "text";
    input.id = "item-search-input";
    input.placeholder = "Search items...";
    input.addEventListener("input", (e) => applySearchFilter(e.target.value));
    inputWrap.appendChild(input);
    panel.appendChild(inputWrap);
    searchInputEl = input;

    const results = document.createElement("div");
    results.className = "search-results";

    CATEGORY_ORDER.forEach((cat) => {
      const section = document.createElement("section");
      section.className = "search-section";

      const heading = document.createElement("h2");
      heading.className = "search-section-title";
      heading.textContent = SHOP_DATA[cat].label;
      section.appendChild(heading);

      const grid = document.createElement("div");
      grid.className = "search-grid";
      TIER_ORDER.forEach((tier) => {
        (SHOP_DATA[cat].tiers[tier] || []).forEach((item) => {
          grid.appendChild(buildItemCard(cat, tier, item));
        });
      });
      section.appendChild(grid);

      results.appendChild(section);
    });

    panel.appendChild(results);
    shopEl.appendChild(panel);
  }

  function buildTierQuadrant(cat, tier) {
    const items = SHOP_DATA[cat].tiers[tier] || [];

    const quad = document.createElement("div");
    quad.className = "tier-quadrant tier-" + tier;

    const grid = document.createElement("div");
    grid.className = "mods-container";
    items.forEach((item) => grid.appendChild(buildItemCard(cat, tier, item)));
    quad.appendChild(grid);

    return quad;
  }

  function buildItemCard(cat, tier, item) {
    const card = document.createElement("div");
    card.className = "mod-box";
    card.dataset.category = cat;
    card.dataset.tier = tier;
    card.dataset.name = item.name;
    card.dataset.file = item.file;
    if (item.active) card.dataset.active = "1";
    if (item.imbue) card.dataset.imbue = "1";

    const cardBg = document.createElement("div");
    cardBg.className = "card-background";
    cardBg.style.backgroundImage = 'url("frontend_assets/card_' + cat + "_" + tier + '.png")';
    card.appendChild(cardBg);

    const paperIdx = ((item.name.length + tier) % 3) + 1;
    const paper = document.createElement("div");
    paper.className = "paper-texture";
    paper.style.backgroundImage = 'url("frontend_assets/shop_paper_' + paperIdx + '.png")';
    card.appendChild(paper);

    if (item.imbue) {
      const t = document.createElement("span");
      t.className = "item-tag tag-imbue";
      t.textContent = "Imbue";
      card.appendChild(t);
    }
    if (item.active) {
      const t = document.createElement("span");
      t.className = "item-tag tag-active";
      t.textContent = "Active";
      card.appendChild(t);
    }

    const iconContainer = document.createElement("div");
    iconContainer.className = "mod-icon-container";
    const icon = document.createElement("div");
    icon.className = "mod-icon";
    icon.style.backgroundImage = 'url("' + iconPath(cat, item.file) + '")';
    iconContainer.appendChild(icon);
    card.appendChild(iconContainer);

    const labelWrap = document.createElement("div");
    labelWrap.className = "mod-name-label-container";
    const label = document.createElement("div");
    label.className = "mod-name-label";
    label.textContent = item.name;
    labelWrap.appendChild(label);
    card.appendChild(labelWrap);

    card.addEventListener("mouseenter", () => {
      showTooltip(card, cat, tier, item);
      card.classList.add("is-hovered");
      const panel = card.closest(".shop-panel");
      if (panel) panel.classList.add("dimming");
    });
    card.addEventListener("mousemove", (e) => positionTooltip(e, card));
    card.addEventListener("mouseleave", () => {
      hideTooltip();
      card.classList.remove("is-hovered");
      const panel = card.closest(".shop-panel");
      if (panel) panel.classList.remove("dimming");
    });

    return card;
  }

  function showTooltip(card, cat, tier, item) {
    const key = cat + ":" + item.file;
    const desc = ITEM_DESCRIPTIONS[key] || "";

    let tagsHtml = "";
    if (item.imbue) tagsHtml += '<span class="tooltip-tag tag-imbue">Imbue</span>';
    if (item.active) tagsHtml += '<span class="tooltip-tag tag-active">Active</span>';

    tooltipEl.className = "item-tooltip category-" + cat;
    tooltipEl.innerHTML =
      '<div class="tooltip-header">' +
      '<span class="tooltip-name">' + item.name + "</span>" +
      '<span class="tooltip-cost"><img class="tooltip-soul" src="frontend_assets/icon_soul.svg" alt="">' + tier + "</span>" +
      "</div>" +
      '<div class="tooltip-meta">' +
      '<span class="tooltip-category">' + SHOP_DATA[cat].label + '</span>' +
      tagsHtml +
      "</div>" +
      '<div class="tooltip-desc">' + (desc || "Description coming soon.") + "</div>";

    tooltipEl.style.display = "block";
    positionTooltip(null, card);
  }

  function positionTooltip(e, card) {
    if (tooltipEl.style.display !== "block") return;
    const rect = card.getBoundingClientRect();
    const tw = tooltipEl.offsetWidth || 260;
    const th = tooltipEl.offsetHeight || 160;

    let left = rect.right + 12;
    let top = rect.top;

    if (left + tw > window.innerWidth - 8) {
      left = rect.left - tw - 12;
    }
    if (top + th > window.innerHeight - 8) {
      top = window.innerHeight - th - 8;
    }
    if (top < 8) top = 8;

    tooltipEl.style.left = left + window.scrollX + "px";
    tooltipEl.style.top = top + window.scrollY + "px";
  }

  function hideTooltip() {
    tooltipEl.style.display = "none";
  }

  function applySearchFilter(query) {
    const q = query.trim().toLowerCase();
    document.querySelectorAll(".mod-box").forEach((card) => {
      const match = !q || card.dataset.name.toLowerCase().includes(q);
      card.classList.toggle("search-hidden", !match);
    });
  }

  buildTabs();
  buildPanels();
  buildSearchPanel();
})();
