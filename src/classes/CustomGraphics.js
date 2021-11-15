import Phaser from "phaser";

export default class CustomGraphics extends Phaser.GameObjects.Graphics {
   /** @type {Phaser.Scene} */
   scene;
   /** @type {Phaser.GameObjects.Line} */
   mouseLine;

   constructor(scene) {
      super(scene);
      this.scene = scene

      scene.add.existing(this)
      this.mouseLine = scene.add.line().setOrigin(0, 0).setLineWidth(5, 5)
   }

   startLineFrom(dot) {  // Calling from GameScene.onPointerDown()
      // Separate line from Dot to cursor pointer
      this.mouseLine.setTo(dot.x, dot.y, dot.x, dot.y)
      this.mouseLine.setAlpha(1)
      this.mouseLine.setStrokeStyle(5, dot.color, 1)
   }
   startPathFrom(dot) {
      // Start drawing connecting line
      this.lineStyle(10, dot.color)
      this.fillStyle(10, dot.color)
      this.beginPath()
      this.moveTo(dot.x, dot.y);
   }

   connectLineTo(dot) {  // Calling from GameScene.onPointerOver()
      this.lineTo(dot.x, dot.y)
      this.strokePath();
   }

   redrawLines(dotsArr) {  // Calling from GameScene.onPointerOver()
      this.clearGraphics()

      const lastDot = dotsArr.at(-1)

      // Mouse Line
      this.startLineFrom(lastDot)
      this.startPathFrom(dotsArr[0])

      if (dotsArr.length > 1) {
         for (let i = 1; i < dotsArr.length; i++) {
            this.lineTo(dotsArr[i].x, dotsArr[i].y)
            this.strokePath();
         }
      }
   }

   clearGraphics() {  // Clear all drawn lines
      this.mouseLine.setAlpha(0)
      this.clear();
   }

   updateMouseLine(dot, pointer) {  // Updating Cursor`s line position
      this.mouseLine.setTo(dot.x, dot.y, pointer.x, pointer.y)
   }

}
