export interface Point2D {
  x: number;
  y: number;
  id?: string;
  label?: string;
}

export interface Waypoint extends Point2D {
  isControlPoint?: boolean;
}

export type SceneTheme = 'city' | 'park' | 'track' | 'school' | 'lake' | 'abstract';

export interface ScenePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  theme: SceneTheme;
  scaleMeterPerPixel: number; // e.g. 0.05m/px => 20px = 1 meter
  origin: Point2D; // coordinate origin in canvas pixel space
  waypoints: Waypoint[];
  defaultDuration: number; // seconds
  vehicleType: 'car' | 'runner' | 'cyclist' | 'cart' | 'particle';
  notes: string;
  educationalQuestion?: string;
}

export interface SampledPathPoint {
  point: Point2D;
  tangent: Point2D; // normalized tangent vector
  normal: Point2D;
  cumulativeDistance: number; // in meters
  progress: number; // 0 to 1
}

export interface MotionState {
  time: number; // elapsed seconds
  totalDuration: number; // total expected time in seconds
  progress: number; // 0..1
  currentPos: Point2D; // in meters (relative to physics origin)
  canvasPos: Point2D; // in canvas pixels
  startPos: Point2D; // in meters
  endPos: Point2D; // in meters
  distanceTraveled: number; // s (m)
  totalDistance: number; // s_total (m)
  displacementVector: Point2D; // d = (dx, dy) in meters
  displacementMagnitude: number; // |d| in meters
  displacementAngleDeg: number; // angle in degrees
  instantaneousSpeed: number; // v = ds/dt in m/s
  instantaneousVelocity: Point2D; // v_vector = (vx, vy) in m/s
  tangentAngleDeg: number;
  averageSpeed: number; // v_tb = s / t in m/s
  averageVelocity: Point2D; // v_tb_vec = d / t in m/s
  averageVelocityMagnitude: number; // |v_tb_vec| in m/s
  accelerationVector?: Point2D; // a_vec = (ax, ay) in m/s^2
  accelerationMagnitude?: number;
  isComplete: boolean;
}

export interface GraphDataPoint {
  t: number; // time in s
  s: number; // distance in m
  d: number; // displacement magnitude or 1D displacement in m
  dx: number;
  dy: number;
  v_inst: number; // instantaneous speed in m/s
  v_avg: number; // average speed in m/s
  vx: number;
  vy: number;
  a?: number; // acceleration in m/s^2
}

export type LabTab =
  | 'DISPLACEMENT_DISTANCE'
  | 'SPEED_VELOCITY'
  | 'INSTANTANEOUS_VECTOR'
  | 'SPEED_MEASUREMENT'
  | 'DT_GRAPH'
  | 'UNIFORM_MOTION'
  | 'ACCELERATED_MOTION'
  | 'MULTI_OBJECT'
  | 'CHALLENGES'
  | 'EXPLORATION_QUIZ';

export interface LayerVisibility {
  showTrajectory: boolean;
  showDisplacementVector: boolean;
  showInstantaneousVelocity: boolean;
  showAverageVelocity: boolean;
  showGrid: boolean;
  showWaypoints: boolean;
  showObjectTrail: boolean;
  showCoordinates: boolean;
  showTangentLine: boolean;
  showMetricsOverlay: boolean;
}

export interface MeasurementTrial {
  id: number;
  distance: number; // m
  time: number; // s
  speed: number; // m/s
  sensorEPos: number; // m
  sensorFPos: number; // m
  timestamp: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Cơ bản' | 'Thông hiểu' | 'Vận dụng' | 'Thử thách nâng cao';
  goal: string;
  targetCriteria: {
    minDistance?: number;
    maxDistance?: number;
    targetDisplacement?: number;
    toleranceDisplacement?: number;
    targetAverageSpeed?: number;
    targetAverageVelocityMag?: number;
    requireZeroDisplacement?: boolean;
    requireCurveTrajectory?: boolean;
  };
  hint: string;
  pedagogicalExplanation: string;
}

export interface QuizQuestion {
  id: string;
  lesson: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  explanationSummary: string;
  knttReference: string;
}

export interface MultiObjectPreset {
  id: string;
  name: string;
  description: string;
  objects: {
    id: string;
    name: string;
    color: string;
    vehicleType: 'car' | 'runner' | 'cyclist';
    pathType: 'straight' | 'detour' | 'zigzag' | 'loop';
    speedMultiplier: number;
    waypoints: Waypoint[];
  }[];
}
