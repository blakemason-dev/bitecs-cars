import Phaser from "phaser";

import {
    createWorld,
    addEntity,
    addComponent,
    IWorld,
    System
} from 'bitecs';

import { Position } from "../components/Position";
import { Rotation } from "../components/Rotation";
import { Velocity } from "../components/Velocity";
import { Sprite } from "../components/Sprite";
import { Player } from "../components/Player";

import { createSpriteSystem } from "../systems/SpriteSystem";
import { createMovementSystem } from "../systems/MovementSystem";
import { createPlayerSystem } from "../systems/PlayerSystem";

export default class Game extends Phaser.Scene {
    private world?: IWorld;
    private spriteSystem?: System;
    private movementSystem?: System;
    private playerSystem?: System;
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

        this.spriteSystem = createSpriteSystem(this, ['car-red', 'car-green', 'car-blue']);
        this.movementSystem = createMovementSystem();
        this.playerSystem = createPlayerSystem(this.cursors);

        // TODO: create entities
        // TODO: attach components
        // TODO: create systems
    }

    update(t: number, dt: number) {
        if (!this.world) return;

        // TODO: run systems
        this.playerSystem?.(this.world);
        this.movementSystem?.(this.world);
        this.spriteSystem?.(this.world);
    }
}