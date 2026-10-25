<template>
  <div class="placeholder-container">
    <div class="card center-card">
      <div class="icon">🚧</div>
      <h1 class="title">Detail Page Coming Soon</h1>
      <p class="text-secondary">Schedule details for {{ route.params.date }} will be displayed here.</p>
      
      <NuxtLink to="/schedule" class="btn-primary back-btn">
        Back to Calendar
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style lang="scss" scoped>
.placeholder-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 24px;
}

.center-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  width: 100%;
}

.icon {
  font-size: 48px;
}

.title {
  font-size: 20px;
  font-weight: 800;
  color: #0E2138;
  margin: 0;
}

.back-btn {
  margin-top: 16px;
  text-decoration: none;
}
</style>