import currentLang from './i18n'

const defaultLines = currentLang.common.randomLines

export function randomLine() {
  return defaultLines[Math.floor(Math.random() * defaultLines.length)]
}
