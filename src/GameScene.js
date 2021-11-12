import Phaser from 'phaser';

import Dot from "./Dot";
import Dots from "./Dots";
import CustomGraphics from "./Graphics";

import {CELL_SIZE, COL_NUM, COLOR_SET, DOT_SIZE, ROW_NUM} from './constants'

export default class GameScene extends Phaser.Scene {
   /** @type {Dots} */
   dotsGroup;

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

      this.dotsGroup.onDotClick(dot)
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

      this.dotsGroup.onDotOverlap(dot, (action) => {
         if (action === 'connect') {
            this.graphics.connectLineTo(dot)
         }
         if (action === 'undo') {
            this.graphics.redrawLines(this.dotsGroup.chosenDots)
         }
      })
   }

   stopDrag(pointer, targets) {
      this.dotsGroup.onMouseUp()
      this.dotsGroup.resetHelpers()
      this.graphics.clearDrawings()

      this.input.on('pointerdown', this.startDrag, this)
      this.input.off('pointermove', this.drawMouseLine, this)
      this.input.off('pointerover', this.doDrag, this)
      this.input.off('pointerup', this.stopDrag, this)
   }

   drawMouseLine(pointer) {
      const lastDot = this.dotsGroup.chosenDots[this.dotsGroup.chosenDots.length - 1]

      this.graphics.updateMouseLine(lastDot, pointer)
   }

}
