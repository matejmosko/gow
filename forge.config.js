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
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/renderer/console.html",
              js: "./src/renderer/console-script.js",
              name: "gow_console"
            },
            {
              html: "./src/renderer/projector.html",
              js: "./src/renderer/projector-script.js",
              name: "gow_projector"
            }
          ]
        }
      }
    ]
  ]
}
