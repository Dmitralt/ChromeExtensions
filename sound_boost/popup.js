document.addEventListener("DOMContentLoaded", () => {
    const volumeSlider = document.getElementById("volume");
    const volumeValue = document.getElementById("volumeValue");
    const bassSlider = document.getElementById("bass");
    const midSlider = document.getElementById("mid");
    const trebleSlider = document.getElementById("treble");
    const resetButton = document.getElementById("reset");

    function loadSettings() {
        chrome.storage.sync.get(["volume", "bass", "mid", "treble"], (data) => {
            volumeSlider.value = isFinite(data.volume) ? data.volume : 1;
            volumeValue.textContent = volumeSlider.value + "x";
            bassSlider.value = isFinite(data.bass) ? data.bass : 0;
            midSlider.value = isFinite(data.mid) ? data.mid : 0;
            trebleSlider.value = isFinite(data.treble) ? data.treble : 0;
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const sendMessage = debounce(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]) return;
            const settings = {
                volume: parseFloat(volumeSlider.value),
                bass: parseFloat(bassSlider.value),
                mid: parseFloat(midSlider.value),
                treble: parseFloat(trebleSlider.value),
            };

            chrome.storage.sync.set(settings);
            chrome.tabs.sendMessage(tabs[0].id, settings);
        });
    }, 300);

    volumeSlider.addEventListener("input", () => {
        volumeValue.textContent = volumeSlider.value + "x";
        sendMessage();
    });

    bassSlider.addEventListener("input", sendMessage);
    midSlider.addEventListener("input", sendMessage);
    trebleSlider.addEventListener("input", sendMessage);

    resetButton.addEventListener("click", () => {
        const defaultSettings = {
            volume: 1,
            bass: 0,
            mid: 0,
            treble: 0
        };

        chrome.storage.sync.set(defaultSettings, () => {
            loadSettings();
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (!tabs[0]) return;
                chrome.tabs.sendMessage(tabs[0].id, defaultSettings);
            });
        });
    });

    loadSettings();
});
