import Phaser from 'phaser';
import LoadingBar from "../classes/LoadingBar";
import {BG_COLOR} from "../constants/constants";

export default class PreloadScene extends Phaser.Scene {
   constructor() {
      super('Preload');
   }

   preload() {
      const loadingBar = new LoadingBar(this)
      this.preloadAssets()
   }

   preloadAssets() {
      this.load.image('circle', 'assets/circle.png')
   }

   create() {
      this.scene.start('Game')
   }

}
