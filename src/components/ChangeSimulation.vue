<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'
import Vector2 from '@rawify/vector2'
import { path } from 'ghost-cursor'
import type { TimedVector, Vector } from 'ghost-cursor/lib/math'
import GodotIcon from './icons/GodotIcon.vue'
import colors from 'tailwindcss/colors'

function moveTowards(delta: number, speed: number, position: Vector2, target: Vector2): Vector2 {
  const d = target.sub(position)

  const distance = target.distance(position)

  // If already at target or will overshoot, snap to target
  const maxStep = speed * delta
  if (distance <= maxStep || distance === 0) {
    return target
  }

  const t = maxStep / distance
  return position.add(d.scale(t))
}

abstract class InteractorTask {
  finished: boolean
  constructor() {
    this.finished = false
  }
  init(_interactor: Interactor) {}
  abstract update(delta: number, interactor: Interactor): void
  protected finish() {
    this.finished = true
  }
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3)
}

function randomDir(): Vector2 {
  const angle = Math.random() * 2 * Math.PI
  return new Vector2(Math.cos(angle), Math.sin(angle))
}

function remap(value: number, low1: number, high1: number, low2: number, high2: number) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
}

class VisitTask extends InteractorTask {
  target: () => Vector2
  startPosition = new Vector2(0, 0)
  time = 0
  progress = 0

  constructor(target: () => Vector2) {
    super()
    this.target = target
  }
  override init(interactor: Interactor) {
    this.startPosition = interactor.position
    const dist = this.target().distance(this.startPosition)
    this.time = Math.min((dist / 10) * 0.4 + 0.6 * 0.6, 2)
  }
  update(delta: number, interactor: Interactor) {
    this.progress += delta

    if (this.progress >= this.time) {
      this.finish()
      return
    }

    interactor.position = this.startPosition.lerp(
      this.target(),
      easeInOutCubic(this.progress / this.time),
    )
  }
}

class DropTask extends VisitTask {
  shape: Shape
  constructor(shape: Shape, target: () => Vector2) {
    super(target)
    this.shape = shape
  }
  override update(delta: number, interactor: Interactor) {
    super.update(delta, interactor)
    this.shape.position = interactor.position
  }
}

class WaitTask extends InteractorTask {
  time: number
  constructor(time: number) {
    super()
    this.time = time
  }
  update(delta: number, _interactor: Interactor): void {
    this.time -= delta
    if (this.time <= 0) {
      this.finish()
    }
  }
}

abstract class Entity {
  abstract update(delta: number): void
  abstract draw(ctx: CanvasRenderingContext2D): void
}

class Interactor extends Entity {
  position: Vector2
  speed: number
  taskQueue: InteractorTask[]
  currentTask: InteractorTask | null = null

  constructor() {
    super()
    this.position = new Vector2(0, 0)
    this.speed = 5
    this.taskQueue = []
  }

  pushTask(task: InteractorTask) {
    this.taskQueue.push(task)
  }

  update(delta: number) {
    if (!this.currentTask) {
      this.currentTask = this.taskQueue.shift() ?? null
      if (!this.currentTask) return
      this.currentTask.init(this)
    }
    this.currentTask.update(delta, this)
    if (this.currentTask.finished) {
      this.currentTask = null
      // yucky hack -- the last task is always just a cursor reset, which we doesn't affect finished state
      if (this.taskQueue.length == 1) {
        saveIcon.value?.getAnimations().forEach((anim) => {
          anim.cancel()
          anim.play()
        })

        window.setTimeout(() => emit('finished'), 500)
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.position.x, this.position.y)
    const dpr = window.devicePixelRatio || 1
    const factor = (0.05 * 16) / (ctx.canvas.width / dpr)
    ctx.scale(factor, factor)
    const styles = getComputedStyle(document.documentElement)
    const color = styles.getPropertyValue(`--color-${props.color}-500`)
    ctx.fillStyle = color
    const cursor = new Path2D(
      'm 80 470 l 79 -110 h 170 L 80 164 v 306 Z M 311 800 L 166 488 L 0 720 v -720 l 560 440 H 276 l 144 309 l -109 51 Z M 159 360 Z',
    )
    ctx.fill(cursor)
  }
}

class Shape extends Entity {
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
    const dpr = window.devicePixelRatio || 1
    const factor = 16 / (ctx.canvas.width / dpr)
    ctx.lineWidth = 4 * factor
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

abstract class Simulation {
  world: Entity[]
  lastTime: number | null
  animationId: number
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.world = []
    this.lastTime = null
    this.animationId = -1
    this.canvas = canvas
    this.ctx = ctx
    this.animate = this.animate.bind(this)
    this.resizeCanvas = this.resizeCanvas.bind(this)
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

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.update(delta)

