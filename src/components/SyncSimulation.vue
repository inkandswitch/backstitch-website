<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import ChangeSimulation from './ChangeSimulation.vue'

const jadzia = useTemplateRef('jadzia')
const nerys = useTemplateRef('nerys')

onMounted(() => {
  jadzia.value?.moveShapes()
})

function jadziaFinished() {
  nerys.value?.syncShapes(jadzia.value!.getShapes())
}

function nerysFinished() {
  jadzia.value?.syncShapes(nerys.value!.getShapes())
}
</script>
<template>
  <div class="flex gap-2 max-w-250 m-auto">
    <ChangeSimulation
      ref="jadzia"
      name="Jadzia"
      color="secondary"
      @finished="jadziaFinished"
    ></ChangeSimulation>
    <ChangeSimulation
      ref="nerys"
      name="Nerys"
      color="primary"
      @finished="nerysFinished"
    ></ChangeSimulation>
  </div>
</template>
