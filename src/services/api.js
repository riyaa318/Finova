/**
 * Tiny mock-network layer. Every service call goes through `respond()` so components
 * see the same async behaviour (latency, occasional failures) they would with a real API.
 * Swap the body of the service functions for `fetch()` calls and nothing else changes.
 */
import { storage } from '../utils/storage';

export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const SIMULATE_KEY = 'dev:simulate-errors';
const FAILURE_RATE = 0.5;

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const setErrorSimulation = (enabled) => storage.set(SIMULATE_KEY, Boolean(enabled));
export const isErrorSimulationOn = () => storage.get(SIMULATE_KEY, false) === true;

/**
 * @param {() => T} produce  Synchronous work performed "on the server".
 * @param {{ latency?: number | [number, number], canFail?: boolean }} [options]
 */
export async function respond(produce, { latency = [260, 520], canFail = true } = {}) {
  const wait = Array.isArray(latency) ? latency[0] + Math.random() * (latency[1] - latency[0]) : latency;
  if (wait > 0) await sleep(wait);
  if (canFail && isErrorSimulationOn() && Math.random() < FAILURE_RATE) {
    throw new ApiError('The service is temporarily unavailable. Please try again.', 503);
  }
  return produce();
}

export const makeId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
export const makeTransactionId = () => `TXN-${Math.random().toString(16).slice(2, 10).toUpperCase().padEnd(8, '0')}`;
