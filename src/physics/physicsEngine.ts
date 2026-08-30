import {
  GraphDataPoint,
  MotionState,
  Point2D,
  SampledPathPoint,
  Waypoint,
} from '../types/physics';
import { evaluatePathAtDistance, sampleTrajectory, vec } from './mathUtils';

export interface MotionConfig {
  waypoints: Waypoint[];
  scaleMeterPerPixel: number; // e.g. 0.05 m/px (20px = 1m)
  origin?: Point2D; // in canvas px
  motionType: 'uniform' | 'accelerated' | 'multi_segment';
  totalDuration: number; // seconds
  v0?: number; // m/s for accelerated
  acceleration?: number; // m/s^2 for accelerated
  isClosed?: boolean;
}

export class PhysicsEngine {
  private sampledPath: SampledPathPoint[] = [];
  private totalDistanceMeters = 0;
  private config: MotionConfig;

  constructor(config: MotionConfig) {
    this.config = config;
    this.rebuildPath();
  }

  public updateConfig(config: Partial<MotionConfig>) {
    this.config = { ...this.config, ...config };
    this.rebuildPath();
  }

  public rebuildPath() {
    this.sampledPath = sampleTrajectory(
      this.config.waypoints,
      this.config.scaleMeterPerPixel,
      40,
      this.config.isClosed || false
    );
    this.totalDistanceMeters =
      this.sampledPath.length > 0
        ? this.sampledPath[this.sampledPath.length - 1].cumulativeDistance
        : 0;
  }

  public getTotalDistance(): number {
    return this.totalDistanceMeters;
  }

  public getSampledPath(): SampledPathPoint[] {
    return this.sampledPath;
  }

  /**
   * Calculate exact physics state at time t (in seconds)
   */
  public computeStateAtTime(t: number): MotionState {
    const duration = Math.max(0.1, this.config.totalDuration);
    const clampedTime = Math.max(0, Math.min(t, duration));
    const isComplete = t >= duration;

    let distanceTraveled = 0;
    let instantaneousSpeed = 0;
    let accelerationMagnitude = 0;

    if (this.config.motionType === 'accelerated') {
      const v0 = this.config.v0 || 0;
      const a = this.config.acceleration || 0;
      distanceTraveled = v0 * clampedTime + 0.5 * a * clampedTime * clampedTime;
      // Clamp to valid range
      distanceTraveled = Math.max(0, Math.min(distanceTraveled, this.totalDistanceMeters));
      instantaneousSpeed = Math.max(0, v0 + a * clampedTime);
      accelerationMagnitude = a;
    } else {
      // Uniform motion along path
      const progress = clampedTime / duration;
      distanceTraveled = progress * this.totalDistanceMeters;
      instantaneousSpeed = duration > 0 ? this.totalDistanceMeters / duration : 0;
      accelerationMagnitude = 0;
    }

    const { point: canvasPoint, tangent, progress } = evaluatePathAtDistance(
      this.sampledPath,
      distanceTraveled
    );

    const startCanvas = this.sampledPath[0]?.point || { x: 0, y: 0 };
    const endCanvas = this.sampledPath[this.sampledPath.length - 1]?.point || { x: 0, y: 0 };

    // Real world positions in meters (y-axis inverted for standard Cartesian coords)
    const currentMeters: Point2D = {
      x: canvasPoint.x * this.config.scaleMeterPerPixel,
      y: -canvasPoint.y * this.config.scaleMeterPerPixel,
    };
    const startMeters: Point2D = {
      x: startCanvas.x * this.config.scaleMeterPerPixel,
      y: -startCanvas.y * this.config.scaleMeterPerPixel,
    };
    const endMeters: Point2D = {
      x: endCanvas.x * this.config.scaleMeterPerPixel,
      y: -endCanvas.y * this.config.scaleMeterPerPixel,
    };

    // Displacement vector: d = r(t) - r(0)
    const displacementVector: Point2D = {
      x: currentMeters.x - startMeters.x,
      y: currentMeters.y - startMeters.y,
    };
    const displacementMagnitude = vec.mag(displacementVector);
    const displacementAngleDeg = vec.angleDeg(displacementVector);

    // Instantaneous velocity vector v(t) = v * tangent
    // Convert canvas tangent (where +y is down) to Cartesian (+y is up)
    const cartesianTangent: Point2D = {
      x: tangent.x,
      y: -tangent.y,
    };
    const instantaneousVelocity: Point2D = vec.scale(cartesianTangent, instantaneousSpeed);
    const tangentAngleDeg = vec.angleDeg(cartesianTangent);

    // Average quantities
    const effectiveTime = clampedTime > 1e-4 ? clampedTime : 1e-4;
    const averageSpeed = clampedTime > 1e-4 ? distanceTraveled / effectiveTime : instantaneousSpeed;
    const averageVelocity: Point2D =
      clampedTime > 1e-4
        ? vec.scale(displacementVector, 1 / effectiveTime)
        : instantaneousVelocity;
    const averageVelocityMagnitude = vec.mag(averageVelocity);

    // Acceleration vector (tangential)
    const accelerationVector: Point2D = vec.scale(cartesianTangent, accelerationMagnitude);

    return {
      time: clampedTime,
      totalDuration: duration,
      progress,
      currentPos: currentMeters,
      canvasPos: canvasPoint,
      startPos: startMeters,
      endPos: endMeters,
      distanceTraveled,
      totalDistance: this.totalDistanceMeters,
      displacementVector,
      displacementMagnitude,
      displacementAngleDeg,
      instantaneousSpeed,
      instantaneousVelocity,
      tangentAngleDeg,
      averageSpeed,
      averageVelocity,
      averageVelocityMagnitude,
      accelerationVector,
      accelerationMagnitude,
      isComplete,
    };
  }

  /**
   * Pre-generate full graph series data for synchronized plotting
   */
  public generateGraphSeries(samples = 100): GraphDataPoint[] {
    const duration = Math.max(0.1, this.config.totalDuration);
    const points: GraphDataPoint[] = [];

    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * duration;
      const state = this.computeStateAtTime(t);
      points.push({
        t: state.time,
        s: state.distanceTraveled,
        d: state.displacementMagnitude,
        dx: state.displacementVector.x,
        dy: state.displacementVector.y,
        v_inst: state.instantaneousSpeed,
        v_avg: state.averageSpeed,
        vx: state.instantaneousVelocity.x,
        vy: state.instantaneousVelocity.y,
        a: state.accelerationMagnitude,
      });
    }

    return points;
  }
}
