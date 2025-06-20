let blacklist = [];
let whitelist = [];

function applyHighlight(container, color) {
    if (!container || container.dataset.highlighted === 'true') return;

    container.style.backgroundColor = color;
    container.style.border = `2px solid ${color}`;
    container.style.borderRadius = '8px';
    container.style.padding = '4px';
    container.dataset.highlighted = 'true';
}

function scanTweetTexts() {
    const tweetDivs = document.querySelectorAll('div[data-testid="tweetText"]');

    tweetDivs.forEach(div => {
        if (div.dataset.checked === 'true') return;

        const fullText = div.innerText.toLowerCase();
        for (const item of blacklist) {
            if (item.word && fullText.includes(item.word.toLowerCase())) {
                div.innerHTML = `<span style="font-weight:bold;">${item.replace}</span>`;
                applyHighlight(div.closest('article') || div, '#ffcccc');
                div.dataset.checked = 'true';
                return;
            }
        }

        for (const item of whitelist) {
            if (item.word && fullText.includes(item.word.toLowerCase())) {
                applyHighlight(div.closest('article') || div, item.color || '#ffffcc');
                break;
            }
        }

        div.dataset.checked = 'true';
    });
}

function init() {
    chrome.storage.local.get(['blacklist', 'whitelist'], data => {
        blacklist = data.blacklist || [];
        whitelist = data.whitelist || [];
        setInterval(scanTweetTexts, 1500);
    });
}

init();
