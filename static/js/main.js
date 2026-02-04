// ============== CONFIGURATION ==============
const API_BASE_URL = ''; // Change to your domain in production (e.g., 'https://yourdomain.com')

// ============== THEME MANAGEMENT ==============
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.classList.add(savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const moonIcon = themeToggle?.querySelector('.fa-moon');
    const sunIcon = themeToggle?.querySelector('.fa-sun');
    
    if (theme === 'dark') {
        moonIcon?.classList.add('hidden');
        sunIcon?.classList.remove('hidden');
    } else {
        moonIcon?.classList.remove('hidden');
        sunIcon?.classList.add('hidden');
    }
}

themeToggle?.addEventListener('click', () => {
    const isDark = html.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    
    html.classList.remove('dark', 'light');
    html.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// ============== MOBILE MENU ==============
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
});

mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// ============== TYPING ANIMATION ==============
const typingText = document.getElementById('typing-text');
const roles = ['Graphic Designer', 'Python Developer', 'Frontend Engineer', 'Creative Technologist'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function type() {
    if (!typingText) return;
    
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingDelay = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingDelay = 500;
    }

    setTimeout(type, typingDelay);
}

if (typingText) {
    type();
}

// ============== SKILL BARS ANIMATION ==============
function animateSkillBars() {
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) {
            bar.style.width = width;
        }
    });
}

const skillsSection = document.getElementById('skills');
if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateSkillBars, 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(skillsSection);
}

// ============== PORTFOLIO FILTER ==============
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => {
            b.classList.remove('bg-zinc-900', 'dark:bg-white', 'text-white', 'dark:text-zinc-900');
            b.classList.add('border', 'border-zinc-200', 'dark:border-zinc-800', 'bg-transparent', 'text-zinc-700', 'dark:text-zinc-300');
        });
        btn.classList.remove('border', 'border-zinc-200', 'dark:border-zinc-800', 'bg-transparent', 'text-zinc-700', 'dark:text-zinc-300');
        btn.classList.add('bg-zinc-900', 'dark:bg-white', 'text-white', 'dark:text-zinc-900');

        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ============== CONTACT FORM (FIXED) ==============
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

function showStatus(message, type = 'error') {
    if (!formStatus) return;
    
    formStatus.classList.remove('hidden');
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const colorClass = type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    
    formStatus.innerHTML = `
        <p class="text-sm font-medium ${colorClass}">
            <i class="fas ${icon} mr-2"></i>${message}
        </p>
    `;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        formStatus.classList.add('hidden');
    }, 5000);
}

function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    
    submitBtn.disabled = isSubmitting;
    if (isSubmitting) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
    } else {
        submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane text-xs ml-2"></i>';
    }
}

async function submitContactForm(e) {
    e.preventDefault();
    
    if (!contactForm) return;
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name')?.trim() || '',
        email: formData.get('email')?.trim() || '',
        phone: formData.get('phone')?.trim() || '',
        company: formData.get('company')?.trim() || '',
        project_type: formData.get('project_type') || '',
        budget: formData.get('budget') || '',
        subject: formData.get('subject')?.trim() || '',
        message: formData.get('message')?.trim() || '',
        website: formData.get('website') || '' // Honeypot field
    };
    
    // Client-side validation
    if (!data.name || !data.email || !data.subject || !data.message) {
        showStatus('Please fill in all required fields (Name, Email, Subject, Message)', 'error');
        return;
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
        showStatus('Please enter a valid email address', 'error');
        return;
    }
    
    setSubmitting(true);
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(`${API_BASE_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        let result;
        const contentType = response.headers.get('content-type');
        
        // Check if response is JSON
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            // If not JSON, get text and throw error
            const text = await response.text();
            console.error('Non-JSON response:', text.substring(0, 200));
            throw new Error('Server returned invalid response format');
        }
        
        if (response.ok && result.ok) {
            showStatus(result.message || 'Message sent successfully!', 'success');
            contactForm.reset();
        } else {
            showStatus(result.message || result.error || 'Failed to send message', 'error');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        if (error.name === 'AbortError') {
            showStatus('Request timed out. Please check your connection and try again.', 'error');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            showStatus('Network error. Please check your internet connection.', 'error');
        } else {
            showStatus(error.message || 'An unexpected error occurred. Please try again.', 'error');
        }
    } finally {
        setSubmitting(false);
    }
}

contactForm?.addEventListener('submit', submitContactForm);

// ============== CHATBOT ==============
const chatBtn = document.getElementById('chat-btn');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendMessage = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');
const quickReplies = document.querySelectorAll('.quick-reply');

let isChatOpen = false;

function toggleChat() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        chatWindow?.classList.remove('hidden');
        setTimeout(() => chatInput?.focus(), 100);
    } else {
        chatWindow?.classList.add('hidden');
    }
}

chatBtn?.addEventListener('click', toggleChat);
closeChat?.addEventListener('click', toggleChat);

function addMessage(text, isUser = false) {
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex gap-3 ${isUser ? 'justify-end' : ''}`;
    
    if (isUser) {
        messageDiv.innerHTML = `
            <div class="rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 text-sm max-w-[80%]">
                ${escapeHtml(text)}
            </div>
            <div class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-user text-xs"></i>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center flex-shrink-0">
                <i class="fas fa-robot text-xs text-white dark:text-zinc-900"></i>
            </div>
            <div class="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 max-w-[80%]">
                ${escapeHtml(text)}
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'flex gap-3';
    typingDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center flex-shrink-0">
            <i class="fas fa-robot text-xs text-white dark:text-zinc-900"></i>
        </div>
        <div class="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2">
            <span class="animate-pulse">...</span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    indicator?.remove();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function sendChatMessage(message) {
    if (!message.trim()) return;
    
    // Add user message
    addMessage(message, true);
    
    // Clear input
    if (chatInput) chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ message: message }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        removeTypingIndicator();
        
        let result;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            throw new Error('Invalid response format');
        }
        
        addMessage(result.response || "I'm sorry, I didn't understand that.");
        
    } catch (error) {
        removeTypingIndicator();
        console.error('Chat error:', error);
        addMessage("I'm having trouble connecting. Please try again later.");
    }
}

sendMessage?.addEventListener('click', () => {
    const message = chatInput?.value || '';
    sendChatMessage(message);
});

chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = chatInput.value || '';
        sendChatMessage(message);
    }
});

quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
        sendChatMessage(btn.textContent);
    });
});

// ============== SCROLL TO TOP ==============
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn?.classList.remove('translate-y-20', 'opacity-0');
    } else {
        scrollTopBtn?.classList.add('translate-y-20', 'opacity-0');
    }
});

scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============== CUSTOM CURSOR ==============
const cursor = document.getElementById('custom-cursor');
const cursorDot = document.getElementById('cursor-dot');

if (!window.matchMedia('(pointer: coarse)').matches) {
    document.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
        if (cursorDot) {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        }
    });

    document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor?.classList.add('scale-150');
        });
        el.addEventListener('mouseleave', () => {
            cursor?.classList.remove('scale-150');
        });
    });
}

// ============== SMOOTH SCROLL ==============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - navHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============== NAVBAR SCROLL EFFECT ==============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar?.classList.add('shadow-md', 'bg-white/90', 'dark:bg-black/90');
    } else {
        navbar?.classList.remove('shadow-md', 'bg-white/90', 'dark:bg-black/90');
    }
});

// ============== INITIALIZATION ==============
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});