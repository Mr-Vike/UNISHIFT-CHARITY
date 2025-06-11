<template>
  <section id="faq" class="questions-section section-padding">
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
        <p>We'll aim to get back to you within 24 hours</p>
        <p class="modal-subtitle">If we don't get back to you in 24 hours, please email us on info@unishift.org</p>
        
        <!-- Success Message -->
        <div v-if="submitStatus === 'success'" class="success-message">
          <div class="success-icon">
            <CheckCircle :size="24" />
          </div>
          <div class="success-content">
            <h4>Question Submitted Successfully!</h4>
            <p>Thank you for reaching out. We've received your question and will get back to you within 24 hours.</p>
            <button @click="resetForm" class="btn-primary">
              Ask Another Question
            </button>
          </div>
        </div>
        
        <!-- Error Message -->
        <div v-if="submitStatus === 'error'" class="error-message">
          <div class="error-icon">
            <AlertCircle :size="24" />
          </div>
          <div class="error-content">
            <h4>Submission Failed</h4>
            <p>{{ errorMessage }}</p>
            <button @click="submitStatus = ''" class="btn-secondary">
              Try Again
            </button>
          </div>
        </div>
        
        <!-- Form -->
        <form v-if="!submitStatus" @submit.prevent="submitForm" class="contact-form">
          <div class="form-group">
            <label for="email">Your Email</label>
            <input 
              type="email" 
              id="email"
              v-model="formData.email"
              required
              placeholder="your@email.com"
              :disabled="isSubmitting"
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
              :disabled="isSubmitting"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button 
              type="button" 
              @click="showContactForm = false" 
              class="btn-secondary"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="isSubmitting"
            >
              <Send v-if="!isSubmitting" :size="20" style="margin-right: 8px;" />
              <div v-else class="loading-spinner"></div>
              {{ isSubmitting ? 'Sending...' : 'Send Question' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChevronDown, MessageCircle, X, Send, CheckCircle, AlertCircle } from 'lucide-vue-next'
import { useIntersectionObserver } from '@vueuse/core'

const header = ref()
const contactTrigger = ref()
const cardRefs = ref<HTMLElement[]>([])
const activeQuestion = ref(-1)
const showContactForm = ref(false)
const isSubmitting = ref(false)
const submitStatus = ref('') // '', 'success', 'error'
const errorMessage = ref('')

const formData = ref({
  email: '',
  question: ''
})

const faqs = [
  {
    question: "What is Unishift and what does it stand for?",
    answer: "Unishift is a student-led charity initiative focused on creating positive change through community-driven projects, awareness campaigns, and educational outreach. Our mission is to empower young people to make a difference by addressing social, environmental, and educational challenges both locally and globally."
  },
  {
    question: "What makes Unishift different from other charities?",
    answer: "What makes Unishift special is that we're entirely youth-driven. We believe in the power of young people to create change, and we give students a platform to lead, learn, and make a real difference. Our approach is grassroots, hands-on, and fueled by genuine passion for social impact."
  },
  {
    question: "Where does my money go?",
    answer: "Your generous donation goes a long way! Every pound you give helps us provide warm, nutritious meals to people experiencing homelessness, making a real difference in their day. It also helps us keep the Unishift platform running—so we can continue spreading awareness, sharing updates, and bringing more people together to support meaningful causes. With your support, we're able to create real impact, both online and in the community."
  },
  {
    question: "Do you accept food donations?",
    answer: "We really appreciate your kindness and willingness to help! However, for health and safety reasons, we're unable to accept food donations from individuals at this time. To ensure the well-being of those we support, we can only accept food that comes from certified organizations that follow strict health and safety guidelines. This helps us make sure everything we distribute is safe, properly handled, and high-quality. Thank you so much for understanding—and there are still plenty of other ways to get involved if you'd like to help!"
  }
]

const toggleQuestion = (index: number) => {
  activeQuestion.value = activeQuestion.value === index ? -1 : index
}

const submitForm = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  submitStatus.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.value.email.trim(),
        question: formData.value.question.trim()
      })
    })

    const result = await response.json()

    if (result.success) {
      submitStatus.value = 'success'
    } else {
      submitStatus.value = 'error'
      errorMessage.value = result.message || 'Failed to submit your question. Please try again.'
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    submitStatus.value = 'error'
    errorMessage.value = 'Network error. Please check your connection and try again.'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = { email: '', question: '' }
  submitStatus.value = ''
  errorMessage.value = ''
}

const closeModal = () => {
  showContactForm.value = false
  resetForm()
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

.form-group input:disabled,
.form-group textarea:disabled {
  background: var(--gray-100);
  cursor: not-allowed;
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

.success-message,
.error-message {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.success-message {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #ef4444;
}

.success-icon,
.error-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.success-icon {
  color: #0ea5e9;
}

.error-icon {
  color: #ef4444;
}

.success-content h4,
.error-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.success-content h4 {
  color: #0c4a6e;
}

.error-content h4 {
  color: #991b1b;
}

.success-content p,
.error-content p {
  color: var(--text-light);
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
  
  .success-message,
  .error-message {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}
</style>