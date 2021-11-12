import Phaser from "phaser";
import Dot from "./Dot";

import {CELL_SIZE,COL_NUM,COLOR_SET,DOT_SIZE, ROW_NUM} from './constants'

export default class Dots extends Phaser.GameObjects.Group {
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
