const path = require('path');
module.exports = {
  electronPackagerConfig: {
    icon: path.resolve(__dirname, 'src/assets/icons/icon.ico')
  },
  makers: [{
      name: "@electron-forge/maker-flatpak",
      config: {
        options: {
          categories: ["Games"]
        }
      }
    },
    {
      name: "@electron-forge/maker-deb",
      config: {}
    },
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "game-of-worlds"
      }
    }
  ]
}
