<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue'

const container = useTemplateRef('container')
const width = ref(100)
const height = ref(100)

onMounted(() => {
  if (!container.value) return
  // width.value = container.value.clientWidth
  // height.value = container.value.clientHeight
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      width.value = entry.contentRect.width
      height.value = entry.contentRect.height
    }
  })
  ro.observe(container.value)
})

const dashedRect = useTemplateRef<SVGElement>('dashed-rect')
function spin() {
  dashedRect.value?.getAnimations().forEach((anim) => {
    anim.cancel()
    anim.play()
  })
}

defineProps(['color'])
defineExpose({
  spin,
})
</script>

<template>
  <div ref="container" class="absolute top-0 left-0 w-full h-full pointer-events-none">
    <svg class="absolute top-0 left-0 w-full h-full" :viewBox="`0 0 ${width} ${height}`">
      <!-- stroke-primary-500 stroke-secondary-500 -->
      <rect
        x="1"
        y="1"
        :width="Math.max(width - 2, 0)"
        :height="Math.max(height - 2, 0)"
        rx="16"
        ry="16"
        fill="none"
        ref="dashed-rect"
        class="dashed-rect"
        :class="`stroke-${color}-500`"
        stroke-width="2"
        stroke-dasharray="8 6"
        vector-effect="non-scaling-stroke"
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
</style>
