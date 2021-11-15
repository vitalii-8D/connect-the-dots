import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
   constructor() {
      super('preloader');
   }

   preload() {
      this.load.image('circle', 'assets/circle.png')
   }

   create() {
      this.scene.start('game')
   }

}
