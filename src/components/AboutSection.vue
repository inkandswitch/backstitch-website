<script setup lang="ts">
import DiffSimulation from './DiffSimulation.vue'
import HistorySimulation from './HistorySimulation.vue'
</script>

<template>
  <section class="text-content flex gap-8 mt-8">
    <div class="flex flex-col justify-around">
      <div>
        <h3>Sync in Real-Time</h3>
        <p>
          When you save a scene or resource, your changes are immediately pushed to everyone else.
        </p>
      </div>
      <HistorySimulation class="w-full block sm:hidden my-8" />
      <div>
        <h3>Branch. Merge. Revert.</h3>
        <p>
          Create branches for features, or for teams. When you merge, conflicts are automatically
          handled by <a href="https://automerge.org/" target="_blank" rel="nofollow">Automerge</a>.
        </p>
      </div>
      <DiffSimulation class="w-full block sm:hidden my-8" color="primary" />
      <div>
        <h3>Inspect Any Change</h3>
        <p>
          Find out exactly what changed, where. Highlight any changed node in your scene, and see
          the edited properties.
        </p>
      </div>
    </div>
    <div class="basis-200 flex-col gap-8 hidden sm:flex">
      <HistorySimulation class="w-full" />
      <DiffSimulation class="w-full" color="primary" />
    </div>
  </section>
  <section class="text-content">
    <h2>Using Backstitch</h2>
    <p>
      Backstitch syncs with a remote server, storing your data on the cloud. For alpha testing, we
      provide a public sync server that anyone can access. Or, for additional security, you can
      easily host your own.
    </p>
    <p>
      Backstitch works with Git, or other version control systems. Take advantage of Backstitch's
      easy real-time sync for daily work. Then, for larger changes, commit and push with Git.
    </p>
  </section>
</template>

<style scoped></style>
