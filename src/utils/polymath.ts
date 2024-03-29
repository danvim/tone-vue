import { Cartesian } from 'tone-core/dist/lib/Coordinates';

/**
 * @param cornerCount
 * @return {function(*, *, *): Cartesian}
 */
const polygonCornerFnGen = (cornerCount: number) => (
  center: Cartesian,
  size: number,
  i: number,
) => {
  const angleOne = 360 / cornerCount;
  const angleDeg = angleOne * i - angleOne / 2;
  const angleRad = (Math.PI / 180) * angleDeg;
  return new Cartesian(
    center.x + size * Math.cos(angleRad),
    center.y + size * Math.sin(angleRad),
  );
};

const polygonCorner = (
  center: Cartesian,
  size: number,
  i: number,
  cornerCount: number,
) => polygonCornerFnGen(cornerCount)(center, size, i);

/**
 *
 * @param center
 * @param size
 * @param i
 * @return {Cartesian}
 */
const hexCorner = polygonCornerFnGen(6);

export { polygonCorner, hexCorner };
