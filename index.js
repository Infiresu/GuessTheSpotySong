const clientId = "bcbf752d3a9244f19ed768e3adeebb43"; // Вставьте сюда ваш Client ID
const redirectUri = "https://infiresu.github.io/GuessTheSpotySong/"; // Вставьте сюда ваш Redirect URI
const scopes = "user-read-private user-read-email user-library-read";

document.getElementById("login-button").addEventListener("click", () => {
  const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  window.location.href = url;
});

const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');

if (accessToken) {
    initializeGame(accessToken);
}

function initializeGame(accessToken) {
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('game').style.display = 'block';
        document.getElementById('login-button').style.display = 'none';
        startGame(accessToken);
    });
}

function startGame(accessToken) {
    fetchRandomTrack(accessToken).then(track => {
        const audio = document.getElementById('audio');
        audio.src = track.preview_url;
        audio.play();

        setTimeout(() => {
            audio.pause();
        }, 5000);

        document.getElementById('submit-guess').addEventListener('click', () => {
            const guess = document.getElementById('guess').value;
            const result = document.getElementById('result');
            if (guess.toLowerCase() === track.name.toLowerCase()) {
                result.textContent = 'Correct! The track is ' + track.name;
            } else {
                result.textContent = 'Wrong! The track is ' + track.name;
            }
        });
    });
}

function fetchRandomTrack(accessToken) {
    return fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const tracks = data.items;
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)].track;
        return randomTrack;
    });
}
