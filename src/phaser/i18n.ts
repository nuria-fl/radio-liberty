import en from './i18n/en.json'
import ca from './i18n/ca.json'

const languages = {
  en,
  ca,
}

const currentLang = process.env.LANG || 'ca'

console.log(currentLang, process.env.LANG)

export default languages[currentLang]
