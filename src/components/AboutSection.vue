<script setup lang="ts"></script>

<template>
  <section class="text-content">
    <h2>How It Works</h2>
    <div class="flex flex-col sm:flex-row gap-5">
      <img class="order-first" src="https://placekittens.com/300/200" />
      <p>
        Patchwork works alongside existing version control systems like Git. It acts as a layer
        <em>on top</em> of your existing version control system, providing real-time functionality.
      </p>
    </div>
    <div class="flex flex-col sm:flex-row gap-5">
      <img class="order-last" src="https://placekittens.com/200/200" />
      <p>
        When a user saves a scene or edits a file, that change is immediately synced with the rest
        of your team. Conflicting changes are automatically handled with
        <a href="https://automerge.org/" target="_blank" rel="nofollow">Automerge</a>. Scenes are
        parsed and resolved on-the-fly: a scene can never break due to a merge conflict!
      </p>
    </div>
    <div class="flex flex-col sm:flex-row gap-5">
      <img src="https://placekittens.com/200/250" />
      <p>
        Conflicting changes are automatically handled with
        <a href="https://automerge.org/" target="_blank" rel="nofollow">Automerge</a>. Scenes are
        parsed and resolved on-the-fly: a scene can never break due to a merge conflict!
      </p>
    </div>
    <p>
      Patchwork syncs with a remote server, storing your data on the cloud. You can host your own
      server easily! For alpha testing, we provide a public sync server that anyone can access.
    </p>
  </section>
</template>

<style scoped></style>
