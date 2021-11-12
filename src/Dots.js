import Phaser from "phaser";
import Dot from "./Dot";

import {CELL_SIZE,COL_NUM,COLOR_SET,DOT_SIZE, ROW_NUM} from './constants'

export default class Dots extends Phaser.GameObjects.Group {
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
      for (let i = 0; i < ROW_NUM; i++) {
         for (let j = 0; j < COL_NUM; j++) {
            const dot = Dot.generate(this.scene, i, j)
            this.add(dot)
         }
      }
   }

   onDotClick(dot) {
      this.chosenColor = dot.color;
      this.chosenDots.push(dot)

      this.updateMoveObj(dot.col, dot.row)
   }

   onDotOverlap(dot, cb) {
      const lastChosenDot = this.chosenDots[this.chosenDots.length - 1];
      if (dot.color === this.chosenColor
         && Phaser.Math.Distance.Between(dot.x, dot.y, lastChosenDot.x, lastChosenDot.y) < CELL_SIZE + 5
         && !this.chosenDots.some(d => d === dot)
      ) {
         this.chosenDots.push(dot)

         this.updateMoveObj(dot.col, dot.row)

         cb('connect');
      }

      if (dot === this.chosenDots[this.chosenDots.length - 2]) {
         console.log('undo')
         const releasedDot = this.chosenDots.pop()
         const {col, row} = releasedDot
         this.moveObj[col] = this.moveObj[col].filter(r => r != row)
         cb('undo')
      }

   }

   onMouseUp() {
      if (this.chosenDots.length > 1) {

         this.chosenDots.forEach(dot => {
            this.killAndHide(dot)
         })

         this.handleChosenDots(this.moveObj)
      }
   }

   resetHelpers() {
      this.chosenDots = []
      this.moveObj = {}
      this.chosenColor = null
   }

   updateMoveObj(col, row) {
      // Creating object for further dots moving
      if (!this.moveObj[col]) {
         this.moveObj[col] = []
      }
      this.moveObj[col].push(row)
   }

   handleChosenDots(moveObj) {

      for (const col in moveObj) {
         const shift = moveObj[col].length
         const startRowIndex = Math.min(...moveObj[col]) - 1

         const dotsCol = this.getMatching('col', +col);

         if (startRowIndex >= 0) {
            dotsCol.forEach(dot => {
               if (dot.row <= startRowIndex) {
                  dot.goDownPer(shift)
               }
            })
         } else {
            for (let i = 0; i < shift; i++) {

            }
         }

         const inactiveDots = dotsCol.filter(dot => !dot.active)

         inactiveDots.forEach((dot, row) => {
            dot.restoreColorAndPosition(row)
         })

      }
   }

}
