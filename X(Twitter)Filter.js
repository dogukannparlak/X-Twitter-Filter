// ==UserScript==
// @name         Kitleleri Uyutma Aracı Engelleyici
// @namespace    http://x.com/operagxturkiye
// @version      2.0
// @description  Bu eklenti, gündemi değiştirmek isteyen ve kitleleri uyutmak için ortaya çıkan gönderileri engellemek için tasarlanmıştır. Gelişmiş filtreleme özellikleri içerir.
// @author       Opera GX Türkiye /dogukanparIak /dursunator
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Opera_GX_Icon.svg/2048px-Opera_GX_Icon.svg.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL  https://raw.githubusercontent.com/dogukannparlak/Kitleleri_Uyutma_Engelleyici/main/X(Twitter)Filter.js
// @updateURL    https://raw.githubusercontent.com/dogukannparlak/Kitleleri_Uyutma_Engelleyici/main/X(Twitter)Filter.js
// ==/UserScript==

(function () {
  "use strict";

  // Enhanced default settings with all new features
  const defaultSettings = {
    filterMode: "blur",
    kitlelerUyutmaKeywords:
      "futbol,maç,morinyo,mourinho,#GSvFB,#FBvGS,derbi,fener,fenerbahçe,galatasaray,gs,fb,okan buruk,osimhhen,bjk",
    ekKeywords: "",
    specialAccounts: "fahrettinaltun,06melihgokcek",
    grokKeywords: "grok,GROK,@grok",
    isEnabled: true,
    shortcutsEnabled: true,
    customFilters: [
      {
        name: "Politik",
        keywords: "siyaset,seçim,miting",
        message: "Politik içerik filtrelendi",
      },
      {
        name: "Reklam",
        keywords: "kampanya,indirim,fırsat",
        message: "Reklam içeriği filtrelendi",
      },
    ],
    theme: "dracula",
    filterStrength: "medium",
  };

  let settings = GM_getValue("uaSettings", defaultSettings);
  verifySettings();

  // Theme definitions
  const themes = {
    dracula: {
      primary: "#ff5555",
      background: "#282a36",
      text: "#f8f8f2",
    },
    nord: {
      primary: "#88c0d0",
      background: "#2e3440",
      text: "#eceff4",
    },
    custom: {
      primary: "#f0f",
      background: "#111",
      text: "#fff",
    },
  };

  // Filter strength options
  const filterOptions = {
    strength: {
      light: { blurAmount: "4px", label: "Hafif Bulanıklık" },
      medium: { blurAmount: "8px", label: "Orta Bulanıklık" },
      strong: { blurAmount: "12px", label: "Güçlü Bulanıklık" },
    },
  };

  // Apply selected theme
  function applyTheme() {
    const theme = themes[settings.theme] || themes.dracula;
    GM_addStyle(`
            :root {
                --ua-primary: ${theme.primary};
                --ua-background: ${theme.background};
                --ua-text: ${theme.text};
            }
        `);
  }

  applyTheme();

  // Enhanced CSS with theme variables
  GM_addStyle(`
        #uaSettingsPanel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--ua-background);
            border: 1px solid var(--ua-primary);
            border-radius: 12px;
            padding: 24px;
            z-index: 10001;
            width: 500px;
            height: 70vh;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            color: var(--ua-text);
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
        }

        #uaSettingsPanel h2 {
            text-align: center;
            margin-bottom: 20px;
            color: var(--ua-primary);
            font-size: 24px;
            font-weight: 700;
        }

        .ua-tab-container {
            height: calc(100% - 120px);
            overflow: hidden;
            position: relative;
        }

        .ua-scroll-content {
            max-height: calc(70vh - 150px);
            overflow-y: auto;
            padding-right: 10px;
        }

        .ua-tabs {
            display: flex;
            border-bottom: 1px solid var(--ua-primary);
            margin-bottom: 15px;
        }

        .ua-tab {
            padding: 10px 15px;
            cursor: pointer;
            background: none;
            border: none;
            color: var(--ua-text);
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
            font-size: 14px;
        }

        .ua-tab:hover {
            background-color: rgba(255, 85, 85, 0.1);
        }

        .ua-tab.active {
            border-bottom-color: var(--ua-primary);
            font-weight: bold;
        }

        .ua-tab-content {
            display: none;
            height: 100%;
        }

        .ua-tab-content.active {
            display: block;
        }

        .ua-section {
            margin-bottom: 20px;
            padding: 15px;
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }

        .ua-section-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: var(--ua-primary);
            font-size: 16px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }

        select, textarea, input[type="text"] {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            background-color: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--ua-primary);
            border-radius: 4px;
            color: var(--ua-text);
        }

        textarea {
            min-height: 80px;
            resize: vertical;
        }

        .ua-info {
            font-size: 12px;
            color: #aaa;
            margin-top: -8px;
            margin-bottom: 10px;
        }

        .ua-info-box {
            background-color: rgba(0, 0, 0, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
            font-size: 13px;
        }

        .ua-info-box p {
            margin: 5px 0;
        }

        .ua-info-box strong {
            color: var(--ua-primary);
        }

        .ua-buttons-container {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
        }

        .ua-button {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
        }

        .ua-button-primary {
            background-color: var(--ua-primary);
            color: white;
        }

        .ua-button-primary:hover {
            opacity: 0.9;
        }

        .ua-button-secondary {
            background-color: transparent;
            border: 1px solid var(--ua-primary);
            color: var(--ua-primary);
        }

        .ua-button-secondary:hover {
            background-color: rgba(255, 85, 85, 0.1);
        }

        .ua-custom-filter {
            background-color: rgba(0, 0, 0, 0.2);
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .ua-custom-filter input,
        .ua-custom-filter textarea {
            margin-bottom: 8px;
        }

        .delete-filter {
            padding: 5px 10px;
            font-size: 12px;
        }

        .ua-link-button {
            background: none;
            border: 1px solid var(--ua-primary);
            color: var(--ua-primary);
            padding: 8px 12px;
            margin: 5px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 13px;
        }

        .ua-link-button:hover {
            background-color: var(--ua-primary);
            color: white;
        }

        .ua-shortcut-box {
            background-color: rgba(0, 0, 0, 0.1);
            padding: 15px;
            border-radius: 8px;
        }

        .ua-shortcut-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .ua-shortcut-list li {
            margin-bottom: 8px;
            padding: 8px;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
        }

        .ua-kbd {
            display: inline-block;
            padding: 2px 6px;
            background-color: rgba(0, 0, 0, 0.3);
            border: 1px solid var(--ua-primary);
            border-radius: 3px;
            font-family: monospace;
            font-size: 12px;
        }

        .ua-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--ua-primary);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Scrollbar styling */
        .ua-scroll-content::-webkit-scrollbar {
            width: 8px;
        }

        .ua-scroll-content::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }

        .ua-scroll-content::-webkit-scrollbar-thumb {
            background-color: var(--ua-primary);
            border-radius: 10px;
        }
    `);

  // Verify and repair settings
  function verifySettings() {
    let needsFix = false;

    for (const key in defaultSettings) {
      if (settings[key] === undefined) {
        settings[key] = defaultSettings[key];
        needsFix = true;
      }
    }

    if (needsFix) {
      GM_setValue("uaSettings", settings);
      showNotification("Eksik ayarlar onarıldı", "info");
    }
  }

  // Safe execution wrapper
  function safeExecute(fn, fallbackValue) {
    try {
      return fn();
    } catch (error) {
      console.error(`Kitleleri Uyutma Aracı Hata: ${error.message}`, error);
      showNotification("Bir hata oluştu. Konsolu kontrol edin.", "error");
      return fallbackValue;
    }
  }

  // Get all keywords from different sources
  function getAllKeywords() {
    const kitlelerUyutmaKeywords = settings.kitlelerUyutmaKeywords
      .split(",")
      .map((keyword) => keyword.trim().toLowerCase())
      .filter((keyword) => keyword !== "");

    const ekKeywords = settings.ekKeywords
      .split(",")
      .map((keyword) => keyword.trim().toLowerCase())
      .filter((keyword) => keyword !== "");

    return [...kitlelerUyutmaKeywords, ...ekKeywords];
  }

  // Get special accounts from settings
  function getSpecialAccounts() {
    return settings.specialAccounts
      .split(",")
      .map((account) => account.trim().toLowerCase())
      .filter((account) => account !== "");
  }

  // Get GROK keywords from settings
  function getGrokKeywords() {
    return settings.grokKeywords
      .split(",")
      .map((keyword) => keyword.trim().toLowerCase())
      .filter((keyword) => keyword !== "");
  }

  // Check custom filters
  function checkCustomFilters(textContent) {
    for (const filter of settings.customFilters) {
      const filterKeywords = filter.keywords
        .split(",")
        .map((keyword) => keyword.trim().toLowerCase())
        .filter((keyword) => keyword !== "");

      if (filterKeywords.some((word) => textContent.includes(word))) {
        return { filtered: true, reason: filter.message || "🚫 Özel filtre" };
      }
    }
    return { filtered: false };
  }

  // Throttled observer for better performance
  function throttledObserver() {
    let timeout;
    return function () {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        processNewContent();
      }, 200);
    };
  }

  const optimizedObserver = throttledObserver();

  // Keyboard shortcuts
  function redirectToOperaGX(event) {
    if (!settings.shortcutsEnabled) return;

    if (event.altKey && event.shiftKey && event.key === "O") {
      window.open("https://www.opera.com/tr/gx", "_blank");
    } else if (event.altKey && event.shiftKey && event.key === "I") {
      window.open("https://x.com/operagxturkiye", "_blank");
    } else if (event.altKey && event.shiftKey && event.key === "K") {
      toggleSettingsPanel();
    }
  }

  document.addEventListener("keydown", redirectToOperaGX);

  // Main observer for filtering content
  const observer = new MutationObserver(() => {
    if (!settings.isEnabled) return;

    const keywords = getAllKeywords();
    const specialAccounts = getSpecialAccounts();
    const grokKeywords = getGrokKeywords();

    document.querySelectorAll("article").forEach((article) => {
      if (article.getAttribute("data-processed")) return;

      const textContent = article.innerText.toLowerCase();
      let filterReason = "";
      let shouldFilter = false;

      // Check for special accounts
      const usernameElements = article.querySelectorAll(
        '[data-testid="User-Name"]'
      );
      let isSpecialAccount = false;

      usernameElements.forEach((element) => {
        const usernameText = element.textContent.toLowerCase();

        specialAccounts.forEach((account) => {
          if (usernameText.includes("@" + account)) {
            filterReason = "Bu kişi rende binasına hizmet ediyor";
            shouldFilter = true;
            isSpecialAccount = true;
          }
        });
      });

      // If not a special account, check other filters
      if (!isSpecialAccount) {
        // Check for GROK account
        const isGrokAccount = Array.from(usernameElements).some((el) =>
          el.textContent.toLowerCase().includes("@grok")
        );

        if (isGrokAccount) {
          filterReason = "GROK tarafından yazılmıştır";
          shouldFilter = true;
        }
        // Check for GROK keywords
        else if (grokKeywords.some((word) => textContent.includes(word))) {
          filterReason = "GROK çağrılmıştır";
          shouldFilter = true;
        }
        // Check custom filters
        else {
          const customFilterResult = checkCustomFilters(textContent);
          if (customFilterResult.filtered) {
            filterReason = customFilterResult.reason;
            shouldFilter = true;
          }
          // Check regular keywords
          else if (keywords.some((word) => textContent.includes(word))) {
            filterReason = "🚫 KİTLELERİ UYUTMA ARACI";
            shouldFilter = true;
          }
        }
      }

      if (shouldFilter) {
        if (settings.filterMode === "blur") {
          blurContent(article, filterReason);
        } else {
          hideContent(article);
        }

        article.setAttribute("data-processed", "true");
        article.setAttribute("data-filter-reason", filterReason);
      }
    });
  });

  // Filtering functions
  function blurContent(article, reason) {
    const blurAmount =
      filterOptions.strength[settings.filterStrength]?.blurAmount || "8px";

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.width = "100%";

    const parent = article.parentNode;
    parent.replaceChild(wrapper, article);
    wrapper.appendChild(article);

    article.style.filter = `blur(${blurAmount})`;

    const overlay = document.createElement("div");
    overlay.innerText = reason;
    overlay.style.position = "absolute";
    overlay.style.top = "50%";
    overlay.style.left = "50%";
    overlay.style.transform = "translate(-50%, -50%)";
    overlay.style.backgroundColor = "rgba(255, 85, 85, 0.9)";
    overlay.style.color = "white";
    overlay.style.padding = "10px 20px";
    overlay.style.fontSize = "16px";
    overlay.style.fontWeight = "bold";
    overlay.style.zIndex = "10000";
    overlay.style.borderRadius = "8px";
    overlay.style.pointerEvents = "none";
    overlay.style.textAlign = "center";
    overlay.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    wrapper.appendChild(overlay);

    const clickOverlay = document.createElement("div");
    clickOverlay.style.position = "absolute";
    clickOverlay.style.top = "0";
    clickOverlay.style.left = "0";
    clickOverlay.style.width = "100%";
    clickOverlay.style.height = "100%";
    clickOverlay.style.zIndex = "9999";
    clickOverlay.style.cursor = "pointer";
    clickOverlay.title = "İçeriği görmek için tıkla";

    clickOverlay.addEventListener("click", function (e) {
      e.stopPropagation();
      wrapper.removeChild(overlay);
      wrapper.removeChild(clickOverlay);
      article.style.filter = "none";
    });

    wrapper.appendChild(clickOverlay);
  }

  function hideContent(article) {
    article.style.display = "none";
  }

  // Settings panel functions
  function createSettingsPanel() {
    const panel = document.createElement("div");
    panel.id = "uaSettingsPanel";

    panel.innerHTML = `
            <h2>Kitleleri Uyutma Aracı Ayarları</h2>

            <div class="ua-tabs">
                <button class="ua-tab active" data-tab="general">Genel</button>
                <button class="ua-tab" data-tab="accounts">Hesaplar</button>
                <button class="ua-tab" data-tab="keywords">Anahtar Kelimeler</button>
                <button class="ua-tab" data-tab="custom">Özel Filtreler</button>
                <button class="ua-tab" data-tab="shortcuts">Kısayollar</button>
            </div>

            <div class="ua-tab-container">
                <div class="ua-tab-content active" data-tab="general">
                    <div class="ua-scroll-content">
                        <div class="ua-section">
                            <div class="ua-section-title">Genel Ayarlar</div>
                            <label for="uaEnabled">Eklenti Durumu:</label>
                            <select id="uaEnabled">
                                <option value="true" ${
                                  settings.isEnabled ? "selected" : ""
                                }>Aktif</option>
                                <option value="false" ${
                                  !settings.isEnabled ? "selected" : ""
                                }>Pasif</option>
                            </select>

                            <label for="uaFilterMode">Filtreleme Modu:</label>
                            <select id="uaFilterMode">
                                <option value="blur" ${
                                  settings.filterMode === "blur"
                                    ? "selected"
                                    : ""
                                }>Bulanıklaştır</option>
                                <option value="hide" ${
                                  settings.filterMode === "hide"
                                    ? "selected"
                                    : ""
                                }>Tamamen Gizle</option>
                            </select>

                            <label for="uaFilterStrength">Bulanıklık Seviyesi:</label>
                            <select id="uaFilterStrength">
                                ${Object.entries(filterOptions.strength)
                                  .map(
                                    ([key, option]) =>
                                      `<option value="${key}" ${
                                        settings.filterStrength === key
                                          ? "selected"
                                          : ""
                                      }>${option.label}</option>`
                                  )
                                  .join("")}
                            </select>

                            <label for="uaShortcutsEnabled">Klavye Kısayolları Aktif:</label>
                            <select id="uaShortcutsEnabled">
                                <option value="true" ${
                                  settings.shortcutsEnabled ? "selected" : ""
                                }>Aktif</option>
                                <option value="false" ${
                                  !settings.shortcutsEnabled ? "selected" : ""
                                }>Pasif</option>
                            </select>

                            <label for="uaTheme">Tema:</label>
                            <select id="uaTheme">
                                ${Object.keys(themes)
                                  .map(
                                    (theme) =>
                                      `<option value="${theme}" ${
                                        settings.theme === theme
                                          ? "selected"
                                          : ""
                                      }>${
                                        theme.charAt(0).toUpperCase() +
                                        theme.slice(1)
                                      }</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>

                        <div class="ua-section">
                            <div class="ua-section-title">Filtreleme Nasıl Çalışır?</div>
                            <div class="ua-info-box">
                                <p><strong>Özel hesaplar:</strong> Belirtilen hesaplardan gelen tüm içerikler filtrelenir.</p>
                                <p><strong>GROK hesabı:</strong> @grok hesabından gelen tüm içerikler filtrelenir.</p>
                                <p><strong>GROK anahtar kelimeleri:</strong> Belirtilen kelimeleri içeren içerikler filtrelenir.</p>
                                <p><strong>Kitleleri uyutma kelimeleri:</strong> Belirtilen kelimeleri içeren içerikler filtrelenir.</p>
                                <p><strong>Özel filtreler:</strong> Kendi oluşturduğunuz filtre kuralları uygulanır.</p>
                            </div>
                        </div>
                        <div class="ua-buttons-container">
                        <button id="uaSaveButton" class="ua-button ua-button-primary">Kaydet</button>
                        <button id="uaCloseButton" class="ua-button ua-button-secondary">Kapat</button>
                    </div>
                    </div>

                </div>

                <div class="ua-tab-content" data-tab="accounts">
                    <div class="ua-scroll-content">
                        <div class="ua-section">
                            <div class="ua-section-title">Filtrelenecek Hesaplar</div>

                            <label for="specialAccounts">Özel Hesaplar:</label>
                            <textarea id="specialAccounts" placeholder="fahrettinaltun,06melihgokcek">${
                              settings.specialAccounts
                            }</textarea>
                            <div class="ua-info">Virgülle ayırarak yazın. Örnek: hesapadi1,hesapadi2</div>

                            <label for="grokAccounts">GROK Hesapları:</label>
                            <textarea id="grokAccounts" placeholder="grok,GROK,@grok">${
                              settings.grokKeywords
                            }</textarea>
                            <div class="ua-info">Virgülle ayırarak yazın. Örnek: grok,GROK,@grok</div>
                        </div>

                        <div class="ua-section">
                            <div class="ua-section-title">Örnek Hesaplar</div>
                            <div class="ua-info-box">
                                <p><strong>Politik Hesaplar:</strong> fahrettinaltun,06melihgokcek</p>
                                <p><strong>Spor Hesapları:</strong> beinsportsturkiye,ligtv</p>
                                <p><strong>Reklam Hesapları:</strong> trendyol,hepsiburada</p>
                            </div>
                        </div>
                        <div class="ua-buttons-container">
                        <button id="uaSaveButton" class="ua-button ua-button-primary">Kaydet</button>
                        <button id="uaCloseButton" class="ua-button ua-button-secondary">Kapat</button>
                    </div>
                    </div>

                </div>

                <div class="ua-tab-content" data-tab="keywords">
                    <div class="ua-scroll-content">
                        <div class="ua-section">
                            <div class="ua-section-title">Anahtar Kelime Filtreleri</div>

                            <label for="kitlelerUyutmaKeywords">Kitleleri Uyutma Kelimeleri:</label>
                            <textarea id="kitlelerUyutmaKeywords" placeholder="futbol,maç,morinyo,mourinho">${
                              settings.kitlelerUyutmaKeywords
                            }</textarea>
                            <div class="ua-info">Virgülle ayırarak yazın. Örnek: futbol,maç,gs,fb</div>

                            <label for="ekKeywords">Ek Anahtar Kelimeler:</label>
                            <textarea id="ekKeywords" placeholder="deneme,test,filtre">${
                              settings.ekKeywords
                            }</textarea>
                            <div class="ua-info">Virgülle ayırarak yazın. Ekstra filtrelemek istediğiniz kelimeler</div>
                        </div>

                        <div class="ua-section">
                            <div class="ua-section-title">Örnek Anahtar Kelimeler</div>
                            <div class="ua-info-box">
                                <p><strong>Spor:</strong> futbol,maç,gs,fb,fenerbahçe,galatasaray</p>
                                <p><strong>Politika:</strong> seçim,aday,siyaset,miting</p>
                                <p><strong>Reklam:</strong> indirim,kampanya,fırsat,ürün</p>
                            </div>
                        </div>
                        <div class="ua-buttons-container">
                        <button id="uaSaveButton" class="ua-button ua-button-primary">Kaydet</button>
                        <button id="uaCloseButton" class="ua-button ua-button-secondary">Kapat</button>
                    </div>
                    </div>

                </div>

                <div class="ua-tab-content" data-tab="custom">
                    <div class="ua-scroll-content">
                        <div class="ua-section">
                            <div class="ua-section-title">Özel Filtre Kategorileri</div>
                            <div id="customFiltersList">
                                ${settings.customFilters
                                  .map(
                                    (filter, index) => `
                                    <div class="ua-custom-filter" data-index="${index}">
                                        <input type="text" class="filter-name" value="${filter.name}" placeholder="Kategori Adı">
                                        <textarea class="filter-keywords" placeholder="Anahtar kelimeler">${filter.keywords}</textarea>
                                        <input type="text" class="filter-message" value="${filter.message}" placeholder="Filtreleme mesajı">
                                        <button class="ua-button ua-button-secondary delete-filter">Sil</button>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                            <button id="addNewFilter" class="ua-button ua-button-primary">Yeni Filtre Ekle</button>
                        </div>

                        <div class="ua-section">
                            <div class="ua-section-title">Filtreleri Dışa/İçe Aktarma</div>
                            <div class="ua-buttons-container">
                                <button id="exportFilters" class="ua-button ua-button-secondary">Filtreleri Dışa Aktar</button>
                                <input type="file" id="importFiltersInput" accept=".json" style="display:none">
                                <button id="importFilters" class="ua-button ua-button-secondary">Filtreleri İçe Aktar</button>
                            </div>
                        </div>
                        <div class="ua-buttons-container">
                        <button id="uaSaveButton" class="ua-button ua-button-primary">Kaydet</button>
                        <button id="uaCloseButton" class="ua-button ua-button-secondary">Kapat</button>
                    </div>
                    </div>

                </div>

                <div class="ua-tab-content" data-tab="shortcuts">
                    <div class="ua-scroll-content">
                        <div class="ua-section">
                            <div class="ua-section-title">Klavye Kısayolları</div>
                            <div class="ua-shortcut-box">
                                <ul class="ua-shortcut-list">
                                    <li><span class="ua-kbd">Alt</span> + <span class="ua-kbd">Shift</span> + <span class="ua-kbd">K</span>: Ayarlar panelini aç/kapat</li>
                                    <li><span class="ua-kbd">Alt</span> + <span class="ua-kbd">Shift</span> + <span class="ua-kbd">O</span>: Opera GX sayfasını aç</li>
                                    <li><span class="ua-kbd">Alt</span> + <span class="ua-kbd">Shift</span> + <span class="ua-kbd">I</span>: Opera GX Türkiye sayfasını aç</li>
                                </ul>
                            </div>
                        </div>

                        <div class="ua-section">
                            <div class="ua-section-title">Hızlı Erişim Linkleri</div>
                            <div class="ua-links-container">
                                <button class="ua-link-button" data-url="https://www.opera.com/tr/gx">Opera GX</button>
                                <button class="ua-link-button" data-url="https://x.com/operagxturkiye">Opera GX Türkiye</button>
                                <button class="ua-link-button" data-url="https://x.com/dogukanparIak">DogukanparIak</button>
                                <button class="ua-link-button" data-url="https://x.com/dursunator">Dursunator</button>
                            </div>
                        </div>
                        <div class="ua-buttons-container">
                        <button id="uaSaveButton" class="ua-button ua-button-primary">Kaydet</button>
                        <button id="uaCloseButton" class="ua-button ua-button-secondary">Kapat</button>
                    </div>
                    </div>

                </div>

            </div>
        `;

    document.body.appendChild(panel);

    // Tab functionality
    panel.querySelectorAll(".ua-tab").forEach((tab) => {
      tab.addEventListener("click", function () {
        const tabName = this.getAttribute("data-tab");
        panel
          .querySelectorAll(".ua-tab")
          .forEach((t) => t.classList.remove("active"));
        panel
          .querySelectorAll(".ua-tab-content")
          .forEach((c) => c.classList.remove("active"));
        this.classList.add("active");
        panel
          .querySelector(`.ua-tab-content[data-tab="${tabName}"]`)
          .classList.add("active");
      });
    });

    // Link buttons
    panel.querySelectorAll(".ua-link-button").forEach((button) => {
      button.addEventListener("click", function () {
        window.open(this.dataset.url, "_blank");
      });
    });

    // Add new filter button
    panel.querySelector("#addNewFilter").addEventListener("click", function () {
      const newFilterDiv = document.createElement("div");
      newFilterDiv.className = "ua-custom-filter";
      newFilterDiv.dataset.index =
        document.querySelectorAll(".ua-custom-filter").length;
      newFilterDiv.innerHTML = `
                <input type="text" class="filter-name" placeholder="Kategori Adı">
                <textarea class="filter-keywords" placeholder="Anahtar kelimeler"></textarea>
                <input type="text" class="filter-message" placeholder="Filtreleme mesajı">
                <button class="ua-button ua-button-secondary delete-filter">Sil</button>
            `;
      document.getElementById("customFiltersList").appendChild(newFilterDiv);

      newFilterDiv
        .querySelector(".delete-filter")
        .addEventListener("click", function () {
          newFilterDiv.remove();
        });
    });

    // Delete filter buttons
    panel.querySelectorAll(".delete-filter").forEach((button) => {
      button.addEventListener("click", function () {
        this.closest(".ua-custom-filter").remove();
      });
    });

    // Export filters
    panel
      .querySelector("#exportFilters")
      .addEventListener("click", function () {
        const filtersToExport = {
          kitlelerUyutmaKeywords: document.getElementById(
            "kitlelerUyutmaKeywords"
          ).value,
          ekKeywords: document.getElementById("ekKeywords").value,
          specialAccounts: document.getElementById("specialAccounts").value,
          grokKeywords: document.getElementById("grokAccounts").value,
          customFilters: [],
        };

        document.querySelectorAll(".ua-custom-filter").forEach((filterDiv) => {
          const name = filterDiv.querySelector(".filter-name").value;
          const keywords = filterDiv.querySelector(".filter-keywords").value;
          const message = filterDiv.querySelector(".filter-message").value;

          if (name && keywords) {
            filtersToExport.customFilters.push({ name, keywords, message });
          }
        });

        const dataStr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(filtersToExport));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute(
          "download",
          "kitleleri_uyutma_filtreleri.json"
        );
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      });

    // Import filters
    panel
      .querySelector("#importFilters")
      .addEventListener("click", function () {
        document.getElementById("importFiltersInput").click();
      });

    panel
      .querySelector("#importFiltersInput")
      .addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            const importedFilters = JSON.parse(e.target.result);

            if (importedFilters.kitlelerUyutmaKeywords)
              document.getElementById("kitlelerUyutmaKeywords").value =
                importedFilters.kitlelerUyutmaKeywords;

            if (importedFilters.ekKeywords)
              document.getElementById("ekKeywords").value =
                importedFilters.ekKeywords;

            if (importedFilters.specialAccounts)
              document.getElementById("specialAccounts").value =
                importedFilters.specialAccounts;

            if (importedFilters.grokKeywords)
              document.getElementById("grokAccounts").value =
                importedFilters.grokKeywords;

            if (
              importedFilters.customFilters &&
              importedFilters.customFilters.length > 0
            ) {
              document.getElementById("customFiltersList").innerHTML = "";

              importedFilters.customFilters.forEach((filter, index) => {
                const newFilterDiv = document.createElement("div");
                newFilterDiv.className = "ua-custom-filter";
                newFilterDiv.dataset.index = index;
                newFilterDiv.innerHTML = `
                                <input type="text" class="filter-name" value="${filter.name}" placeholder="Kategori Adı">
                                <textarea class="filter-keywords" placeholder="Anahtar kelimeler">${filter.keywords}</textarea>
                                <input type="text" class="filter-message" value="${filter.message}" placeholder="Filtreleme mesajı">
                                <button class="ua-button ua-button-secondary delete-filter">Sil</button>
                            `;
                document
                  .getElementById("customFiltersList")
                  .appendChild(newFilterDiv);

                newFilterDiv
                  .querySelector(".delete-filter")
                  .addEventListener("click", function () {
                    newFilterDiv.remove();
                  });
              });
            }

            showNotification("Filtreler başarıyla içe aktarıldı!");
          } catch (error) {
            showNotification("Filtreler içe aktarılırken bir hata oluştu.");
            console.error("Filter import error:", error);
          }
        };
        reader.readAsText(file);
      });

    // Save button
    document
      .getElementById("uaSaveButton")
      .addEventListener("click", saveSettings);

    // Close button
    document
      .getElementById("uaCloseButton")
      .addEventListener("click", function () {
        document.body.removeChild(panel);
      });

    return panel;
  }

  function saveSettings() {
    const newSettings = {
      filterMode: document.getElementById("uaFilterMode").value,
      kitlelerUyutmaKeywords: document.getElementById("kitlelerUyutmaKeywords")
        .value,
      ekKeywords: document.getElementById("ekKeywords").value,
      specialAccounts: document.getElementById("specialAccounts").value,
      grokKeywords: document.getElementById("grokAccounts").value,
      isEnabled: document.getElementById("uaEnabled").value === "true",
      shortcutsEnabled:
        document.getElementById("uaShortcutsEnabled").value === "true",
      theme: document.getElementById("uaTheme").value,
      filterStrength: document.getElementById("uaFilterStrength").value,
      customFilters: [],
    };

    // Gather custom filters
    document.querySelectorAll(".ua-custom-filter").forEach((filterDiv) => {
      const name = filterDiv.querySelector(".filter-name").value;
      const keywords = filterDiv.querySelector(".filter-keywords").value;
      const message = filterDiv.querySelector(".filter-message").value;

      if (name && keywords) {
        newSettings.customFilters.push({ name, keywords, message });
      }
    });

    settings = newSettings;
    GM_setValue("uaSettings", settings);

    // Reset processed articles
    document.querySelectorAll("[data-processed]").forEach((el) => {
      el.removeAttribute("data-processed");
      el.removeAttribute("data-filter-reason");

      if (el.style.filter) {
        el.style.filter = "none";

        const parent = el.parentNode;
        if (parent && parent.parentNode && parent.tagName === "DIV") {
          const grandParent = parent.parentNode;
          grandParent.replaceChild(el, parent);
        }
      }

      if (el.style.display === "none") {
        el.style.display = "";
      }
    });

    showNotification("Ayarlar kaydedildi ve uygulandı!");

    const panel = document.getElementById("uaSettingsPanel");
    if (panel) {
      document.body.removeChild(panel);
    }

    // Reapply theme
    applyTheme();

    // Restart observer
    observer.disconnect();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function toggleSettingsPanel() {
    let panel = document.getElementById("uaSettingsPanel");

    if (panel) {
      document.body.removeChild(panel);
    } else {
      panel = createSettingsPanel();
      panel.style.display = "block";
    }
  }

  function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "ua-notification";
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(function () {
      document.body.removeChild(notification);
    }, 3000);
  }

  // Menu commands
  GM_registerMenuCommand("⚙️ Ayarları Aç", toggleSettingsPanel);
  GM_registerMenuCommand("🔄 Yenile", function () {
    location.reload();
  });
  GM_registerMenuCommand("🌐 Opera GX Sayfasına Git", function () {
    window.open("https://www.opera.com/tr/gx", "_blank");
  });
  GM_registerMenuCommand("🐦 DogukanparIak Profiline Git", function () {
    window.open("https://x.com/dogukanparIak", "_blank");
  });
  GM_registerMenuCommand("🐦 Opera GX Türkiye X Hesabı", function () {
    window.open("https://x.com/operagxturkiye", "_blank");
  });
  GM_registerMenuCommand("🐦 Dursunator Profiline Git", function () {
    window.open("https://x.com/dursunator", "_blank");
  });

  // Start observing
  observer.observe(document.body, { childList: true, subtree: true });
})();
