require('dotenv').config();

const express = require('express');
const request = require('request');
const querystring = require('querystring');

const app = express();

// TODO: Trim these to include only needed permissions
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
];

const redirect_uri =
	process.env.REDIRECT_URI || 'http://localhost:8888/callback';

app.get('/login', (_req, res) => {
	const querystrings = querystring.stringify({
		response_type: 'code',
		client_id: process.env.SPOTIFY_CLIENT_ID,
		scope: SCOPES.join(' '),
		redirect_uri,
	});

	res.redirect(`https://accounts.spotify.com/authorize?${querystrings}`);
});

app.get('/callback', (req, res) => {
	const code = req.query.code || null;
	const authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code,
			redirect_uri,
			grant_type: 'authorization_code',
		},
		headers: {
			Authorization:
				'Basic ' +
				new Buffer(
					process.env.SPOTIFY_CLIENT_ID +
						':' +
						process.env.SPOTIFY_CLIENT_SECRET,
				).toString('base64'),
		},
		json: true,
	};

	request.post(authOptions, (_error, _response, body) => {
		var access_token = body.access_token;
		const uri = process.env.FRONTEND_URI || 'http://localhost:3000';

		res.redirect(uri + '?' + querystring.stringify({ access_token }));
	});
});

const port = process.env.PORT || 8888;
console.log(
	`Listening on port ${port}. Go to /login to initiate authentication flow.`,
);
app.listen(port);
