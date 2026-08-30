import { Point2D, SampledPathPoint, Waypoint } from '../types/physics';

/**
 * Basic 2D Vector Math
 */
export const vec = {
  add: (p1: Point2D, p2: Point2D): Point2D => ({ x: p1.x + p2.x, y: p1.y + p2.y }),
  sub: (p1: Point2D, p2: Point2D): Point2D => ({ x: p1.x - p2.x, y: p1.y - p2.y }),
  scale: (p: Point2D, s: number): Point2D => ({ x: p.x * s, y: p.y * s }),
  dot: (p1: Point2D, p2: Point2D): number => p1.x * p2.x + p1.y * p2.y,
  magSq: (p: Point2D): number => p.x * p.x + p.y * p.y,
  mag: (p: Point2D): number => Math.sqrt(p.x * p.x + p.y * p.y),
  dist: (p1: Point2D, p2: Point2D): number => Math.hypot(p2.x - p1.x, p2.y - p1.y),
  normalize: (p: Point2D): Point2D => {
    const m = Math.hypot(p.x, p.y);
    return m > 1e-9 ? { x: p.x / m, y: p.y / m } : { x: 1, y: 0 };
  },
  angleRad: (p: Point2D): number => Math.atan2(p.y, p.x),
  angleDeg: (p: Point2D): number => (Math.atan2(p.y, p.x) * 180) / Math.PI,
  rotate: (p: Point2D, angleRad: number): Point2D => {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return {
      x: p.x * cos - p.y * sin,
      y: p.x * sin + p.y * cos,
    };
  },
};

/**
 * Centripetal Catmull-Rom Spline Interpolation for smooth, physically realistic curves through waypoints
 */
export function getCatmullRomPoint(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  t: number,
  alpha = 0.5
): Point2D {
  // Compute knot sequences
  function getT(tPrev: number, pA: Point2D, pB: Point2D): number {
    const d = Math.hypot(pB.x - pA.x, pB.y - pA.y);
    return tPrev + Math.pow(d, alpha);
  }

  const t0 = 0;
  const t1 = getT(t0, p0, p1);
  const t2 = getT(t1, p1, p2);
  const t3 = getT(t2, p2, p3);

  // Avoid division by zero
  if (t2 - t1 <= 1e-6) return p1;

  const currentT = t1 + t * (t2 - t1);

  const a1 = {
    x: ((t1 - currentT) / (t1 - t0 || 1)) * p0.x + ((currentT - t0) / (t1 - t0 || 1)) * p1.x,
    y: ((t1 - currentT) / (t1 - t0 || 1)) * p0.y + ((currentT - t0) / (t1 - t0 || 1)) * p1.y,
  };
  const a2 = {
    x: ((t2 - currentT) / (t2 - t1 || 1)) * p1.x + ((currentT - t1) / (t2 - t1 || 1)) * p2.x,
    y: ((t2 - currentT) / (t2 - t1 || 1)) * p1.y + ((currentT - t1) / (t2 - t1 || 1)) * p2.y,
  };
  const a3 = {
    x: ((t3 - currentT) / (t3 - t2 || 1)) * p2.x + ((currentT - t2) / (t3 - t2 || 1)) * p3.x,
    y: ((t3 - currentT) / (t3 - t2 || 1)) * p2.y + ((currentT - t2) / (t3 - t2 || 1)) * p3.y,
  };

  const b1 = {
    x: ((t2 - currentT) / (t2 - t0 || 1)) * a1.x + ((currentT - t0) / (t2 - t0 || 1)) * a2.x,
    y: ((t2 - currentT) / (t2 - t0 || 1)) * a1.y + ((currentT - t0) / (t2 - t0 || 1)) * a2.y,
  };
  const b2 = {
    x: ((t3 - currentT) / (t3 - t1 || 1)) * a2.x + ((currentT - t1) / (t3 - t1 || 1)) * a3.x,
    y: ((t3 - currentT) / (t3 - t1 || 1)) * a2.y + ((currentT - t1) / (t3 - t1 || 1)) * a3.y,
  };

  return {
    x: ((t2 - currentT) / (t2 - t1 || 1)) * b1.x + ((currentT - t1) / (t2 - t1 || 1)) * b2.x,
    y: ((t2 - currentT) / (t2 - t1 || 1)) * b1.y + ((currentT - t1) / (t2 - t1 || 1)) * b2.y,
  };
}

/**
 * Generate finely sampled trajectory points from waypoints
 * Converts pixel coordinates to real-world meters using scaleMeterPerPixel
 */
