function sendMessage(action) {
    try {
        if (chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ action });
        }
    } catch (error) {

    }
}

setInterval(() => {
    const video = document.querySelector(".html5-main-video");
    if (!video) return;

    if (!chrome.runtime || !chrome.runtime.id) {

        clearInterval(this);
        return;
    }

    try {
        if (!video.paused) {
            chrome.runtime.sendMessage({ action: "videoPlaying" });
        } else {
            chrome.runtime.sendMessage({ action: "videoPaused" });
        }
    } catch (error) {

    }
}, 1000);




