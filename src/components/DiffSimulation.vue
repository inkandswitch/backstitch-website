<script setup lang="ts">
import { Axis, Shape } from '@/utils/simulation-components'
import { remap, Simulation } from '@/utils/simulation-engine'
import { Vector2 } from '@rawify/vector2'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import ExpandIcon from './icons/ExpandIcon.vue'
import CollapseIcon from './icons/CollapseIcon.vue'
import StitchedBorder from './StitchedBorder.vue'
import BranchIcon from './icons/BranchIcon.vue'

type Rectangle = [number, number, number, number]

class ChangeSimulation extends Simulation {
  shapes: Shape[] = []
  nextHighlight = 0
  time = 0
  waitTime = 0.5
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx, false)

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
  }

  override update(delta: number) {
    this.time += delta
    if (highlighted.value == '' && this.time >= this.waitTime) {
      highlighted.value = highlightOptions[this.nextHighlight] ?? ''
      this.time = 0
      this.nextHighlight++
      this.nextHighlight %= highlightOptions.length
    } else if (this.time > 1.2) {
      highlighted.value = ''
      this.time = 0
    }
  }

  override afterDraw(ctx: CanvasRenderingContext2D) {
    const styles = getComputedStyle(document.documentElement)
    const scaleX = ctx.getTransform().a

    let amount = 0
    if (highlighted.value) {
      amount = remap(this.time, 0, 0.2, 0, 1)
    } else {
      amount = remap(this.time, 0, 0.2, 1, 0)
    }

    function union(rect1: Rectangle, rect2: Rectangle): Rectangle {
      const [x1, y1, w1, h1] = rect1
      const [x2, y2, w2, h2] = rect2

      const left = Math.min(x1, x2)
      const top = Math.min(y1, y2)
      const right = Math.max(x1 + w1, x2 + w2)
      const bottom = Math.max(y1 + h1, y2 + h2)

      return [left, top, right - left, bottom - top]
    }

    let rect: Rectangle | null = null
    const expand = 2
    const previousShape =
      this.nextHighlight == 0 ? highlightOptions.length - 1 : this.nextHighlight - 1
    for (const shape of this.shapes) {
      if (
        shape.type == highlightOptions[previousShape]! ||
        highlightOptions[previousShape]! == 'shapes'
      ) {
        const other: Rectangle = [
          shape.position.x - shape.size / 2 - expand / 2,
          shape.position.y - shape.size / 2 - expand / 2,
          shape.size + expand,
          shape.size + expand,
        ]
        if (rect == null) rect = other
        else rect = union(rect, other)
      }
    }

    ctx.fillStyle = styles.getPropertyValue(`--color-mauve-900`)
    ctx.globalAlpha = 0.6 * amount

    ctx.beginPath()
    ctx.rect(-100, -100, 200, 200)
    ctx.roundRect(...rect!, [0.8])
    ctx.fill('evenodd')

    ctx.globalAlpha = 1 * amount
    ctx.lineWidth = 2 / scaleX
    // --color-primary-500, --color-secondary-500
    ctx.strokeStyle = styles.getPropertyValue(`--color-${props.color}-500`)
    ctx.beginPath()
    ctx.roundRect(...rect!, [0.8])
    ctx.stroke()
  }
}

let simulation: ChangeSimulation | null = null
const highlighted = ref('')
const highlightOptions = ['shapes', 'triangle', 'circle', 'square']
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

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

const props = defineProps(['color'])
</script>

<template>
  <!-- text-primary-500, text-secondary-500 -->
  <div class="relative flex flex-col font-mono p-3" :class="`text-${color}-500`">
    <StitchedBorder :color="color" />
    <div :class="`border-${color}-500`" class="border-b-2 mb-2 pb-2 mx-1 border-dashed">
      <!-- fill-primary-500, fill-secondary-500 -->
      Changes for <BranchIcon :class="`fill-${color}-500`" class="inline-block w-4" />
      <span class="font-semibold ml-2">Add fetch quest</span>
    </div>
    <div class="flex flex-row relative items-stretch">
      <!-- border-primary-500, border-secondary-500 -->
      <div
        class="changeset border-dashed border-r-2 mr-0 pr-4"
        :class="`border-${color}-500`"
        :style="{ '--icon-color': `var(--color-${color}-500)` }"
      >
        <ul>
          <li>
            <CollapseIcon />main.tscn
            <ul>
              <li>
                <span class="highlightable" :class="{ highlighted: highlighted == 'shapes' }">
                  <CollapseIcon />Shapes
                </span>
                <ul>
                  <li>
                    <span class="highlightable" :class="{ highlighted: highlighted == 'triangle' }">
                      <ExpandIcon />Triangle
                    </span>
                  </li>
                  <li>
                    <span class="highlightable" :class="{ highlighted: highlighted == 'circle' }">
                      <CollapseIcon />Circle
                    </span>
                    <ul>
                      <li class="property-grid">
                        <div class="name">Modulate</div>
                        <div class="old">
                          <div class="color"></div>
                        </div>
                        <div class="new">
                          <div class="color"></div>
                        </div>
                      </li>
                      <li class="property-grid">
                        <div class="name">Z Index</div>
                        <div class="old">0</div>
                        <div class="new">1</div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span class="highlightable" :class="{ highlighted: highlighted == 'square' }">
                      <ExpandIcon />Square
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="grow shrink relative">
        <canvas ref="canvas" class="canvas absolute top-0 bottom-0 left-0 right-0"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
li ul li {
  margin-left: 1rem;
}
.property-grid {
  /* display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-areas:
    'name old'
    '. new'; */
  margin-bottom: 1rem;
  margin-left: 2rem;
  display: flex;
  flex-direction: column;
}

.name {
  grid-area: name;
}

.old {
  grid-area: old;
}

.new {
  grid-area: new;
}

.changeset svg {
  fill: var(--icon-color);
  width: 1.5rem;
  display: inline-block;
}

.old,
.new {
  display: flex;
  min-height: 2rem;
  align-items: center;
}

.color {
  border: 2px solid var(--icon-color);
  height: 1rem;
  width: 3rem;
  position: relative;
  padding: 0.2rem;
  border-radius: 8px;
}

.color:after {
  content: '';
  position: absolute;
  left: 0.2rem;
  right: 0.2rem;
  bottom: 0.2rem;
  top: 0.2rem;
  border-radius: 4px;
}

.old .color:after {
  background: oklch(59.1% 0.293 322.896);
}

.new .color:after {
  background: oklch(76.5% 0.177 163.223);
}

.old:before,
.new:before {
  content: '';
  width: 0.25rem;
  margin: 2px 0;
  background: red;
  display: block;
  margin-right: 0.5rem;
  align-self: stretch;
}

.old:before {
  background: oklch(63.7% 0.237 25.331);
}

.new:before {
  background: oklch(72.3% 0.219 149.579);
}

.highlightable {
  padding: 0.2rem 0.4rem 0.2rem 0;
  transition: all 0.2s;
  border-radius: 8px;
}

.highlightable svg {
  transition: all 0.2s;
}

.highlighted {
  background: var(--icon-color);
  color: var(--color-mauve-900);
}

.highlighted svg {
  fill: var(--color-mauve-900);
}
</style>
