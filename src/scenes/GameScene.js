import Phaser from 'phaser';

import DotsField from "../classes/DotsField";
import CustomGraphics from "../classes/CustomGraphics";

import {sceneEvents} from '../events/Events'

export default class GameScene extends Phaser.Scene {
   /** @type {DotsField} */
   dots; // Group class which is handling a Dot logic
   /** @type {CustomGraphics} */
   graphics; // Draws lines
   points; // Earned points

   constructor() {
      super('game');
   }

   init() {
   }

   create() {
      this.scene.run('game-ui') // Running UI

      this.dots = new DotsField(this)
      this.graphics = new CustomGraphics(this)

      this.points = 0;

      sceneEvents.on('points-earned', this.increasePoints, this) // 'points-earned' emitted by DotsField class after destroying selected line
      this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {  //
         sceneEvents.off('update-points-text', this.updatePointsText)
      }, this)

      this.input.on('pointerdown', this.onPointerDown, this) // Mouse click event
   }

   increasePoints(points) {  // adding points
      this.points += points;
      sceneEvents.emit('update-points-text', this.points) // Event emitted for GameUI to update the POINTS text
   }

   onPointerDown(pointer, targets) { // Mouse click handler
      /** @type {Dot} */
      const dot = targets[0]
      const tweenIsPlaying = this.tweens.getAllTweens().length; // Prevent clicking while any tween playing
      if (!dot || tweenIsPlaying) return;

      this.dots.selectFirst(dot) // Selecting clicked dot
      this.graphics.startLineFrom(dot) // Start drawing the line from dot to mouse pointer
      this.graphics.startPathFrom(dot) // Begin the path which will be drawn between connected points

      this.input.off('pointerdown', this.onPointerDown, this) // Remove the listener while mouse is already pressed
      this.input.on('pointermove', this.onPointerMove, this) // Mouse move event for drawing the cursor line
      this.input.on('pointerover', this.onPointerOver, this) // Mouse over event for Dot
      this.input.on('pointerup', this.onPointerUp, this) // Mouse UP event
   }

   onPointerOver(pointer, targets) {  //
      const dot = targets[0]
      if (!dot) return;

      this.dots.connectNext(  // Connect the next dot (if it acceptable)
         dot,
         this.graphics.connectLineTo.bind(this.graphics), // cb in case the line is allowed to connect with
         this.graphics.redrawLines.bind(this.graphics) // cb in case was chosen the previous Dot for undo last selecting
      )
   }

   onPointerUp(pointer, targets) {  // Mouse UP handler
      this.dots.checkSelectedDots() // Finish selecting and destroy connected dots(if acceptable)
      this.graphics.clearGraphics() // Clear all connected lines

      this.input.on('pointerdown', this.onPointerDown, this) // Add mouse up listener again
      this.input.off('pointermove', this.onPointerMove, this) // Remove the listener while mouse is UP
      this.input.off('pointerover', this.onPointerOver, this) // Remove the listener while mouse is UP
      this.input.off('pointerup', this.onPointerUp, this) // Remove the listener while mouse is UP
   }

   onPointerMove(pointer) { // Mouse line handler
      const lastDot = this.dots.getSelectedDotAtPosition(-1)

      this.graphics.updateMouseLine(lastDot, pointer) // Updating position of the Cursor line
   }

}
