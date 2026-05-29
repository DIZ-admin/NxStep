import https from 'https';
const urls = [
  'https://cdn.cloudflare.steamstatic.com/apps/csgo/images/csgo_react/maps/ancient.jpg',
  'https://cdn.cloudflare.steamstatic.com/apps/csgo/images/csgo_react/maps/ancient.png',
  'https://steamcdn-a.akamaihd.net/apps/csgo/images/csgo_react/maps/ancient.jpg',
  'https://wiki.cs.money/weapons/backgrounds/ancient.jpg',
  'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CS2/master/csgo/materials/panorama/images/map_icons/screenshots/1080p/ancient.jpg',
  'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/materials/panorama/images/map_icons/screenshots/1080p/ancient.png'
];
urls.forEach(u => {
    https.get(u, res => console.log(res.statusCode, u)).on('error', e => console.log(e.message, u));
});


