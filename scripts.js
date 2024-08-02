document.addEventListener('DOMContentLoaded', () => {
    updateChannels();
});

function playDirect() {
    const url = document.getElementById('directUrl').value;
    playStream(url);
}

function loadM3U() {
    // Logic to load channels from M3U URL
    const url = document.getElementById('m3uUrl').value;
    // Fetch and parse M3U file, then call updateChannels()
}

function loadM3UFile() {
    const fileInput = document.getElementById('m3uFile');
    const file = fileInput.files[0];
    if (file) {
        // Logic to parse M3U file and update channels
        // Read the file, parse it and then call updateChannels()
    }
}

function updateChannels() {
    // Logic to populate group and channel select elements
    const groupSelect = document.getElementById('groupSelect');
    const channelSelect = document.getElementById('channelSelect');
    // Populate the options with groups and channels
}

function playChannel() {
    const channelSelect = document.getElementById('channelSelect');
    const url = channelSelect.value;
    playStream(url);
}

function playStream(url) {
    const enableDRM = document.getElementById('enableDRM').checked;
    const drmKey = document.getElementById('drmKey').value;
    const drmKeyId = document.getElementById('drmKeyId').value;

    const config = {
        file: url,
        width: '100%',
        aspectratio: '16:9',
        autostart: true
    };

    if (enableDRM) {
        config.drm = {
            clearkey: {
                keyId: drmKeyId,
                key: drmKey
            }
        };
    }

    jwplayer('jwplayerDiv').setup(config);
}
