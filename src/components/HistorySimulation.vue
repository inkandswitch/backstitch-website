<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import MergeIcon from './icons/MergeIcon.vue'
import RevertIcon from './icons/RevertIcon.vue'
import BranchIcon from './icons/BranchIcon.vue'
import StitchedBorder from './StitchedBorder.vue'
abstract class Change {
  name: string
  icon = 'none'
  index: number
  constructor(index: number, name: string) {
    this.name = name
    this.index = index
  }
  abstract message(): string
}

class MergeChange extends Change {
  branch: string
  constructor(index: number, name: string, branch: string) {
    super(index, name)
    this.branch = branch
    this.icon = 'merge'
  }
  message() {
    return `${this.name} merged "${this.branch}"`
  }
}

class RevertChange extends Change {
  ref: string
  constructor(index: number, name: string, ref: string) {
    super(index, name)
    this.ref = ref
    this.icon = 'revert'
  }
  message() {
    return `${this.name} reverted to ${this.ref}`
  }
}

class FileChange extends Change {
  operation: string
  file: string
  constructor(index: number, name: string, operation: string, file: string) {
    super(index, name)
    this.operation = operation
    this.file = file
  }
  message() {
    return `${this.name} ${this.operation} ${this.file}`
  }
}

function randFromArray<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

function generateName() {
  return randFromArray(['Jadzia', 'Nerys', 'Benjamin'])!
}

function generateBranch() {
  return randFromArray([
    'Add more levels',
    'Fix player sprite',
    'Rebalance mechanics',
    'Stomp bugs',
    'Reticulate splines',
  ])!
}

function generateFile() {
  return randFromArray([
    'main.tscn',
    'splash_screen.tscn',
    'abilities.tres',
    'grass_tex.png',
    'coconut.mp3',
    'player_controller.gd',
  ])!
}

function generateOperation() {
  return randFromArray(['created', 'edited', 'deleted'])!
}

function generateRef() {
  return Math.floor(Math.random() * 0x100000)
    .toString(16)
    .padStart(5, '0')
}

let num = 0
function generateChange() {
  const r = Math.random()
  const index = num++

  if (r < 0.2) {
    return new RevertChange(index, generateName(), generateRef())
  } else if (r < 0.4) {
    return new MergeChange(index, generateName(), generateBranch())
  } else {
    return new FileChange(index, generateName(), generateOperation(), generateFile())
  }
}

const items: Ref<Change[]> = ref([])
let interval: null | number = null
onMounted(() => {
  interval = window.setInterval(() => {
    items.value.unshift(generateChange())
    items.value = items.value.slice(0, 10)
  }, 1500)
})
onUnmounted(() => {
  if (interval != null) window.clearInterval(interval)
})
</script>

<template>
  <div class="relative p-3 h-58 font-mono text-secondary-500 flex flex-col">
    <p class="font-semibold">
      <BranchIcon class="w-4 h-4 inline-block fill-secondary-500 mr-2" />main
    </p>
    <div class="w-full border-b-2 mb-2 border-dashed border-secondary-500"></div>
    <div class="pl-4 h-full overflow-hidden relative">
      <TransitionGroup name="list" tag="ul" class="absolute top-0 left-0 w-full h-full">
        <li v-for="item in items" :key="item.index">
          <MergeIcon class="w-4 h-4 inline-block fill-secondary-500" v-if="item.icon == 'merge'" />
          <RevertIcon
            class="w-4 h-4 inline-block fill-secondary-500"
            v-if="item.icon == 'revert'"
          />

          {{ item.message() }}
        </li>
      </TransitionGroup>
    </div>
    <StitchedBorder color="secondary" />
  </div>
</template>

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  display: none;
}
</style>
