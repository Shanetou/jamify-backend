require('dotenv').config();

const express = require('express')
const request = require('request')
const querystring = require('querystring')

const app = express()

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-top-read',
  'user-read-recently-played',
  'user-library-read',
  'user-read-birthdate',
]

const redirect_uri =
  process.env.REDIRECT_URI ||
  'http://localhost:8888/callback'

app.get('/login', (req, res) => {
  console.log('login');
  // console.log('res from /login: ', res);

  const querystrings = querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: SCOPES.join(' '),
    redirect_uri
  })
  console.log('querystrings', querystrings);

  res.redirect(`https://accounts.spotify.com/authorize?${querystrings}`)
})

app.get('/callback', (req, res) => {
  console.log('/callback');
  // console.log('res /callback', res);
  const code = req.query.code || null
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' +
        process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }

  request.post(authOptions, (error, response, body) => {
    // console.log('authOptions', authOptions);
    console.log('body', body);
    var access_token = body.access_token
    console.log('access_token', access_token);
    const uri = process.env.FRONTEND_URI || 'http://localhost:3000'

    console.log('uri + querystring.stringify({ access_token })', uri + querystring.stringify({ access_token }));
    res.redirect(uri + '?' + querystring.stringify({ access_token }))
  })
})

const port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go to /login to initiate authentication flow.`)
app.listen(port)