<template>
  <div class="schedule-container">
    <!-- Header with Prev/Next Controls -->
    <header class="calendar-header">
      <button @click="changeMonth(-1)" class="control-btn" aria-label="Previous Month">❮</button>
      <h1 class="month-title">{{ currentMonthName }} {{ currentYear }}</h1>
      <button @click="changeMonth(1)" class="control-btn" aria-label="Next Month">❯</button>
    </header>

    <!-- State: Loading/Error -->
    <div v-if="pending" class="state-container">
      <p>Loading schedule...</p>
    </div>
    <div v-else-if="error" class="state-container error">
      <p>Failed to load schedule.</p>
    </div>

    <!-- Calendar Grid -->
    <div v-else class="calendar-wrapper">
      <div class="weekdays">
        <span v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">
          {{ day }}
        </span>
      </div>

      <div class="calendar-grid">
        <!-- Blank padding days -->
        <div v-for="blank in paddingDays" :key="'blank-' + blank" class="grid-cell empty"></div>
        
        <!-- Actual Days -->
        <NuxtLink 
          v-for="day in daysInMonth" 
          :key="day.dateStr"
          :to="`/schedule/${day.dateStr}`"
          class="grid-cell day-cell"
          :class="{ 'has-duty': day.schedule }"
          :style="{ backgroundColor: day.schedule ? day.schedule.base_color + '20' : 'transparent', borderColor: day.schedule ? day.schedule.base_color : '#E5E7EB' }"
        >
          <span class="date-num">{{ day.dateNum }}</span>
          
          <!-- Duty Info -->
          <div v-if="day.schedule" class="duty-info">
            <span class="base-name" :style="{ color: day.schedule.base_color }">
              {{ day.schedule.base_name }}
            </span>
            
            <!-- Status Badge: Tick if complete, otherwise remaining duties -->
            <div 
              class="status-badge" 
              :style="{ backgroundColor: day.schedule.base_color }"
            >
              <span v-if="day.schedule.count_logbooks === day.schedule.count_schedules">✓</span>
              <span v-else>{{ day.schedule.count_schedules - day.schedule.count_logbooks }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Legend -->
      <section class="legend-section">
        <h2 class="legend-title">Duty Types</h2>
        <div class="legend-grid">
          <div v-for="item in apiData?.legend" :key="item.code" class="legend-item">
            <span class="color-dot" :style="{ backgroundColor: item.color }"></span>
            <span class="legend-label">{{ item.label }} ({{ item.code }})</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'

const currentYear = ref(2026)
const currentMonth = ref(5)

const currentMonthName = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value - 1, 1)
  return d.toLocaleString('default', { month: 'long' })
})

const { data: apiData, pending, error } = useApi<any>('/schedules', {
  query: { year: currentYear, month: currentMonth }
})

const changeMonth = (delta: number) => {
  let newMonth = currentMonth.value + delta
  let newYear = currentYear.value
  
  if (newMonth > 12) {
    newMonth = 1
    newYear++
  } else if (newMonth < 1) {
    newMonth = 12
    newYear--
  }
  
  currentMonth.value = newMonth
  currentYear.value = newYear
}

const paddingDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1)
  return firstDay.getDay()
})

const daysInMonth = computed(() => {
  const days = new Date(currentYear.value, currentMonth.value, 0).getDate()
  const daysArray = []
  
  const schedulesMap = new Map()
  if (apiData.value?.schedules) {
    for (const s of apiData.value.schedules) {
      schedulesMap.set(s.duty_date, s)
    }
  }

  for (let i = 1; i <= days; i++) {
    const monthStr = currentMonth.value.toString().padStart(2, '0')
    const dayStr = i.toString().padStart(2, '0')
    const fullDate = `${currentYear.value}-${monthStr}-${dayStr}`
    
    daysArray.push({
      dateNum: i,
      dateStr: fullDate,
      schedule: schedulesMap.get(fullDate) || null
    })
  }
  
  return daysArray
})
</script>

<style lang="scss" scoped>
.schedule-container {
  padding: 24px 16px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .month-title {
    font-size: 20px;
    font-weight: 800;
    color: #0E2138;
    margin: 0;
  }
  
  .control-btn {
    background: #F5F6F8;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    font-weight: bold;
    color: #0E2138;
    cursor: pointer;
    
    &:hover { background: #E5E7EB; }
  }
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 8px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 32px;
}

.grid-cell {
  aspect-ratio: 1;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  background-color: white;
  padding: 4px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  color: inherit;
  
  &.empty {
    background-color: transparent;
    border-color: transparent;
  }
  
  .date-num {
    font-size: 13px;
    font-weight: 600;
  }
}

.duty-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2px;
  
  .base-name {
    font-size: 10px;
    font-weight: 800;
  }
  
  .status-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    color: white;
    font-size: 10px;
    font-weight: bold;
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 2px solid white;
  }
}

.state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
  color: #6B7280;
  &.error { color: #E63757; }
}

.legend-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #E5E7EB;
}

.legend-title {
  font-size: 14px;
  font-weight: 700;
  color: #0E2138;
  margin: 0 0 12px 0;
}

.legend-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .legend-label {
    font-size: 12px;
    font-weight: 500;
    color: #6B7280;
  }
}
</style>