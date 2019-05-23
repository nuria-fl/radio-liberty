const defaultLines = [
  "That doesn't seem to work.",
  'Dude, that makes no sense.',
  "I'm not sure what's supposed to happen.",
  "Eh… I don't think so."
]

export function randomLine() {
  return defaultLines[Math.floor(Math.random() * defaultLines.length)]
}
