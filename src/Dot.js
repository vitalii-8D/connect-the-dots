import Phaser from "phaser";

import {GAME_WIDTH, GAME_HEIGHT, CELL_SIZE, COL_NUM, COLOR_SET, DOT_SIZE, ROW_NUM, X_MARGIN, Y_MARGIN} from './constants'

export default class Dot extends Phaser.GameObjects.Arc {
   static generateAttributes(colNum, rowNum) {
      const color = Phaser.Utils.Array.GetRandom(COLOR_SET)

      const x = X_MARGIN + CELL_SIZE * colNum;
      const y = Y_MARGIN + CELL_SIZE * rowNum;

      return {x, y, color}
   }

   // /** @param {Phaser.Scene} scene   */
   constructor(data) {
      const {scene, x, y, radius, color} = data;
      super(scene, x, -DOT_SIZE, radius, 0, Phaser.Math.PI2, true, color);

      this.init(data);
   }

   init(data) {
      const {scene, x, y, radius, color, col, row} = data;

      this.scene = scene
      this.col = col
      this.row = row
      this.color = color

      this.targetY = y

      this.setInteractive()
      this.scene.add.existing(this)

      scene.tweens.add({
         targets: this,
         y: y,
         delay: col * 30 * COL_NUM + (ROW_NUM - 1 - row) * 30 + 500,
         duration: 100,
         ease: 'Linear'
      })
   }

   static generate(scene, colNum, rowNum) {
      const data = Dot.generateAttributes(colNum, rowNum)

      return new Dot({
         scene,
         ...data,
         radius: DOT_SIZE / 2,
         col: colNum,
         row: rowNum
      })
   }

   goDownPer(cellsNum) {
      this.row += cellsNum
      this.y += cellsNum * CELL_SIZE;
   }

   restoreColorAndPosition(row) {
      const data = Dot.generateAttributes(this.col, row)
      this.color = data.color
      this.setFillStyle(data.color)
      this.row = row
      this.y = -CELL_SIZE

      this.enableDot()

      this.scene.tweens.add({
         targets: this,
         y: data.y,
         duration: 100,
         ease: 'Linear'
      })
   }

   enableDot() {
      this.setActive(true)
      this.setVisible(true)
   }

}

