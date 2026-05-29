import https from 'https';

const url = 'https://cdn.cloudflare.steamstatic.com/apps/csgo/images/csgo_react/maps/ancient.png';
https.get(url, res => console.log('png', res.statusCode));
