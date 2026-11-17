// Removes accents: "Rosée" -> "Rosee". NFD splits "é" into "e" plus a combining accent mark
// (U+0300 to U+036F), which the regex then drops. Shared by the search and the slug generator.
export function stripAccents(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
