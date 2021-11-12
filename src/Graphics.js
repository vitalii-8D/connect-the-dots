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

   startLineFrom(dot) {
      // Graphics
      this.lineStyle(10, dot.color)
      this.fillStyle(10, dot.color)
      this.beginPath()
      this.moveTo(dot.x, dot.y);

      // Mouse Line
      this.mouseLine.setTo(dot.x, dot.y, dot.x, dot.y)
      this.mouseLine.setAlpha(1)
      this.mouseLine.setStrokeStyle(5, dot.color, 1)
   }

   connectLineTo(dot) {
      this.lineTo(dot.x, dot.y)
      this.strokePath();
   }

   clearDrawings() {
      this.mouseLine.setAlpha(0)
      this.clear();
   }

   updateMouseLine(dot, pointer) {
      this.mouseLine.setTo(dot.x, dot.y, pointer.x, pointer.y)
   }

   redrawLines(dotsArr) {
      this.clearDrawings()

      const length = dotsArr.length;
      const lastDot = dotsArr[length - 1]
      // Mouse Line
      this.mouseLine.setTo(lastDot.x, lastDot.y, lastDot.x, lastDot.y)
      this.mouseLine.setAlpha(1)
      this.mouseLine.setStrokeStyle(5, lastDot.color, 1)

      if (length > 1) {
         this.lineStyle(10, lastDot.color)
         this.fillStyle(10, lastDot.color)
         this.beginPath()
         this.moveTo(dotsArr[0].x, dotsArr[0].y);

         for (let i = 1; i < length; i++) {
            this.lineTo(dotsArr[i].x, dotsArr[i].y)
            this.strokePath();
         }
      }

   }
}
