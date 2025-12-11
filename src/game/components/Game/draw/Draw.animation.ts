import { MAX_RANDOM_BALL } from '@/config/app.config'
import { onMounted, ref } from 'vue'

type StartDrawOptions = {
  delayBetween: number
}

type DrawedBallsType = {
  color: string
  num: number
}

const BALL_SVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs>
            <radialGradient id="bg" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="55%" stop-color="#f0f4f8" />
              <stop offset="100%" stop-color="#cfd8e3" />
            </radialGradient>
            <radialGradient id="shine" cx="30%" cy="30%" r="60%">
              <stop offset="0%" stop-color="rgba(255,255,255,0.8)" />
              <stop offset="80%" stop-color="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="94" fill="url(#bg)" stroke="#0f1f24" stroke-width="4"/>
          <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(9,123,172,0.25)" stroke-width="10"/>
          <ellipse cx="70" cy="70" rx="38" ry="28" fill="url(#shine)" />
        </svg>
      `
const BALL_SVG_URI = `data:image/svg+xml;utf8,${encodeURIComponent(BALL_SVG)}`

export const useDrawAnimation = () => {
  const canvas = ref<any>()
  const ctx = ref()

  const drawedBalls = ref<DrawedBallsType[]>([])
  const status = ref<string>('')
  const currentBall = document.getElementById('currentBall')

  let balls: any[] = []
  let remaining: any[] = []

  const centerX = ref(0)
  const centerY = ref(0)
  const radius = 150 // cercul de joc (mai mic)

  // stare elice + ușă
  let doorProgress = 0 // 0 = închis, 1 = deschis
  let targetDoor = 0 // ținta către care animăm ușa
  let drawInProgress = false
  let rotationPhase = 0

  // control extragere automată
  let autoSequence: any[] = []
  let autoIndex = 0
  let autoDelay = 2000
  let autoActive = false
  let autoTimer: any = null
  let autoCompletionResolve: any = null
  let onBallDrawn: any = null

  function randColor() {
    return '#15383e'
  }

  function init() {
    const root = document.documentElement
    if (root) {
      console.log('init root()', `url(${BALL_SVG_URI})`)
      root.style.setProperty('--ball-tex', `url(${BALL_SVG_URI})`)
    }

    canvas.value = document.querySelector('#canvas-draw-animation')
    ctx.value = canvas.value?.getContext('2d')

    centerX.value = canvas.value.width / 2
    centerY.value = canvas.value.height / 2 + 10

    remaining = Array.from({ length: MAX_RANDOM_BALL }, (_, i) => i + 1)
    balls = []
    drawedBalls.value = []
    targetDoor = 0
    doorProgress = 0
    drawInProgress = false
    stopAutoDraw('reset')
    updateStatus()
    resetCurrentBall()

    for (const num of remaining) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * (radius - 25)

      balls.push({
        num,
        x: centerX.value + Math.cos(angle) * dist,
        y: centerY.value + Math.sin(angle) * dist,
        r: 18,
        vx: (Math.random() * 2 - 1) * 4.8,
        vy: (Math.random() * 2 - 1) * 4.8,
        color: randColor(),
        falling: false,
        fy: 0,
        spinPhase: Math.random() * Math.PI * 2,
        spinSpeed: 0.0015 + Math.random() * 0.002,
        swirlDir: Math.random() > 0.5 ? 1 : -1,
        highlightAngle: Math.random() * Math.PI * 2,
        danceAmp: 0.8 + Math.random() * 0.6,
        danceSpeed: 0.0006 + Math.random() * 0.0009,
        danceBias: Math.random() * Math.PI * 2,
        danceVX: 0,
        danceVY: 0,
        nextDanceSwitch: 0,
      })
    }
  }

  function stopAutoDraw(reason = 'stopped') {
    autoActive = false
    autoSequence = []
    autoIndex = 0
    if (autoTimer) {
      clearTimeout(autoTimer)
      autoTimer = null
    }
    if (autoCompletionResolve) {
      const resolve = autoCompletionResolve
      autoCompletionResolve = null
      resolve({
        completed: reason === 'completed',
        reason,
      })
    }
  }

  function updateStatus() {
    status.value = `Mingi rămase: ${remaining.length} / ${MAX_RANDOM_BALL}`
  }

  function resetCurrentBall() {
    if (!currentBall) return
    currentBall.textContent = '--'
    currentBall.style.setProperty('--accent', '#15383e')
    currentBall.classList.remove('show')
    currentBall.style.opacity = '0'
  }

  function showCurrentBall(num: string, color: string) {
    if (!currentBall) return
    currentBall.textContent = num
    currentBall.style.setProperty('--accent', color || '#15383e')
    currentBall.classList.remove('show')
    // force reflow to restart animation
    void currentBall.offsetWidth
    currentBall.classList.add('show')
  }

  // Coliziuni între mingi (dezactivate)
  function handleBallCollisions() {}

  function scheduleAutoContinuation() {
    if (!autoActive) return
    if (autoIndex >= autoSequence.length || remaining.length === 0) {
      stopAutoDraw('completed')
      return
    }
    if (autoTimer) {
      clearTimeout(autoTimer)
    }
    autoTimer = setTimeout(() => {
      autoTimer = null
      runAutoDraw()
    }, autoDelay)
  }

  function runAutoDraw() {
    if (!autoActive) return
    if (autoIndex >= autoSequence.length) {
      stopAutoDraw('completed')
      return
    }
    const nextNum = autoSequence[autoIndex++]
    drawOne(nextNum, { silent: true })
  }

  function setExtractionSequence(sequence: number[]) {
    if (!Array.isArray(sequence) || sequence.length === 0) return false
    autoSequence = sequence
      .map((n) => Number(n))
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= MAX_RANDOM_BALL)
    if (autoSequence.length === 0) return false
    autoIndex = 0
    autoActive = true
    return true
  }

  function startDraw(sequence: number[], options?: StartDrawOptions) {
    const delayBetween =
      options && typeof options.delayBetween === 'number' ? options.delayBetween : 2000
    stopAutoDraw('replaced')
    const configured = setExtractionSequence(sequence)
    if (!configured) {
      return Promise.resolve({
        completed: false,
        reason: 'invalid_sequence',
      })
    }
    autoDelay = typeof delayBetween === 'number' && delayBetween >= 600 ? delayBetween : 2000
    return new Promise((resolve) => {
      autoCompletionResolve = resolve
      runAutoDraw()
    })
  }

  function setOnBallDrawn(callback: any) {
    onBallDrawn = typeof callback === 'function' ? callback : null
  }

  // Jet dezactivat (păstrăm funcția pentru compatibilitate)
  function applyAirJet() {
    return false
  }

  // Turbulențe controlate pentru realism (fără sens circular)
  function applyTurbulence(b: any, t: any) {
    if (t >= b.nextDanceSwitch) {
      const dir = Math.random() * Math.PI * 2
      const mag = 0.12 + Math.random() * 0.25
      b.danceVX = Math.cos(dir) * mag
      b.danceVY = Math.sin(dir) * mag
      b.nextDanceSwitch = t + 400 + Math.random() * 900
    }

    const danceScale = 0.18 * b.danceAmp
    b.vx += b.danceVX * danceScale
    b.vy += b.danceVY * danceScale

    const wobble = Math.sin(t * b.spinSpeed + b.spinPhase)
    const wobble2 = Math.cos(t * (b.spinSpeed * 0.8) + b.spinPhase * 1.3)
    b.vx += wobble * 0.12 * b.swirlDir
    b.vy += wobble2 * 0.1

    const dx = b.x - centerX.value
    const dy = b.y - centerY.value
    const dist = Math.hypot(dx, dy) || 1

    // direcție pseudo-aleatoare care își schimbă constant unghiul
    const driftAngle = Math.sin(t * (0.0009 + b.spinSpeed) + b.spinPhase + b.danceBias) * Math.PI
    const driftSpeed = 0.14
    b.vx += Math.cos(driftAngle) * driftSpeed
    b.vy += Math.sin(driftAngle) * driftSpeed

    // bruiaj aleator pentru direcții imprevizibile
    const jitterAngle = Math.random() * Math.PI * 2
    b.vx += Math.cos(jitterAngle) * 0.07
    b.vy += Math.sin(jitterAngle) * 0.07

    // ușor push radial pentru distribuție pe toată suprafața,
    // dar fără a forța o mișcare circulară
    const distNorm = dist / radius
    if (distNorm > 0.85) {
      b.vx -= (dx / dist) * 0.28 * (distNorm - 0.85)
      b.vy -= (dy / dist) * 0.28 * (distNorm - 0.85)
    } else if (distNorm < 0.2) {
      b.vx += (dx / dist) * 0.24 * (0.2 - distNorm)
      b.vy += (dy / dist) * 0.24 * (0.2 - distNorm)
    }
  }

  // Efect vizual de rotație rapidă
  function drawRotationBlur(t: any) {
    rotationPhase += 0.25
    if (!ctx.value) return

    ctx.value.save()
    ctx.value.translate(centerX.value, centerY.value)
    ctx.value.rotate(rotationPhase)
    ctx.value.globalCompositeOperation = 'lighter'

    for (let i = 0; i < 6; i++) {
      const alpha = 0.16 + 0.06 * Math.sin(t * 0.005 + i)
      ctx.value.strokeStyle = `rgba(59,130,246,${alpha})`
      ctx.value.lineWidth = 18
      ctx.value.beginPath()
      ctx.value.arc(0, 0, radius - 32, i * (Math.PI / 3), i * (Math.PI / 3) + 0.9)
      ctx.value.stroke()
    }

    for (let i = 0; i < 8; i++) {
      ctx.value.rotate(Math.PI / 4)
      const grad = ctx.value.createLinearGradient(0, -radius + 20, 0, radius - 20)
      grad.addColorStop(0, 'rgba(14,165,233,0)')
      grad.addColorStop(0.5, 'rgba(14,165,233,0.25)')
      grad.addColorStop(1, 'rgba(14,165,233,0)')
      ctx.value.fillStyle = grad
      ctx.value.fillRect(-3, -radius + 20, 6, (radius - 20) * 2)
    }

    ctx.value.restore()
    ctx.value.globalCompositeOperation = 'source-over'
  }

  // Desen ușă animată în partea de sus a cercului
  function drawDoor() {
    doorProgress += (targetDoor - doorProgress) * 0.12

    if (!ctx.value) return

    const doorWidth = 90
    const doorHeight = 18
    const hingeX = centerX.value - doorWidth / 2
    const hingeY = centerY.value - radius - doorHeight / 2
    const angle = doorProgress * (Math.PI / 1.6) // rotire realistă

    ctx.value.save()
    ctx.value.fillStyle = '#0f172a'
    ctx.value.strokeStyle = '#94a3b8'
    ctx.value.lineWidth = 2

    // rama fixă
    ctx.value.strokeRect(centerX.value - doorWidth / 2, hingeY, doorWidth, doorHeight)

    // panoul mobil pivotat
    ctx.value.translate(hingeX, hingeY + doorHeight / 2)
    ctx.value.rotate(-angle)
    const panelGrad = ctx.value.createLinearGradient(0, 0, doorWidth, 0)
    panelGrad.addColorStop(0, '#1f2937')
    panelGrad.addColorStop(1, '#475569')
    ctx.value.fillStyle = panelGrad
    ctx.value.fillRect(0, -doorHeight / 2, doorWidth, doorHeight)
    ctx.value.strokeRect(0, -doorHeight / 2, doorWidth, doorHeight)

    // braț mecanic
    ctx.value.beginPath()
    ctx.value.moveTo(doorWidth, -doorHeight / 2)
    ctx.value.lineTo(doorWidth + 25, -doorHeight)
    ctx.value.strokeStyle = '#cbd5f5'
    ctx.value.stroke()

    ctx.value.restore()
  }

  function draw(t: any) {
    if (!ctx.value || !canvas.value) return

    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

    // stand / bază pentru mașină (aspect mai „real”)
    // corpul mașinii - cerc cu border gros
    ctx.value.beginPath()
    ctx.value.arc(centerX.value, centerY.value, radius, 0, Math.PI * 2)
    ctx.value.lineWidth = 3

    const grad = ctx.value.createRadialGradient(
      centerX.value - 60,
      centerY.value - 60,
      radius * 0.1,
      centerX.value,
      centerY.value,
      radius,
    )
    grad.addColorStop(0, '#4b6d78')
    grad.addColorStop(1, '#324f57')
    ctx.value.fillStyle = grad
    ctx.value.fill()
    ctx.value.strokeStyle = '#374151'
    ctx.value.stroke()

    // Counter overlay
    drawRotationBlur(t)
    drawDoor()

    // Jet (dezactivat, păstrăm hook dacă revine în viitor)
    applyAirJet()

    // (Elică dezactivată)

    handleBallCollisions()

    for (const b of balls) {
      if (!b.falling) {
        b.x += b.vx
        b.y += b.vy

        // frecare ușoară
        b.vx *= 0.985
        b.vy *= 0.985

        applyTurbulence(b, t)
        b.highlightAngle += 0.15 + Math.random() * 0.05

        // limităm viteza
        const maxSpeed = 8.4
        const speed = Math.hypot(b.vx, b.vy)
        if (speed > maxSpeed) {
          const scale = maxSpeed / speed
          b.vx *= scale
          b.vy *= scale
        }

        // coliziune cu cercul
        const dx = b.x - centerX.value
        const dy = b.y - centerY.value
        const dist = Math.hypot(dx, dy)

        if (dist > radius - b.r) {
          const nx = dx / dist
          const ny = dy / dist
          b.x = centerX.value + nx * (radius - b.r)
          b.y = centerY.value + ny * (radius - b.r)

          const dot = b.vx * nx + b.vy * ny
          b.vx -= 2 * dot * nx
          b.vy -= 2 * dot * ny
        }
        // ușor efect care ține mingile în interior
        const distNorm = dist / radius
        if (distNorm > 0.95) {
          b.vx -= (dx / dist) * 0.3 * (distNorm - 0.95)
          b.vy -= (dy / dist) * 0.3 * (distNorm - 0.95)
        }
      } else {
        // cădere simplă
        b.fy += 0.9
        b.y += b.fy
        b.highlightAngle += 0.08
      }

      // desen minge
      ctx.value.save()
      ctx.value.translate(b.x, b.y)
      const hx = Math.cos(b.highlightAngle) * b.r * 0.35
      const hy = Math.sin(b.highlightAngle) * b.r * 0.35
      const bodyGrad = ctx.value.createRadialGradient(hx, hy, b.r * 0.2, 0, 0, b.r)
      bodyGrad.addColorStop(0, '#1f3f45')
      bodyGrad.addColorStop(0.6, '#10262b')
      bodyGrad.addColorStop(1, '#071419')

      ctx.value.beginPath()
      ctx.value.arc(0, 0, b.r, 0, Math.PI * 2)
      ctx.value.fillStyle = bodyGrad
      ctx.value.fill()

      const rimGrad = ctx.value.createRadialGradient(0, 0, b.r * 0.3, 0, 0, b.r)
      rimGrad.addColorStop(0, 'rgba(255,255,255,0.05)')
      rimGrad.addColorStop(1, 'rgba(0,0,0,0.35)')
      ctx.value.strokeStyle = rimGrad
      ctx.value.lineWidth = 2
      ctx.value.stroke()

      ctx.value.save()
      ctx.value.rotate(b.highlightAngle)
      ctx.value.scale(1, 0.6)
      const glossGrad = ctx.value.createLinearGradient(-b.r, 0, b.r, 0)
      glossGrad.addColorStop(0, 'rgba(255,255,255,0)')
      glossGrad.addColorStop(0.5, 'rgba(255,255,255,0.22)')
      glossGrad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.value.fillStyle = glossGrad
      ctx.value.globalAlpha = 0.5
      ctx.value.beginPath()
      ctx.value.ellipse(0, -b.r * 0.2, b.r * 0.58, b.r * 0.3, 0, 0, Math.PI * 2)
      ctx.value.fill()
      ctx.value.restore()

      ctx.value.restore()
      ctx.value.fillStyle = 'white'
      ctx.value.font = 'bold 14px sans-serif'
      ctx.value.textAlign = 'center'
      ctx.value.textBaseline = 'middle'
      ctx.value.lineWidth = 3
      ctx.value.strokeStyle = 'rgba(0,0,0,0.5)'
      ctx.value.strokeText(b.num, b.x, b.y)
      ctx.value.fillText(b.num, b.x, b.y)
    }
    requestAnimationFrame(draw)
  }

  function drawOne(forcedNumber = null, opts?: any) {
    const { silent = false } = opts
    if (drawInProgress) return
    if (remaining.length === 0) {
      if (!silent) alert('Nu mai sunt mingi.')
      stopAutoDraw('completed')
      return
    }

    drawInProgress = true
    targetDoor = 1

    // total extraction time = 1s (door open + fall + register)
    setTimeout(() => {
      let num
      if (typeof forcedNumber === 'number') {
        const idx = remaining.indexOf(forcedNumber)
        if (idx === -1) {
          drawInProgress = false
          targetDoor = 0
          scheduleAutoContinuation()
          return
        }
        num = remaining.splice(idx, 1)[0]
      } else {
        const i = Math.floor(Math.random() * remaining.length)
        num = remaining.splice(i, 1)[0]
      }

      const b = balls.find((x) => x.num === num)
      if (!b) {
        drawInProgress = false
        updateStatus()
        targetDoor = 0
        scheduleAutoContinuation()
        return
      }

      b.falling = true
      b.fy = 0

      setTimeout(() => {
        drawedBalls.value.push({
          num: b.num,
          color: b.color,
        })
        showCurrentBall(b.num, b.color)

        balls = balls.filter((x) => x.num !== num)
        updateStatus()
        targetDoor = 0
        drawInProgress = false

        if (onBallDrawn) {
          try {
            onBallDrawn({
              number: b.num,
              color: b.color,
              remaining: remaining.length,
            })
          } catch (err) {
            console.error('onBallDrawn callback error:', err)
          }
        }
        scheduleAutoContinuation()
      }, 750)
    }, 250)
  }

  onMounted(() => {
    init()
    requestAnimationFrame(draw)
  })

  return {
    canvas,
    drawedBalls,
    status,
    startDraw,
    stopAutoDraw,
    setOnBallDrawn,
  }
}
