// ==UserScript==
// @name         Kitleleri Uyutma Aracı Engelleyici
// @namespace    http://x.com/operagxturkiye
// @version      1.2
// @description  Kitleleri oyalayan gönderileri bulan ve kullanıcının kontrolüne sunan bir araç.
// @author       Opera GX Türkiye
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/e/e7/Opera_GX_Icon.svg
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Kullanıcı tarafından özelleştirilebilir engellenen kelimeler listesi
    let keywords = JSON.parse(localStorage.getItem('blockedKeywords')) || [
        "futbol", "maç", "morinyo", "mourinho", "#GSvFB", "#FBvGS",
        "derbi", "fener", "fenerbahçe", "galatasaray", "gs", "fb",
        "okan buruk"
    ];

    function saveKeywords() {
        localStorage.setItem('blockedKeywords', JSON.stringify(keywords));
    }

    function addKeyword(word) {
        if (!keywords.includes(word.toLowerCase())) {
            keywords.push(word.toLowerCase());
            saveKeywords();
        }
    }

    function removeKeyword(word) {
        keywords = keywords.filter(k => k !== word.toLowerCase());
        saveKeywords();
    }

    function createSettingsButton() {
        const btn = document.createElement('button');
        btn.innerText = '⚙️ Filtre Ayarları';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px';
        btn.style.backgroundColor = '#ff0000';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';

        btn.onclick = function () {
            const userWord = prompt('Engellenecek yeni bir kelime ekleyin (veya kaldırmak için mevcut birini girin):');
            if (userWord) {
                if (keywords.includes(userWord.toLowerCase())) {
                    removeKeyword(userWord);
                    alert(`"${userWord}" kelimesi engellenenler listesinden çıkarıldı.`);
                } else {
                    addKeyword(userWord);
                    alert(`"${userWord}" kelimesi engellenenler listesine eklendi.`);
                }
            }
        };

        document.body.appendChild(btn);
    }

    function processArticles() {
        document.querySelectorAll('article').forEach(article => {
            if (article.getAttribute('data-blurred')) return;

            const textContent = article.innerText.toLowerCase();
            if (keywords.some(word => textContent.includes(word))) {
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.style.display = 'inline-block';

                const parent = article.parentNode;
                parent.replaceChild(wrapper, article);
                wrapper.appendChild(article);

                article.style.filter = 'blur(8px)';

                const overlay = document.createElement('div');
                overlay.innerText = '🚫 Bu içerik saklandı!';
                overlay.style.position = 'absolute';
                overlay.style.top = '50%';
                overlay.style.left = '50%';
                overlay.style.transform = 'translate(-50%, -50%)';
                overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
                overlay.style.color = 'white';
                overlay.style.padding = '8px 16px';
                overlay.style.fontSize = '16px';
                overlay.style.fontWeight = 'bold';
                overlay.style.zIndex = '10000';
                overlay.style.borderRadius = '8px';
                overlay.style.cursor = 'pointer';

                overlay.onclick = function () {
                    article.style.filter = 'none';
                    overlay.remove();
                };

                wrapper.appendChild(overlay);
                article.setAttribute('data-blurred', 'true');
            }
        });
    }

    // MutationObserver yerine belirli aralıklarla tarama yap
    setInterval(processArticles, 2000);

    createSettingsButton();
})();
