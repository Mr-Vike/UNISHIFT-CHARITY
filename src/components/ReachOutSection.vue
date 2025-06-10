<template>
  <section class="reach-out-section section-padding">
    <div class="container">
      <div class="section-header fade-in" ref="header">
        <h2 class="section-title">Ways to Help</h2>
        <p class="section-subtitle">Choose how you'd like to make a difference</p>
      </div>
      
      <div class="slider-container fade-in" ref="sliderContainer">
        <div class="slider-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div class="slide">
            <div class="slide-content">
              <div class="slide-text">
                <h3 class="slide-title">Online Donations</h3>
                <p class="slide-description">
                  Make a secure online donation from anywhere in the world. Every contribution, 
                  no matter the size, helps us reach more families in need and create lasting impact 
                  in our communities.
                </p>
                <a href="#" class="btn-primary">
                  <CreditCard :size="20" style="margin-right: 8px;" />
                  Donate Online
                </a>
              </div>
            </div>
          </div>
          
          <div class="slide">
            <div class="slide-content split-layout">
              <div class="slide-text">
                <h3 class="slide-title">In-Person Donations</h3>
                <p class="slide-description">
                  Visit our community center to drop off food donations, volunteer your time, 
                  or learn more about our programs. We're always here to welcome new supporters 
                  and answer any questions.
                </p>
                <div class="location-info">
                  <MapPin :size="16" style="margin-right: 8px;" />
                  <span>123 Community Street, Hope City, HC 12345</span>
                </div>
              </div>
              <div class="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1!2d-74.0059!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuMiJX!5e0!3m2!1sen!2sus!4v1234567890"
                  style="border:0; width: 100%; height: 100%; border-radius: 12px;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>
        </div>
        
        <div class="slider-indicators">
          <button 
            v-for="(_, index) in 2" 
            :key="index"
            class="indicator"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { CreditCard, MapPin } from 'lucide-vue-next'
import { useIntersectionObserver } from '@vueuse/core'

const header = ref()
const sliderContainer = ref()
const currentSlide = ref(0)
let autoSlideInterval: number

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % 2
}

useIntersectionObserver(header, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    header.value.classList.add('visible')
  }
})

useIntersectionObserver(sliderContainer, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    sliderContainer.value.classList.add('visible')
  }
})

onMounted(() => {
  autoSlideInterval = setInterval(nextSlide, 6000)
})

onUnmounted(() => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
  }
})
</script>

<style scoped>
.reach-out-section {
  background: white;
  width: 100%;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  color: var(--text-light);
  max-width: 600px;
  margin: 0 auto;
}

.slider-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.slider-track {
  display: flex;
  transition: transform 0.8s ease-in-out;
  width: 200%;
}

.slide {
  width: 50%;
  min-height: 400px;
}

.slide-content {
  padding: 60px;
  background: linear-gradient(135deg, var(--light-orange) 0%, var(--white) 100%);
  height: 100%;
  display: flex;
  align-items: center;
}

.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.slide-text {
  max-width: 500px;
}

.slide-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 20px;
}

.slide-description {
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 32px;
}

.location-info {
  display: flex;
  align-items: center;
  color: var(--text-light);
  margin-top: 24px;
  font-size: clamp(0.8rem, 2vw, 1rem);
}

.map-container {
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.slider-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: var(--primary-orange);
  transform: scale(1.2);
}

/* Tablet styles */
@media (max-width: 1024px) {
  .slide-content {
    padding: 50px 40px;
  }
  
  .split-layout {
    gap: 30px;
  }
  
  .map-container {
    height: 250px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .section-header {
    margin-bottom: 60px;
  }
  
  .slide-content {
    padding: 40px 30px;
  }
  
  .split-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .map-container {
    height: 250px;
  }
  
  .slide {
    min-height: auto;
  }
}

/* Small mobile styles */
@media (max-width: 480px) {
  .slide-content {
    padding: 30px 20px;
  }
  
  .map-container {
    height: 200px;
  }
  
  .location-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .slider-indicators {
    bottom: 20px;
  }
}

/* Landscape mobile */
@media (max-width: 896px) and (orientation: landscape) {
  .slide-content {
    padding: 30px 40px;
  }
  
  .slide {
    min-height: 350px;
  }
  
  .map-container {
    height: 200px;
  }
}

/* Ultra-wide screens */
@media (min-width: 1600px) {
  .slider-container {
    max-width: 1200px;
  }
  
  .slide-content {
    padding: 80px;
  }
  
  .split-layout {
    gap: 60px;
  }
}
</style>