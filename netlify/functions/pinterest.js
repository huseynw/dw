const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { url } = event.queryStringParameters || {};
  if (!url) return { statusCode: 400, body: JSON.stringify({ error: 'URL tələb olunur' }) };

  try {
    // Pinterest oEmbed API (pulsuz, media qaytarır)
    const oembedUrl = `https://www.pinterest.com/oembed.json?url=${encodeURIComponent(url)}`;
    const resp = await fetch(oembedUrl);
    const json = await resp.json();
    // Oembed adətən thumbnail_url verir, tam keyfiyyət üçün birbaşa pin linkindən çıxarıla bilər.
    // Bu sadə nümunədə thumbnail əsas götürülür.
    const result = {
      title: json.title || 'Pinterest',
      thumbnail: json.thumbnail_url || '',
      images: json.thumbnail_url ? [json.thumbnail_url.replace('/280x280_80/', '/originals/')] : [],
      videoUrl: json.html ? (json.html.match(/src="([^"]+)"/)?.[1] || '') : ''
    };
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Pinterest alınmadı' }) };
  }
};
