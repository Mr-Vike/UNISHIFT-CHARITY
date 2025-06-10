<template>
  <section class="landing-section">
    <div class="container">
      <div class="landing-content">
        <div class="left-content fade-in" ref="leftContent">
          <div class="logo-section">
            <div class="logo">
              <div class="logo-icon">
                <Heart :size="48" color="#FF6B35" />
              </div>
              <h1 class="logo-text">UniSHIFT</h1>
            </div>
            <p class="slogan">Serving Hope In Food Together</p>
          </div>
          
          <div class="statistics">
            <div class="stat-item">
              <div class="stat-number" ref="moneyRaised">$0</div>
              <div class="stat-label">Money Raised</div>
            </div>
            <div class="stat-item">
              <div class="stat-number" ref="contributors">0</div>
              <div class="stat-label">Contributors</div>
            </div>
          </div>
        </div>
        
        <div class="right-content fade-in" ref="rightContent">
          <div class="hero-image-container">
            <img 
              src="https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="People helping with food distribution"
              class="hero-image floating"
            />
          </div>
        </div>
      </div>
      
      <div class="donation-button-container fade-in" ref="donationButton">
        <a href="#" class="btn-primary donation-btn">
          <Heart :size="20" style="margin-right: 8px;" />
          Donate Now
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Heart } from 'lucide-vue-next'
import { useIntersectionObserver } from '@vueuse/core'

const leftContent = ref()
const rightContent = ref()
const donationButton = ref()
const moneyRaised = ref()
const contributors = ref()

const animateNumber = (element: HTMLElement, target: number, duration: number = 2000) => {
  let start = 0
  const increment = target / (duration / 16)
  
  const timer = setInterval(() => {
    start += increment
    if (start >= target) {
      element.textContent = target.toLocaleString()
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(start).toLocaleString()
    }
  }, 16)
}

useIntersectionObserver(leftContent, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    leftContent.value.classList.add('visible')
    setTimeout(() => {
      if (moneyRaised.value && contributors.value) {
        moneyRaised.value.textContent = '$'
        contributors.value.textContent = ''
        setTimeout(() => {
          animateNumber(moneyRaised.value, 125000)
          animateNumber(contributors.value, 847)
        }, 500)
      }
    }, 800)
  }
})

useIntersectionObserver(rightContent, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    rightContent.value.classList.add('visible')
  }
})

useIntersectionObserver(donationButton, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    donationButton.value.classList.add('visible')
  }
})
</script>

<style scoped>
.landing-section {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--light-orange) 0%, var(--white) 100%);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.landing-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  margin-bottom: 60px;
}

.logo-section {
  margin-bottom: 60px;
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.logo-icon {
  margin-right: 16px;
  padding: 12px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 16px;
}

.logo-text {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-orange), var(--secondary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slogan {
  font-size: 1.5rem;
  color: var(--text-light);
  font-weight: 400;
  margin-left: 76px;
}

.statistics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.stat-item {
  text-align: center;
  padding: 32px 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--primary-orange);
  margin-bottom: 8px;
  font-family: 'SF Mono', Monaco, monospace;
}

.stat-label {
  color: var(--text-light);
  font-weight: 500;
  font-size: 1rem;
}

.hero-image-container {
  display: flex;
  justify-content: center;
  position: relative;
}

.hero-image {
  width: 100%;
  max-width: 500px;
  height: 400px;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(255, 107, 53, 0.2);
}

.floating {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.donation-button-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.donation-btn {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  padding: 20px 40px;
  border-radius: 16px;
}

@media (max-width: 768px) {
  .landing-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .logo-text {
    font-size: 2.5rem;
  }
  
  .slogan {
    margin-left: 0;
    font-size: 1.2rem;
  }
  
  .statistics {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .hero-image {
    max-width: 350px;
    height: 300px;
  }
}
</style>