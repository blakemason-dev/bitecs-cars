import {
    defineSystem, 
    IWorld,
    defineQuery
} from 'bitecs';

import { Position } from '../components/Position';
import { Rotation } from '../components/Rotation';
import { Velocity } from '../components/Velocity';

export const createMovementSystem = () => {
    const query = defineQuery([Position, Rotation, Velocity]);

    return defineSystem( (world: IWorld) => {
        const entities = query(world);
        entities.map(eid => {
            Position.x[eid] += Velocity.x[eid];
            Position.y[eid] += Velocity.y[eid];
        });

        return world;
    });
}