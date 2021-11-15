import Phaser from "phaser";

export default class CustomGraphics extends Phaser.GameObjects.Graphics {
   /** @type {Phaser.GameObjects.Line} */
   mouseLine;

   constructor(scene) {
      super(scene);
      this.scene = scene

      scene.add.existing(this)
      this.mouseLine = scene.add.line().setOrigin(0, 0).setLineWidth(5, 5)
   }

   //  *****  Separate line from Dot to cursor pointer  ***
   startLineFrom(dot) {  // Calling from GameScene.onPointerDown()
      this.mouseLine.setTo(dot.x, dot.y, dot.x, dot.y)
      this.mouseLine.setAlpha(1)
      this.mouseLine.setStrokeStyle(5, dot.color, 1)
   } // ****************************

   // *****  Start drawing connecting line  ***
   startPathFrom(dot) {
      this.lineStyle(10, dot.color)
      this.fillStyle(10, dot.color)
      this.beginPath()
      this.moveTo(dot.x, dot.y);
   } // ****************************

   //  *****  Calling from GameScene.onPointerOver()  ***
   connectLineTo(dot) {
      this.lineTo(dot.x, dot.y)
      this.strokePath();
   } // ****************************

   // *****  Calling from GameScene.onPointerOver()   ***
   redrawLines(dotsArr) {
      this.clearGraphics()

      const lastDot = dotsArr.at(-1)

      // * Mouse Line *
      this.startLineFrom(lastDot)
      this.startPathFrom(dotsArr[0])

      if (dotsArr.length > 1) {
         for (let i = 1; i < dotsArr.length; i++) {
            this.lineTo(dotsArr[i].x, dotsArr[i].y)
            this.strokePath();
         }
      }
   } // ****************************

   //  *****  Clear all drawn lines  ***
   clearGraphics() {
      this.mouseLine.setAlpha(0)
      this.clear();
   } // ****************************

   //  *****  Updating Cursor`s line position  ***
   updateMouseLine(dot, pointer) {
      this.mouseLine.setTo(dot.x, dot.y, pointer.x, pointer.y)
   } // ****************************

}
