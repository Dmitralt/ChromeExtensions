(function () {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let source = null;
    let gainNode = audioContext.createGain();
    let bassEQ = audioContext.createBiquadFilter();
    let midEQ = audioContext.createBiquadFilter();
    let trebleEQ = audioContext.createBiquadFilter();

    bassEQ.type = "lowshelf";
    bassEQ.frequency.value = 100;
    midEQ.type = "peaking";
    midEQ.frequency.value = 1000;
    trebleEQ.type = "highshelf";
    trebleEQ.frequency.value = 3000;

    function setupAudio() {
        let video = document.querySelector("video");
        if (!video || source) return;

        source = audioContext.createMediaElementSource(video);
        source.connect(bassEQ);
        bassEQ.connect(midEQ);
        midEQ.connect(trebleEQ);
        trebleEQ.connect(gainNode);
        gainNode.connect(audioContext.destination);

        chrome.storage.sync.get(["volume", "bass", "mid", "treble"], (data) => {
            gainNode.gain.value = parseFloat(data.volume) || 2;
            bassEQ.gain.value = parseFloat(data.bass) || 10;
            midEQ.gain.value = parseFloat(data.mid) || 0;
            trebleEQ.gain.value = parseFloat(data.treble) || 0;
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const saveSettings = debounce((settings) => {
        chrome.storage.sync.set(settings);
    }, 500);

    chrome.runtime.onMessage.addListener((request) => {
        gainNode.gain.value = parseFloat(request.volume);
        bassEQ.gain.value = parseFloat(request.bass);
        midEQ.gain.value = parseFloat(request.mid);
        trebleEQ.gain.value = parseFloat(request.treble);
        saveSettings({ volume: request.volume, bass: request.bass, mid: request.mid, treble: request.treble });
    });

    const observer = new MutationObserver(() => {
        if (document.querySelector("video") && !source) {
            setupAudio();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setupAudio();
})();