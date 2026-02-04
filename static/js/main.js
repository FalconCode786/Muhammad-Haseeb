// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
html.classList.add(currentTheme);

themeToggle?.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Typing Animation
const typingText = document.getElementById('typing-text');
const roles = ['Graphic Designer', 'Python Developer', 'Frontend Engineer', 'Creative Technologist'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function type() {
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

// Skill Bars Animation
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
    });
};

// Intersection Observer for skill bars
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateSkillBars, 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(skillsSection);
}

// Portfolio Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => {
            b.classList.remove('bg-zinc-900', 'dark:bg-white', 'text-white', 'dark:text-zinc-900');
            b.classList.add('border', 'border-zinc-200', 'dark:border-zinc-800', 'bg-transparent', 'text-zinc-700', 'dark:text-zinc-300');
        });
        btn.classList.remove('border', 'border-zinc-200', 'dark:border-zinc-800', 'bg-transparent', 'text-zinc-700', 'dark:text-zinc-300');
        btn.classList.add('bg-zinc-900', 'dark:bg-white', 'text-white', 'dark:text-zinc-900');

        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Contact Form Submission - FIXED ERROR HANDLING
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i> Sending...';
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        project_type: formData.get('project_type'),
        budget: formData.get('budget'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        website: formData.get('website')
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned non-JSON response. Please try again later.');
        }

        const result = await response.json();

        formStatus.classList.remove('hidden');
        
        if (response.ok && result.ok) {
            formStatus.innerHTML = `<p class="text-sm font-medium text-green-600 dark:text-green-400"><i class="fas fa-check-circle mr-2"></i>${result.message}</p>`;
            contactForm.reset();
        } else {
            formStatus.innerHTML = `<p class="text-sm font-medium text-red-600 dark:text-red-400"><i class="fas fa-exclamation-circle mr-2"></i>${result.error || 'An error occurred'}</p>`;
        }
    } catch (error) {
        console.error('Form submission error:', error);
        formStatus.classList.remove('hidden');
        formStatus.innerHTML = `<p class="text-sm font-medium text-red-600 dark:text-red-400"><i class="fas fa-exclamation-circle mr-2"></i>${error.message || 'Failed to send message. Please try again.'}</p>`;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane text-xs"></i>';
        
        setTimeout(() => {
            formStatus.classList.add('hidden');
        }, 5000);
    }
});

// Chatbot
const chatBtn = document.getElementById('chat-btn');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendMessage = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');
const quickReplies = document.querySelectorAll('.quick-reply');

function toggleChat() {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
        chatInput.focus();
    }
}

chatBtn?.addEventListener('click', toggleChat);
closeChat?.addEventListener('click', toggleChat);

async function sendChatMessage(message) {
    // Add user message
    const userDiv = document.createElement('div');
    userDiv.className = 'flex gap-3 justify-end';
    userDiv.innerHTML = `
        <div class="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-900 dark:bg-white px-4 py-2 text-sm text-white dark:text-zinc-900 max-w-[80%]">
            ${message}
        </div>
        <div class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 text-xs flex-shrink-0">
            <i class="fas fa-user"></i>
        </div>
    `;
    chatMessages.appendChild(userDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'flex gap-3';
    typingDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 text-xs flex-shrink-0 border border-zinc-200 dark:border-zinc-800">
            <i class="fas fa-robot"></i>
        </div>
        <div class="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400">
            <i class="fas fa-ellipsis-h"></i>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid response from server');
        }

        const data = await response.json();
        
        // Remove typing indicator
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();

        // Add bot response
        const botDiv = document.createElement('div');
        botDiv.className = 'flex gap-3';
        botDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 text-xs flex-shrink-0 border border-zinc-200 dark:border-zinc-800">
                <i class="fas fa-robot"></i>
            </div>
            <div class="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 max-w-[80%]">
                ${data.response || data.error || "I'm sorry, I didn't understand that."}
            </div>
        `;
        chatMessages.appendChild(botDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
    } catch (error) {
        console.error('Chat error:', error);
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'flex gap-3';
        errorDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 text-xs flex-shrink-0 border border-zinc-200 dark:border-zinc-800">
                <i class="fas fa-robot"></i>
            </div>
            <div class="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-sm text-red-600 dark:text-red-400 max-w-[80%]">
                Sorry, I'm having trouble connecting. Please try again later.
            </div>
        `;
        chatMessages.appendChild(errorDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

sendMessage?.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        sendChatMessage(message);
        chatInput.value = '';
    }
});

chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = chatInput.value.trim();
        if (message) {
            sendChatMessage(message);
            chatInput.value = '';
        }
    }
});

quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
        sendChatMessage(btn.textContent);
    });
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.remove('translate-y-20', 'opacity-0');
    } else {
        scrollTopBtn.classList.add('translate-y-20', 'opacity-0');
    }
});

scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Custom Cursor (Desktop only)
const cursor = document.getElementById('custom-cursor');
const cursorDot = document.getElementById('cursor-dot');

if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-sm');
    } else {
        navbar.classList.remove('shadow-sm');
    }
});