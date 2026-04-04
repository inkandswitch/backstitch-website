import Vector2 from '@rawify/vector2'

export abstract class Entity {
  abstract update(delta: number): void
  abstract draw(ctx: CanvasRenderingContext2D): void
}

export abstract class Simulation {
  world: Entity[]
  lastTime: number | null
  animationId: number
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  fitHeight: boolean

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, fitHeight: boolean) {
    this.world = []
    this.lastTime = null
    this.animationId = -1
    this.canvas = canvas
    this.ctx = ctx
    this.animate = this.animate.bind(this)
    this.resizeCanvas = this.resizeCanvas.bind(this)
    this.fitHeight = fitHeight
  }

  private animate(now: number) {
    this.animationId = requestAnimationFrame(this.animate)
    if (!this.canvas || !this.ctx) return

    if (this.lastTime == null) {
      this.lastTime = now
      return
    }

    const delta = (now - this.lastTime) / 1000
    this.lastTime = now

    this.update(delta)

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.save()

    // we setup our coordinate space here.
    // origin is at 0, 0. Units are based responsively on the canvas height or width.
    // the whole canvas is arbitrarily 25 units high/wide.
    const scale = (this.fitHeight ? this.ctx.canvas.height : this.ctx.canvas.width) / 25
    this.ctx.setTransform(
      scale, // scale X
      0,
      0,
      scale, // scale Y
      this.ctx.canvas.width / 2, // translate X to center
      this.ctx.canvas.height / 2, // translate Y to center
    )

    // allow the simulation to set global properties
    this.draw(this.ctx)

    for (const e of this.world) {
      e.update(delta)
      this.ctx.save()

      e.draw(this.ctx)
      this.ctx.restore()
    }

    this.afterDraw(this.ctx)
    this.ctx.restore()
  }

  start() {
    window.addEventListener('resize', this.resizeCanvas)

    console.log('start')
    this.animationId = requestAnimationFrame(this.animate)
    this.resizeCanvas()
  }

  protected update(_delta: number): void {}
  protected draw(_ctx: CanvasRenderingContext2D): void {}
  protected afterDraw(_ctx: CanvasRenderingContext2D): void {}

  stop() {
    window.removeEventListener('resize', this.resizeCanvas)
    cancelAnimationFrame(this.animationId)
  }

  private resizeCanvas() {
    const container = this.ctx.canvas.parentElement
    if (container == null) return
    this.canvas.width = container.clientWidth
    this.canvas.height = container.clientHeight
  }
}

export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3)
}

export function randomDir(): Vector2 {
  const angle = Math.random() * 2 * Math.PI
  return new Vector2(Math.cos(angle), Math.sin(angle))
}

export function remap(value: number, low1: number, high1: number, low2: number, high2: number) {
  if (high1 === low1) {
    return low2
  }

  const t = (value - low1) / (high1 - low1)

  // Clamp between 0 and 1
  const clampedT = Math.min(1, Math.max(0, t))

  return low2 + (high2 - low2) * clampedT
}
