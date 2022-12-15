import {
    defineSystem, 
    IWorld,
    defineQuery
} from 'bitecs';

import { Position } from '../components/Position';
import { Rotation } from '../components/Rotation';
import { Velocity } from '../components/Velocity';
import { Input, Direction } from '../components/Input';

export const createMovementSystem = () => {
    const query = defineQuery([Position, Rotation, Velocity, Input]);

    return defineSystem( (world: IWorld) => {
        const entities = query(world);
        entities.map(eid => {
            const direction = Input.direction[eid];

            switch (direction) {
                case Direction.None: {
                    Velocity.x[eid] = 0;
                    Velocity.y[eid] = 0;
                    break;
                }
                case Direction.Left: {
                    Velocity.x[eid] = -Input.speed[eid];
                    Velocity.y[eid] = 0;
                    Rotation.angle[eid] = 180;
                    break;
                }
                case Direction.Right: {
                    Velocity.x[eid] = Input.speed[eid];
                    Velocity.y[eid] = 0;
                    Rotation.angle[eid] = 0;
                    break;
                }
                case Direction.Up: {
                    Velocity.x[eid] = 0;
                    Velocity.y[eid] = -Input.speed[eid];
                    Rotation.angle[eid] = -90;
                    break;
                }
                case Direction.Down: {
                    Velocity.x[eid] = 0;
                    Velocity.y[eid] = Input.speed[eid];
                    Rotation.angle[eid] = 90;
                    break;
                }
                default: {
                    break;
                }
            }

            Position.x[eid] += Velocity.x[eid];
            Position.y[eid] += Velocity.y[eid];
        });

        return world;
    });
}