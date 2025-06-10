<template>
  <section class="journey-section section-padding">
    <div class="container">
      <div class="section-header fade-in" ref="header">
        <h2 class="section-title">Our Journey</h2>
        <p class="section-subtitle">Milestones in our mission to serve hope</p>
      </div>
      
      <div class="journey-content fade-in" ref="journeyContent">
        <div class="timeline-container">
          <div class="timeline">
            <div 
              v-for="(milestone, index) in milestones" 
              :key="index"
              class="timeline-node"
              :class="{ active: activeNode === index }"
              @click="setActiveNode(index)"
            >
              <div class="node-circle">
                <component :is="milestone.icon" :size="16" />
              </div>
              <div class="node-date">{{ milestone.date }}</div>
            </div>
          </div>
        </div>
        
        <div class="content-card">
          <div class="card-header">
            <div class="navigation-arrows">
              <button @click="previousNode" class="nav-arrow" :disabled="activeNode === 0">
                <ChevronLeft :size="20" />
              </button>
              <button @click="nextNode" class="nav-arrow" :disabled="activeNode === milestones.length - 1">
                <ChevronRight :size="20" />
              </button>
            </div>
          </div>
          
          <div class="card-content">
            <div class="milestone-date">{{ milestones[activeNode].date }}</div>
            <h3 class="milestone-title">{{ milestones[activeNode].title }}</h3>
            <p class="milestone-description">{{ milestones[activeNode].description }}</p>
            <div class="milestone-stats" v-if="milestones[activeNode].stats">
              <div 
                v-for="(stat, key) in milestones[activeNode].stats" 
                :key="key"
                class="stat-item"
              >
                <div class="stat-value">{{ stat }}</div>
                <div class="stat-label">{{ key }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, Calendar, Users, Heart, Award, Zap } from 'lucide-vue-next'
import { useIntersectionObserver } from '@vueuse/core'

const header = ref()
const journeyContent = ref()
const activeNode = ref(0)
let autoProgressInterval: number

const milestones = [
  {
    date: "January 2020",
    title: "Foundation Established",
    description: "UniSHIFT was founded with a simple mission: to ensure no one in our community goes hungry. Starting with just a small team of passionate volunteers.",
    icon: Calendar,
    stats: {
      "Volunteers": "12",
      "Families Served": "50"
    }
  },
  {
    date: "March 2020",
    title: "Emergency Response",
    description: "When the pandemic hit, we quickly pivoted to provide emergency food relief, establishing contactless distribution points throughout the city.",
    icon: Zap,
    stats: {
      "Distribution Points": "8",
      "Emergency Meals": "2,400"
    }
  },
  {
    date: "August 2021",
    title: "Community Gardens Launch",
    description: "Launched our sustainable food program, helping communities build their own food gardens and become more self-sufficient.",
    icon: Heart,
    stats: {
      "Gardens Established": "15",
      "Community Members": "300"
    }
  },
  {
    date: "December 2022",
    title: "Regional Expansion",
    description: "Expanded our reach to serve three additional counties, multiplying our impact and helping even more families access nutritious food.",
    icon: Users,
    stats: {
      "Counties Served": "4",
      "Partner Organizations": "25"
    }
  },
  {
    date: "September 2024",
    title: "Recognition & Growth",
    description: "Received the Community Impact Award and reached our goal of serving over 10,000 families. Looking ahead to even greater impact.",
    icon: Award,
    stats: {
      "Families Served": "10,000+",
      "Total Donations": "$500K+"
    }
  }
]

const setActiveNode = (index: number) => {
  activeNode.value = index
}

const nextNode = () => {
  if (activeNode.value < milestones.length - 1) {
    activeNode.value++
  }
}

const previousNode = () => {
  if (activeNode.value > 0) {
    activeNode.value--
  }
}

const autoProgress = () => {
  if (activeNode.value < milestones.length - 1) {
    activeNode.value++
  } else {
    activeNode.value = 0
  }
}

useIntersectionObserver(header, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    header.value.classList.add('visible')
  }
})

useIntersectionObserver(journeyContent, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    journeyContent.value.classList.add('visible')
  }
})

onMounted(() => {
  autoProgressInterval = setInterval(autoProgress, 5000)
})

onUnmounted(() => {
  if (autoProgressInterval) {
    clearInterval(autoProgressInterval)
  }
})
</script>

<style scoped>
.journey-section {
  background: var(--gray-50);
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

.journey-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 60px;
  align-items: start;
}

.timeline-container {
  position: sticky;
  top: 100px;
}

.timeline {
  position: relative;
  padding: 20px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--gray-200);
}

.timeline-node {
  position: relative;
  margin-bottom: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

.timeline-node:hover {
  transform: translateX(8px);
}

.node-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 3px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.timeline-node.active .node-circle {
  background: var(--primary-orange);
  border-color: var(--primary-orange);
  color: white;
  transform: scale(1.2);
}

.node-date {
  font-weight: 600;
  color: var(--text-light);
  transition: color 0.3s ease;
}

.timeline-node.active .node-date {
  color: var(--primary-orange);
}

.content-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 30px 40px 0;
  display: flex;
  justify-content: flex-end;
}

.navigation-arrows {
  display: flex;
  gap: 12px;
}

.nav-arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--gray-200);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-arrow:hover:not(:disabled) {
  border-color: var(--primary-orange);
  color: var(--primary-orange);
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.card-content {
  padding: 20px 40px 40px;
}

.milestone-date {
  color: var(--primary-orange);
  font-weight: 600;
  margin-bottom: 8px;
}

.milestone-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 16px;
}

.milestone-description {
  color: var(--text-light);
  line-height: 1.6;
  font-size: 1.1rem;
  margin-bottom: 32px;
}

.milestone-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: var(--light-orange);
  border-radius: 12px;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-orange);
  margin-bottom: 4px;
}

.stat-label {
  color: var(--text-light);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }
  
  .journey-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .timeline-container {
    position: static;
  }
  
  .timeline {
    display: flex;
    overflow-x: auto;
    padding: 20px 0;
    gap: 20px;
  }
  
  .timeline::before {
    display: none;
  }
  
  .timeline-node {
    flex-direction: column;
    margin-bottom: 0;
    min-width: 100px;
    text-align: center;
  }
  
  .card-content {
    padding: 20px 24px 32px;
  }
  
  .milestone-title {
    font-size: 1.5rem;
  }
}
</style>