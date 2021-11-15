import Phaser from 'phaser';

import {DOT_SIZE} from "../constants/constants";

export default class ParticlesManager extends Phaser.GameObjects.Particles.ParticleEmitterManager {
   constructor(scene, texture) {
      super(scene, texture)
   }

   generateEmitter({x, y, color}) {
      const config = this.generateNewConfig(x, y, color)
      return this.createEmitter(config);
   }

   changeConfig({x, y, color, emitter}) {
      emitter.fromJSON({
         x: {min: (x - DOT_SIZE / 10), max: (x - DOT_SIZE / 10)},
         y: {min: (y - DOT_SIZE / 10), max: (y - DOT_SIZE / 10)},
         tint: color
      })
   }

   generateNewConfig(x, y, color) {
      return {
         x: {min: (x - DOT_SIZE / 10), max: (x - DOT_SIZE / 10)},
         y: {min: (y - DOT_SIZE / 10), max: (y - DOT_SIZE / 10)},
         speed: 100,
         accelerationY: 50,
         lifespan: {min: 100, max: 600},
         gravityY: 300,
         tint: color,
         frequency: 50,
         blendMode: 'NORMAL',
         on: false,
         scale: {min: 0.02, max: 0.15},
         angle: {min: 30, max: 160},
         alpha: {min: 0.5, max: 1}
      }
   }
}
