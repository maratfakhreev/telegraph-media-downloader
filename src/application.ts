const createTgCounter = (): void => {
  window.tgCounter = document.createElement('div');
  window.tgCounter.innerHTML = `
    <div style="-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; font-family: system-ui; border: 1px solid #dfdfdf; border-radius: 12px; position: fixed; background-color: #fff; padding: 12px 18px; top: 18px; right: 18px; width: 180px;">
      <div style="font-size: 16px;" id="t_media_title"></div>
      <div style="font-size: 12px;" id="t_media_progress"></div>
    </div>
  `;

  document.body.appendChild(window.tgCounter);
};

const removeTgCounter = (): void => {
  if (window.tgTimeout) {
    clearTimeout(window.tgTimeout);
  }

  window.tgTimeout = setTimeout(() => {
    window.tgCounter?.remove();
    delete window.tgCounter;
  }, 2000);
};

const clearTgInterval = (): void => {
  clearInterval(window.tgInterval);
  delete window.tgInterval;
};

let titleNode: HTMLElement;
let progressNode: HTMLElement;

if (window.location.host === 'telegra.ph') {
  if (window.tgCounter) {
    titleNode = document.querySelector('#t_media_title');
    titleNode.innerHTML = 'Download is interrupted';
    titleNode.style.margin = '0';
    progressNode = document.querySelector('#t_media_progress');
    progressNode.innerHTML = '';

    removeTgCounter();
  } else {
    createTgCounter();
  }

  if (window.tgInterval) {
    clearTgInterval();
  } else {
    const media = document.querySelectorAll('figure img, figure video, figure audio');
    const mediaCount = media.length;
    let i = 0;

    if (mediaCount === 0) {
      titleNode = document.querySelector('#t_media_title');
      titleNode.innerHTML = 'Nothing to download';
      titleNode.style.margin = '0';

      removeTgCounter();
    } else {
      titleNode = document.querySelector('#t_media_title');
      titleNode.innerHTML = `Media count: ${mediaCount}`;
      titleNode.style.margin = '0 0 9px';

      window.tgInterval = setInterval(() => {
        if (!window.tgCounter) {
          return;
        }

        progressNode = document.querySelector('#t_media_progress');

        if (mediaCount > i) {
          const currentAsset: any = media[i];
          const link = document.createElement('a');
          const { src } = currentAsset;

          link.id = i.toString();
          link.download = src;
          link.href = src;
          link.click();
          progressNode.innerHTML = `downloading media: ${++i}`;
        } else {
          progressNode.innerHTML = '<b>all media downloaded</b>';

          removeTgCounter();
          clearTgInterval();
        }
      }, 200);
    }
  }
} else {
  alert('The extension works only on https://telegra.ph website');
}
