# Telegraph media downloader

Super simple and clean image and video downloader from telegra.ph

## Prepare

### OSX

1. Install environment

```bash
brew install nvm yarn
nvm install node
nvm alias default node
```

2. Install dependencies

```
yarn install
```

## Scripts

### Code quality

```
yarn lint
```

### Check types

```
yarn tscheck
```

### Watch types checking

```
yarn tswatch
```

### Build

Note: '\_firefox' postfix is being used for firefox extension specific scripts

```
yarn build
yarn build_firefox
```

### Dev

```
yarn dev
yarn dev_firefox
```

### Compress

```
yarn compress
yarn compress_firefox
```

### Release (Build + Compress)

```
yarn release
yarn release_firefox
```

## Example

Install plugin and open https://google.com to see example widget

### Releases

We strictly follow [Semantic Versioning](http://semver.org/)

1. Update project version in src/manifest-v3.json for Chromium based browsers.
2. Update project version in src/manifest-v2.json for Firefox browser.
3. Commit it with message `release x.x.x`.

## Additional information

Extensions page:\
chrome://extensions

For fast extenstion reloading use:\
https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid
