import Phaser from "phaser";

import {
    createWorld,
    addEntity,
    addComponent,
    defineComponent,
    Types,
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    System
} from 'bitecs';

const Position = defineComponent({
    x: Types.f32,
    y: Types.f32
});

const Velocity = defineComponent({
    x: Types.f32,
    y: Types.f32
});

const Sprite = defineComponent({
    texture: Types.ui8
});

const spritesById = new Map<number, Phaser.GameObjects.Sprite>()
const spriteQuery = defineQuery([Sprite, Position]);
const spriteQueryEnter = enterQuery(spriteQuery);
const spriteQueryExit = exitQuery(spriteQuery);
const createSpriteSystem = (scene: Phaser.Scene, textures: string[]) => {
    return defineSystem((world: IWorld) => {
            const enterEntities = spriteQueryEnter(world);
            for (let i = 0; i < enterEntities.length; i++) {
                const id = enterEntities[i];
                const texId = Sprite.texture[id];
                const texture = textures[texId];
                spritesById.set(id, scene.add.sprite(0,0,texture));
            }
            
            const entities = spriteQuery(world);
            for (let i = 0; i < entities.length; i++) {
                const id = entities[i];
                const sprite = spritesById.get(id);
                
                if (!sprite) continue;

                sprite.x = Position.x[i];
                sprite.y = Position.y[i];
            }

            const exitEntities = spriteQueryExit(world);
            for (let i = 0; i < exitEntities.length; i++) {
                const id = exitEntities[i];
                const sprite = spritesById.get(id);
                if (!sprite) continue;

                sprite.destroy();
                spritesById.delete(id);
            }

            return world;
        })
} 

export default class Game extends Phaser.Scene {
    private world?: IWorld;
    private spriteSystem?: System;
    
    constructor() {
        super('Game');
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
        
        addComponent(this.world, Velocity, car);

        Velocity.x[car] = 5;
        Velocity.y[car] = 5;

        addComponent(this.world, Sprite, car);

        Sprite.texture[car] = 0;

        this.spriteSystem = createSpriteSystem(this, ['car-red', 'car-green', 'car-blue']);

        // TODO: create entities
        // TODO: attach components
        // TODO: create systems
    }

    update(t: number, dt: number) {
        if (!this.world || !this.spriteSystem) return;

        // TODO: run systems
        this.spriteSystem(this.world);
    }
}