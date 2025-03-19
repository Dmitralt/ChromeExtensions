let totalWatchTime = 0;
let activeVideoTab = null;
let interval = null;

chrome.storage.local.get(["totalWatchTime"], (data) => {
    totalWatchTime = data.totalWatchTime || 0;
});

function checkActiveVideoTab() {
    chrome.tabs.query({ audible: true }, (tabs) => {
        const youtubeTab = tabs.find(tab => tab.url.includes("youtube.com/watch") || tab.url.includes("youtube.com/shorts"));
        if (youtubeTab) {
            if (!interval) {
                activeVideoTab = youtubeTab.id;
                interval = setInterval(() => {
                    totalWatchTime += 1;
                    chrome.storage.local.set({ totalWatchTime });
                }, 1000);
            }
        } else {
            clearInterval(interval);
            interval = null;
            activeVideoTab = null;
        }
    });
}

chrome.tabs.onUpdated.addListener(() => {
    checkActiveVideoTab();
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId === activeVideoTab) {
        clearInterval(interval);
        interval = null;
        activeVideoTab = null;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "resetTimer") {
        totalWatchTime = 0;
        chrome.storage.local.set({ totalWatchTime }, () => {
            sendResponse({ success: true });
        });
        return true;
    }
});