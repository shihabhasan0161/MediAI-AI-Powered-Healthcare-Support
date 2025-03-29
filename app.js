document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('show');
      // Toggle icon between bars and X
      const icon = this.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    });
  }
  
  // Video modal functionality
  const videoModal = document.getElementById('video-modal');
  const playBtn = document.getElementById('play-video');
  const watchDemo = document.getElementById('watch-demo');
  const closeModal = document.querySelector('.close-modal');
  const video = document.getElementById('demo-video');
  
  function openModal() {
    videoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    setTimeout(() => {
      video.play();
    }, 300);
  }
  
  function closeVideoModal() {
    video.pause();
    videoModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
  
  if (playBtn) playBtn.addEventListener('click', openModal);
  if (watchDemo) watchDemo.addEventListener('click', openModal);
  if (closeModal) closeModal.addEventListener('click', closeVideoModal);
  
  // Close modal when clicking outside the content
  if (videoModal) {
    videoModal.addEventListener('click', function(e) {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }
  
  // Close modal on escape key press
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && videoModal.style.display === 'flex') {
      closeVideoModal();
    }
  });
  
  // Symptom Checker Functionality
  const symptoms = document.querySelectorAll('.symptom');
  const durationSelect = document.getElementById('duration');
  const severitySelect = document.getElementById('severity');
  const checkSymptomsBtn = document.getElementById('check-symptoms');
  const symptomResult = document.getElementById('symptom-result');
  
  // Enable/disable submit button based on form state
  function updateCheckButtonState() {
    const hasSelectedSymptoms = Array.from(symptoms).some(symptom => symptom.checked);
    const hasDuration = durationSelect.value !== '';
    const hasSeverity = severitySelect.value !== '';
    
    checkSymptomsBtn.disabled = !(hasSelectedSymptoms && hasDuration && hasSeverity);
  }
  
  // Add event listeners to form elements
  if (symptoms.length) {
    symptoms.forEach(symptom => {
      symptom.addEventListener('change', updateCheckButtonState);
    });
  }
  
  if (durationSelect) {
    durationSelect.addEventListener('change', updateCheckButtonState);
  }
  
  if (severitySelect) {
    severitySelect.addEventListener('change', updateCheckButtonState);
  }
  
  // Handle symptom check submission
  if (checkSymptomsBtn) {
    checkSymptomsBtn.addEventListener('click', function() {
      // Display loading state
      checkSymptomsBtn.disabled = true;
      checkSymptomsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
      symptomResult.style.display = 'none';
      
      // Get selected symptoms
      const selectedSymptoms = Array.from(symptoms)
        .filter(symptom => symptom.checked)
        .map(symptom => symptom.id);
      
      // Simulate API call with setTimeout
      setTimeout(() => {
        let resultMessage = '';
        
        // Simple logic to determine result based on symptoms
        if (selectedSymptoms.includes('fever') && selectedSymptoms.includes('cough') && selectedSymptoms.includes('shortness-breath')) {
          resultMessage = 'Your symptoms could be consistent with a respiratory infection. Please consult a healthcare provider for proper diagnosis and treatment.';
        } else if (selectedSymptoms.includes('headache') && selectedSymptoms.includes('nausea') && selectedSymptoms.includes('dizziness')) {
          resultMessage = 'Your symptoms might indicate a migraine or other neurological condition. Rest in a dark, quiet room and consult your doctor if symptoms persist.';
        } else if (selectedSymptoms.includes('sore-throat') && selectedSymptoms.includes('cough')) {
          resultMessage = 'Your symptoms could be caused by a common cold or mild upper respiratory infection. Stay hydrated and rest. If symptoms worsen, please see a doctor.';
        } else if (selectedSymptoms.includes('chest-pain')) {
          resultMessage = 'Chest pain can be a serious symptom. Please seek immediate medical attention to rule out any cardiac issues.';
        } else if (selectedSymptoms.includes('rash')) {
          resultMessage = 'Skin rashes can have many causes including allergies, infections, or other conditions. If the rash is spreading or accompanied by other symptoms, please consult a healthcare provider.';
        } else {
          resultMessage = 'Based on the symptoms you\'ve selected, we recommend monitoring your condition. If symptoms persist for more than a few days or worsen, please consult a healthcare provider.';
        }
        
        resultMessage += '\n\nRemember: This is not a medical diagnosis. Always consult with a healthcare professional for proper evaluation.';
        
        // Display result
        symptomResult.innerHTML = `
          <h4 class="text-lg font-bold mb-2">Assessment Result:</h4>
          <p>${resultMessage.replace(/\n/g, '<br>')}</p>
        `;
        symptomResult.style.display = 'block';
        
        // Reset button
        checkSymptomsBtn.innerHTML = 'Check Symptoms';
        checkSymptomsBtn.disabled = false;
        
        // Scroll to the result
        symptomResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 2000);
    });
  }
  
  // Chatbot Functionality
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const chatMessages = document.getElementById('chat-messages');
  
  // Enable/disable send button based on input
  if (userInput) {
    userInput.addEventListener('input', function() {
      sendButton.disabled = !this.value.trim();
    });
  }
  
  // Get current time formatted as HH:MM
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Add a message to chat
  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${text}</p>
        <span class="message-time">${getCurrentTime()}</span>
      </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom of chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
      <div class="message-content">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // AI response generator
  function generateAIResponse(userMessage) {
    // Simple response logic based on keywords
    const userMessageLower = userMessage.toLowerCase();
    let response = '';
    
    if (userMessageLower.includes('hello') || userMessageLower.includes('hi') || userMessageLower.includes('hey')) {
      response = "Hello! How can I assist you with your health today?";
    } else if (userMessageLower.includes('headache')) {
      response = "I'm sorry to hear you're experiencing a headache. Headaches can have many causes, including stress, dehydration, lack of sleep, or eyestrain. For mild headaches, rest, hydration, and over-the-counter pain relievers may help. If your headache is severe, persistent, or accompanied by other symptoms, please consult a healthcare professional.";
    } else if (userMessageLower.includes('fever')) {
      response = "Fever is often a sign that your body is fighting an infection. Rest, stay hydrated, and consider taking acetaminophen or ibuprofen to reduce fever. If your temperature exceeds 103°F (39.4°C), persists for more than three days, or is accompanied by severe symptoms, please seek medical attention.";
    } else if (userMessageLower.includes('cold') || userMessageLower.includes('flu')) {
      response = "Cold and flu symptoms can include congestion, sore throat, cough, fever, and body aches. Rest, stay hydrated, and manage symptoms with over-the-counter medications. Most colds resolve within 7-10 days. If symptoms are severe or persistent, please consult a healthcare provider.";
    } else if (userMessageLower.includes('covid') || userMessageLower.includes('coronavirus')) {
      response = "Common COVID-19 symptoms include fever, cough, fatigue, and loss of taste or smell. If you suspect you have COVID-19, please get tested and follow current isolation guidelines. Contact a healthcare provider if you experience difficulty breathing or persistent chest pain.";
    } else if (userMessageLower.includes('diet') || userMessageLower.includes('nutrition')) {
      response = "A balanced diet typically includes fruits, vegetables, whole grains, lean proteins, and healthy fats. It's recommended to limit processed foods, added sugars, and excessive salt. For personalized nutrition advice, consider consulting a registered dietitian.";
    } else if (userMessageLower.includes('exercise') || userMessageLower.includes('workout')) {
      response = "Regular physical activity is important for overall health. Adults should aim for at least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity exercise per week, plus muscle-strengthening activities twice weekly. Always start slowly if you're new to exercise.";
    } else if (userMessageLower.includes('sleep')) {
      response = "Most adults need 7-9 hours of sleep per night. To improve sleep quality, maintain a consistent schedule, create a relaxing bedtime routine, limit screen time before bed, and ensure your sleep environment is comfortable, dark, and quiet.";
    } else if (userMessageLower.includes('stress') || userMessageLower.includes('anxiety')) {
      response = "Managing stress is important for both mental and physical health. Consider techniques like deep breathing, meditation, regular exercise, adequate sleep, and connecting with supportive people. If stress or anxiety significantly affects your daily life, please consider speaking with a mental health professional.";
    } else if (userMessageLower.includes('thanks') || userMessageLower.includes('thank you')) {
      response = "You're welcome! I'm here to help. Is there anything else I can assist you with?";
    } else {
      response = "Thank you for sharing that information. For any specific health concerns, I recommend consulting with a healthcare professional for personalized advice. Is there anything specific you'd like to know about maintaining your health?";
    }
    
    return response;
  }
  
  // Handle chat form submission
  if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const message = userInput.value.trim();
      if (!message) return;
      
      // Add user message to chat
      addMessage(message, true);
      
      // Clear input
      userInput.value = '';
      sendButton.disabled = true;
      
      // Show typing indicator
      showTypingIndicator();
      
      // Simulate AI thinking and responding
      setTimeout(() => {
        removeTypingIndicator();
        const aiResponse = generateAIResponse(message);
        addMessage(aiResponse);
      }, 1500);
    });
  }
  
  // Add animation classes on scroll
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.service-card, .section-header h2, .section-header p');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
        element.classList.add('animate');
      }
    });
  };
  
  // Add initial classes
  document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.5s ease ${index * 0.1}s`;
  });
  
  document.querySelectorAll('.section-header h2, .section-header p').forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `all 0.5s ease ${index * 0.1}s`;
  });
  
  // Define the animate class
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .animate {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    </style>
  `);
  
  // Call on scroll and on load
  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', animateOnScroll);
}); 