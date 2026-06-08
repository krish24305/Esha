// Multi-screen flow + confetti + interactive roast/sweet message script
const openBtn = document.getElementById('openBtn')
const continueBtn = document.getElementById('continueBtn')
const nextToFinalBtn = document.getElementById('nextToFinalBtn')
const restartBtn = document.getElementById('restartBtn')
const messageEl = document.getElementById('message')
const roastListEl = document.getElementById('roastList')
const popperEl = document.getElementById('popper')
const mainPhoto = document.getElementById('mainPhoto')

const introScreen = document.getElementById('introScreen')
const revealScreen = document.getElementById('revealScreen')
const roastScreen = document.getElementById('roastScreen')
const finalScreen = document.getElementById('finalScreen')

// Try to set images from available extensions (png, jpg, jpeg)
function setAvailableImages(){
  const exts = ['.png','.jpg','.jpeg']
  const imgs = document.querySelectorAll('img[data-src-base]')
  imgs.forEach(img => {
    const base = img.dataset.srcBase
    if(!base) return
    let i = 0
    const tryNext = () => {
      if(i >= exts.length) return
      const url = base + exts[i]
      const tester = new Image()
      tester.onload = () => { img.src = url }
      tester.onerror = () => { i++; tryNext() }
      tester.src = url
    }
    tryNext()
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setAvailableImages)
} else {
  // document already loaded (script placed at end), run immediately
  setAvailableImages()
}

const roasts = [
  "You're so short that even the Wi-Fi signal looks down on you — but the signal still loves you.",
  "Chl htt bauni",
  "If shortness was a sport, you'd have a gold medal and a trophy shelf small enough to fit in your palm.",
  "You may be vertically economical, but your attitude pahad jaisa.",
  "Bauna phirbhi bauna h chahe parvat pe ho ."
]

const sweets = [
  "Koi baat nahi, height choti h but dil bada h.Thank kro mera,tumhara dost hone ke liye!, maza aata  h tumhe ragebait karne mein! ab itna sweet message diya h toh party kab dogi and most importantly, bandi bana do ;)",
]

function showRoasts(){
  roastListEl.innerHTML = ''
  roasts.forEach(r => {
    const li = document.createElement('li')
    li.textContent = r
    roastListEl.appendChild(li)
  })
  // show roast screen
  introScreen.classList.add('hidden')
  revealScreen.classList.add('hidden')
  finalScreen.classList.add('hidden')
  roastScreen.classList.remove('hidden')
  // staggered animate each roast list item
  const items = roastListEl.querySelectorAll('li')
  items.forEach((it, i) => {
    it.style.animation = `roastIn .45s ease ${i * 120}ms forwards`
  })
}

function showFinal(){
  roastScreen.classList.add('hidden')
  finalScreen.classList.remove('hidden')
  const note = sweets[Math.floor(Math.random()*sweets.length)]
  const fullText = `${note}\n\n— Krish`
  // typewriter effect
  messageEl.textContent = ''
  messageEl.classList.remove('show')
  let idx = 0
  const speed = 28
  const typer = setInterval(()=>{
    if(idx >= fullText.length){
      clearInterval(typer)
      messageEl.classList.add('show')
      // confetti after typing finishes
      launchConfetti(true)
      return
    }
    const ch = fullText[idx]
    messageEl.textContent += ch
    idx++
  }, speed)
}

openBtn.addEventListener('click', ()=>{
  // ensure images are loaded, then show reveal screen with main photo and popper
  setAvailableImages()
  introScreen.classList.add('hidden')
  revealScreen.classList.remove('hidden')
  // animate photo in (add show to the reveal screen so CSS triggers)
  revealScreen.classList.add('show')
  // trigger popper animation and show continue after a short delay
  popperEl.classList.add('show')
  setTimeout(()=>{ continueBtn.classList.remove('hidden') }, 700)
})

continueBtn.addEventListener('click', ()=>{
  // move to roast screen
  popperEl.classList.remove('show')
  showRoasts()
})

nextToFinalBtn.addEventListener('click', ()=>{
  showFinal()
})

restartBtn.addEventListener('click', ()=>{
  finalScreen.classList.add('hidden')
  introScreen.classList.remove('hidden')
})

/* Confetti implementation (lightweight) */
function launchConfetti(full=true){
  const canvas = document.getElementById('confettiCanvas')
  const ctx = canvas.getContext('2d')
  let W = canvas.width = window.innerWidth
  let H = canvas.height = window.innerHeight
  const pieces = []

  function rand(min,max){return Math.random()*(max-min)+min}

  for(let i=0;i<120;i++){
    pieces.push({x:rand(0,W),y:rand(-H,0),vx:rand(-4,4),vy:rand(2,7),size:rand(6,12),color:`hsl(${rand(0,360)},80%,60%)`})
  }

  let t=0
  function frame(){
    ctx.clearRect(0,0,W,H)
    for(const p of pieces){
      p.x += p.vx
      p.y += p.vy + Math.sin((p.x+t)/20)*0.5
      ctx.fillStyle = p.color
      ctx.fillRect(p.x,p.y,p.size,p.size*0.6)
      if(p.y>H+50) { p.y = -20; p.x = rand(0,W) }
    }
    t+=1
    if(full || t<260) requestAnimationFrame(frame)
    else ctx.clearRect(0,0,W,H)
  }
  frame()
}

window.addEventListener('resize', ()=>{
  const canvas = document.getElementById('confettiCanvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})
