(function () {
    function makeMiniPlayerDraggable() {
        let miniPlayer = document.querySelector('ytd-miniplayer');

        if (!miniPlayer) return;

        miniPlayer.style.position = 'fixed';
        miniPlayer.style.zIndex = '9999';
        miniPlayer.style.cursor = 'grab';

        let isDragging = false, shiftX = 0, shiftY = 0;

        function onMouseMove(event) {
            if (!isDragging) return;

            let newX = event.clientX - shiftX;
            let newY = event.clientY - shiftY;

            let maxX = window.innerWidth - miniPlayer.offsetWidth;
            let maxY = window.innerHeight - miniPlayer.offsetHeight;

            miniPlayer.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
            miniPlayer.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
        }

        miniPlayer.addEventListener('mousedown', function (event) {
            event.preventDefault();
            isDragging = true;

            shiftX = event.clientX - miniPlayer.getBoundingClientRect().left;
            shiftY = event.clientY - miniPlayer.getBoundingClientRect().top;

            miniPlayer.style.cursor = 'grabbing';
            document.addEventListener('mousemove', onMouseMove);
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            miniPlayer.style.cursor = 'grab';
            document.removeEventListener('mousemove', onMouseMove);
        });

        miniPlayer.ondragstart = () => false;

        showNotification();
    }

    function showNotification() {
        let menu = document.createElement('div');
        menu.textContent = "MiniPlayer is now draggable.";
        menu.style.position = "fixed";
        menu.style.bottom = "20px";
        menu.style.left = "50%";
        menu.style.transform = "translateX(-50%)";
        menu.style.background = "rgba(0, 0, 0, 0.8)";
        menu.style.color = "#fff";
        menu.style.padding = "10px 15px";
        menu.style.borderRadius = "10px";
        menu.style.fontSize = "14px";
        menu.style.fontFamily = "Arial, sans-serif";
        menu.style.zIndex = "10000";
        menu.style.transition = "opacity 0.5s ease-in-out";
        menu.style.opacity = "1";

        document.body.appendChild(menu);

        setTimeout(() => {
            menu.style.opacity = "0";
            setTimeout(() => menu.remove(), 500);
        }, 3000);
    }
    const observer = new MutationObserver(() => {
        if (document.querySelector('ytd-miniplayer')) {
            makeMiniPlayerDraggable();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
