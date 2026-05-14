const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { url } = event.queryStringParameters || {};
  if (!url) return { statusCode: 400, body: JSON.stringify({ error: 'URL tələb olunur' }) };

  try {
    const apiUrl = `https://api.igdown.com/api/download?url=${encodeURIComponent(url)}`;
    const resp = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await resp.json();

    if (!json.success && !json.data) throw new Error('Məlumat alınmadı');

    const media = json.data?.medias || [];
    const first = media[0] || {};
    const images = media.filter(m => m.type === 'image').map(m => m.url);
    const videoUrl = media.find(m => m.type === 'video')?.url || '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: json.data?.title || 'Instagram',
        thumbnail: json.data?.thumbnail || first.url || '',
        type: videoUrl ? 'reel' : 'post',
        images: images.length ? images : null,
        videoUrl: videoUrl || null
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Instagram alınmadı: ' + err.message })
    };
  }
};
