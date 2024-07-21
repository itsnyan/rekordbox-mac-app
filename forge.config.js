const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'RB XML Organizer',
        icon: './assets/rekordbox-icon-1024x.png'
      }
    }
  ]
};