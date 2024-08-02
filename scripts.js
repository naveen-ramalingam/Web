let channels = {};

function updateDateTime() {
    const now = new Date();
    const date = now.toISOString().split('T')[0].replace(/-/g, '/'); // Format: yyyy/mm/dd
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('current-date').textContent = date;
    document.getElementById('current-time').textContent = time;
}

setInterval(updateDateTime, 1000);

function playDirectLink() {
    const m3u8Link = document.getElementById('m3u8-link').value;
    if (m3u8Link) {
        loadStream(m3u8Link);
    } else {
        alert("Please enter a valid .m3u8 link.");
    }
}

function loadM3UFromURL() {
    const url = document.getElementById('m3u-url').value;
    if (url) {
        fetch(url)
            .then(response => response.text())
            .then(data => parseM3U(data))
            .catch(error => console.error('Error loading M3U URL:', error));
    } else {
        alert("Please enter a valid M3U URL.");
    }
}

function loadM3UFromFile() {
    const fileInput = document.getElementById('file-input');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            parseM3U(event.target.result);
        };
        reader.readAsText(file);
    } else {
        alert("Please select a valid M3U file.");
    }
}

function parseM3U(content) {
    const lines = content.split('\n');
    channels = {};
    let currentGroup = '';

    lines.forEach(line => {
        if (line.startsWith('#EXTINF')) {
            const parts = line.split(',');
            const channelName = parts[1];
            const channelInfo = parts[0].match(/tvg-id="([^"]*)"/);
            const tvgId = channelInfo ? channelInfo[1] : '';
            const groupInfo = parts[0].match(/group-title="([^"]*)"/);
            const groupTitle = groupInfo ? groupInfo[1] : '';
            const logoInfo = parts[0].match(/tvg-logo="([^"]*)"/);
            const logo = logoInfo ? logoInfo[1] : '';
            const url = lines[lines.indexOf(line) + 1];

            if (!channels[groupTitle]) {
                channels[groupTitle] = [];
            }

            channels[groupTitle].push({
                name: channelName,
                url: url,
                tvgId: tvgId,
                groupTitle: groupTitle,
                logo: logo
            });
        }
    });

    populateGroups();
}

function populateGroups() {
    const groupSelect = document.getElementById('group-select');
    groupSelect.innerHTML = '<option value="">Group:</option>';
    Object.keys(channels).forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
    });
}

function onGroupChange() {
    const groupSelect = document.getElementById('group-select');
    const selectedGroup = groupSelect.value;
    const channelSelect = document.getElementById('channel-select');
    channelSelect.innerHTML = '<option value="">Channel:</option>';

    if (channels[selectedGroup]) {
        channels[selectedGroup].forEach(channel => {
            const option = document.createElement('option');
            option.value = channel.url;
            option.textContent = channel.name;
            channelSelect.appendChild(option);
        });
    }
}

function onChannelChange() {
    const channelSelect = document.getElementById('channel-select');
    const selectedChannelURL = channelSelect.value;

    if (selectedChannelURL) {
        const groupSelect = document.getElementById('group-select');
        const selectedGroup = groupSelect.value;
        const channel = channels[selectedGroup].find(c => c.url === selectedChannelURL);

        if (channel) {
            displayChannelInfo(channel);
            loadStream(selectedChannelURL);
        }
    }
}

function displayChannelInfo(channel) {
    const channelLogo = document.getElementById('channel-logo');
    const channelDetails = document.getElementById('channel-details');
    const channelLink = document.getElementById('channel-link');

    if (channel.logo) {
        channelLogo.src = channel.logo;
        channelLogo.style.display = 'block';
    } else {
        channelLogo.style.display = 'none';
    }

    channelDetails.innerHTML = `
        <strong>TVG ID:</strong> ${channel.tvgId || 'N/A'}<br>
        <strong>Group Title:</strong> ${channel.groupTitle || 'N/A'}<br>
        <strong>Channel Name:</strong> ${channel.name || 'N/A'}
    `;
    channelDetails.style.display = 'block';

    channelLink.href = channel.url;
    channelLink.textContent = channel.url;
    channelLink.style.display = 'block';
}

function loadStream(url) {
    jwplayer("player-container").setup({
        file: url,
        width: "100%",
        height: "100%",
        aspectratio: "16:9"
    });
}
