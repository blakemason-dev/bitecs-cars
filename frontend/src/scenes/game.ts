import Phaser from "phaser";

import {
    createWorld,
    addEntity,
    addComponent,
    IWorld,
    System
} from 'bitecs';

// import components
import { Position } from "../components/Position";
import { Rotation } from "../components/Rotation";
import { Velocity } from "../components/Velocity";
import { Sprite } from "../components/Sprite";
import { Player } from "../components/Player";
import { CPU } from "../components/CPU";

// import systems
import { createSpriteSystem } from "../systems/SpriteSystem";
import { createMovementSystem } from "../systems/MovementSystem";
import { createPlayerSystem } from "../systems/PlayerSystem";
import { createCPUSystem } from "../systems/CPUSystem";
import { Direction, Input } from "../components/Input";

export default class Game extends Phaser.Scene {
    private world?: IWorld;
    private spriteSystem?: System;
    private movementSystem?: System;
    private playerSystem?: System;
    private cpuSystem?: System;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    
    constructor() {
        super('Game');
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    preload() {
        this.load.image('car-red', '/src/assets/car-red.png');
        this.load.image('car-green', '/src/assets/car-green.png');
        this.load.image('car-blue', '/src/assets/car-blue.png');
    }

    create() {
        this.world = createWorld();

        // create the player cars
        const car = addEntity(this.world);

        addComponent(this.world, Position ,car);    
        Position.x[car] = 100;
        Position.y[car] = 100;

        addComponent(this.world, Rotation, car);
        Rotation.angle[car] = 0;
        
        addComponent(this.world, Velocity, car);
        Velocity.x[car] = 0;
        Velocity.y[car] = 0;

        addComponent(this.world, Sprite, car);
        Sprite.texture[car] = 0;

        addComponent(this.world, Player, car);
        Player.name[car] = 0;

        addComponent(this.world, Input, car);
        Input.direction[car] = Direction.None;
        Input.speed[car] = 5;

        // create cpu cars
        for (let i = 0; i < 20; i++) {
            const tank = addEntity(this.world);

            addComponent(this.world, Position, tank);
            Position.x[tank] = Phaser.Math.Between(0,this.game.canvas.width);
            Position.y[tank] = Phaser.Math.Between(0,this.game.canvas.height);

            addComponent(this.world, Rotation, tank);
            Rotation.angle[car] = 0;

            addComponent(this.world, Velocity, tank);
            Velocity.x[tank] = 0;
            Velocity.y[tank] = 0;

            addComponent(this.world, Sprite, tank);
            Sprite.texture[tank] = Phaser.Math.Between(1,2);

            addComponent(this.world, CPU, tank);
            CPU.accumulatedTime[tank] = 0;
            CPU.timeBetweenActions[tank] = 100;

            addComponent(this.world, Input, tank);
            Input.direction[tank] = Direction.None;
            Input.speed[tank] = Phaser.Math.Between(2, 5);
        }

        this.playerSystem = createPlayerSystem(this.cursors);
        this.cpuSystem = createCPUSystem(this);
        this.movementSystem = createMovementSystem();
        this.spriteSystem = createSpriteSystem(this, ['car-red', 'car-green', 'car-blue']);
    }

    update(t: number, dt: number) {
        if (!this.world) return;

        // run systems
        this.playerSystem?.(this.world);
        this.cpuSystem?.(this.world);
        this.movementSystem?.(this.world);
        this.spriteSystem?.(this.world);
    }
}