document.addEventListener("DOMContentLoaded", () => {
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    function updateWatchTime() {
        chrome.storage.local.get(["totalWatchTime"], (data) => {
            const time = formatTime(data.totalWatchTime || 0);
            document.getElementById("watch-time").textContent = time;
        });
    }

    document.getElementById("reset-button").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "resetTimer" }, (response) => {
            if (response && response.success) {
                updateWatchTime();
            }
        });
    });

    updateWatchTime();
    setInterval(updateWatchTime, 1000);
});
