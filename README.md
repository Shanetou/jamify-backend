# Jamify Backend

*Backend Oauth server for [Jamify](https://github.com/Shanetou/jamify)


### Try the full app at:
https://jamifynow.herokuapp.com/

### To run the just this backend: 
1. Clone this repo
2. Follow [these directions](https://developer.spotify.com/documentation/general/guides/app-settings/) at Spotify to generate credentials 
- Whitelist `http://localhost:8888/callback` as the redirect URI
3. Add and source the following environment variables:
- `FRONTEND_URI=http://localhost:3000`
- `REDIRECT_URI=http://localhost:8888/callback`
- `SPOTIFY_CLIENT_ID=<your_client_id>`
- `SPOTIFY_CLIENT_SECRET=<your_client_secret>`
3. Run `yarn install && node server.js`

*\* To run the full app, you will also need to run the frontend portion of the app at [Jamify](https://github.com/Shanetou/jamify)*

