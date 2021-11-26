import Phaser from "phaser";

import {CELL_SIZE, COL_NUM, COLOR_SET, DOT_SIZE, ROW_NUM, X_MARGIN, Y_MARGIN, DOT_TWEENS} from '../constants/constants'

// Our Dot`s class
export default class Dot extends Phaser.GameObjects.Arc {
   /** @type {Phaser.Scene} */
   scene;
   col;
   row;
   color;
   targetY;

   tweens = {}

   static generateAttributes(colNum, rowNum, exclude) {  // Generating Dot`s attributes
      const colorSet = exclude ? COLOR_SET.filter(color => color !== exclude) : COLOR_SET
      const color = Phaser.Utils.Array.GetRandom(colorSet)  // Get random color from the set

      const x = X_MARGIN + CELL_SIZE * (colNum) + CELL_SIZE / 2; // Converting col index to the game`s X coordinates
      const y = -CELL_SIZE * (ROW_NUM - rowNum)
      const targetY = Y_MARGIN + CELL_SIZE * (rowNum) + CELL_SIZE / 2; // Converting row index to the game`s Y coordinates

      return {x, y, color, targetY}
   }

   constructor(data) {
      const {scene, x, y, radius, color} = data;
      super(scene, x, y, radius, 0, Phaser.Math.PI2, true, color); // Allow Dot to fall from the top by setting Y coordinates to -DOT_SIZE

      this.init(data);
   }

   init({scene, color, col, row, targetY}) {
      this.scene = scene

      this.col = col
      this.row = row
      this.targetY = targetY
      this.color = color
      this.isAnimating = false

      this.setInteractive()  // Making Dot visible for Pointer events
      scene.add.existing(this)  // Adding Dot to the scene

      this.createTweens()

      this.tweens[DOT_TWEENS.FALL].play()
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
      this.targetY += cellsNum * CELL_SIZE

      this.tweens[DOT_TWEENS.FALL].data[0].start = this.y
      this.tweens[DOT_TWEENS.FALL].restart()
   }

   resetDot(row, exclude) {  // Resetting destroyed Dot
      const data = Dot.generateAttributes(this.col, row, exclude)

      this.color = data.color
      this.row = row
      // this.y = data.y
      this.targetY = data.targetY

      this.setFillStyle(data.color) // set color to the Dot
      this.setAlive(true)  // Set the Dot to the active state

      this.tweens[DOT_TWEENS.FALL].data[0].start = data.y
      this.tweens[DOT_TWEENS.FALL].restart()
   }

   setAlive(status) {  // Set the Dot to the active state
      this.setActive(status)
      this.setVisible(status)
   }

   setSelected(state) {
      if (this.isAnimating) return;

      const animKey = state ? DOT_TWEENS.SELECT : DOT_TWEENS.UNSELECT;

      this.tweens[animKey].play()
   }

   setAnimated(state) {
      if (this.isAnimating === state) return;

      this.isAnimating = state
      state ?
         this.tweens[DOT_TWEENS.ANIMATION].play()
         : this.tweens[DOT_TWEENS.ANIMATION].stop(0)
   }


   createTweens() {
      this.tweens[DOT_TWEENS.FALL] = this.scene.tweens.create({
         targets: this,
         y: () => this.targetY,
         delay: 50,
         duration: 400,
         ease: 'Bounce.easeOut',
      })

      this.tweens[DOT_TWEENS.SELECT] = this.createScaleTween({scale: 1.3})

      this.tweens[DOT_TWEENS.UNSELECT] = this.createScaleTween({scale: 0.8})

      this.tweens[DOT_TWEENS.ANIMATION] = this.createScaleTween({
         ease: 'Linear',
         repeat: -1,
         delay: 10,
         duration: 100
      })
   }


   createScaleTween(extras) {
      const config = {
         targets: this,
         ease: 'Back.easeInOut',
         scale: 1.5,
         yoyo: true,
         repeat: 1,
         delay: 20,
         duration: 80,
         ...extras
      }

      return this.scene.tweens.create(config)
   }

}

