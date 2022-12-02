let colorPickerEl = document.querySelector('.colorPicker')
let colorPickerInput = document.querySelector('.colorPicker .input')
let colorPickerDisplay = document.querySelector('.colorPicker .display')
let palletteContainerEl = document.querySelector('.palletteContainer')
let copyEl = document.querySelector('#copy')

let colorInput = 'abcdef'
let rgb = []

let pallettes = {
  'Invert': [
    (r,g,b)=>[255-r,255-g,255-b]
  ],
  'RGB Rotate': [
    (r,g,b) => [b,r,g],
    (r,g,b) => [g,b,r]
  ],
  'RGB Swap': [
    (r,g,b) => [r,b,g],
    (r,g,b) => [b,g,r],
    (r,g,b) => [g,r,b]
  ],
  'Darken': [
    (r,g,b) => [r*.9,g*.9,b*.9],
    (r,g,b) => [r*.8,g*.8,b*.8],
    (r,g,b) => [r*.7,g*.7,b*.7]
  ],
  'Lighten': [
    (r,g,b) => [r*1.1,g*1.1,b*1.1],
    (r,g,b) => [r*1.2,g*1.2,b*1.2],
    (r,g,b) => [r*1.3,g*1.3,b*1.3]
  ]
}

class Pallette {
  constructor (rgb, name) {
    this.originalRGB = rgb
    this.r = [rgb[0]]
    this.g = [rgb[1]]
    this.b = [rgb[2]]
    this.palletteLength = 1
    this.name = (name || '-')
  }
  addColor (equation) {
    this.r.push(Math.min(Math.floor(equation(...this.originalRGB)[0]),255))
    this.g.push(Math.min(Math.floor(equation(...this.originalRGB)[1]),255))
    this.b.push(Math.min(Math.floor(equation(...this.originalRGB)[2]),255))
    this.palletteLength ++
  }
  compilePallette () {
    let palletteEl = document.createElement('div')
    palletteEl.classList.add('pallette')
    palletteContainerEl.append(palletteEl)

    let palletteNameEl = document.createElement('h1')
    palletteNameEl.innerText = this.name
    palletteEl.append(palletteNameEl)
    for (let i = 0; i < this.palletteLength; i++) {
      let palletteColorEl = document.createElement('div')
      palletteColorEl.classList.add('palletteColor')
      let newRGB = [
        this.r[i].toString(16).padStart(2,0),
        this.g[i].toString(16).padStart(2,0),
        this.b[i].toString(16).padStart(2,0)
      ]
      let color = `#${newRGB[0]}${newRGB[1]}${newRGB[2]}`
      palletteColorEl.style.background = color
      palletteColorEl.innerText = color
      palletteColorEl.style.color = ((this.r[i]+this.g[i]+this.b[i])/3>=150?'black':'white')
      palletteColorEl.onclick = () => {
        copyEl.innerText = color
        copyEl.select()
        document.execCommand('copy')
        document.activeElement.blur();
      }
      palletteEl.append(palletteColorEl)
    }
  }
}

addEventListener('keydown',updateInput)
function updateInput(e){
  console.log(e.key)
  if (e.key == 'Backspace') {
    colorInput = colorInput.slice(0,-1)
  }
  if ('0123456789abcdef'.includes(e.key) && colorInput.length < 6) {
    colorInput += e.key
  }
  colorPickerInput.innerText = colorInput
  if (colorInput.length && colorInput.length % 3 == 0) {
    updateColor()
  }
}
function updateColor() {
  palletteContainerEl.innerHTML = ''
  colorPickerDisplay.style.background = `#${colorInput}`
  if (colorInput.length == 6) {
    rgb = [parseInt(colorInput.slice(0,2),16),parseInt(colorInput.slice(2,4),16),parseInt(colorInput.slice(4,6),16)]
  } else {
    rgb = [parseInt(colorInput[0].repeat(2),16),parseInt(colorInput[1].repeat(2),16),parseInt(colorInput[2].repeat(2),16)]
  }
  for (let i of Object.keys(pallettes)) {
    let newPallette = new Pallette(rgb,i)
    for (let j of pallettes[i]) {
      newPallette.addColor(j)
    }
    newPallette.compilePallette()
  }
}
updateColor()
// let invert = new Pallette()
// invert.compilePallette()
function randomColor() {
  colorInput = `${Math.floor(Math.random()*256).toString(16)}${Math.floor(Math.random()*256).toString(16)}${Math.floor(Math.random()*256).toString(16)}`
  colorPickerInput.innerText = colorInput
  updateColor()
}