    for (const e of this.world) {
      e.update(delta)
      this.ctx.save()

      // we setup our coordinate space here.
      // origin is at 0, 0. Units are based responsively on the canvas height.
      // the whole canvas is arbitrarily 25 units high.
      const scale = this.ctx.canvas.height / 25
      this.ctx.setTransform(
        scale,
        0, // scale X
        0,
        scale, // scale Y
        this.ctx.canvas.width / 2, // translate X to center
        this.ctx.canvas.height / 2, // translate Y to center
      )

      e.draw(this.ctx)
      this.ctx.restore()
    }
  }

  start() {
    window.addEventListener('resize', this.resizeCanvas)

    console.log('start')
    this.animationId = requestAnimationFrame(this.animate)
    this.resizeCanvas()
  }

  protected update(_delta: number): void {}

  stop() {
    window.removeEventListener('resize', this.resizeCanvas)
    cancelAnimationFrame(this.animationId)
  }

  private resizeCanvas() {
    const dpr = window.devicePixelRatio || 1
    const container = this.ctx.canvas.parentElement
    if (container == null) return
    this.canvas.width = container.clientWidth * dpr
    this.canvas.height = container.clientHeight * dpr
  }
}

class Axis extends Entity {
  update(_delta: number): void {}
  draw(ctx: CanvasRenderingContext2D): void {
    const dpr = window.devicePixelRatio || 1
    const factor = 16 / (ctx.canvas.width / dpr)
    ctx.lineWidth = 2 * factor
    ctx.strokeStyle = '#2d272e'

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

class ChangeSimulation extends Simulation {
  shapes: Shape[] = []
  interactor: Interactor
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx)

    this.interactor = new Interactor()
    this.shapes.push(
      new Shape(new Vector2(Math.sin(Math.PI / 4), Math.cos(Math.PI / 4)).scale(7), 'circle'),
      new Shape(
        new Vector2(Math.sin((Math.PI / 4) * 3), Math.cos((Math.PI / 4) * 3)).scale(7),
        'triangle',
      ),
      new Shape(
        new Vector2(Math.sin((Math.PI / 4) * 6), Math.cos((Math.PI / 4) * 6)).scale(7),
        'square',
      ),
    )

    this.world.push(new Axis())
    this.world.push(...this.shapes)
    this.world.push(this.interactor)
  }

  moveShapes() {
    console.log('Dispatching..')
    // grab and move 2 shapes
    const shape1idx = Math.floor(Math.random() * this.shapes.length)
    const shape1 = this.shapes[shape1idx]

    let shape2idx
    do {
      shape2idx = Math.floor(Math.random() * this.shapes.length)
    } while (shape2idx === shape1idx)

    const shape2 = this.shapes[shape2idx]

    if (shape1 == undefined || shape2 == undefined) return
    this.interactor.pushTask(new VisitTask(() => shape1.position))
    const dropLocation1 = randomDir().scale(7)
    this.interactor.pushTask(new DropTask(shape1, () => dropLocation1))
    this.interactor.pushTask(new VisitTask(() => shape2.position))
    const dropLocation2 = randomDir().scale(7)
    this.interactor.pushTask(new DropTask(shape2, () => dropLocation2))
    this.interactor.pushTask(new VisitTask(() => new Vector2(0, 0)))
  }

