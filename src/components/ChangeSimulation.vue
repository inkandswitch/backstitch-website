<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import Vector2 from '@rawify/vector2'
import GodotIcon from './icons/GodotIcon.vue'
import StitchedBorder from './StitchedBorder.vue'
import { easeInOutCubic, Entity, randomDir, Simulation } from '@/utils/simulation-engine'
import { Axis, Shape } from '@/utils/simulation-components'

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
    const factor = (0.05 * 16) / ctx.canvas.width
    ctx.scale(factor, factor)
    const styles = getComputedStyle(document.documentElement)
    const color = styles.getPropertyValue(`--color-${props.color}-500`)
    ctx.fillStyle = color
    const cursor = new Path2D(
      'M 311 800 L 166 488 L 0 720 v -720 l 560 440 H 276 l 144 309 l -109 51 Z',
    )
    ctx.fill(cursor)
  }
}

class ChangeSimulation extends Simulation {
  shapes: Shape[] = []
  interactor: Interactor
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx, true)

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

    this.world.push(new Axis(props.color))
    this.world.push(...this.shapes)
    this.world.push(this.interactor)
  }

  moveShapes() {
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
const border = useTemplateRef('border')
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
    border.value?.spin()
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
  <div :class="`text-${color}-500`" class="w-full font-mono relative flex flex-col">
    <div class="mx-3 mt-3 mb-2 text-lg flex gap-2 items-center">
      <!-- fill-primary-500 fill-secondary-500 -->
      <GodotIcon :color="`fill-${color}-500`" width="24" height="24" />
      {{ name }}
    </div>
    <!-- border-primary-500 border-secondary-500 -->
    <div :class="`border-${color}-500`" class="border-b-2 border-dashed mx-2"></div>
    <div class="w-full relative grow aspect-square max-h-[calc(40vh+4rem)] shrink">
      <canvas ref="canvas" class="canvas absolute top-0 left-0 right-0 bottom-0"></canvas>
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
    </div>

    <StitchedBorder ref="border" :color="color" />
  </div>
</template>

<style scoped>
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
