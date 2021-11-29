import Phaser from "phaser";

import MenuBtn from "../classes/MenuBtn";

export default class MenuScene extends Phaser.Scene {
   timeGameBtn;
   moveGameBtn;
   infiniteGameBtn;
   challengeGameBtn;

   constructor(props) {
      super('Menu');
   }

   create() {
      this.createButtons()
   }

   createButtons() {
      this.scene.run()
      const {width, height} = this.scale

      this.timeGameBtn = MenuBtn.generate({
         scene: this,
         x: width / 2,
         y: height / 4,
         texture: 'btn',
         frame: 'blue_button0.png',
         text: 'Time',
      })

      this.moveGameBtn = MenuBtn.generate({
         scene: this,
         x: width / 2,
         y: height * 5 / 12,
         texture: 'btn',
         frame: 'green_button0.png',
         text: 'Moves',
      })

      this.infiniteGameBtn = MenuBtn.generate({
         scene: this,
         x: width / 2,
         y: height * 7 / 12,
         texture: 'btn',
         frame: 'red_button0.png',
         text: 'Infinite',
      })

      this.chalengeGameBtn = MenuBtn.generate({
         scene: this,
         x: width / 2,
         y: height * 3 / 4,
         texture: 'btn',
         frame: 'yellow_button0.png',
         text: 'Challenge',
      })
   }

}


