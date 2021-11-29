//  MenuBtn
import Phaser from "phaser";

export default class MenuBtn extends Phaser.GameObjects.Sprite {

   static textConfig = {
      fontSize: 36,
      fontFamily: '"Press Start 2P"'
   }

   static generate(data) {
      return new MenuBtn(data)
   }

   constructor(data) {
      super(data.scene, data.x, data.y, data.texture, data.frame);
      this.scene = data.scene

      this.init(data)
   }

   init(data) {
      this.setScale(2)
      this.setInteractive()
      this.scene.add.existing(this)

      /** @type { Phaser.GameObjects.Text} */
      this.label = this.scene.add.text(this.x, this.y, data.text, MenuBtn.textConfig)
         .setOrigin(0.5)

      this.setEvents()
      this.scene.scene.start('Game')
   }

   setEvents() {
      this.on('pointerdown', this.onPointerDown, this)

   }

   onPointerDown() {
      const newFrame = this.frame.name.replace(0, 1)
      this.setFrame(newFrame)
      this.setOrigin(0.5, 0.45)
      this.label.y += this.height * 0.1

      this.scene.scene.start('Game')
   }

}
