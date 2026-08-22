/**
 * RELATIVITY LAB — Centralized Physics Calculations
 * 
 * All Special Relativity formulas in one place.
 * No physics calculations should exist outside this module.
 * All functions validate inputs and return safe values.
 */

/** Speed of light in m/s */
export const C = 299_792_458;

/** Speed of light squared */
export const C_SQUARED = C * C;

/**
 * Validates that a velocity is physically possible for a material object.
 * |v| must be strictly less than c.
 */
export function isValidVelocity(v: number): boolean {
  return Math.abs(v) < 1; // v expressed as fraction of c
}

/**
 * Validates velocity and throws descriptive error if invalid.
 */
function assertValidVelocity(v: number, label = 'v'): void {
  if (Math.abs(v) >= 1) {
    throw new Error(`${label} = ${v}c is not valid. Material objects cannot reach or exceed the speed of light.`);
  }
}

/**
 * Lorentz factor γ = 1/√(1 - v²/c²)
 * @param v velocity as fraction of c (e.g., 0.8 means 0.8c)
 * @returns gamma factor, always ≥ 1
 */
export function gamma(v: number): number {
  if (v === 0) return 1;
  assertValidVelocity(v);
  const beta = Math.abs(v);
  return 1 / Math.sqrt(1 - beta * beta);
}

/**
 * Safe gamma that returns Infinity-clamped value instead of throwing.
 * Useful for UI sliders that might hit edge values.
 */
export function gammaSafe(v: number): number {
  if (Math.abs(v) >= 1) return Infinity;
  if (v === 0) return 1;
  const beta = Math.abs(v);
  const g = 1 / Math.sqrt(1 - beta * beta);
  return isFinite(g) ? g : Infinity;
}

/**
 * Beta factor β = v/c
 * @param v velocity as fraction of c
 */
export function beta(v: number): number {
  return Math.abs(v);
}

/**
 * Lorentz transformation: x' = γ(x - vt)
 */
export function lorentzX(x: number, t: number, v: number = 0): number {
  assertValidVelocity(v);
  const g = gamma(v);
  return g * (x - v * t);
}

/**
 * Lorentz transformation: t' = γ(t - vx/c²)
 */
export function lorentzT(x: number, t: number, v: number = 0): number {
  assertValidVelocity(v);
  const g = gamma(v);
  return g * (t - v * x);
}

/**
 * Inverse Lorentz transformation: x = γ(x' + vt')
 */
export function inverseLorentzX(xPrime: number, tPrime: number, v: number = 0): number {
  assertValidVelocity(v);
  const g = gamma(v);
  return g * (xPrime + v * tPrime);
}

/**
 * Inverse Lorentz transformation: t = γ(t' + vx'/c²)
 */
export function inverseLorentzT(xPrime: number, tPrime: number, v: number = 0): number {
  assertValidVelocity(v);
  const g = gamma(v);
  return g * (tPrime + v * xPrime);
}

/**
 * Time dilation: Δt = γΔt₀
 */
export function timeDilation(properTime: number, v: number = 0): number {
  assertValidVelocity(v);
  return gamma(v) * properTime;
}

/**
 * Inverse time dilation: Δt₀ = Δt/γ
 */
export function inverseTimeDilation(dilatedTime: number, v: number = 0): number {
  assertValidVelocity(v);
  return dilatedTime / gamma(v);
}

/**
 * Length contraction: L = L₀/γ
 */
export function lengthContraction(properLength: number, v: number = 0): number {
  assertValidVelocity(v);
  return properLength / gamma(v);
}

/**
 * Inverse length contraction: L₀ = γL
 */
export function inverseLength(contractedLength: number, v: number = 0): number {
  assertValidVelocity(v);
  return contractedLength * gamma(v);
}

/**
 * Relativistic velocity addition: u = (u' + v) / (1 + u'v/c²)
 */
export function relativisticVelocityAdd(uPrime: number, v: number): number {
  const numerator = uPrime + v;
  const denominator = 1 + uPrime * v;
  if (denominator === 0) return 0;
  return numerator / denominator;
}

/** Aliases for velocity addition */
export const velocityAddition = relativisticVelocityAdd;

/**
 * Inverse relativistic velocity: u' = (u - v) / (1 - uv/c²)
 */
export function relativisticVelocitySub(u: number, v: number): number {
  const numerator = u - v;
  const denominator = 1 - u * v;
  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Classical (Galilean) velocity addition: u = u' + v
 */
export function galileanVelocityAdd(uPrime: number, v: number): number {
  return uPrime + v;
}

/**
 * Spacetime interval: (Δs)² = (cΔt)² - (Δx)²
 */
export function spacetimeInterval(deltaT: number, deltaX: number): number {
  return deltaT * deltaT - deltaX * deltaX;
}

/** Alias for invariant interval */
export const invariantInterval = spacetimeInterval;

/**
 * Classify spacetime interval
 */
export function classifyInterval(deltaT: number, deltaX: number): 'timelike' | 'spacelike' | 'lightlike' {
  const ds2 = spacetimeInterval(deltaT, deltaX);
  const epsilon = 1e-10;
  if (Math.abs(ds2) < epsilon) return 'lightlike';
  return ds2 > 0 ? 'timelike' : 'spacelike';
}

/**
 * Check if event B is causally reachable from event A.
 */
export function isCausallyConnected(
  deltaT: number,
  deltaX: number
): boolean {
  return spacetimeInterval(deltaT, deltaX) >= -1e-10;
}

/**
 * Simultaneity transformation: Δt' = γ(Δt - vΔx/c²)
 */
export function simultaneityTransform(deltaT: number, deltaX: number, v: number): number {
  assertValidVelocity(v);
  const g = gamma(v);
  return g * (deltaT - v * deltaX);
}

/**
 * Muon decay calculations
 */
export const MUON = {
  properLifetime: 2.2e-6,
  typicalSpeed: 0.99,
  creationAltitude: 10000,
};

export function muonLabDistance(v: number, properLifetime: number = MUON.properLifetime): number {
  const dilatedTime = timeDilation(properLifetime, v);
  return dilatedTime * v * C;
}

export function muonFrameDistance(labDistance: number, v: number): number {
  return lengthContraction(labDistance, v);
}

export function formatNumber(value: number, decimals: number = 4): string {
  if (!isFinite(value)) return '∞';
  if (Math.abs(value) < 1e-15) return '0';
  return Number(value.toFixed(decimals)).toString();
}

export function formatVelocity(v: number): string {
  if (v === 0) return '0';
  if (v === 1) return 'c';
  if (v === -1) return '-c';
  return `${formatNumber(v)}c`;
}

export function clampVelocity(v: number, max: number = 0.999): number {
  return Math.max(-max, Math.min(max, v));
}

export function properTimeInterval(deltaT: number, deltaX: number): number {
  const ds2 = spacetimeInterval(deltaT, deltaX);
  if (ds2 < 0) {
    throw new Error('Cannot compute proper time for spacelike interval');
  }
  return Math.sqrt(ds2);
}

export function worldlineAngle(v: number): number {
  return Math.atan(Math.abs(v));
}

export function primedXAxisAngle(v: number): number {
  return Math.atan(v);
}

export function primedCtAxisAngle(v: number): number {
  return Math.atan(v);
}

export function primedAxisScale(v: number): number {
  if (Math.abs(v) >= 1) return Infinity;
  const v2 = v * v;
  return Math.sqrt((1 + v2) / (1 - v2));
}
