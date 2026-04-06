<script setup lang="ts">
import DiffSimulation from './DiffSimulation.vue'
import HistorySimulation from './HistorySimulation.vue'
import GodotIcon from './icons/GodotIcon.vue'
import RocketIcon from './icons/RocketIcon.vue'
import ServerIcon from './icons/ServerIcon.vue'
import GitIcon from './icons/GitIcon.vue'
</script>

<template>
  <section class="flex gap-8 my-8 content-box">
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
  <div class="bg-[rgba(0,0,0,0.2)] pb-16 pt-16 mt-16">
    <section class="content-box">
      <h2 class="mb-8 text-left">Using Backstitch</h2>
      <div class="use-grid sm:grid">
        <ServerIcon class="fill-secondary-500" />
        <p>
          <strong>Host, or Join</strong>: Backstitch syncs with a remote server, storing your data
          on the cloud. For alpha testing, we provide a public sync server that anyone can access.
          Or, for additional security, you can easily host your own.
        </p>
        <GitIcon class="fill-secondary-500" />
        <p>
          <strong>Git Compatibility</strong>: Our plugin works with Git, or other version control
          systems. Take advantage of Backstitch's easy real-time sync for daily collaboration. Then,
          for larger changes, commit and push with Git.
        </p>
        <RocketIcon class="fill-secondary-500" />
        <p>
          <strong>Launcher</strong>: For the alpha, simply add our
          <RouterLink to="/docs">launcher</RouterLink> into your testing project, and run it. It
          will download everything you need!
        </p>
        <GodotIcon color="fill-secondary-500" class="p-1" />
        <p>
          <strong>Engine</strong>: We currently rely on a custom development build of Godot. In the
          near future, we'll be available in the Asset Library!
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.use-grid {
  display: grid;
  grid-template-columns: 4rem 1fr;
  column-gap: 1rem;
  row-gap: 2rem;
}

.use-grid svg {
  max-width: 4rem;
  margin: 0 auto;
  display: block;
}
@media (width >= 40rem /* 640px */) {
  .use-grid {
    grid-template-columns: 4rem 1fr 4rem 1fr;
  }
}
</style>
