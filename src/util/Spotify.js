const clientId = 'df0ed28c3b2e4ba49a13325a0c0f3bae';
const redirectURI = 'http://jamming-yacine.surge.sh';
let userToken;

const Spotify = {
    getAccessToken() {
        if (userToken) {
            return userToken;
        } 
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            userToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // clear the parameter to grab new access token
            window.setTimeout(() => userToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return userToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },

    search(searchTerm) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        })
        .then(response => response.json())
        .then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    savePlaylist(playlistName, trackUrisArr) {
        if (!playlistName || !trackUrisArr.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` }
        let userId;
        return fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ name: playlistName })
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({ uris: trackUrisArr })
                })
            })
        })
    }
};




export default Spotify;