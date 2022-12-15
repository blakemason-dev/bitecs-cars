import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
} from 'bitecs';

import { Sprite } from '../components/Sprite';
import { Position } from '../components/Position';
import { Rotation } from '../components/Rotation';

export const createSpriteSystem = (scene: Phaser.Scene, textures: string[]) => {
    const spritesById = new Map<number, Phaser.GameObjects.Sprite>()
    const spriteQuery = defineQuery([Sprite, Position]);
    const spriteQueryEnter = enterQuery(spriteQuery);
    const spriteQueryExit = exitQuery(spriteQuery);

    return defineSystem((world: IWorld) => {
            const enterEntities = spriteQueryEnter(world);
            for (let i = 0; i < enterEntities.length; i++) {
                const id = enterEntities[i];
                const texId = Sprite.texture[id];
                const texture = textures[texId];
                spritesById.set(id, scene.add.sprite(0,0,texture));
                spritesById.get(id)?.setDisplaySize(64,32);
            }
            
            const entities = spriteQuery(world);
            for (let i = 0; i < entities.length; i++) {
                const id = entities[i];
                const sprite = spritesById.get(id);
                
                if (!sprite) continue;

                sprite.x = Position.x[i];
                sprite.y = Position.y[i];
                sprite.angle = Rotation.angle[i];
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