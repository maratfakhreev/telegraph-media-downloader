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

const asyncSleep = (ms: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const hasFileExtension = (str: string): boolean => /\.[0-9a-z]+$/i.test(str);

const toDataURL = async (url): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
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

      const collection = Array.from(media).reverse().entries();
      let someFilesWithoutExtension = false;

      progressNode = document.querySelector('#t_media_progress');

      for (const [i, v] of collection) {
        if (!window.tgDowloadIsStarted) {
          break;
        }

        const pictureNumber = i + 1;
        const link = document.createElement('a');
        const image = v as HTMLImageElement;
        let src: string;

        if (hasFileExtension(image.src)) {
          src = image.src;
          progressNode.innerHTML = `downloading media: ${pictureNumber}`;
        } else {
          someFilesWithoutExtension = true;
          src = `${image.src}.jpg`;
          progressNode.innerHTML = `downloading media: ${pictureNumber}.<br /><br />Some of the files do not have an extension, so they will be saved as .jpg`;
        }

        link.id = i.toString();
        link.download = src;
        link.href = await toDataURL(src);
        link.click();
        document.body.appendChild(link);
        await asyncSleep(100);
        document.body.removeChild(link);

        if (mediaCount === pictureNumber) {
          progressNode.innerHTML = someFilesWithoutExtension
            ? '<b>all media downloaded.<br /><br />Some of the files do not have an extension, so they were saved as .jpg</b>'
            : '<b>all media downloaded</b>';
          removeTgCounter();
        }
      }
    }
  } else {
    alert('The extension works only on https://telegra.ph website');
  }
})();
