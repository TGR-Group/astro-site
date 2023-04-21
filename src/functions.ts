import chroma from 'chroma-js'
const { hsl, distance, contrast } = chroma

export const themeColor = (hue: number, sat: number, ctr: number) => {
  let left: number = 0
  let right: number = 1
  let count: number = 0
  while (right - left > 0.01) {
    const middle = Math.floor(((left + right) / 2) * 100) / 100
    const color = hsl(hue, sat, middle)
    if (contrast('#fff', color) > ctr) {
      left = middle
    } else {
      right = middle
    }
    if (count > 5) break
    count++
  }
  return hsl(hue, sat, left).hex()
}
