import Phaser from "phaser";

import Dot from "./Dot";
import {sceneEvents} from '../events/Events'

import {CELL_SIZE, COL_NUM, POINTS_PER_DOT, ROW_NUM} from '../constants/constants'

export default class DotsField extends Phaser.GameObjects.Group {
   /** @type {Phaser.Scene} */
   scene;
   selectedColor;  // Color of the first selected Dot in the chain
   selectedDots = [];  // Array of selected Dots

   constructor(scene) {
      super(scene);

      this.scene = scene
      this.init()
   }

   init() {
      // Creates initial amount of Dots  with given col and row numbers
      for (let col = 0; col < COL_NUM; col++) {
         for (let row = 0; row < ROW_NUM; row++) {
            const dot = Dot.generate(this.scene, col, row)
            this.add(dot)
         }
      }
   }

   selectFirst(dot) {
      // Selecting the Dot when clicking the first time
      this.selectedColor = dot.color;
      this.selectDot(dot)
   }

   connectNext(dot, connectLine, undoConnecting) {
      // Checking if hovered Dot can be selected and added to the chain or an already selected Dot should be unmarked
      const lastSelectedDot = this.getSelectedDotAtPosition(-1)  // Dot which added the last

      if (dot.color === this.selectedColor
         && Phaser.Math.Distance.Between(dot.x, dot.y, lastSelectedDot.x, lastSelectedDot.y) < CELL_SIZE + 5
         && !this.selectedDots.some(d => d === dot)
      ) {
         this.selectDot(dot)

         connectLine(dot)  // Connect Dot with the previously selected one.  Method from CustomGraphics
      }

      // Checking if hovered Dot intended should be unmarked
      if (dot === this.getSelectedDotAtPosition(-2)) {
         const releasedDot = this.selectedDots.pop()
         this.unselectDot(releasedDot)

         undoConnecting(this.selectedDots) // Redrawing all lines after undoing last selecting.  Method from CustomGraphics
      }

   }

   checkSelectedDots() {  // Checking selected Dots after mouse UP
      if (this.selectedDots.length > 1) {
         this.destroyDots(this.selectedDots)  // Kill and Hide the the given Dots

         this.emitParticles(this.selectedDots, () => {
            this.moveDownDots(this.selectedDots)  // Move Dots down to free space

            const earnedPoints = this.selectedDots.length * POINTS_PER_DOT  //
            sceneEvents.emit('points-earned', earnedPoints)  // Emitting event for Points increasing in GameScene
         })
      }

      this.resetHelpers()
   }

   resetHelpers() {  // Resetting helpers after pointer is UP
      this.selectedDots.forEach(dot => this.unselectDot(dot))
      this.selectedDots = []
      this.selectedColor = null
   }

   emitParticles(dotsArr, cb) {
      dotsArr.forEach(dot => {
         dot.emitParticles(cb)
      })
   }

   destroyDots(dotsArr) {   // Kill and Hide the the given Dots
      dotsArr.forEach(dot => {
         this.killAndHide(dot)
      })
   }

   resetDotsAtTheTopOfCol(dotsArr, col) {  // Reset killed and hidden Dots at the top of column
      dotsArr.forEach((dot, index) => {
         dot.setNewColorAndPosition(index)
      })
   }

   moveDownDots(dotsArr) {
      // Handling point disappearing and resetting
      const moveObj = this.getMoveObject(dotsArr)  // Helper object for moving remaining dots to empty positions

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

         const destroyedDots = dotsCol.filter(dot => !dot.active)  //
         this.resetDotsAtTheTopOfCol(destroyedDots)  // // Reset killed and hidden Dots at the top of column
      }
   }

   getMoveObject(dotsArr) {
      // Create the object which help to manage our Dots moving from given Dots array
      return dotsArr.reduce((prevValue, curValue) => {  // Helper object for deleting selected chains of Dots
         const {col, row} = curValue;

         if (!prevValue[col]) {
            prevValue[col] = []
         }
         prevValue[col].push(row)
         return prevValue
      }, {})
   }

   // Get selected dot at special position
   getSelectedDotAtPosition(index) {  // Get a Dot on the given position
      return this.selectedDots.at(index)
   }

   selectDot(dot) { // Add the Dot to array with selected Dots and start playing onSelectTween
      dot.playOnSelectTween()
      this.selectedDots.push(dot)
   }
   unselectDot(dot) { // Stop playing onSelectTween
      dot.stopOnSelectTween()
   }

}
