function changeSpeed(speed) {
    let video = document.querySelector("video");
    if (video) {
        video.playbackRate = speed;
        alert(`set speed: ${speed}x`);
    }
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "speedUp") {
        changeSpeed(message.speed);
    }
});
