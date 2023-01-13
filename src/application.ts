if (window.location.host === 'telegra.ph') {
  if (window.tgCounter) {
    document.querySelector('#t_media_title').textContent = `Download is interrupted`;
    setTimeout(() => {
      window.tgCounter.remove();
      delete window.tgCounter;
    }, 2000);
  } else {
    window.tgCounter = document.createElement('div');
    window.tgCounter.innerHTML = `
        <div style="-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; font-family: system-ui; border: 1px solid #dfdfdf; border-radius: 12px; position: fixed; background-color: #fff; padding: 12px 18px; top: 18px; right: 18px; width: 180px;">
          <div style="font-size: 16px; margin: 0 0 9px;" id="t_media_title"></div>
          <div style="font-size: 12px;" id="t_media_progress"></div>
        </div>
      `;

    document.body.appendChild(window.tgCounter);
  }

  if (window.tgInterval) {
    clearInterval(window.tgInterval);
    delete window.tgInterval;
  } else {
    const media = document.querySelectorAll('figure img, figure video');
    const mediaCount = media.length;
    let i = 0;

    document.querySelector('#t_media_title').innerHTML = `Media count: ${mediaCount}`;
    window.tgInterval = setInterval(() => {
      if (mediaCount > i) {
        const currentAsset: any = media[i];
        const link = document.createElement('a');
        const { src } = currentAsset;

        link.id = i.toString();
        link.download = src;
        link.href = src;
        link.click();
        ++i;
        document.querySelector('#t_media_progress').innerHTML = `downloading media: ${i}`;
      } else {
        document.querySelector('#t_media_progress').innerHTML = `<b>all media downloaded</b>`;
        clearInterval(window.tgInterval);
        setTimeout(() => {
          window.tgCounter.remove();
          delete window.tgCounter;
        }, 2000);
      }
    }, 200);
  }
} else {
  alert('The extension works only on https://telegra.ph website');
}
