function createInput(type, options = {}) {
    const input = document.createElement('input');
    input.type = type;

    if (type === 'text') {
        input.maxLength = 100;
    }

    Object.assign(input, options);
    return input;
}

function createDeleteButton(onClick) {
    const btn = document.createElement('button');
    btn.className = 'delete-btn';
    btn.textContent = '×';
    btn.onclick = onClick;
    return btn;
}

function createEntry(inputs) {
    const entry = document.createElement('div');
    entry.className = 'entry';

    inputs.forEach(rowInputs => {
        const row = document.createElement('div');
        row.className = 'row';
        rowInputs.forEach(input => row.appendChild(input));
        entry.appendChild(row);
    });

    entry.appendChild(createDeleteButton(() => {
        entry.remove();
        saveData();
    }));

    entry.querySelectorAll('input').forEach(input =>
        input.addEventListener('input', saveData)
    );

    return entry;
}

function createBlacklistEntry(word = '', replace = '') {
    const wordInput = createInput('text', {
        placeholder: 'Keyword',
        value: word
    });

    const replaceInput = createInput('text', {
        placeholder: 'Replacement text',
        value: replace
    });

    return createEntry([[wordInput], [replaceInput]]);
}

function createWhitelistEntry(word = '', color = '#ffefc3') {
    const wordInput = createInput('text', {
        placeholder: 'Keyword',
        value: word
    });

    const colorInput = createInput('color', {
        value: color
    });

    return createEntry([[wordInput, colorInput]]);
}

function saveData() {
    const toList = (selector, fields) => {
        const map = new Map();

        Array.from(document.querySelectorAll(selector)).forEach(entry => {
            const inputs = entry.querySelectorAll('input');
            const item = {};
            fields.forEach((field, i) => {
                item[field] = inputs[i].value.trim();
            });

            if (item.word) {
                const key = item.word.toLowerCase();
                map.set(key, item);
            }
        });

        return Array.from(map.values());
    };

    const blacklist = toList('#blacklist .entry', ['word', 'replace']);
    const whitelist = toList('#whitelist .entry', ['word', 'color']);

    chrome.storage.local.set({ blacklist, whitelist });
}


function loadData() {
    chrome.storage.local.get(['blacklist', 'whitelist'], data => {
        const blackContainer = document.getElementById('blacklist');
        const whiteContainer = document.getElementById('whitelist');

        (data.blacklist || []).forEach(item => {
            blackContainer.appendChild(createBlacklistEntry(item.word, item.replace));
        });

        (data.whitelist || []).forEach(item => {
            whiteContainer.appendChild(createWhitelistEntry(item.word, item.color));
        });
    });
}

function togglePanel(type) {
    const panel = document.getElementById(`panel-${type}`);
    const header = document.getElementById(`toggle-${type}`);
    panel.classList.toggle('show');
    header.classList.toggle('collapsed');
}

window.addEventListener('load', () => {
    loadData();

    document.getElementById('add-black').onclick = () =>
        document.getElementById('blacklist').appendChild(createBlacklistEntry());

    document.getElementById('add-white').onclick = () =>
        document.getElementById('whitelist').appendChild(createWhitelistEntry());

    document.getElementById('toggle-black').addEventListener('click', () =>
        togglePanel('black'));

    document.getElementById('toggle-white').addEventListener('click', () =>
        togglePanel('white'));
});
