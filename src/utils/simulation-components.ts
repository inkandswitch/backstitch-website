import { Vector2 } from '@rawify/vector2'
import { easeOutCubic, Entity, remap } from './simulation-engine'

export class Shape extends Entity {
  position: Vector2
  size: number
  type: string

  // for easing
  startPosition = new Vector2(0, 0)
  targetPosition = new Vector2(0, 0)
  time: number = 0
  progress: number = 0

  constructor(position: Vector2, type: string) {
    super()
    this.position = position
    this.type = type
    this.size = 4
  }

  update(delta: number) {
    if (this.progress < this.time) {
      this.progress += delta
      if (this.progress > this.time) this.progress = this.time
      this.position = this.startPosition.lerp(
        this.targetPosition,
        easeOutCubic(this.progress / this.time),
      )
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const scaleX = ctx.getTransform().a
    ctx.lineWidth = 4 / scaleX
    ctx.globalAlpha = this.progress < this.time ? 0.3 : 1

    const progress = this.progress / this.time
    if (progress < 0.2) {
      ctx.globalAlpha = remap(progress, 0, 0.2, 1, 0.3)
    }
    if (progress > 0.8) {
      ctx.globalAlpha = remap(progress, 0.8, 1, 0.3, 1)
    }

    if (this.type == 'circle') {
      ctx.strokeStyle = 'oklch(76.5% 0.177 163.223)'
      ctx.beginPath()
      ctx.arc(this.position.x, this.position.y, this.size / 2, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.stroke()
    } else if (this.type == 'square') {
      ctx.strokeStyle = 'oklch(59.1% 0.293 322.896)'
      const size = this.size * 0.8
      ctx.strokeRect(this.position.x - size / 2, this.position.y - size / 2, size, size)
    } else if (this.type == 'triangle') {
      ctx.strokeStyle = 'oklch(79.5% 0.184 86.047)'
      ctx.beginPath()
      const height = (this.size * Math.sqrt(3)) / 2
      ctx.translate(0, this.size / 8)
      ctx.moveTo(this.position.x - this.size / 2, this.position.y + height / 3)
      ctx.lineTo(this.position.x + this.size / 2, this.position.y + height / 3)
      ctx.lineTo(this.position.x, this.position.y - (2 * height) / 3)
      ctx.closePath()
      ctx.stroke()
    }
  }

  moveTo(position: Vector2, time: number) {
    this.progress = 0
    this.time = time
    this.startPosition = this.position
    this.targetPosition = position
  }
}

export class Axis extends Entity {
  color: string
  constructor(color: string) {
    super()
    this.color = color
  }
  update(_delta: number): void {}
  draw(ctx: CanvasRenderingContext2D): void {
    const scaleX = ctx.getTransform().a
    ctx.lineWidth = 2 / scaleX
    const styles = getComputedStyle(document.documentElement)
    // --color-primary-900, --color-secondary-900
    const color = styles.getPropertyValue(`--color-${this.color}-900`)
    ctx.globalAlpha = 0.4
    ctx.strokeStyle = color

    ctx.beginPath()
    ctx.moveTo(-1000, 4)
    ctx.lineTo(1000, 4)
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(4, -1000)
    ctx.lineTo(4, 1000)
    ctx.closePath()
    ctx.stroke()
  }
}
