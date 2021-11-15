import Phaser from 'phaser';

import DotsField from "./DotsField";
import CustomGraphics from "./CustomGraphics";

export default class GameScene extends Phaser.Scene {
   /** @type {DotsField} */
   dots;
   /** @type {CustomGraphics} */
   graphics;

   constructor() {
      super('game');
   }

   create() {
      this.dots = new DotsField(this)
      this.graphics = new CustomGraphics(this)

      this.input.on('pointerdown', this.onPointerDown, this)
   }

   onPointerDown(pointer, targets) {
      /** @type {Dot} */
      const dot = targets[0]
      if (!dot) return;

      this.dots.selectFirst(dot)
      this.graphics.startLineFrom(dot)

      this.input.off('pointerdown', this.onPointerDown, this)
      this.input.on('pointermove', this.onPointerMove, this)
      this.input.on('pointerover', this.onPointerOver, this)
      this.input.on('pointerup', this.onPointerUp, this)
   }

   onPointerOver(pointer, targets) {
      const dot = targets[0]
      if (!dot) return;

      this.dots.connectNext(
         dot,
         this.graphics.connectLineTo.bind(this.graphics),
         this.graphics.redrawLines.bind(this.graphics)
      )
   }

   onPointerUp(pointer, targets) {
      this.dots.stopSelecting()
      this.graphics.clearDrawings()

      this.input.on('pointerdown', this.onPointerDown, this)
      this.input.off('pointermove', this.onPointerMove, this)
      this.input.off('pointerover', this.onPointerOver, this)
      this.input.off('pointerup', this.onPointerUp, this)
   }

   onPointerMove(pointer) {
      const lastDot = this.dots.chosenDots.at(-1)

      this.graphics.updateMouseLine(lastDot, pointer)
   }

}
