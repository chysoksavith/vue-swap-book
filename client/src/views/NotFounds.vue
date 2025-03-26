<script setup lang="ts">
defineOptions({
  name: "NotFound",
});
</script>

<template>
  <div class="not-found">

    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <router-link to="/">Go Home</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #ff4444;
}

h2 {
  margin: 1rem 0;
}

a {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>
