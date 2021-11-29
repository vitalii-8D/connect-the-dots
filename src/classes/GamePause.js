import Phaser from 'phaser';

import MenuBtn from "./MenuBtn";

import {X_MARGIN, Y_MARGIN, CELL_SIZE, ROW_NUM, COL_NUM} from '../constants/constants'

export default class GamePause {
   continueBtn;
   retryBtn;
   menuBtn;

   painter;

   constructor(scene) {
      /** @type {Phaser.Scene} */
      this.scene = scene

      this.init()
   }

   init(data) {
      this.painter = this.scene.add.graphics()

      this.createButtons()
   }

   runPause() {
      this.painter
         .fillStyle(0xFFFFE5)
         .fillRect(0, Y_MARGIN, COL_NUM * CELL_SIZE, ROW_NUM * CELL_SIZE)
   }

   renderPause() {

   }

   createButtons() {
      const {width, height} = this.scene.scale

      this.continueBtn = MenuBtn.generate({
         scene: this,
         x: width / 2,
         y: height * 4 / 12,
         texture: 'btn',
         frame: 'green_button0.png',
         text: 'Continue',
      })

      this.retryBtn = MenuBtn.generate({
         scene: this,
         x: width / 2,
         y: height * 8 / 12,
         texture: 'btn',
         frame: 'red_button0.png',
         text: 'Retry',
      })

      this.menuBtn = MenuBtn.generate({
         scene: this,
         x: width / 2,
         y: height / 2,
         texture: 'btn',
         frame: 'yellow_button0.png',
         text: 'Menu',
      })

   }

}
