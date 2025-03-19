chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;

    if (!url.includes("youtube.com")) {
        document.body.innerHTML = "<h2>Not available for this site</h2>";
        return;
    }

    const speedSlider = document.getElementById("speedSlider");
    const speedValue = document.getElementById("speedValue");
    const playPauseBtn = document.getElementById("playPause");

    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => document.querySelector("video")?.playbackRate || 1.0
    }, (results) => {
        if (results && results[0].result) {
            const currentSpeed = results[0].result;
            speedSlider.value = currentSpeed;
            speedValue.textContent = currentSpeed + "x";
        }
    });

    speedSlider.addEventListener("input", () => {
        const speed = parseFloat(speedSlider.value);
        speedValue.textContent = speed + "x";
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (speed) => { document.querySelector("video").playbackRate = speed; },
            args: [speed]
        });
    });

    playPauseBtn.addEventListener("click", () => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
                const video = document.querySelector("video");
                if (video.paused) {
                    video.play();
                    return true;
                } else {
                    video.pause();
                    return false;
                }
            }
        }, (results) => {
            if (results && results[0].result) {
                playPauseBtn.textContent = "Pause";
            } else {
                playPauseBtn.textContent = "Play";
            }
        });
    });

    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => document.querySelector("video").paused
    }, (results) => {
        if (results && results[0].result) {
            playPauseBtn.textContent = "Play";
        } else {
            playPauseBtn.textContent = "Pause";
        }
    });
});
