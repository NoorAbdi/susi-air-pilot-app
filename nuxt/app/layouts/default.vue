<template>
  <div class="layout-wrapper">
    <main class="main-content">
      <slot />
    </main>

    <nav class="bottom-nav">
      <!-- R-26: Functional routing. Non-existent pages explicitly use `#` and will be marked TODO if tapped -->
      <NuxtLink to="/home" class="nav-item" active-class="active">
        <span class="icon">🏠</span>
        <span class="label">Home</span>
      </NuxtLink>
      <NuxtLink to="/schedule" class="nav-item" active-class="active">
        <span class="icon">📅</span>
        <span class="label">Schedule</span>
      </NuxtLink>
      <a href="#" class="nav-item">
        <span class="icon">📓</span>
        <span class="label">Logbook</span>
      </a>
      <a href="#" class="nav-item">
        <span class="icon">☰</span>
        <span class="label">More</span>
      </a>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-bottom: 70px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  border-top: 1px solid #E5E7EB;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #6B7280;
  gap: 4px;
  
  .icon {
    font-size: 20px;
  }
  
  .label {
    font-size: 11px;
    font-weight: 600;
  }
  
  &.active {
    color: #0E2138;
  }
}
</style>