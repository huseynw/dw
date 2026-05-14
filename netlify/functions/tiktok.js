const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { url } = event.queryStringParameters || {};
  if (!url) return { statusCode: 400, body: JSON.stringify({ error: 'URL tələb olunur' }) };

  try {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const resp = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await resp.json();

    if (json.code !== 0) throw new Error(json.msg || 'API xətası');

    const data = json.data;
    const result = {
      title: data.title || 'TikTok video',
      thumbnail: data.cover || '',
      videoUrl: data.play || '',
      audioUrl: data.music || '',
      images: data.images || null  // slayd şəkilləri varsa
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'TikTok alınmadı: ' + err.message })
    };
  }
};
