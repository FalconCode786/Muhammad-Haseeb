import os
from datetime import datetime
from functools import wraps
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import re

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///portfolio.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ContactSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    company = db.Column(db.String(100))
    budget = db.Column(db.String(50))
    project_type = db.Column(db.String(50))
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='unread')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PortfolioItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500))
    technologies = db.Column(db.String(200))
    demo_link = db.Column(db.String(500))
    github_link = db.Column(db.String(500))
    order = db.Column(db.Integer, default=0)

class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    excerpt = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text)
    category = db.Column(db.String(50))
    read_time = db.Column(db.String(10))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Admin Authentication Decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route('/')
def index():
    skills = {
        'design': [
            {'name': 'Adobe Photoshop', 'level': 95},
            {'name': 'Figma', 'level': 90},
            {'name': 'Illustrator', 'level': 85},
            {'name': 'Adobe XD', 'level': 80},
            {'name': 'Sketch', 'level': 75}
        ],
        'python': [
            {'name': 'Python', 'level': 95},
            {'name': 'Flask', 'level': 90},
            {'name': 'Regex/Pattern Matching', 'level': 85},
            {'name': 'Hugging Face Transformers', 'level': 80},
            {'name': 'Web Scraping', 'level': 85}
        ],
        'frontend': [
            {'name': 'HTML5/CSS3', 'level': 95},
            {'name': 'JavaScript', 'level': 90},
            {'name': 'React.js', 'level': 85},
            {'name': 'Vue.js', 'level': 80},
            {'name': 'TailwindCSS', 'level': 95}
        ]
    }
    
    # Timeline based on PRD - Updated for accuracy
    timeline = [
        {
            'year': '2021',
            'title': 'Started Coding Journey',
            'description': 'Began learning Python fundamentals and programming basics in Rawalpindi.',
            'quote': 'Every expert was once a beginner.'
        },
        {
            'year': '2022',
            'title': 'First Python Project',
            'description': 'Built first web scraping tools and automation scripts using Python and Regex.',
            'quote': 'Code is poetry written in logic.'
        },
        {
            'year': '2023',
            'title': 'AI & NLP Integration',
            'description': 'Started working with Hugging Face transformers and text processing algorithms.',
            'quote': 'Where data meets intelligence.'
        },
        {
            'year': '2024',
            'title': 'Full Stack Developer',
            'description': 'Combining Python backend expertise with modern web deployment on Vercel.',
            'quote': 'From scripts to scalable applications.'
        }
    ]
    
    # All projects are Python-based with specific technologies
    projects = [
        {
            'id': 1,
            'title': 'CV Job Scraper',
            'category': 'python',
            'description': 'Automated CV parsing and job matching platform using regex pattern matching to extract relevant information from job listings and candidate profiles',
            'image': 'scraper.jpg',
            'tech': 'Python, Regex, Pattern Matching, Flask',
            'demo_link': 'https://cv-job-scrapper.vercel.app/',  # Removed space
            'github_link': 'https://github.com/FalconCode786/Job-Scrapper.git'  # Removed space
        },
        {
            'id': 2,
            'title': 'AI Notes Generator',
            'category': 'python',
            'description': 'Intelligent note-taking application using Hugging Face Transformers to automatically generate structured summaries from lectures and documents',
            'image': 'notes.jpg',
            'tech': 'Python, Hugging Face, NLP, Transformers',
            'demo_link': 'https://notes-generator-mu.vercel.app/',  # Removed space
            'github_link': 'https://github.com/FalconCode786/Notes-Generator.git'  # Removed space
        },
        {
            'id': 3,
            'title': 'Plagiarism Checker Pro',
            'category': 'python',
            'description': 'Advanced Turnitin alternative using regex-based text similarity analysis, pattern matching for citation detection, and comprehensive originality scoring',
            'image': 'plagiarism.jpg',
            'tech': 'Python, Regex, Text Processing, Flask',
            'demo_link': 'https://turnitin-alternative.vercel.app/',  # Removed space
            'github_link': 'https://github.com/FalconCode786/Turnitin-Alternative.git'  # Removed space
        }
    ]
    
    return render_template('index.html', 
                         skills=skills, 
                         timeline=timeline, 
                         projects=projects)

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    
    # Honeypot check (anti-spam)
    if data.get('website'):
        return jsonify({'error': 'Spam detected'}), 400
    
    # Validation
    required = ['name', 'email', 'subject', 'message']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    # Email validation
    email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(email_pattern, data['email']):
        return jsonify({'error': 'Invalid email'}), 400
    
    submission = ContactSubmission(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone'),
        company=data.get('company'),
        budget=data.get('budget'),
        project_type=data.get('project_type'),
        subject=data['subject'],
        message=data['message']
    )
    
    db.session.add(submission)
    db.session.commit()
    
    return jsonify({'ok': True, 'message': 'Message sent successfully!'})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '').lower()
    
    # Rule-based chatbot - no API keys needed
    responses = {
        'contact': "You can reach Muhammad at muhammadhaseeb.code@gmail.com or use the contact form below.",
        'email': "Email: muhammadhaseeb.code@gmail.com",
        'location': "Muhammad is based in Rawalpindi, Pakistan, available for local and remote work.",
        'pakistan': "Yes, Muhammad is based in Pakistan and works with clients globally!",
        'skills': "Muhammad specializes in Python Development (Flask, Regex, Hugging Face), Graphic Design (Photoshop, Figma), and Front-End (React, Vue).",
        'python': "Muhammad is experienced in Python, Flask, Regex pattern matching, Hugging Face Transformers, and web scraping.",
        'regex': "Regex (Regular Expressions) is Muhammad's specialty for text processing, pattern matching, and data extraction in the Job Scraper and Plagiarism Checker projects.",
        'hugging face': "The Notes Generator uses Hugging Face Transformers library for AI-powered text summarization and NLP tasks.",
        'design': "He creates stunning designs using Adobe Photoshop, Figma, Illustrator, and XD.",
        'frontend': "Expert in React, Vue.js, HTML/CSS, and TailwindCSS with modern responsive design.",
        'hire': "Great! Use the contact form below or email directly. Muhammad is available for freelance and full-time opportunities.",
        'price': "Budget ranges from less than $1,000 to $25,000+ depending on project scope. Contact for detailed quote!",
        'experience': "Muhammad has been coding since 2021, specializing in Python, Regex, and AI integration. Check the About timeline!",
        'job scraper': "CV Job Scraper uses Python and Regex to parse job listings and match them with candidate profiles. Live demo available!",
        'notes generator': "AI Notes Generator uses Hugging Face Transformers to create intelligent summaries from text and documents.",
        'plagiarism': "Plagiarism Checker uses advanced regex patterns to detect text similarity and check for copied content.",
        'hello': "Asalamu alikum! How can I help you learn about Muhammad Haseeb today?",
        'hi': "Hello! I'm Haseeb's assistant. Ask about his Python skills, AI projects, or how I can help you!",
        'github': "Check his code at https://github.com/FalconCode786",
        'linkedin': "Connect professionally at https://linkedin.com/in/muhammad-haseeb-980b16366/",
        'dribbble': "See design work at https://dribbble.com/mh324",
        'default': "I'm here to help! Ask about Muhammad's Python projects, AI tools, contact info, or services."
    }

    response_text = responses['default']
    for key, value in responses.items():
        if key in user_message:
            response_text = value
            break
    
    return jsonify({'response': response_text})

