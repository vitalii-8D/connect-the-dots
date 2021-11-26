import Phaser from "phaser";

export default class LoadingBar {
   constructor(scene) {
      /** @type {Phaser.Scene} */
      this.scene = scene;
      this.style = {
         boxColor: 0xd3d3d3,
         barColor: 0xfff8dc,
         x: scene.scale.width / 2 - 450,
         y: scene.scale.height / 2 + 250,
         width: 900,
         height: 25
      }

      this.progressBox = this.scene.add.graphics();
      this.progressBar = this.scene.add.graphics();

      this.showProgressBox()
      this.setEvents()
   }

   showProgressBox() {
      this.progressBox
         .fillStyle(this.style.boxColor)
         .fillRect(this.style.x, this.style.y, this.style.width, this.style.height)
   }

   setEvents() {
      this.scene.events.on('progress', this.showProgressBar, this)
      this.scene.load.on('complete', this.onLoadComplete, this);
   }

   showProgressBar(progress) {
      this.progressBox
         .fillStyle(this.style.boxColor)
         .fillRect(this.style.x, this.style.y, this.style.width * progress, this.style.height)
   }

   onLoadComplete() {
      this.progressBar.destroy();
      this.progressBox.destroy();
   }

}
