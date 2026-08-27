/**
 * Centralized Physics Engine for Kinematics Lab
 * Authoritative scientific calculations for Chapter 1 — Kinematics (IB Physics 7th Ed)
 */

// Helper for degrees to radians
export const degToRad = (deg) => (deg * Math.PI) / 180;
export const radToDeg = (rad) => (rad * 180) / Math.PI;

/**
 * 1.1 Position & Uniform Motion
 */
export const calcDisplacement = (s_initial, s_final) => {
  return s_final - s_initial;
};

export const calcAverageVelocity = (delta_s, delta_t) => {
  if (delta_t <= 0) return 0;
  return delta_s / delta_t;
};

export const calcAverageSpeed = (totalDistance, totalTime) => {
  if (totalTime <= 0) return 0;
  return Math.abs(totalDistance) / totalTime;
};

export const calcUniformPosition = (s_initial, velocity, time) => {
  return s_initial + velocity * time;
};

/**
 * 1.2 SUVAT Kinematics Equations
 */
// v = u + a * t
export const calcVelocityUAT = (u, a, t) => {
  return u + a * t;
};

// Delta s = ((u + v) / 2) * t
export const calcDisplacementUVT = (u, v, t) => {
  return ((u + v) / 2) * t;
};

// Delta s = u * t + 0.5 * a * t^2
export const calcDisplacementUAT = (u, a, t) => {
  return u * t + 0.5 * a * Math.pow(t, 2);
};

// v^2 = u^2 + 2 * a * Delta s
export const calcFinalVelocitySquared = (u, a, delta_s) => {
  const vSq = Math.pow(u, 2) + 2 * a * delta_s;
  if (vSq < 0) return null; // Impossible physical state
  return Math.sqrt(vSq);
};

// Solve time for v = u + at -> t = (v - u) / a
export const calcTimeFromUVA = (u, v, a) => {
  if (a === 0) return null;
  return (v - u) / a;
};

/**
 * 1.4 Projectile Motion
 */
export const calcProjectileComponents = (u, thetaDeg) => {
  const rad = degToRad(thetaDeg);
  const ux = u * Math.cos(rad);
  const uy = u * Math.sin(rad);
  return { ux, uy };
};

export const calcProjectileState = (u, thetaDeg, t, g = 9.81, y0 = 0) => {
  const { ux, uy } = calcProjectileComponents(u, thetaDeg);
  const vx = ux;
  const vy = uy - g * t;
  const speed = Math.sqrt(vx * vx + vy * vy);
  const x = ux * t;
  const y = y0 + uy * t - 0.5 * g * t * t;
  const currentAngleRad = Math.atan2(vy, vx);
  const currentAngleDeg = radToDeg(currentAngleRad);

  return {
    x,
    y: Math.max(0, y), // bound to ground
    vx,
    vy,
    speed,
    currentAngleDeg,
    ax: 0,
    ay: -g
  };
};

export const calcProjectileMaxHeight = (u, thetaDeg, g = 9.81, y0 = 0) => {
  const { uy } = calcProjectileComponents(u, thetaDeg);
  if (g <= 0) return y0;
  return y0 + Math.pow(uy, 2) / (2 * g);
};

export const calcProjectileTimeToApex = (u, thetaDeg, g = 9.81) => {
  const { uy } = calcProjectileComponents(u, thetaDeg);
  if (g <= 0) return 0;
  return Math.max(0, uy / g);
};

export const calcProjectileFlightTime = (u, thetaDeg, g = 9.81, y0 = 0) => {
  const { uy } = calcProjectileComponents(u, thetaDeg);
  if (g <= 0) return 0;
  // Solving 0 = y0 + uy * t - 0.5 * g * t^2 => 0.5 * g * t^2 - uy * t - y0 = 0
  const a = 0.5 * g;
  const b = -uy;
  const c = -y0;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return 0;
  const t1 = (-b + Math.sqrt(disc)) / (2 * a);
  return Math.max(0, t1);
};

export const calcProjectileRange = (u, thetaDeg, g = 9.81, y0 = 0) => {
  const tFlight = calcProjectileFlightTime(u, thetaDeg, g, y0);
  const { ux } = calcProjectileComponents(u, thetaDeg);
  return ux * tFlight;
};

/**
 * Fluid Resistance & Terminal Speed
 */
export const calcTerminalSpeedLinear = (m, g, k) => {
  if (k <= 0) return Infinity;
  return (m * g) / k;
};

// Numerical simulation step for falling body with drag: F_net = m*g - k*v^p
export const simulateFreefallWithDrag = (m, k, g = 9.81, dragPower = 1, tMax = 10, dt = 0.05) => {
  const points = [];
  let t = 0;
  let v = 0;
  let y = 0; // downward distance from drop height

  while (t <= tMax) {
    const Fdrag = k * Math.pow(v, dragPower);
    const Fnet = m * g - Fdrag;
    const a = Fnet / m;

    points.push({
      t: parseFloat(t.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
      v: parseFloat(v.toFixed(2)),
      a: parseFloat(a.toFixed(2)),
      Fdrag: parseFloat(Fdrag.toFixed(2))
    });

    v += a * dt;
    if (v < 0) v = 0;
    y += v * dt;
    t += dt;
  }
  return points;
};

// Numerical integration for 2D projectile with air resistance F = k * v^2
export const simulateProjectileWithDrag = (u, thetaDeg, k, m = 1, g = 9.81, dt = 0.02) => {
  const { ux, uy } = calcProjectileComponents(u, thetaDeg);
  const points = [];
  let t = 0;
  let x = 0;
  let y = 0;
  let vx = ux;
  let vy = uy;

  while (y >= 0 && t <= 20) {
    points.push({
      t: parseFloat(t.toFixed(2)),
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
      vx: parseFloat(vx.toFixed(2)),
      vy: parseFloat(vy.toFixed(2)),
      speed: parseFloat(Math.sqrt(vx * vx + vy * vy).toFixed(2))
    });

    const speed = Math.sqrt(vx * vx + vy * vy);
    const FdragX = -k * speed * vx;
    const FdragY = -k * speed * vy;

    const ax = FdragX / m;
    const ay = -g + FdragY / m;

    vx += ax * dt;
    vy += ay * dt;
    x += vx * dt;
    y += vy * dt;
    t += dt;
  }

  return points;
};
