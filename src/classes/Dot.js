import Phaser from "phaser";

import {CELL_SIZE, COL_NUM, COLOR_SET, DOT_SIZE, ROW_NUM, X_MARGIN, Y_MARGIN, DOT_TWEENS} from '../constants/constants'

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
      const {scene, color, col, row} = data;

      this.scene = scene
      this.col = col
      this.row = row
      this.color = color
      this.tweens = {} // Dot`s tweens

      this.setInteractive()  // Making Dot visible for Pointer events
      this.scene.add.existing(this)  // Adding Dot to the scene

      this.createInitialTweens(data)
      this.currentTween = this.tweens[DOT_TWEENS.FEW_SELECTED]
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

      this.createTween({
         y: `+=${cellsNum * CELL_SIZE}`
      })

      // this.scene.tweens.add({
      //    targets: this,
      //    duration: 150,
      //    ease: 'Linear',
      //    y: `+=${cellsNum * CELL_SIZE}`,
      //    onComplete: (tween) => {
      //       tween.remove()
      //    },
      //    callbackScope: this
      // })
   }

   setNewColorAndPosition(row, col = this.col) {  // Resetting destroyed Dot
      const data = Dot.generateAttributes(col, row)

      this.color = data.color
      this.row = row
      this.col = col
      this.y = -DOT_SIZE

      this.setFillStyle(data.color, 1) // set color to the Dot
      this.makeActive()  // Set the Dot to the active state

      this.createTween({
         y: data.y,
         delay: (ROW_NUM - row) * 20,
      })

      // this.scene.tweens.add({
      //    targets: this,
      //    ease: 'Linear',
      //    y: data.y,
      //    delay: (ROW_NUM - row) * 20,
      //    duration: 150,
      //    onComplete: (tween) => {
      //       tween.remove()
      //    },
      //    callbackScope: this
      // })
   }

   makeActive() {  // Set the Dot to the active state
      this.setActive(true)
      this.setVisible(true)
   }

   playSelectedTween() {
      this.currentTween.play()
   }

   stopSelectedTween() {
      this.currentTween.stop()
   }

   switchTween(name) {
      this.currentTween = this.tweens[name]
   }

   createInitialTweens(data) {
      const {y, col, row} = data;

      this.createTween({
         y,
         delay: col * 30 * COL_NUM + (ROW_NUM - 1 - row) * 30 + 500
      })

      // this.scene.tweens.add({
      //    targets: this,
      //    ease: 'Linear',
      //    y,
      //    delay: col * 30 * COL_NUM + (ROW_NUM - 1 - row) * 30 + 500,
      //    duration: 150,
      //    onComplete: (tween) => {
      //       tween.remove()
      //    },
      //    callbackScope: this
      // })

      this.tweens[DOT_TWEENS.FEW_SELECTED] = this.createTween({
         scale: 1.2,
         delay: 30,
         duration: 300,
         onActive: () => this.setScale(1)
      }, false, true, false)

      // this.tweens[DOT_TWEENS.FEW_SELECTED] = this.scene.tweens.create({
      //    targets: this,
      //    ease: 'Linear',
      //    scale: 1.2,
      //    delay: 30,
      //    duration: 300,
      //    yoyo: true,
      //    repeat: -1,
      //    onActive: () => this.setScale(1),
      //    onStop: () => this.setScale(1),
      //    callbackScope: this
      // })

      this.tweens[DOT_TWEENS.ALL_SELECTED] = this.createTween({
         ease: 'Bounce',  // 'Cubic', 'Elastic', 'Bounce', 'Back'
         scale: 1.3,
         duration: 200,
         onActive: () => this.setScale(1.1),
      }, false, true, false)

      // this.tweens[DOT_TWEENS.ALL_SELECTED] = this.scene.tweens.create({
      //    targets: this,
      //    ease: 'Bounce',  // 'Cubic', 'Elastic', 'Bounce', 'Back'
      //    scale: 1.3,
      //    duration: 150,
      //    yoyo: true,
      //    repeat: -1,
      //    onActive: () => this.setScale(1.1),
      //    onStop: () => this.setScale(1),
      //    callbackScope: this
      // })
   }

   createTween(extra, removeOnComplete = true, repeat = false, play = true) {
      /** @type {Phaser.Types.Tweens.TweenBuilderConfig} */
      const config = {
         targets: this,
         ease: 'Linear',
         duration: 150,
         onStop: () => {
            this.setScale(1)
         },
         callbackScope: this,
         ...extra
      }

      repeat ? Object.assign(config, {yoyo: true, repeat: -1}) : '';
      removeOnComplete ? Object.assign(config, {onComplete: tween => tween.remove()}) : '';

      return this.scene.tweens[`${play ? 'add' : 'create'}`](config)
   }

}

