import Phaser from 'phaser';

import LoadingBar from "../classes/LoadingBar";
import WebFontFile from "../classes/WebFontLoader";

export default class PreloadScene extends Phaser.Scene {
   constructor() {
      super('Preload');
   }

   preload() {
      const loadingBar = new LoadingBar(this)
      this.preloadAssets()
      this.loadFonts()
   }

   preloadAssets() {
      this.load.atlas('btn', 'assets/rectengular_buttons.png', 'assets/rectengular_buttons.json')
      this.load.atlas('icon', 'assets/ui_icons.png', 'assets/ui_icons.json')
   }

   loadFonts() {
      const fonts = new WebFontFile(this.load, 'Press Start 2P')
      this.load.addFile(fonts)
   }

   create() {
      this.scene.start('Menu')
   }

}
