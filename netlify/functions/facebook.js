const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { url } = event.queryStringParameters || {};
  if (!url) return { statusCode: 400, body: JSON.stringify({ error: 'URL tələb olunur' }) };

  try {
    // Facebook oEmbed
    const oembedUrl = `https://www.facebook.com/plugins/video/oembed.json/?url=${encodeURIComponent(url)}`;
    const resp = await fetch(oembedUrl);
    const json = await resp.json();
    const videoMatch = json.html?.match(/src="([^"]+)"/);
    const result = {
      title: json.title || 'Facebook',
      thumbnail: json.thumbnail_url || '',
      images: json.thumbnail_url ? [json.thumbnail_url] : [],
      videoUrl: videoMatch ? videoMatch[1] : ''
    };
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Facebook alınmadı' }) };
  }
};
