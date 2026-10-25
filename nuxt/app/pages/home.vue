<template>
  <div class="home-container">
    <div v-if="pending" class="state-container">
      <p>Loading flight data...</p>
    </div>

    <div v-else-if="error" class="state-container error">
      <p>Failed to load data. Please try again.</p>
    </div>

    <div v-else class="content-wrapper">
      
      <!-- 1. Header Section -->
      <header class="profile-header">
        <div class="info">
          <p class="greeting">Good morning,</p>
          <h1 class="name">{{ pilot?.name }}</h1>
          <p class="hours text-secondary">Total: <span class="font-bold">{{ pilot?.totalFlightHours }} hrs</span></p>
        </div>
        <img :src="pilot?.avatarUrl" alt="Pilot Avatar" class="avatar" />
      </header>

      <!-- 2. Hours to Limit Section -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Hours to Limit</h2>
          
          <!-- Range Toggles -->
          <div class="range-toggles">
            <button 
              v-for="range in ['1w', '1m', '3m', '6m', '1y']" 
              :key="range"
              class="toggle-btn"
              :class="{ active: selectedRange === range }"
              @click="selectedRange = range"
            >
              {{ range }}
            </button>
          </div>
        </div>
        
        <div class="limits-grid">
          <div class="card limit-card" v-for="(data, key) in summary?.currentLimits" :key="key">
            <p class="limit-label">{{ key }}</p>
            <div class="limit-values">
              <span class="current">{{ data.hours }}</span>
              <span class="max text-secondary">/ {{ data.limit }}</span>
            </div>
            <div class="progress-track">
              <div 
                class="progress-fill" 
                :style="{ width: `${Math.min((data.hours / data.limit) * 100, 100)}%` }"
                :class="{'danger': (data.hours / data.limit) > 0.9}"
              ></div>
            </div>
          </div>
        </div>

        <!-- The Rolling Sum Chart -->
        <div class="card chart-container">
          <RollingSumChart 
            v-if="summary?.chartData" 
            :data="summary.chartData" 
            :config="summary.config" 
          />
        </div>
      </section>

      <!-- 3. My Documents Section -->
      <section class="section">
        <h2 class="section-title">My Documents</h2>
        <div class="documents-list">
          <div class="card doc-card" v-for="doc in processedDocuments" :key="doc.id">
            <span class="doc-label">{{ doc.label }}</span>
            <span 
              class="doc-badge"
              :class="doc.statusClass"
            >
              {{ doc.expiryDate }}
            </span>
          </div>
        </div>
      </section>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import RollingSumChart from '~/components/RollingSumChart.vue'

const selectedRange = ref('1w')

const { data: pilot, pending: p1, error: e1 } = useApi<any>('/pilot/me')
const { data: summary, pending: p2, error: e2 } = useApi<any>('/flight-hours/summary', {
  query: { range: selectedRange }
})
const { data: documents, pending: p3, error: e3 } = useApi<any>('/documents')

const pending = computed(() => p1.value || p2.value || p3.value)
const error = computed(() => e1.value || e2.value || e3.value)

const processedDocuments = computed(() => {
  if (!documents.value) return []
  
  const today = new Date('2026-05-15').getTime()
  
  return documents.value.map((doc: any) => {
    const exp = new Date(doc.expiryDate).getTime()
    const daysRemaining = (exp - today) / (1000 * 60 * 60 * 24)
    
    let statusClass = 'safe'
    if (daysRemaining <= 0) statusClass = 'expired'
    else if (daysRemaining <= 30) statusClass = 'soon'
    
    return { ...doc, statusClass }
  })
})
</script>

<style lang="scss" scoped>
.home-container {
  padding: 24px;
}

.state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: #6B7280;
  
  &.error { color: #E63757; }
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  .greeting { font-size: 14px; color: #6B7280; margin: 0 0 4px 0; }
  .name { font-size: 24px; font-weight: 800; margin: 0 0 4px 0; color: #0E2138; }
  .hours { font-size: 14px; margin: 0; }
  .avatar { width: 56px; height: 56px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 12px rgba(14, 33, 56, 0.1); }
}

.section { margin-bottom: 32px; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #0E2138;
}

.range-toggles {
  display: flex;
  background-color: #E5E7EB;
  border-radius: 6px;
  padding: 2px;
  
  .toggle-btn {
    border: none;
    background: transparent;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    color: #6B7280;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
    
    &.active {
      background-color: white;
      color: #0E2138;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
  }
}

.limits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.limit-card {
  .limit-label { font-size: 13px; font-weight: 600; text-transform: capitalize; margin: 0 0 8px 0; color: #6B7280; }
  .limit-values { margin-bottom: 12px; .current { font-size: 20px; font-weight: 800; } .max { font-size: 14px; font-weight: 500; } }
  .progress-track { height: 6px; background-color: #F5F6F8; border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; background-color: #1FBF8F; border-radius: 3px; transition: width 0.3s ease; &.danger { background-color: #E63757; } }
}

.chart-container {
  padding: 16px;
  margin-top: 16px;
}

.documents-list { display: flex; flex-direction: column; gap: 12px; }

.doc-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  
  .doc-label { font-size: 14px; font-weight: 600; color: #0E2138; }
  .doc-badge {
    font-size: 12px; font-weight: 700; padding: 6px 10px; border-radius: 6px;
    &.safe { background-color: rgba(31, 191, 143, 0.1); color: #1FBF8F; }
    &.soon { background-color: rgba(245, 158, 11, 0.1); color: #F59E0B; }
    &.expired { background-color: rgba(230, 55, 87, 0.1); color: #E63757; }
  }
}
</style>