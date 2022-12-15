import Game from "./scenes/game";

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: Game
}

new Phaser.Game(config);