export function parseNativeEmoji(unified: string): string {
  return unified
    .split('-')
    .map(hex => String.fromCodePoint(Number.parseInt(hex, 16)))
    .join('');
}
