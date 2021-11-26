import Phaser from 'phaser';

import {BG_COLOR} from "../constants/constants";

export default class BootScene extends Phaser.Scene {
   constructor() {
      super('Boot');
   }

   preloader() {
      document.getElementById('body').style.backgroundColor = BG_COLOR
   }

   create() {
      this.scene.start('Preload')
   }

}
