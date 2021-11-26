import Phaser from "phaser";

import Dot from "./Dot";
import DotsArray from "./DotsArray";
import {sceneEvents} from '../events/Events'

import {CELL_SIZE, COL_NUM, POINTS_PER_DOT, ROW_NUM, DOT_TWEENS} from '../constants/constants'

export default class DotsField extends Phaser.GameObjects.Group {
   selectedColor = null;  // Color of the first selected Dot in the chain
   /** @type {DotsArray} */
   selected;  // Array of selected Dots
   /** @type {DotsArray} */
   sameColored; // All Dots on the field with selected color
   /** @type {DotsArray} */
   intersected;

   constructor(scene) {
      super(scene);
      this.scene = scene

      this.init()
   }

   init() {  // Creates initial amount of Dots  with given col and row numbers
      this.selected = new DotsArray()
      this.sameColored = new DotsArray()
      this.intersected = new DotsArray()

      for (let col = 0; col < COL_NUM; col++) {
         for (let row = 0; row < ROW_NUM; row++) {
            const dot = Dot.generate(this.scene, col, row)
            this.add(dot)
         }
      }
   }


   //  *********  Selecting the Dot when clicking the first time  *********
   selectFirst(dot) {
      this.selectedColor = dot.color;
      this.selected.add(dot).setSelected(true)
   } // ****************************


   //  *********  Checking if the hovered Dot can be selected and added...  *********
   //  ********* ...to the chain or the already selected Dot should be unmarked  *********
   connectNext(dot, connectLine, undoConnecting) {

      if (this.isSameAndNearest(dot)) {

         const index = this.selected.getIndexOf(dot);
         if (index === undefined) {
            this.selected.add(dot).setSelected(true)
            connectLine(dot)  // Connect Dot with the previously selected one. (Method from CustomGraphics)
            return;
         }

         //  *********  Checking if hovered Dot intended should be unselected  *********
         if (this.selected.length > 1 && dot === this.selected.getByIndex(-2)) {
            const unselectedDot = this.selected.deleteLast()
            unselectedDot.setSelected(false)

            const index = this.intersected.getIndexOf(unselectedDot);
            if (this.intersected.length && index !== undefined) {

               this.intersected.deleteByIndex(index)
               if (!this.intersected.length) {
                  this.sameColored.setAnimatedAll(false)
                  this.sameColored.reset()
                  this.selected.setSelectedAll(true)
               }
            }

            undoConnecting(this.selected.dots) // Redrawing all lines after undoing last selecting.  Method from CustomGraphics
            return;
         } // ****************************

         this.selected.add(dot)
         this.sameColored.dots = this.getMatching('color', this.selectedColor)
         this.sameColored.setAnimatedAll(true)
         this.intersected.add(dot)
         connectLine(dot)

      } // *** IF ***
   }// >>>>>>>>>>> connectNext(dot, connectLine, undoConnecting) <<<<<<<<<<<<<<



   //  *********  Checking selected Dots after mouse UP  *********
   checkSelectedDots(dot) {

      if (this.selected.length > 1) { // Ability to destroy all Dots the same color if your selected Dots formed a ring
         if (this.sameColored.length) { // Replace selected by all Dots same color on the field
            this.selected.dots = this.sameColored.dots
            this.sameColored.setAnimatedAll(false)
         }

         this.selected.setAliveAll(false)

         this.moveDownDots()  // Move Dots down to free space

         const earnedPoints = this.selected.length * POINTS_PER_DOT
         sceneEvents.emit('points-earned', earnedPoints)  // Emitting event for Points increasing in GameScene
      }

      this.resetHelpers()
   } // ****************************


   //  *********  Handling point disappearing and resetting  *********
   moveDownDots(dotsArr) {
      const moveObj = this.getMoveObject(this.selected.dots)  // Helper object for moving remaining dots to empty positions

      for (const col in moveObj) {  // Iterating through affected columns
         const maxRowIndex = Math.max(...moveObj[col])  // The lowest affected row (moving the Dots starting from this row and moving on to the top)
         const dotsCol = this.getMatching('col', +col);  // Whole column of Dots

         let cell = maxRowIndex  // Row index with the lowest destroyed Dot (Active Dots moving to it`s place)
         let shift = 1;  // The number of rows to which active Dots will be moved down

         for (let i = maxRowIndex - 1; i >= 0; i--) {  //
            const dot = dotsCol.find(d => d.row === i)
            if (dot.active) {  // If next Dot is active - move it down per the 'shift' value
               dot.goDownPer(shift)
               cell--;
            } else {  // if the next Dot is Destroyed, it means the next active Dot will be moved down per 1 cell more
               shift++;  // So we increasing 'shift' value
            }
         }

         const destroyedDots = dotsCol.filter(dot => !dot.active)
         const excludedColor = this.sameColored.length ? this.selectedColor : false

         // If we destroy all same colored dots - there shouldn`t be this color in new dots.
         destroyedDots.forEach((d, i) => d.resetDot(i, excludedColor))

      } // >>>>>>>>>for (const col in moveObj) <<<<<<<<<<<<

   } // >>>>>>>>> moveDownDots(dotsArr) <<<<<<<<<<<<


   //  *********  Create the object which help to manage our Dots moving from given Dots array  *********
   getMoveObject(dotsArr) {
      return dotsArr.reduce((prevValue, curValue) => {  // Helper object for deleting selected chains of Dots
         const {col, row} = curValue;

         if (!prevValue[col]) {
            prevValue[col] = []
         }
         prevValue[col].push(row)
         return prevValue
      }, {})
   } // ****************************


   isSameAndNearest(dot) {
      const lastSelectedDot = this.selected.getByIndex(-1)  // Dot which added the last
      return dot.color === this.selectedColor
         && Phaser.Math.Distance.Between(dot.x, dot.y, lastSelectedDot.x, lastSelectedDot.y) === CELL_SIZE
   }


   //  *********  Resetting helpers after pointer is UP  *********
   resetHelpers() {
      this.selectedColor = null
      this.selected.reset()
      this.sameColored.reset()
      this.intersected.reset()
   } // ****************************

}
