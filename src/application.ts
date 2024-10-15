const addTgCounter = (): void => {
  window.tgCounter = document.createElement('div');
  window.tgCounter.innerHTML = `
    <div style="-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; font-family: system-ui; position: fixed; z-index: 9999; right: 18px; bottom: 18px; width: 260px;">
      <div style="background-color: #fff; padding: 12px; border: 1px solid #dfdfdf; border-radius: 12px; font-size: 12px;">
        <div style="font-size: 16px;" id="t_media_title"></div>
        <div id="t_media_progress"></div>
      </div>
      <div style="background-color: #fff; padding: 12px; border: 1px solid #dfdfdf; border-radius: 12px; font-size: 10px; margin: 6px 0 0; color: #7A7A7A;">
        this extension is free and will always be so, but if you want to support me then
        <a href="https://buymeacoffee.com/maratfakhreev" style="color: #A74E0D;" target="_blank">buy me a ☕️</a>
      </div>
    </div>
  `;
  document.body.appendChild(window.tgCounter);
};

const removeTgCounter = (): void => {
  if (window.tgCounterTimeout) {
    clearTimeout(window.tgCounterTimeout);
  }

  window.tgCounterTimeout = setTimeout(() => {
    window.tgCounter?.remove();
    delete window.tgCounter;
  }, 2000);
};

(async (): Promise<void> => {
  let titleNode: HTMLElement;
  let progressNode: HTMLElement;

  if (window.location.host === 'telegra.ph') {
    if (window.tgCounter) {
      window.tgDowloadIsStarted = false;
      titleNode = document.querySelector('#t_media_title');
      titleNode.innerHTML = 'Download is interrupted';
      titleNode.style.margin = '0';
      progressNode = document.querySelector('#t_media_progress');
      progressNode.innerHTML = '';
      removeTgCounter();
    } else {
      window.tgDowloadIsStarted = true;
      addTgCounter();
    }

    const media = document.querySelectorAll('figure img, figure video, figure audio');
    const mediaCount = media.length;

    if (mediaCount === 0) {
      titleNode = document.querySelector('#t_media_title');
      titleNode.innerHTML = 'Nothing to download';
      titleNode.style.margin = '0';
      removeTgCounter();
    } else {
      if (!window.tgDowloadIsStarted) {
        return;
      }

      window.tgDowloadIsStarted = true;
      titleNode = document.querySelector('#t_media_title');
      titleNode.innerHTML = `Media count: ${mediaCount}`;
      titleNode.style.margin = '0 0 9px';

      await chrome.runtime.sendMessage({
        msg: 'download',
        urls: Array.from(media)
          .reverse()
          .map(v => (v as HTMLImageElement).src),
      });
    }
  } else {
    alert('The extension works only on https://telegra.ph website');
  }
})();

chrome.runtime.onMessage.addListener(({ msg, data }: { msg: string; data: unknown }) => {
  if (msg === 'render_counter') {
    const { index, count } = data as { index: number; count: number };
    const progressNode = document.querySelector('#t_media_progress');

    if (index === count) {
      progressNode.innerHTML = '<b>all media downloaded</b>';
      removeTgCounter();
    } else {
      progressNode.innerHTML = `downloading media: ${index}`;
    }
  }
});
