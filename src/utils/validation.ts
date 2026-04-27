export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}

export function isValidNodeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id)
}

export function clampScore(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value))
}
