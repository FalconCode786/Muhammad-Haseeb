// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check local storage or system preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
});

// Custom Cursor (Desktop Only)
const cursor = document.getElementById('custom-cursor');
const cursorDot = document.getElementById('cursor-dot');

if (window.matchMedia('(pointer: fine)').matches && cursor && cursorDot) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Smooth follow for outer cursor
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Slight delay for dot
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .project-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = '#8B5CF6';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = '#3B82F6';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Typing Effect
const texts = ["Design.", "Code.", "Inspire."];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typing-text');

function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

if (typingElement) type();

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });
}

// Portfolio Filtering with Animation
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

function filterProjects(category) {
    projectCards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            // Show card with stagger animation
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        } else {
            // Hide card
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        
        // Update active button state
        filterBtns.forEach(b => {
            b.classList.remove('bg-primary', 'text-white');
            b.classList.add('bg-gray-200', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
        });
        btn.classList.remove('bg-gray-200', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
        btn.classList.add('bg-primary', 'text-white');
        
        filterProjects(filter);
    });
});

// Initialize project cards animation state
projectCards.forEach(card => {
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
});

// Navbar Scroll Effect with hide/show on scroll direction
const navbar = document.getElementById('navbar');
let lastScroll = 0;
let ticking = false;

function updateNavbar() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('shadow-lg', 'bg-white/95', 'dark:bg-gray-900/95', 'backdrop-blur-md');
        navbar.classList.remove('bg-white/80', 'dark:bg-darkbg/80');
    } else {
        navbar.classList.remove('shadow-lg', 'bg-white/95', 'dark:bg-gray-900/95');
        navbar.classList.add('bg-white/80', 'dark:bg-darkbg/80');
    }
    
    lastScroll = currentScroll;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scroll-top');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.remove('translate-y-20', 'opacity-0');
        } else {
            scrollTopBtn.classList.add('translate-y-20', 'opacity-0');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Skill Bars Animation on Scroll
const skillSection = document.querySelector('#skills');
if (skillSection) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width;
                        // Add glow effect when animation completes
                        setTimeout(() => {
                            bar.classList.add('shadow-lg', 'shadow-primary/50');
                        }, 1500);
                    }, index * 150);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    skillObserver.observe(skillSection);
}

// Timeline Animation on Scroll
const timelineItems = document.querySelectorAll('#about .relative.flex');
if (timelineItems.length > 0) {
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        timelineObserver.observe(item);
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Loading state
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading mr-2"></div> Sending...';
        
        const formData = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            phone: contactForm.phone.value,
            company: contactForm.company.value,
            project_type: contactForm.project_type.value,
            budget: contactForm.budget.value,
            subject: contactForm.subject.value,
            message: contactForm.message.value,
            website: contactForm.website.value // Honeypot field
        };
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.ok) {
                showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error(result.error || 'Something went wrong');
            }
        } catch (error) {
            showFormStatus(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });
}

function showFormStatus(message, type) {
    if (!formStatus) return;
    
    const statusP = formStatus.querySelector('p');
    statusP.textContent = message;
    
    // Reset classes
    statusP.className = 'font-medium';
    if (type === 'success') {
        statusP.classList.add('text-green-500');
    } else {
        statusP.classList.add('text-red-500');
    }
    
    formStatus.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        formStatus.classList.add('hidden');
    }, 5000);
}

// Chatbot Functionality
const chatBtn = document.getElementById('chat-btn');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendMessage = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');

if (chatBtn && chatWindow) {
    // Toggle chat window
    chatBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
            // Add animation class
            chatWindow.classList.add('animate-fade-in');
        }
    });

    // Close chat
    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
        });
    }

    // Send message function
    async function sendChatMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        // Add user message
        addMessage(text, true);
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({message: text})
            });
            
            const data = await response.json();
            
            // Remove typing indicator and add response
            removeTypingIndicator();
            addMessage(data.response, false);
            
        } catch (error) {
            removeTypingIndicator();
            addMessage("Sorry, I'm having trouble connecting. Please try again later.", false);
        }
    }

    // Event listeners for sending messages
    if (sendMessage) {
        sendMessage.addEventListener('click', sendChatMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }

    // Quick replies
    document.querySelectorAll('.quick-reply').forEach(btn => {
        btn.addEventListener('click', () => {
            const replyText = btn.textContent;
            
            // Map quick reply text to full questions
            const replyMap = {
                'Skills?': 'What are your skills?',
                'Contact': 'How can I contact you?',
                'Location': 'Where are you located?',
                'Experience': 'Tell me about your experience'
            };
            
            const fullQuestion = replyMap[replyText] || replyText;
            chatInput.value = fullQuestion;
            sendChatMessage();
        });
    });
}

function addMessage(text, isUser = false) {
    if (!chatMessages) return;
    
    const div = document.createElement('div');
    div.className = 'flex gap-3 message-new mb-4';
    
    if (isUser) {
        div.classList.add('flex-row-reverse');
        div.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                <i class="fas fa-user"></i>
            </div>
            <div class="bg-primary text-white rounded-2xl rounded-tr-none px-4 py-2 text-sm max-w-[80%] shadow-md">
                ${escapeHtml(text)}
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs flex-shrink-0">
                <i class="fas fa-robot"></i>
            </div>
            <div class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none px-4 py-2 text-sm max-w-[80%] shadow-md">
                ${escapeHtml(text)}
            </div>
        `;
    }
    
    chatMessages.appendChild(div);
    scrollToBottom();
}

function showTypingIndicator() {
    if (!chatMessages) return;
    
    const div = document.createElement('div');
    div.id = 'typing-indicator';
    div.className = 'flex gap-3 mb-4';
    div.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs flex-shrink-0">
            <i class="fas fa-robot"></i>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-1">
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
        </div>
    `;
    chatMessages.appendChild(div);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function scrollToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Project Card Button Handling - Ensure external links work
document.querySelectorAll('.project-card a[href]').forEach(link => {
    // Trim any whitespace from href (fix for backend trailing spaces)
    const cleanHref = link.getAttribute('href').trim();
    link.setAttribute('href', cleanHref);
    
    // Ensure external links work properly
    if (cleanHref !== '#' && cleanHref.startsWith('http')) {
        link.addEventListener('click', (e) => {
            // Stop propagation to prevent any parent handlers from interfering
            e.stopPropagation();
            
            // Verify link opens (for debugging)
            console.log('Opening:', cleanHref);
            
            // Ensure target is _blank for external links (belt and suspenders)
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
            }
            if (!link.hasAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
            
            // Allow default behavior (opening link)
            return true;
        });
    } else if (cleanHref === '#') {
        // Disable click for placeholder links
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Demo coming soon');
        });
    }
});

// Safeguard: Prevent smooth scroll handler from interfering with external project links
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', (e) => {
        // Don't prevent default for external links
        e.stopImmediatePropagation();
    });
});

// Prevent double-tap zoom on mobile for buttons (but not for external links)
document.querySelectorAll('button').forEach(el => {
    el.addEventListener('touchstart', function(){}, {passive: true});
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class for initial animations
    document.body.classList.add('loaded');
    
    // Initialize any elements that need starting animations
    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            
            // Verify buttons are clickable
            const links = card.querySelectorAll('a');
            links.forEach(link => {
                if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
                    link.style.pointerEvents = 'auto';
                    link.style.cursor = 'pointer';
                }
            });
        });
    }, 100);
});