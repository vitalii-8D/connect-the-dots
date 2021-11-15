import Phaser from 'phaser';

import GameScene from "./scenes/GameScene";
import GameUI from "./scenes/GameUI";

import {GAME_HEIGHT, GAME_WIDTH, BG_COLOR} from "./constants/constants";
import Preloader from "./scenes/Preloader";

/** @type {Phaser.Types.Core.GameConfig}  */
const gameConfig = {
	type: Phaser.AUTO,
	width: GAME_WIDTH,
	height: GAME_HEIGHT,
	backgroundColor: BG_COLOR,
	parent: 'phaser-game',
	scale: {
		mode: Phaser.Scale.FIT, // Canvas fit the window size
		autoCenter: Phaser.Scale.CENTER_BOTH, // Canvas is centered
	},
	scene: [Preloader, GameScene, GameUI],
};

const game = new Phaser.Game(gameConfig);

// Setting background color from config file to all document
document.addEventListener('DOMContentLoaded', () => {
	const body = document.getElementById('body')
	body.style.backgroundColor = BG_COLOR
})
