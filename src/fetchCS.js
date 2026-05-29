import https from 'https';

https.get('https://en.wikipedia.org/wiki/Counter-Strike:_Global_Offensive', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = data.match(/\/\/upload\.wikimedia\.org\/wikipedia\/en\/[^"'\s]*\.(jpg|png)/gi);
    if (urls) {
        let unique = [...new Set(urls)];
        const ancientStr = unique.filter(u => u.toLowerCase().includes('ancient'));
        console.log("Ancient URLs:", ancientStr);
        console.log("All URLs:", unique);
    } else {
        console.log("No images");
    }
  });
});
