import Phaser from "phaser";

import Dot from "./Dot";
import {sceneEvents} from '../events/Events'

import {CELL_SIZE, COL_NUM, POINTS_PER_DOT, ROW_NUM, DOT_TWEENS} from '../constants/constants'

export default class DotsField extends Phaser.GameObjects.Group {
   selectedColor;  // Color of the first selected Dot in the chain
   selectedDots = [];  // Array of selected Dots
   dotsSameColor = null; // All Dots on the field with selected color

   constructor(scene) {
      super(scene);
      this.scene = scene

      this.init()
   }

   init() {  // Creates initial amount of Dots  with given col and row numbers
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
      this.selectDot(dot)
   } // ****************************



   //  *********  Checking if the hovered Dot can be selected and added...  *********
   //  ********* ...to the chain or the already selected Dot should be unmarked  *********
   connectNext(dot, connectLine, undoConnecting) {
      const lastSelectedDot = this.getSelectedDotAtPosition(-1)  // Dot which added the last

      if (dot.color === this.selectedColor
         && Phaser.Math.Distance.Between(dot.x, dot.y, lastSelectedDot.x, lastSelectedDot.y) < CELL_SIZE + 5
      ) {
         //  *********  New nearby Dot should be connected to the chain  *********
         if (!this.selectedDots.some(d => d === dot)) {
            this.selectDot(dot)
            connectLine(dot)  // Connect Dot with the previously selected one. (Method from CustomGraphics)
         } // ****************************

         //  *********  In case selected Dots are closing in a circle  *********
         if (this.isCircleFormed(dot)) {

            this.dotsSameColor = this.getMatching('color', this.selectedColor)

            // this.stopSwitchPlayTween(this.selectedDots, this.dotsSameColor, this.dotsSameColor, DOT_TWEENS.ALL_SELECTED)

            this.scene.input.once('pointerout', this.unmarkDotsSameColor, this)
         } // ****************************
      }// *** IF ***


      //  *********  Checking if hovered Dot intended should be unmarked  *********
      if (dot === this.getSelectedDotAtPosition(-2)) {
         const releasedDot = this.selectedDots.pop()
         // this.unselectDot(releasedDot)

         undoConnecting(this.selectedDots) // Redrawing all lines after undoing last selecting.  Method from CustomGraphics
      } // ****************************

   }// >>>>>>>>>>> connectNext(dot, connectLine, undoConnecting) <<<<<<<<<<<<<<


   //  *********  Unmark all same colored Dots and change Tween back to initial  *********
   unmarkDotsSameColor() {
      // this.stopSwitchPlayTween(this.dotsSameColor, this.dotsSameColor, this.selectedDots, DOT_TWEENS.FEW_SELECTED)

      this.dotsSameColor = null

      this.scene.input.off('pointerout', this.unmarkDotsSameColor, this)
   } // ****************************


   //  *********  Checking selected Dots after mouse UP  *********
   checkSelectedDots(dott) {

      if (this.isCircleFormed(dott)) { // Replace selectedDots by all Dots same color on the field
         this.selectedDots = [...this.dotsSameColor];

         this.scene.input.off('pointerout', this.unmarkDotsSameColor, this)
      }

      // this.stopSwitchPlayTween(this.selectedDots, this.selectedDots, null, DOT_TWEENS.FEW_SELECTED)

      if (this.selectedDots.length > 1) { // Ability to destroy all Dots the same color if your selected Dots formed a ring
         this.selectedDots.forEach(dot => dot.setAlive(false))

         this.moveDownDots()  // Move Dots down to free space

         const earnedPoints = this.selectedDots.length * POINTS_PER_DOT
         sceneEvents.emit('points-earned', earnedPoints)  // Emitting event for Points increasing in GameScene
      }

      this.resetHelpers()
   } // ****************************

   // stopSwitchPlayTween(toStop, toSwitch, toPlay, tweenKey) {
   //    toStop?.forEach(dot => dot.stopSelectedTween())
   //    toSwitch?.forEach(dot => dot.switchTween(tweenKey))
   //    toPlay?.forEach(dot => dot.playSelectedTween())
   // }


   //  *********  Handling point disappearing and resetting  *********
   moveDownDots(dotsArr) {
      const moveObj = this.getMoveObject(this.selectedDots)  // Helper object for moving remaining dots to empty positions

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

         // If we destroy all same colored dots - there shouldn`t be this color in new dots.
         destroyedDots.forEach((dot, index) => dot.resetDot(index, this.dotsSameColor ? this.selectedColor : false))
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


   //  *********  Add the Dot to array with selected Dots and start playing onSelectTween  *********
   selectDot(dot) {
      // dot.playSelectedTween()
      this.selectedDots.push(dot)
   }
   // unselectDot(dot) { // Stop playing onSelectTween
   //    dot.stopSelectedTween()
   // } // ****************************


   //  *********  Check if the chain with selected Dots closed on circle  *********
   isCircleFormed(dot) {
      return dot
         && this.selectedDots.length >= 4
         && Phaser.Math.Distance.Between(dot.x, dot.y, this.getSelectedDotAtPosition(-1).x, this.getSelectedDotAtPosition(-1).y) < CELL_SIZE + 5
         && this.selectedDots.slice(0, -3).some(d => d === dot)
   } // ****************************


   //  *********  Resetting helpers after pointer is UP  *********
   resetHelpers() {
      this.selectedDots = []
      this.selectedColor = null
      this.dotsSameColor = null
   } // ****************************


   //  *********  Get a Dot on the given position  *********
   getSelectedDotAtPosition(index) {
      return this.selectedDots.at(index)
   } // ****************************

}
