<template>
  <section class="questions-section section-padding">
    <div class="container">
      <div class="section-header fade-in" ref="header">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <p class="section-subtitle">Find answers to common questions about our mission and impact</p>
      </div>
      
      <div class="questions-container">
        <div class="questions-list">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="question-card fade-in"
            :ref="el => cardRefs[index] = el"
          >
            <button 
              class="question-header"
              @click="toggleQuestion(index)"
              :class="{ active: activeQuestion === index }"
            >
              <span class="question-text">{{ faq.question }}</span>
              <ChevronDown 
                :size="20" 
                class="chevron"
                :class="{ rotated: activeQuestion === index }"
              />
            </button>
            <div 
              class="question-content"
              :class="{ expanded: activeQuestion === index }"
            >
              <div class="answer-text">{{ faq.answer }}</div>
            </div>
          </div>
        </div>
        
        <div class="contact-form-trigger fade-in" ref="contactTrigger">
          <div class="trigger-content">
            <h3>Have a different question?</h3>
            <p>We're here to help! Send us your inquiry and we'll get back to you as soon as possible.</p>
            <button @click="showContactForm = true" class="btn-primary">
              <MessageCircle :size="20" style="margin-right: 8px;" />
              Ask a Question
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Contact Form Modal -->
    <div 
      v-if="showContactForm" 
      class="modal-overlay"
      @click="showContactForm = false"
    >
      <div class="modal-content" @click.stop>
        <button 
          @click="showContactForm = false"
          class="modal-close"
        >
          <X :size="20" />
        </button>
        
        <h3 class="modal-title">Send us your question</h3>
        <p class="modal-subtitle">We'll get back to you within 24 hours</p>
        
        <form @submit.prevent="submitForm" class="contact-form">
          <div class="form-group">
            <label for="email">Your Email</label>
            <input 
              type="email" 
              id="email"
              v-model="formData.email"
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div class="form-group">
            <label for="question">Your Question</label>
            <textarea 
              id="question"
              v-model="formData.question"
              required
              placeholder="Type your question here..."
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showContactForm = false" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              <Send :size="20" style="margin-right: 8px;" />
              Send Question
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChevronDown, MessageCircle, X, Send } from 'lucide-vue-next'
import { useIntersectionObserver } from '@vueuse/core'

const header = ref()
const contactTrigger = ref()
const cardRefs = ref<HTMLElement[]>([])
const activeQuestion = ref(-1)
const showContactForm = ref(false)

const formData = ref({
  email: '',
  question: ''
})

const faqs = [
  {
    question: "How does UniSHIFT ensure food reaches those who need it most?",
    answer: "We partner directly with local community organizations, schools, and healthcare providers to identify families in need. Our distribution network includes both emergency relief and ongoing support programs, ensuring we reach both immediate crisis situations and long-term food insecurity."
  },
  {
    question: "What percentage of donations goes directly to food programs?",
    answer: "We're proud that 87% of all donations go directly to our food programs and community initiatives. The remaining 13% covers essential operational costs, ensuring sustainable and efficient program delivery."
  },
  {
    question: "Can I volunteer with UniSHIFT? What opportunities are available?",
    answer: "Absolutely! We welcome volunteers of all backgrounds and skill levels. Opportunities include food sorting and packing, distribution events, community garden maintenance, administrative support, and special event assistance. Visit our volunteer portal to find opportunities that match your interests and schedule."
  },
  {
    question: "How do you measure the impact of your programs?",
    answer: "We track multiple metrics including meals provided, families served, community gardens established, and long-term food security improvements. We conduct quarterly surveys with beneficiaries and publish annual impact reports to ensure transparency and continuous improvement."
  },
  {
    question: "Do you accept food donations? What items are most needed?",
    answer: "Yes, we accept non-perishable food donations at our community center. Most needed items include canned proteins, whole grains, baby food, and hygiene products. We also accept fresh produce from local farms and community gardens. Please check our current needs list on our website before donating."
  }
]

const toggleQuestion = (index: number) => {
  activeQuestion.value = activeQuestion.value === index ? -1 : index
}

const submitForm = () => {
  // Handle form submission here
  console.log('Form submitted:', formData.value)
  showContactForm.value = false
  formData.value = { email: '', question: '' }
  // Show success message
}

useIntersectionObserver(header, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    header.value.classList.add('visible')
  }
})

useIntersectionObserver(contactTrigger, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    contactTrigger.value.classList.add('visible')
  }
})

onMounted(() => {
  cardRefs.value.forEach((card, index) => {
    if (card) {
      useIntersectionObserver(card, ([{ isIntersecting }]) => {
        if (isIntersecting) {
          setTimeout(() => {
            card.classList.add('visible')
          }, index * 100)
        }
      })
    }
  })
})
</script>

<style scoped>
.questions-section {
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

.questions-container {
  max-width: 800px;
  margin: 0 auto;
}

.questions-list {
  margin-bottom: 60px;
}

.question-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.question-card:hover {
  box-shadow: 0 8px 30px rgba(255, 107, 53, 0.1);
  border-color: var(--primary-orange);
}

.question-header {
  width: 100%;
  padding: 24px 28px;
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.question-header.active {
  background: var(--light-orange);
}

.question-text {
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  font-weight: 600;
  color: var(--text-dark);
  flex: 1;
  margin-right: 16px;
}

.chevron {
  color: var(--text-light);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.question-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.question-content.expanded {
  max-height: 300px;
}

.answer-text {
  padding: 0 28px 24px;
  color: var(--text-light);
  line-height: 1.6;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.contact-form-trigger {
  background: linear-gradient(135deg, var(--light-orange) 0%, var(--white) 100%);
  padding: 48px;
  border-radius: 24px;
  text-align: center;
  border: 1px solid rgba(255, 107, 53, 0.1);
}

.trigger-content h3 {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 12px;
}

.trigger-content p {
  color: var(--text-light);
  margin-bottom: 24px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.modal-close:hover {
  background: var(--gray-100);
}

.modal-title {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.modal-subtitle {
  color: var(--text-light);
  margin-bottom: 32px;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-orange);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

/* Tablet styles */
@media (max-width: 1024px) {
  .contact-form-trigger {
    padding: 40px 32px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .section-header {
    margin-bottom: 60px;
  }
  
  .question-header {
    padding: 20px;
  }
  
  .answer-text {
    padding: 0 20px 20px;
  }
  
  .contact-form-trigger {
    padding: 32px 24px;
  }
  
  .modal-content {
    padding: 32px 24px;
    margin: 20px;
  }
}

/* Small mobile styles */
@media (max-width: 480px) {
  .questions-container {
    padding: 0;
  }
  
  .question-header {
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .question-text {
    margin-right: 0;
  }
  
  .chevron {
    align-self: flex-end;
  }
  
  .answer-text {
    padding: 0 16px 16px;
  }
  
  .contact-form-trigger {
    padding: 24px 16px;
  }
  
  .modal-content {
    padding: 24px 16px;
    margin: 10px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>