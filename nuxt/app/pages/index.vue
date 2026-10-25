<template>
  <div class="login-container">
    <div class="logo-wrapper">
      <!-- Live Susi Air Logo Asset -->
      <img 
        src="/susi-air-logo.png" 
        alt="Susi Air Logo" 
        class="brand-logo"
      />
      <p class="subtitle">Pilot Portal</p>
    </div>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="input-group">
        <label for="username">Username</label>
        <input 
          id="username" 
          v-model="username" 
          type="text" 
          required 
          placeholder="e.g. budiluhur"
          :disabled="isLoading"
        />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input 
          id="password" 
          v-model="password" 
          type="password" 
          required 
          placeholder="Enter password"
          :disabled="isLoading"
        />
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <button type="submit" class="btn-primary" :disabled="isLoading || !username || !password">
        {{ isLoading ? 'Signing In...' : 'Sign In' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  const result = await authStore.login(username.value, password.value)
  
  if (result.success) {
    router.push('/home')
  } else {
    errorMessage.value = result.message
  }
  
  isLoading.value = false
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px;
  min-height: 100vh;
  background-color: white;
}

.logo-wrapper {
  text-align: center;
  margin-bottom: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .brand-logo {
    height: 48px;
    object-fit: contain;
    margin-bottom: 12px;
  }
  
  .subtitle {
    color: #6B7280;
    margin: 0;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-size: 14px;
    font-weight: 600;
    color: #0E2138;
  }
  
  input {
    padding: 14px 16px;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-size: 16px;
    font-family: inherit;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: #0E2138;
    }
    
    &:disabled {
      background-color: #F5F6F8;
      cursor: not-allowed;
    }
  }
}

.error-message {
  color: #E63757;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  padding: 8px;
  background-color: rgba(230, 55, 87, 0.1);
  border-radius: 8px;
}
</style>