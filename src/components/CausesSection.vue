<template>
  <section class="causes-section section-padding">
    <div class="container">
      <div class="section-header fade-in" ref="header">
        <h2 class="section-title">Our Causes</h2>
        <p class="section-subtitle">Making a difference through focused initiatives</p>
      </div>
      
      <div class="causes-grid">
        <div 
          v-for="(cause, index) in causes" 
          :key="index"
          class="cause-card fade-in"
          :ref="el => cardRefs[index] = el"
        >
          <div class="card-image">
            <img :src="cause.image" :alt="cause.title" />
            <div class="card-overlay">
              <button class="btn-secondary">Learn More</button>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ cause.title }}</h3>
            <p class="card-description">{{ cause.description }}</p>
            <div class="card-stats">
              <div class="stat">
                <span class="stat-value">{{ cause.beneficiaries }}</span>
                <span class="stat-label">Beneficiaries</span>
              </div>
              <div class="stat">
                <span class="stat-value">${{ cause.raised.toLocaleString() }}</span>
                <span class="stat-label">Raised</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const header = ref()
const cardRefs = ref<HTMLElement[]>([])

const causes = [
  {
    title: "Emergency Food Relief",
    description: "Providing immediate food assistance to families facing crisis situations, ensuring no one goes hungry during their most vulnerable moments.",
    image: "https://images.pexels.com/photos/6995469/pexels-photo-6995469.jpeg?auto=compress&cs=tinysrgb&w=800",
    beneficiaries: "2,400+",
    raised: 85000
  },
  {
    title: "Community Food Gardens",
    description: "Building sustainable food sources in underserved communities through education, resources, and ongoing support for local food production.",
    image: "https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=800",
    beneficiaries: "1,200+",
    raised: 42000
  }
]

useIntersectionObserver(header, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    header.value.classList.add('visible')
  }
})

onMounted(() => {
  cardRefs.value.forEach((card, index) => {
    if (card) {
      useIntersectionObserver(card, ([{ isIntersecting }]) => {
        if (isIntersecting) {
          setTimeout(() => {
            card.classList.add('visible')
          }, index * 200)
        }
      })
    }
  })
})
</script>

<style scoped>
.causes-section {
  background: var(--gray-50);
  width: 100%;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 1.2rem;
  color: var(--text-light);
  max-width: 600px;
  margin: 0 auto;
}

.causes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
  width: 100%;
}

.cause-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  width: 100%;
}

.cause-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(255, 107, 53, 0.2);
}

.card-image {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.cause-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 107, 53, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cause-card:hover .card-overlay {
  opacity: 1;
}

.card-content {
  padding: 32px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 16px;
}

.card-description {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 24px;
}

.card-stats {
  display: flex;
  gap: 32px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-orange);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-light);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }
  
  .causes-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .card-content {
    padding: 24px;
  }
  
  .card-stats {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .causes-grid {
    grid-template-columns: 1fr;
  }
  
  .card-stats {
    flex-direction: column;
    gap: 16px;
  }
}
</style>