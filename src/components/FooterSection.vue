<template>
  <footer id="contact" class="footer-section">
    <div class="container">
      <div class="footer-content">
        <div class="footer-main">
          <div class="footer-brand">
            <div class="logo">
              <div class="logo-icon">
                <Heart :size="32" color="#FF6B35" />
              </div>
              <span class="logo-text">UniSHIFT</span>
            </div>
            <p class="brand-description">
              Serving Hope In Food Together - Building stronger communities through 
              sustainable food security and compassionate support.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">
                <Facebook :size="20" />
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <Twitter :size="20" />
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <Instagram :size="20" />
              </a>
              <a href="#" class="social-link" aria-label="LinkedIn">
                <Linkedin :size="20" />
              </a>
            </div>
          </div>
          
          <div class="footer-links">
            <div class="link-group">
              <h4 class="link-title">Get Involved</h4>
              <ul class="link-list">
                <li><a href="#">Volunteer</a></li>
                <li><a href="#">Donate</a></li>
                <li><a href="#">Partner with Us</a></li>
                <li><a href="#">Corporate Sponsorship</a></li>
              </ul>
            </div>
            
            <div class="link-group">
              <h4 class="link-title">Programs</h4>
              <ul class="link-list">
                <li><a href="#">Emergency Food Relief</a></li>
                <li><a href="#">Community Gardens</a></li>
                <li><a href="#">Nutrition Education</a></li>
                <li><a href="#">Youth Programs</a></li>
              </ul>
            </div>
            
            <div class="link-group">
              <h4 class="link-title">Resources</h4>
              <ul class="link-list">
                <li><a href="#">Annual Reports</a></li>
                <li><a href="#">Impact Stories</a></li>
                <li><a href="#">Press Releases</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-contact">
          <h4 class="contact-title">Contact Information</h4>
          <div class="contact-grid">
            <div class="contact-item">
              <MapPin :size="16" class="contact-icon" />
              <div class="contact-details">
                <strong>Address</strong>
                <span>123 Community Street<br>Hope City, HC 12345</span>
              </div>
            </div>
            
            <div class="contact-item">
              <Phone :size="16" class="contact-icon" />
              <div class="contact-details">
                <strong>Phone</strong>
                <span>(555) 123-4567</span>
              </div>
            </div>
            
            <div class="contact-item">
              <Mail :size="16" class="contact-icon" />
              <div class="contact-details">
                <strong>Email</strong>
                <span>hello@unishift.org</span>
              </div>
            </div>
            
            <div class="contact-item">
              <Clock :size="16" class="contact-icon" />
              <div class="contact-details">
                <strong>Hours</strong>
                <span>Mon-Fri: 9AM-6PM<br>Sat: 10AM-4PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © 2024 UniSHIFT. All rights reserved.
          </p>
          <div class="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Heart, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from 'lucide-vue-next'
</script>

<style scoped>
.footer-section {
  background: linear-gradient(135deg, var(--text-dark) 0%, #1a202c 100%);
  color: white;
  padding: 80px 0 0;
  width: 100%;
}

.footer-content {
  margin-bottom: 60px;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 80px;
  margin-bottom: 60px;
}

.footer-brand {
  max-width: 400px;
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.logo-icon {
  margin-right: 12px;
  padding: 8px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 12px;
  flex-shrink: 0;
}

.logo-text {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-orange), var(--secondary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-description {
  color: #a0aec0;
  line-height: 1.6;
  margin-bottom: 32px;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.social-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.social-link {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: var(--primary-orange);
  transform: translateY(-2px);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.link-title {
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  font-weight: 600;
  margin-bottom: 20px;
  color: white;
}

.link-list {
  list-style: none;
}

.link-list li {
  margin-bottom: 12px;
}

.link-list a {
  color: #a0aec0;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
}

.link-list a:hover {
  color: var(--primary-orange);
}

.footer-contact {
  background: rgba(255, 255, 255, 0.05);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-title {
  font-size: clamp(1.1rem, 2.5vw, 1.2rem);
  font-weight: 600;
  margin-bottom: 32px;
  color: white;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.contact-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.contact-icon {
  color: var(--primary-orange);
  margin-top: 2px;
  flex-shrink: 0;
}

.contact-details strong {
  display: block;
  color: white;
  margin-bottom: 4px;
  font-weight: 600;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.contact-details span {
  color: #a0aec0;
  line-height: 1.4;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.copyright {
  color: #a0aec0;
  margin: 0;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
}

.footer-bottom-links {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.footer-bottom-links a {
  color: #a0aec0;
  text-decoration: none;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  transition: color 0.3s ease;
}

.footer-bottom-links a:hover {
  color: var(--primary-orange);
}

/* Tablet styles */
@media (max-width: 1024px) {
  .footer-section {
    padding: 60px 0 0;
  }
  
  .footer-main {
    gap: 60px;
  }
  
  .footer-links {
    gap: 32px;
  }
  
  .footer-contact {
    padding: 32px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .footer-section {
    padding: 60px 0 0;
  }
  
  .footer-main {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-links {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-bottom-links {
    gap: 20px;
    justify-content: center;
  }
}

/* Small mobile styles */
@media (max-width: 480px) {
  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .footer-contact {
    padding: 24px;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .contact-item {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .footer-bottom-links {
    flex-direction: column;
    gap: 16px;
  }
}

/* Ultra-wide screens */
@media (min-width: 1600px) {
  .footer-main {
    gap: 120px;
  }
  
  .footer-links {
    gap: 60px;
  }
}
</style>