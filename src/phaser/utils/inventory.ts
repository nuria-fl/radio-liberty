export const pickUp = item => {
  document.dispatchEvent(new CustomEvent('pickUp', { detail: item }))
}
