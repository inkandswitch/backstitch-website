<script setup lang="ts">
import SyncSimulation from './SyncSimulation.vue'
</script>

<template>
  <section class="text-content">
    <h1 class="mb-8">Real-Time Version Control for Godot</h1>
    <h2 class="text-center text-pretty mb-8">
      Backstitch provides fast collaboration for dev teams, game jams, and classrooms.
    </h2>
    <p class="mb-5 bg-mauve-900">
      <SyncSimulation />
    </p>
    <div class="flex justify-center gap-5 sm:gap-20 flex-col sm:flex-row items-center text-xl">
      <RouterLink class="button" to="/getting-started">Try the alpha!</RouterLink>
      <a
        class="button-secondary"
        href="https://github.com/inkandswitch/patchwork-godot-plugin/"
        target="_blank"
        rel="nofollow"
        >Visit on GitHub</a
      >
    </div>
  </section>
</template>

<style scoped></style>
