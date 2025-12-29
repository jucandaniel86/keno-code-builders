/* eslint-disable @typescript-eslint/ban-ts-comment */
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

//import images and audio
import MACHINE_IMAGE from './assets/ballMachineBackground.png'
import TUBE_IMAGE from './assets/tube.png'
import BALL_IMAGE from './assets/10.png'
import AUDIO_FILE from './assets/backgroundAudio.wav'
import { MAX_RANDOM_BALL } from '@/config/app.config'

export type LotteryNumbers = string | number | number[]

export interface LotteryMachineOptions {
  containerRadius?: number
  waitInterval?: number
  playSound?: boolean
  assetsBase?: string // path to folder containing Images/ and backgroundAudio.wav
  spinSpeedMultiplier?: number
  blurStrength?: number
  onFinish?: (numbers: LotteryNumbers) => void
  onBallDrawn?: (ballNumber: number, drawIndex: number) => void
}

type Ball = {
  number: number
  x: number
  y: number
  lastX: number
  lastY: number
  dx: number
  dy: number
  r: number
  picked: number
  drawn: boolean
}

type PickedBall = {
  number: number
  x: number
  y: number
  r: number
  dx: number
  dy: number
  targetX: number
  targetY: number
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const TOTAL_IMAGES = MAX_RANDOM_BALL

class LotteryMachineCore {
  private container: HTMLElement
  private opts: Required<LotteryMachineOptions>
  private canvas: HTMLCanvasElement
  private canvas2: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private ctx2: CanvasRenderingContext2D
  private ballRadius: number
  private maxPickedBalls: number
  private balls: Ball[] = []
  private pickedBalls: PickedBall[] = []
  private pause = true
  private resetPicked = false
  private lock = false
  private angle1 = 0
  private angle2 = 180
  private rafId = 0
  private ballImage: HTMLImageElement
  private tubeImage: HTMLImageElement
  private audio: HTMLAudioElement | null = null
  private destroyed = false

  constructor(el: HTMLElement, options: LotteryMachineOptions = {}) {
    const base = options.assetsBase ? options.assetsBase.replace(/\/?$/, '/') : ''
    this.opts = {
      containerRadius: options.containerRadius ?? 150,
      waitInterval: options.waitInterval ?? 1000,
      playSound: options.playSound ?? false,
      assetsBase: base,
      spinSpeedMultiplier: options.spinSpeedMultiplier ?? 4,
      blurStrength: options.blurStrength ?? 0.35,
      onFinish: options.onFinish ?? (() => {}),
      onBallDrawn: options.onBallDrawn ?? (() => {}),
    }

    this.container = el
    this.container.style.position = 'relative'
    this.container.style.width = `${this.opts.containerRadius * 2}px`
    this.container.style.height = `${this.opts.containerRadius * 2}px`
    this.container.style.overflow = 'visible'
    this.container.style.display = 'flex'
    this.container.style.justifyContent = 'center'
    this.container.style.alignItems = 'center'
    this.container.style.gap = '.5rem'
    this.container.style.flexDirection = 'column'

    this.canvas = document.createElement('canvas')
    this.canvas.id = 'lottery-main'
    this.canvas.style.backgroundImage = `url("${base}${MACHINE_IMAGE}")`
    this.canvas.style.backgroundPosition = 'center'
    this.canvas.style.backgroundSize = 'contain'
    this.container.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')!

    this.canvas2 = document.createElement('canvas')
    this.canvas2.id = 'lottery-picked'
    this.container.appendChild(this.canvas2)
    this.ctx2 = this.canvas2.getContext('2d')!

    this.ballRadius = this.opts.containerRadius / 10
    this.canvas.width = this.opts.containerRadius * 2
    this.canvas.height = this.opts.containerRadius * 2
    this.canvas.style.borderRadius = `${this.opts.containerRadius}px`
    this.canvas.style.display = 'block'

    this.canvas2.width = (this.ballRadius * 2 + 10) * 4
    this.canvas2.height = this.ballRadius * 2 + 5
    this.maxPickedBalls = Math.max(1, Math.floor(this.canvas2.width / (this.ballRadius * 2 + 10)))

    this.canvas2.style.background = 'rgba(255,255,255,0.16)'
    this.canvas2.style.border = '1px solid rgba(255,255,255,0.45)'
    this.canvas2.style.borderRadius = '8px'
    this.canvas2.style.backdropFilter = 'blur(3px)'
    this.canvas2.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)'
    this.canvas2.style.zIndex = '5'

    this.ballImage = new Image()
    this.ballImage.src = `${base}${BALL_IMAGE}`
    this.tubeImage = new Image()
    this.tubeImage.src = `${base}${TUBE_IMAGE}`

    if (this.opts.playSound) {
      this.audio = new Audio(`${base}${AUDIO_FILE}`)
      this.audio.loop = true
      this.audio.volume = 0
    }

    this.createBalls()
    this.drawLoop()
  }

  private createBalls() {
    const randomBall = () => {
      const angle = Math.random() * Math.PI * 2
      const dist = (Math.random() * this.opts.containerRadius) / 1.4
      const baseX = this.canvas.width / 2 + Math.cos(angle) * dist
      const baseY = this.canvas.height / 2 + Math.sin(angle) * dist
      const speed = 2 + Math.random() * 2.5
      const dir = Math.random() * Math.PI * 2
      return {
        x: baseX,
        y: baseY,
        dx: Math.cos(dir) * speed,
        dy: Math.sin(dir) * speed,
      }
    }

    for (let i = 0; i < TOTAL_IMAGES; i++) {
      const rand = randomBall()
      this.balls.push({
        number: i + 1,
        x: rand.x,
        y: rand.y,
        lastX: rand.x,
        lastY: rand.y,
        dx: rand.dx,
        dy: rand.dy,
        r: this.ballRadius,
        picked: 0,
        drawn: false,
      })
    }
  }

  private setPickedTargets() {
    const slotWidth = this.ballRadius * 2 + 10
    for (let i = 0; i < this.pickedBalls.length; i++) {
      const slotIndex = this.pickedBalls.length - 1 - i
      // @ts-ignore
      this.pickedBalls[i].targetX = this.canvas2.width - this.ballRadius - 5 - slotWidth * slotIndex
      //@ts-ignore
      this.pickedBalls[i].targetY = this.canvas2.height / 2
    }
  }

  private drawPickedBalls() {
    this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height)
    for (let i = 0; i < this.pickedBalls.length; i++) {
      const pb = this.pickedBalls[i] as PickedBall
      const targetX = pb.targetX ?? pb.x
      const targetY = pb.targetY ?? pb.y
      const stepX = Math.sign(targetX - pb.x) * Math.min(4, Math.abs(targetX - pb.x))
      const stepY = Math.sign(targetY - pb.y) * Math.min(2, Math.abs(targetY - pb.y))
      pb.x += stepX
      pb.y += stepY
      if (Math.abs(targetX - pb.x) < 0.5) pb.x = targetX
      if (Math.abs(targetY - pb.y) < 0.5) pb.y = targetY

      this.ctx2.beginPath()
      this.ctx2.arc(pb.x, pb.y, pb.r, 0, Math.PI * 2)
      this.ctx2.closePath()
      this.ctx2.fillStyle = 'rgba(255, 255, 255, 1)'
      this.ctx2.fill()
      this.ctx2.globalCompositeOperation = 'source-atop'

      const img = this.ballImage
      const imageOffset = 0
      const sx = pb.x - pb.r - imageOffset
      const sy = pb.y - pb.r - imageOffset
      const swidth = pb.r * 2 + imageOffset * 2
      const sheight = pb.r * 2 + imageOffset * 2

      this.ctx2.drawImage(img, sx, sy, swidth, sheight)
      this.ctx2.globalCompositeOperation = 'source-over'

      this.ctx2.font = '12px arial'
      this.ctx2.textAlign = 'center'
      this.ctx2.textBaseline = 'middle'
      this.ctx2.fillStyle = 'black'
      this.ctx2.fillText(String(pb.number), pb.x, pb.y)
    }
  }

  private lineAtAngle(
    startX: number,
    startY: number,
    angleDeg: number,
    offset: number,
    length: number,
  ) {
    const angle = angleDeg * (Math.PI / 180)
    const cosAngle = Math.cos(angle)
    const sinAngle = Math.sin(angle)
    const startXPos = cosAngle * offset + startX
    const startYPos = sinAngle * offset + startY
    const endXPos = cosAngle * length + startXPos
    const endYPos = sinAngle * length + startYPos
    this.ctx.beginPath()
    this.ctx.moveTo(startXPos, startYPos)
    this.ctx.lineTo(endXPos, endYPos)
    this.ctx.lineWidth = 5
    this.ctx.stroke()
    this.ctx.closePath()
  }

  private drawLoop = () => {
    if (this.destroyed) return
    this.ctx.globalAlpha = 1
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.beginPath()
    this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 5, 0, 2 * Math.PI, true)
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = '#5e3434'
    this.ctx.stroke()
    this.ctx.closePath()

    if (!this.pause) {
      this.angle1 += 5
      this.angle2 += 5
    }
    this.lineAtAngle(
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.angle1,
      5,
      this.opts.containerRadius,
    )
    this.lineAtAngle(
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.angle2,
      5,
      this.opts.containerRadius,
    )

    for (let i = 0; i < this.balls.length; i++) {
      const curBall = this.balls[i] as Ball
      if (this.resetPicked) {
        this.pickedBalls = []
        this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height)
        this.resetPicked = false
      }

      const speedMagnitude = Math.hypot(curBall.x - curBall.lastX, curBall.y - curBall.lastY)
      const blurAmount =
        !this.pause && speedMagnitude > 0 ? Math.min(10, speedMagnitude * this.opts.blurStrength) : 0

      if (blurAmount > 0) {
        this.ctx.save()
        this.ctx.filter = `blur(${blurAmount}px)`
        this.ctx.globalAlpha = 0.35
        this.ctx.beginPath()
        this.ctx.arc(curBall.x, curBall.y, curBall.r, 0, Math.PI * 2)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        this.ctx.fill()
        this.ctx.restore()
      }

      this.ctx.beginPath()
      this.ctx.arc(curBall.x, curBall.y, curBall.r, 0, Math.PI * 2)
      this.ctx.closePath()
      this.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
      this.ctx.fill()
      this.ctx.globalCompositeOperation = 'source-atop'

      const img = this.ballImage
      const imageOffset = 0
      const sx = curBall.x - curBall.r - imageOffset
      const sy = curBall.y - curBall.r - imageOffset
      const swidth = curBall.r * 2 + imageOffset * 2
      const sheight = curBall.r * 2 + imageOffset * 2
      this.ctx.drawImage(img, sx, sy, swidth, sheight)
      this.ctx.globalCompositeOperation = 'source-over'

      this.ctx.font = '12px arial'
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillStyle = 'black'
      this.ctx.fillText(String(curBall.number), curBall.x, curBall.y)

      if (!this.pause) {
        if (curBall.picked) {
          curBall.lastX = curBall.x
          curBall.lastY = curBall.y
          curBall.x += curBall.dx
          curBall.y += curBall.dy
          const targetX = this.opts.containerRadius
          const targetY = this.opts.containerRadius * 2 - curBall.r
          const speed = 10

          if (curBall.x - targetX > -speed && curBall.x - targetX < speed) {
            curBall.x = targetX
          }
          if (curBall.y - targetY > -speed && curBall.y - targetY < speed) {
            curBall.y = targetY
          }
          if (curBall.x < targetX) {
            curBall.dx = speed
          } else if (curBall.x > targetX) {
            curBall.dx = -speed
          } else {
            curBall.dx = 0
          }
          if (curBall.y < targetY) {
            curBall.dy = speed
          } else if (curBall.y > targetY) {
            curBall.dy = -speed
          } else {
            curBall.dy = 0
          }

          if (curBall.x === targetX && curBall.y === targetY) {
            const number = curBall.number
            const pickedOrder = curBall.picked
            if (!this.lock) {
              this.lock = true
              setTimeout(() => {
                while (this.pickedBalls.length >= this.maxPickedBalls) {
                  this.pickedBalls.shift()
                }
                this.pickedBalls.push({
                  number,
                  x: this.canvas2.width + curBall.r,
                  y: this.canvas2.height / 2,
                  r: curBall.r,
                  dx: -3,
                  dy: 0,
                  targetX: 0,
                  targetY: 0,
                })
                this.setPickedTargets()

                if (pickedOrder !== undefined) {
                  this.opts.onBallDrawn(number, pickedOrder ?? 0)
                }

                const idx = number - 1
                if (this.balls[idx]) {
                  this.balls[idx].drawn = true
                  this.balls[idx].picked = 0
                  this.balls[idx].x = this.canvas.width / 2
                  this.balls[idx].y = this.canvas.height - 47
                  this.balls[idx].dx = -3.5
                  this.balls[idx].dy = 5
                }

                this.lock = false
              }, this.opts.waitInterval)
            }
          }
        } else {
          curBall.lastX = curBall.x
          curBall.lastY = curBall.y
          const spinMultiplier = this.pause ? 1 : this.opts.spinSpeedMultiplier
          curBall.x += curBall.dx * spinMultiplier
          curBall.y += curBall.dy * spinMultiplier
          const dx = curBall.x - this.opts.containerRadius
          const dy = curBall.y - this.opts.containerRadius
          const distanceFromCenter = Math.sqrt(dx * dx + dy * dy)

          if (distanceFromCenter >= this.opts.containerRadius - curBall.r) {
            const normalMagnitude = distanceFromCenter || 1
            const normalX = dx / normalMagnitude
            const normalY = dy / normalMagnitude
            const tangentX = -normalY
            const tangentY = normalX
            const normalSpeed = -(normalX * curBall.dx + normalY * curBall.dy)
            const tangentSpeed = tangentX * curBall.dx + tangentY * curBall.dy
            curBall.dx = normalSpeed * normalX + tangentSpeed * tangentX
            curBall.dy = normalSpeed * normalY + tangentSpeed * tangentY
          }
        }
      }
    }

    this.ctx.globalAlpha = 0.5
    const tubeWidth = (this.opts.containerRadius / 5) * 2 + 10
    const tubeHeight = (this.opts.containerRadius / 5) * 3
    const tubeX = this.opts.containerRadius - tubeWidth / 2
    const tubeY = this.canvas.height - tubeHeight - 10
    if (this.tubeImage.complete) {
      this.ctx.drawImage(this.tubeImage, tubeX, tubeY, tubeWidth, tubeHeight)
    }

    this.drawPickedBalls()
    this.rafId = requestAnimationFrame(this.drawLoop)
  }

  async run(numbers: LotteryNumbers) {
    for (let i = 0; i < TOTAL_IMAGES; i++) {
      if (this.balls && this.balls[i]) {
        //@ts-ignore
        this.balls[i].picked = 0
      }
    }
    this.resetPicked = true
    this.pause = false
    if (this.opts.playSound && this.audio) {
      try {
        await this.audio.play()
      } catch (_) {
        // playback might be blocked until user gesture; ignore
        console.warn('Audio playback failed', _)
      }
    }

    const digits = Array.isArray(numbers)
      ? numbers
      : typeof numbers === 'number' || typeof numbers === 'string'
        ? numbers.toString().split('').map(Number)
        : []

    for (let idx = 0; idx < digits.length; idx++) {
      await wait(this.opts.waitInterval)
      const no = digits[idx]
      const ball = this.balls.find((b) => b.number === no && !b.drawn && !b.picked)
      if (ball) {
        ball.picked = idx + 1
      }
    }

    await wait(this.opts.waitInterval * 2)
    this.pause = true
    this.opts.onFinish(numbers)
    if (this.opts.playSound && this.audio) {
      this.audio.pause()
    }
  }

  destroy() {
    this.destroyed = true
    cancelAnimationFrame(this.rafId)
    if (this.audio) {
      this.audio.pause()
    }
    try {
      this.container.innerHTML = ''
    } catch (_) {
      // ignore cleanup errors
      console.warn('Cleanup failed', _)
    }
  }
}

export function useLotteryMachine(options: LotteryMachineOptions = {}) {
  const targetRef = ref<HTMLElement | null>(null)
  const isReady = ref(false)
  const isRunning = ref(false)
  let core: LotteryMachineCore | null = null

  const init = () => {
    console.log('Initializing Lottery Machine...', targetRef.value)
    if (core || !targetRef.value) return

    core = new LotteryMachineCore(targetRef.value, options)
    isReady.value = true
  }

  const run = async (numbers: LotteryNumbers): Promise<void> => {
    if (!core) init()
    if (!core) return
    isRunning.value = true
    return core.run(numbers).finally(() => {
      isRunning.value = false
    })
  }

  const destroy = () => {
    if (!core) return
    core.destroy()
    core = null
    isReady.value = false
    isRunning.value = false
  }

  onMounted(async () => {
    await nextTick()
    init()
  })
  onBeforeUnmount(destroy)

  return {
    targetRef,
    isReady,
    isRunning,
    run,
    init,
    destroy,
  }
}