  syncShapes(data: ShapeData) {
    this.shapes[0]?.moveTo(data.circle, 0.4)
    this.shapes[1]?.moveTo(data.triangle, 0.4)
    this.shapes[2]?.moveTo(data.square, 0.4)
  }

  getShapes(): ShapeData {
    return {
      circle: this.shapes[0]?.position ?? new Vector2(0, 0),
      triangle: this.shapes[1]?.position ?? new Vector2(0, 0),
      square: this.shapes[2]?.position ?? new Vector2(0, 0),
    }
  }
}

let simulation: ChangeSimulation | null = null
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const dashedRect = useTemplateRef<SVGElement>('dashed-rect')
const saveIcon = useTemplateRef<SVGElement>('save-icon')

onMounted(() => {
  if (!canvas.value) {
    console.error("Couldn't get canvas ref")
    return
  }
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  simulation = new ChangeSimulation(canvas.value, ctx)
  simulation.start()
})

onUnmounted(() => {
  simulation?.stop()
})

const props = defineProps(['name', 'color'])

type ShapeData = {
  triangle: Vector2
  circle: Vector2
  square: Vector2
}

const emit = defineEmits(['finished'])
defineExpose({
  moveShapes: () => {
    simulation?.moveShapes()
  },
  syncShapes: (data: ShapeData) => {
    dashedRect.value?.getAnimations().forEach((anim) => {
      anim.cancel()
      anim.play()
    })
    window.setTimeout(() => {
      simulation?.syncShapes(data)
    }, 300)

    window.setTimeout(() => {
      simulation?.moveShapes()
    }, 600)
  },
  getShapes: (): ShapeData => {
    return (
      simulation?.getShapes() ?? {
        triangle: new Vector2(0, 0),
        circle: new Vector2(0, 0),
        square: new Vector2(0, 0),
      }
    )
  },
})
</script>

<template>
  <!-- text-primary-500 text-secondary-500 -->
  <div :class="`text-${color}-500`" class="p-2 w-full font-mono relative">
    <div class="mx-2 my-2 text-lg flex gap-2 items-center">
      <!-- fill-primary-500 fill-secondary-500 -->
      <GodotIcon :color="`fill-${color}-500`" width="24" height="24" />
      {{ name }}
    </div>
    <!-- border-primary-500 border-secondary-500 -->
    <div :class="`border-${color}-500`" class="border-b-2 border-dashed mx-2"></div>
    <div class="w-full aspect-square">
      <canvas ref="canvas" class="canvas w-full h-full"></canvas>
    </div>
    <div
      class="absolute w-[70%] h-[70%] max-w-30 max-h-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        ref="save-icon"
        class="save-icon w-full h-full"
        viewBox="0 0 448 512"
      >
        <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
        <!-- fill-primary-600 fill-secondary-600 -->
        <path
          :class="`fill-${color}-600`"
          d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm32 96c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
        />
      </svg>
    </div>
    <svg
      class="w-full h-full top-0 left-0 absolute"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      ref="svg"
    >
      <!-- stroke-primary-500 stroke-secondary-500 -->
      <rect
        x="1"
        y="1"
        rx="4"
        ry="4"
        width="98"
        height="98"
        fill="none"
        class="dashed-rect"
        :class="`stroke-${color}-500`"
        stroke-width="2"
        stroke-dasharray="8 6"
        vector-effect="non-scaling-stroke"
        ref="dashed-rect"
      />
    </svg>
  </div>
</template>

<style scoped>
.dashed-rect {
  stroke-dashoffset: 0;
  animation: dashMove 1s ease-in-out forwards;
  animation-play-state: paused;
}

@keyframes dashMove {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 70;
  }
}

.save-icon {
  animation: appear 1s ease-in-out forwards;
  animation-play-state: paused;
}

@keyframes appear {
  from {
    opacity: 0;
    transform: none;
  }
  60% {
    opacity: 1;
    /* transform: scale(1.3); */
  }
  to {
    opacity: 0;
  }
}
</style>
