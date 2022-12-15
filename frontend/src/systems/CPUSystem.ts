import Phaser from 'phaser';
import {
    defineSystem, 
    IWorld,
    defineQuery
} from 'bitecs';
import { CPU } from '../components/CPU';
import { Rotation } from '../components/Rotation';
import { Velocity } from '../components/Velocity';
import { Direction, Input } from '../components/Input';

export const createCPUSystem = (scene: Phaser.Scene) => {
    const query = defineQuery([CPU, Velocity, Rotation]);
    const SPEED = 5;

    return defineSystem((world: IWorld) => {
        const dt = scene.game.loop.delta;
        const entities = query(world);
        entities.map(eid => {

            CPU.accumulatedTime[eid] += dt;
            if (CPU.accumulatedTime[eid] >= CPU.timeBetweenActions[eid]) {
                CPU.accumulatedTime[eid] = 0;

                const rand = Phaser.Math.Between(0,20);
                switch (rand) {
                    case 0: {
                        Input.direction[eid] = Direction.Left;
                        break;
                    }
                    case 1: {
                        Input.direction[eid] = Direction.Right;
                        break;
                    }
                    case 2: {
                        Input.direction[eid] = Direction.Up;
                        break;
                    }
                    case 3: {
                        Input.direction[eid] = Direction.Down;
                        break;
                    }
                    default: {
                        Input.direction[eid] = Direction.None;
                        break;
                    }
                }
            }
        });

        return world;
    });
}