export function sampleTrajectory(
  waypoints: Waypoint[],
  scaleMeterPerPixel: number,
  samplesPerSegment = 40,
  isClosed = false
): SampledPathPoint[] {
  if (waypoints.length < 2) {
    const single = waypoints[0] || { x: 100, y: 100 };
    return [
      {
        point: single,
        tangent: { x: 1, y: 0 },
        normal: { x: 0, y: 1 },
        cumulativeDistance: 0,
        progress: 0,
      },
    ];
  }

  // Create point list with ghost boundary points for Catmull-Rom
  const pts: Point2D[] = [...waypoints];
  const n = pts.length;

  const sampledCoords: Point2D[] = [];

  for (let i = 0; i < n - (isClosed ? 0 : 1); i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i % n];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];

    for (let step = 0; step < samplesPerSegment; step++) {
      const t = step / samplesPerSegment;
      const pt = getCatmullRomPoint(p0, p1, p2, p3, t);
      sampledCoords.push(pt);
    }
  }
  // Push the final point
  if (!isClosed) {
    sampledCoords.push(pts[n - 1]);
  }

  // Now compute cumulative distances and exact tangents
  const result: SampledPathPoint[] = [];
  let totalDistMeters = 0;

  for (let i = 0; i < sampledCoords.length; i++) {
    const current = sampledCoords[i];
    if (i > 0) {
      const prev = sampledCoords[i - 1];
      const distPx = vec.dist(prev, current);
      totalDistMeters += distPx * scaleMeterPerPixel;
    }

    // Compute tangent using central difference
    let tangent: Point2D;
    if (i === 0) {
      tangent = vec.sub(sampledCoords[1] || current, current);
    } else if (i === sampledCoords.length - 1) {
      tangent = vec.sub(current, sampledCoords[i - 1]);
    } else {
      tangent = vec.sub(sampledCoords[i + 1], sampledCoords[i - 1]);
    }
    const unitTangent = vec.normalize(tangent);
    const unitNormal = { x: -unitTangent.y, y: unitTangent.x };

    result.push({
      point: current,
      tangent: unitTangent,
      normal: unitNormal,
      cumulativeDistance: totalDistMeters,
      progress: 0, // Will populate below
    });
  }

  // Assign normalized progress
  const total = totalDistMeters || 1;
  for (let i = 0; i < result.length; i++) {
    result[i].progress = result[i].cumulativeDistance / total;
  }

  return result;
}

/**
 * Given arc length s (in meters), interpolate exact position and tangent
 */
export function evaluatePathAtDistance(
  sampledPath: SampledPathPoint[],
  sMeters: number
): { point: Point2D; tangent: Point2D; normal: Point2D; progress: number } {
  if (!sampledPath || sampledPath.length === 0) {
    return {
      point: { x: 0, y: 0 },
      tangent: { x: 1, y: 0 },
      normal: { x: 0, y: 1 },
      progress: 0,
    };
  }

  const maxDist = sampledPath[sampledPath.length - 1].cumulativeDistance;
  const clampedDist = Math.max(0, Math.min(sMeters, maxDist));

  if (clampedDist <= 0) {
    return {
      point: sampledPath[0].point,
      tangent: sampledPath[0].tangent,
      normal: sampledPath[0].normal,
      progress: 0,
    };
  }

  if (clampedDist >= maxDist) {
    const last = sampledPath[sampledPath.length - 1];
    return {
      point: last.point,
      tangent: last.tangent,
      normal: last.normal,
      progress: 1,
    };
  }

  // Binary search for interval
  let low = 0;
  let high = sampledPath.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sampledPath[mid].cumulativeDistance < clampedDist) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const idx0 = Math.max(0, high);
  const idx1 = Math.min(sampledPath.length - 1, low);

  if (idx0 === idx1) {
    return {
      point: sampledPath[idx0].point,
      tangent: sampledPath[idx0].tangent,
      normal: sampledPath[idx0].normal,
      progress: sampledPath[idx0].progress,
    };
  }

  const p0 = sampledPath[idx0];
  const p1 = sampledPath[idx1];
  const segDist = p1.cumulativeDistance - p0.cumulativeDistance;
  const fraction = segDist > 1e-9 ? (clampedDist - p0.cumulativeDistance) / segDist : 0;

  const point = {
    x: p0.point.x + fraction * (p1.point.x - p0.point.x),
    y: p0.point.y + fraction * (p1.point.y - p0.point.y),
  };

  const tangent = vec.normalize({
    x: p0.tangent.x + fraction * (p1.tangent.x - p0.tangent.x),
    y: p0.tangent.y + fraction * (p1.tangent.y - p0.tangent.y),
  });

  return {
    point,
    tangent,
    normal: { x: -tangent.y, y: tangent.x },
    progress: clampedDist / maxDist,
  };
}

/**
 * Format physics values with appropriate units and precision
 */
export function formatPhysics(val: number, decimals = 2): string {
  if (Math.abs(val) < 1e-6) return (0).toFixed(decimals);
  return val.toFixed(decimals);
}

export function msToKmh(speedMs: number): number {
  return speedMs * 3.6;
}

export function kmhToMs(speedKmh: number): number {
  return speedKmh / 3.6;
}
