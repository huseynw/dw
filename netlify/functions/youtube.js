const ytdl = require('ytdl-core');

exports.handler = async (event) => {
  const { videoId } = event.queryStringParameters || {};
  if (!videoId) return { statusCode: 400, body: JSON.stringify({ error: 'videoId tələb olunur' }) };

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(url);
    const formats = info.formats
      .filter(f => f.url && (f.hasVideo || f.hasAudio))
      .map(f => ({
        itag: f.itag,
        qualityLabel: f.qualityLabel || (f.audioBitrate ? `${f.audioBitrate}kbps` : null),
        hasVideo: f.hasVideo,
        hasAudio: f.hasAudio,
        container: f.container,
        bitrate: f.bitrate,
        url: f.url
      }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails?.slice(-1)[0]?.url || '',
        duration: new Date(info.videoDetails.lengthSeconds * 1000).toISOString().substr(11, 8),
        formats
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'YouTube məlumatı alınmadı: ' + err.message })
    };
  }
};
