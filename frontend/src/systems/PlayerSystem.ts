import Phaser from 'phaser';
import {
    defineSystem, 
    defineQuery,
    IWorld
} from 'bitecs';
import { Player } from '../components/Player';
import { Position } from '../components/Position';
import { Velocity } from '../components/Velocity';
import { Direction, Input  } from '../components/Input';

export const createPlayerSystem = (cursors: Phaser.Types.Input.Keyboard.CursorKeys) => {
    const query = defineQuery([Player, Position, Velocity, Input]);

    return defineSystem((world: IWorld) => {
        const entities = query(world);
        entities.map(eid => {
            if (cursors.left.isDown) {
                Input.direction[eid] = Direction.Left;
            }
            else if (cursors.right.isDown) {
                Input.direction[eid] = Direction.Right;
            }
            else if (cursors.up.isDown) {
                Input.direction[eid] = Direction.Up;
            }
            else if (cursors.down.isDown) {
                Input.direction[eid] = Direction.Down;
            }
            else {
                Input.direction[eid] = Direction.None;
            }
        });

        return world;
    })
}