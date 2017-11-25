# Shift-Shift

IntelliJ style search/change tabs extension for Chrome browser

### Goal
Toggle/search tabs with familiar action for intelliJ users like me :)


```
npm run start
```
This starter pack cloned and edited from https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate

1. Clone the repository.
2. Install [yarn](https://yarnpkg.com): `npm install -g yarn`.
3. Run `yarn`.
4. Run `npm run start`
7. Load your extension on Chrome following:
    1. Access `chrome://extensions/`
    2. Check `Developer mode`
    3. Click on `Load unpacked extension`
    4. Select the `build` folder.
8. Have fun.

For build
MAN_VER - Manifest version
PACK_VER - Package version
NODE_ENV - enviremonet for build
DESC - description
```
NODE_ENV=production PACK_VER=1.0.0 MAN_VER=2 npm run build
```