import Phaser from 'phaser';

import GamePause from "../classes/GamePause";

import {sceneEvents} from '../events/Events'
import {GAME_WIDTH, Y_MARGIN} from '../constants/constants'

export default class GameUI extends Phaser.Scene {
   /** @type {Phaser.GameObjects.Text} */
   pointsText;
   gamePause;

   constructor() {
      super('game-ui');
   }

   create() {
      this.createPointsText()
      this.createButtons()
      this.gamePause = new GamePause(this)

      sceneEvents.on('update-points-text', this.updatePointsText, this)  // Listener for the text updating
      this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {  // Remove listener if the scene is Shut down
         sceneEvents.off('update-points-text', this.updatePointsText)
      })
   }

   createPointsText() {
      /** @type { Phaser.Types.GameObjects.Text.TextStyle} */
      const textStyle = {
         fontSize: 42,    // Text style config
         color: '#5D3F6A',
         fontStyle: 'bold'
      }

      this.pointsText = this.add.text(  // Create 'POINTS' label in the right-top corner
         GAME_WIDTH * 0.9,
         Y_MARGIN * 0.5,
         'POINTS: 0',
         textStyle
      ).setOrigin(1, 0.5).setDepth(10)
   }

   updatePointsText(points) { // Update text with points
      this.pointsText.text = `POINTS: ${points}`
   }

   createButtons() {
      const {width, height} = this.scale
      const circle = this.add.circle(width / 12, width / 12, width / 18, 0xf3d396)
         .setInteractive()
         .on('pointerdown', this.setPause, this)
         .setStrokeStyle(4, 0x9A5CA7)

      this.pauseBtn = this.add.sprite(width / 12, width / 12, 'icon', 'pause.png')
         .setScale(1.4)
         .setTint(0x9A5CA7)
   }

   setPause() {

   }

}
