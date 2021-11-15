import Phaser from "phaser";
import Dot from "./Dot";

import {CELL_SIZE, COL_NUM, COLOR_SET, DOT_SIZE, ROW_NUM} from './constants'

export default class DotsField extends Phaser.GameObjects.Group {
   /** @type {Phaser.Scene} */
   scene;
   chosenColor;
   chosenDots = [];
   moveObj = {}

   constructor(scene) {
      super(scene);

      this.scene = scene
      this.init()
   }

   init() {
      for (let col = 0; col < COL_NUM; col++) {
         for (let row = 0; row < ROW_NUM; row++) {
            const dot = Dot.generate(this.scene, col, row)
            this.add(dot)
         }
      }
   }

   selectFirst(dot) {
      const {col, row, color} = dot

      this.chosenColor = color;
      this.chosenDots.push(dot)

      this.updateHelperObj(col, row)
   }

   connectNext(dot, connectLine, undoConnecting) {
      const lastChosenDot = this.chosenDots.at(-1)
      if (dot.color === this.chosenColor
         && Phaser.Math.Distance.Between(dot.x, dot.y, lastChosenDot.x, lastChosenDot.y) < CELL_SIZE + 5
         && !this.chosenDots.some(d => d === dot)
      ) {
         this.chosenDots.push(dot)

         this.updateHelperObj(dot.col, dot.row)

         connectLine(dot)
      }

      if (dot === this.chosenDots.at(-2)) {
         const releasedDot = this.chosenDots.pop()

         this.moveObj[releasedDot.col] = this.moveObj[releasedDot.col].filter(row => row != releasedDot.row)

         undoConnecting(this.chosenDots)
      }

   }

   stopSelecting() {
      if (this.chosenDots.length > 1) {

         this.chosenDots.forEach(dot => {
            this.killAndHide(dot)
         })

         this.handleChosenDots(this.moveObj)
      }

      this.resetHelpers()
   }

   resetHelpers() {
      this.chosenDots = []
      this.moveObj = {}
      this.chosenColor = null
   }

   updateHelperObj(col, row) {
      // Creating a helper object for further dots moving
      if (!this.moveObj[col]) {
         this.moveObj[col] = []
      }
      this.moveObj[col].push(row)
   }

   handleChosenDots(moveObj) {

      for (const col in moveObj) {
         const maxRowIndex = Math.max(...moveObj[col])
         const dotsCol = this.getMatching('col', +col);

         let s = 1;
         let cell = maxRowIndex

         for (let i = maxRowIndex - 1; i >= 0; i--) {
            const dot = dotsCol.find(d => d.row === i)
            if (dot.active) {
               dot.goDownPer(s)
               cell--;
            } else {
               s++;
            }
         }

         const inactiveDots = dotsCol.filter(dot => !dot.active)

         inactiveDots.forEach((dot, row) => {
            dot.restoreColorAndPosition(row)
         })

      }
   }

}
