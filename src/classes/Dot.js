import Phaser from "phaser";

import {sceneEvents} from "../events/Events";
import {CELL_SIZE, COL_NUM, COLOR_SET, DOT_SIZE, ROW_NUM, X_MARGIN, Y_MARGIN} from '../constants/constants'

// Our Dot`s class
export default class Dot extends Phaser.GameObjects.Arc {
   static generateAttributes(colNum, rowNum) {  // Generating Dot`s attributes
      const color = Phaser.Utils.Array.GetRandom(COLOR_SET)  // Get random color from the set

      const x = X_MARGIN + CELL_SIZE * (colNum) + CELL_SIZE / 2; // Converting col index to the game`s X coordinates
      const y = Y_MARGIN + CELL_SIZE * (rowNum) + CELL_SIZE / 2; // Converting row index to the game`s Y coordinates

      return {x, y, color}
   }

   // /** @param {Phaser.Scene} scene   */
   constructor(data) {
      const {scene, x, y, radius, color} = data;
      super(scene, x, -DOT_SIZE, radius, 0, Phaser.Math.PI2, true, color); // Allow Dot to fall from the top by setting Y coordinates to -DOT_SIZE

      this.init(data);
   }

   init(data) {
      const {scene, y, color, col, row} = data;

      this.scene = scene
      this.col = col
      this.row = row
      this.color = color

      this.setInteractive()  // Making Dot visible for Pointer events
      this.scene.add.existing(this)  // Adding Dot to the scene

      this.createTween({
         y,
         delay: col * 30 * COL_NUM + (ROW_NUM - 1 - row) * 30 + 500
      })
   }

   static generate(scene, colNum, rowNum) {  // Dot`s generator
      const data = Dot.generateAttributes(colNum, rowNum)

      return new Dot({
         scene,
         ...data,
         radius: DOT_SIZE / 2,
         col: colNum,
         row: rowNum
      })
   }

   goDownPer(cellsNum) {  // Move Dot down to empty place per given cell number
      this.row += cellsNum
      // this.y += cellsNum * CELL_SIZE;
      this.createTween({
         y: `+=${cellsNum * CELL_SIZE}`
      })
   }

   setNewColorAndPosition(row, col = this.col) {  // Resetting destroyed Dot
      const data = Dot.generateAttributes(col, row)

      this.color = data.color
      this.row = row
      this.col = col
      this.y = -DOT_SIZE

      this.setFillStyle(data.color) // set color to the Dot
      this.makeActive()  // Set the Dot to the active state

      this.createTween({
         y: data.y,
         delay: (ROW_NUM - row) * 20
      })
   }

   makeActive() {  // Set the Dot to the active state
      this.setActive(true)
      this.setVisible(true)
   }

   createTween(extra = {}) { // Create animation of falling Dot

      /** @type {Phaser.Types.Tweens.TweenBuilderConfig} */
      const tweenConfig = {
         targets: this,
         duration: 120,
         ease: 'Linear',
         ...extra
      }

      this.scene.tweens.add(tweenConfig)  // adding tween to the scene
   }

}

