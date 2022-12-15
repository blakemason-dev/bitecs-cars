import Phaser from 'phaser';
import {
    defineSystem, 
    defineQuery,
    IWorld
} from 'bitecs';
import { Player } from '../components/Player';
import { Position } from '../components/Position';
import { Velocity } from '../components/Velocity';
import { Rotation } from '../components/Rotation';

export const createPlayerSystem = (cursors: Phaser.Types.Input.Keyboard.CursorKeys) => {
    const query = defineQuery([Player, Position, Velocity]);
    const SPEED = 5;

    return defineSystem((world: IWorld) => {
        const entities = query(world);
        entities.map(eid => {
            if (cursors.left.isDown) {
                Velocity.x[eid] = -SPEED;
                Velocity.y[eid] = 0;
                Rotation.angle[eid] = 180;
            }
            else if (cursors.right.isDown) {
                Velocity.x[eid] = SPEED;
                Velocity.y[eid] = 0;
                Rotation.angle[eid] = 0;
            }
            else if (cursors.up.isDown) {
                Velocity.x[eid] = 0;
                Velocity.y[eid] = -SPEED;
                Rotation.angle[eid] = -90;
            }
            else if (cursors.down.isDown) {
                Velocity.x[eid] = 0;
                Velocity.y[eid] = SPEED;
                Rotation.angle[eid] = 90;
            }
            else {
                Velocity.x[eid] = 0;
                Velocity.y[eid] = 0;
            }
        });

        return world;
    })
}