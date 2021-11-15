import Phaser from 'phaser';
import GameScene from "./GameScene";
import {GAME_HEIGHT, GAME_WIDTH} from "./constants";

/** @type {Phaser.Types.Core.GameConfig}  */
const gameConfig = {
	type: Phaser.AUTO,
	width: GAME_WIDTH,
	height: GAME_HEIGHT,
	backgroundColor: 0xffffe5,
	parent: 'phaser-game',
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [GameScene],
};

const game = new Phaser.Game(gameConfig);

