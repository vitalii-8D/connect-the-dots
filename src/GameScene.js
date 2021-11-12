import Phaser from 'phaser';

import Dot from "./Dot";
import Dots from "./Dots";
import CustomGraphics from "./Graphics";

import {CELL_SIZE, COL_NUM, COLOR_SET, DOT_SIZE, ROW_NUM} from './constants'

export default class GameScene extends Phaser.Scene {
   /** @type {Dots} */
   dotsGroup;
   chosenColor;
   chosenDots = [];
   moveObj = {}

   /** @type {Phaser.GameObjects.Graphics} */
   painter;
   /** @type {Phaser.GameObjects.Line} */
   mouseLine;

   constructor() {
      super('game');
   }

   create() {
      this.dotsGroup = new Dots(this)
      this.graphics = new CustomGraphics(this)

      this.input.on('pointerdown', this.startDrag, this)
   }

   startDrag(pointer, targets) {
      /** @type {Dot} */
      const dot = targets[0]
      if (!dot) return;

      this.chosenColor = dot.color;
      this.chosenDots.push(dot)

      // Creating object for further dots moving
      this.updateMoveObj(dot.col, dot.row)

      this.graphics.startLineFrom(dot)

      this.input.off('pointerdown', this.startDrag, this)
      this.input.on('pointermove', this.drawMouseLine, this)
      this.input.on('pointerover', this.doDrag, this)
      this.input.on('pointerup', this.stopDrag, this)
   }

   doDrag(pointer, targets) {
      /** @type {Dot} */
      const dot = targets[0]
      if (!dot) return;

      const lastChosenDot = this.chosenDots[this.chosenDots.length - 1];
      if (dot.color === this.chosenColor
         && Phaser.Math.Distance.Between(dot.x, dot.y, lastChosenDot.x, lastChosenDot.y) < CELL_SIZE + 5
         && !this.chosenDots.some(d => d === dot)
      ) {
         this.chosenDots.push(dot)

         // Creating object for further dots moving
         this.updateMoveObj(dot.col, dot.row)

         this.graphics.connectLineTo(dot)
      }
   }

   stopDrag(pointer, targets) {
      if (this.chosenDots.length > 1) {

         this.chosenDots.forEach(dot => {
            this.dotsGroup.killAndHide(dot)
         })

         this.dotsGroup.handleChosenDots(this.moveObj)
      }

      this.chosenDots = []
      this.moveObj = {}
      this.chosenColor = null

      this.graphics.clearDrawings()

      this.input.on('pointerdown', this.startDrag, this)
      this.input.off('pointermove', this.drawMouseLine, this)
      this.input.off('pointerover', this.doDrag, this)
      this.input.off('pointerup', this.stopDrag, this)
   }

   drawMouseLine(pointer) {
      const lastDot = this.chosenDots[this.chosenDots.length - 1]

      this.graphics.updateMouseLine(lastDot, pointer)
   }

   updateMoveObj(col, row) {
      // Creating object for further dots moving
      if (!this.moveObj[col]) {
         this.moveObj[col] = []
      }
      this.moveObj[col].push(row)
   }

}