# Admin Routes
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = Admin.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password, password):
            session['admin_id'] = user.id
            return redirect(url_for('admin_dashboard'))
        flash('Invalid credentials')
    
    return render_template('admin/login.html')

@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_id', None)
    return redirect(url_for('admin_login'))

@app.route('/admin')
@login_required
def admin_dashboard():
    stats = {
        'total': ContactSubmission.query.count(),
        'unread': ContactSubmission.query.filter_by(status='unread').count(),
        'read': ContactSubmission.query.filter_by(status='read').count(),
        'replied': ContactSubmission.query.filter_by(status='replied').count(),
        'archived': ContactSubmission.query.filter_by(status='archived').count()
    }
    submissions = ContactSubmission.query.order_by(ContactSubmission.created_at.desc()).all()
    return render_template('admin/dashboard.html', stats=stats, submissions=submissions)

@app.route('/api/admin/submissions', methods=['GET'])
@login_required
def get_submissions():
    status = request.args.get('status')
    query = ContactSubmission.query
    if status:
        query = query.filter_by(status=status)
    submissions = query.order_by(ContactSubmission.created_at.desc()).all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'email': s.email,
        'subject': s.subject,
        'status': s.status,
        'created_at': s.created_at.strftime('%Y-%m-%d %H:%M'),
        'project_type': s.project_type,
        'budget': s.budget
    } for s in submissions])

@app.route('/api/admin/submissions/<int:id>', methods=['DELETE'])
@login_required
def delete_submission(id):
    sub = ContactSubmission.query.get_or_404(id)
    db.session.delete(sub)
    db.session.commit()
    return jsonify({'ok': True})

@app.route('/api/admin/submissions/<int:id>/status', methods=['PATCH'])
@login_required
def update_status(id):
    sub = ContactSubmission.query.get_or_404(id)
    data = request.get_json()
    sub.status = data.get('status', sub.status)
    db.session.commit()
    return jsonify({'ok': True})

# Initialize Database
def init_db():
    with app.app_context():
        db.create_all()
        if not Admin.query.first():
            admin = Admin(
                email='admin@muhammadhaseeb.com',
                password=generate_password_hash('admin123'),
                name='Muhammad Haseeb'
            )
            db.session.add(admin)
            db.session.commit()
            print("Default admin created. Email: admin@muhammadhaseeb.com, Password: admin123")

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)