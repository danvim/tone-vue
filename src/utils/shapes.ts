/**
 * Generates THREE.Shape
 */

import {Cartesian} from 'tone-core/dist/lib/Coordinates';
import {polygonCorner} from './polymath';
import {Shape} from 'three';

/**
 *
 * @param cornerCount
 * @return function(*=): Shape
 */
const polygonFnGen = (cornerCount: number) => (size: number) => {
    const shape = new Shape();
    const [startX, startY] = polygonCorner(Cartesian.origin, size, 0, cornerCount).asArray;
    shape.moveTo(startX, startY);
    for (let i = 1; i < cornerCount; i++) {
        const [x, y] = polygonCorner(Cartesian.origin, size, i, cornerCount).asArray;
        shape.lineTo(x, y);
    }
    return shape;
};

/**
 *
 * @param size
 * @param corner
 * @return {Shape}
 */
const shapePolygon = (size: number, corner: number) => polygonFnGen(corner)(size);

/**
 *
 * @param size
 * @return {Shape}
 */
const shapeHex = polygonFnGen(6);


export {
    shapeHex,
    shapePolygon,
};
