import os
import sys
import traceback
from datetime import datetime
from functools import wraps
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///portfolio.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True,
    'pool_recycle': 300,
}

# Enable CORS for all domains (adjust in production)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize database
db = SQLAlchemy(app)

# ============== DATABASE MODELS ==============

class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Admin {self.email}>'

class ContactSubmission(db.Model):
    __tablename__ = 'contact_submission'
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

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else None
        }

class PortfolioItem(db.Model):
    __tablename__ = 'portfolio_item'
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
    __tablename__ = 'blog_post'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    excerpt = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text)
    category = db.Column(db.String(50))
    read_time = db.Column(db.String(10))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ============== ERROR HANDLERS ==============

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad request', 'message': str(error)}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found', 'message': str(error)}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    traceback.print_exc()
    return jsonify({
        'error': 'Internal server error',
        'message': 'Something went wrong on our end. Please try again later.'
    }), 500

@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

# ============== AUTH DECORATORS ==============

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            if request.is_json or request.headers.get('Accept') == 'application/json':
                return jsonify({'error': 'Unauthorized'}), 401
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

# ============== MAIN ROUTES ==============

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
    
    projects = [
        {
            'id': 1,
            'title': 'CV Job Scraper',
            'category': 'python',
            'description': 'Automated CV parsing and job matching platform using regex pattern matching to extract relevant information from job listings and candidate profiles',
            'image': 'scraper.jpg',
            'tech': 'Python, Regex, Pattern Matching, Flask',
            'demo_link': 'https://cv-job-scrapper.vercel.app/',
            'github_link': 'https://github.com/FalconCode786/Job-Scrapper.git'
        },
        {
            'id': 2,
            'title': 'AI Notes Generator',
            'category': 'python',
            'description': 'Intelligent note-taking application using Hugging Face Transformers to automatically generate structured summaries from lectures and documents',
            'image': 'notes.jpg',
            'tech': 'Python, Hugging Face, NLP, Transformers',
            'demo_link': 'https://notes-generator-mu.vercel.app/',
            'github_link': 'https://github.com/FalconCode786/Notes-Generator.git'
        },
        {
            'id': 3,
            'title': 'Plagiarism Checker Pro',
            'category': 'python',
            'description': 'Advanced Turnitin alternative using regex-based text similarity analysis, pattern matching for citation detection, and comprehensive originality scoring',
            'image': 'plagiarism.jpg',
            'tech': 'Python, Regex, Text Processing, Flask',
            'demo_link': 'https://turnitin-alternative.vercel.app/',
            'github_link': 'https://github.com/FalconCode786/Turnitin-Alternative.git'
        }
    ]
    
    return render_template('index.html', 
                         skills=skills, 
                         timeline=timeline, 
                         projects=projects)

# ============== API ROUTES ==============

@app.route('/api/contact', methods=['POST', 'OPTIONS'])
def contact():
    # Handle preflight request
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    try:
        app.logger.info(f"Contact form submission received")
        app.logger.info(f"Content-Type: {request.content_type}")
        app.logger.info(f"Request method: {request.method}")
        
        # Check if request has JSON data
        if not request.is_json:
            app.logger.warning("Request is not JSON")
            return jsonify({
                'error': 'Invalid request format',
                'message': 'Content-Type must be application/json'
            }), 400
        
        data = request.get_json()
        app.logger.info(f"Received data: {data}")
        
        if not data:
            return jsonify({
                'error': 'No data provided',
                'message': 'Request body is empty'
            }), 400
        
        # Honeypot check (anti-spam) - if website field is filled, it's likely a bot
        if data.get('website') and str(data.get('website')).strip():
            app.logger.warning(f"Honeypot triggered with value: {data.get('website')}")
            return jsonify({
                'error': 'Spam detected',
                'message': 'Your submission was flagged as spam.'
            }), 400
        
        # Validation
        required_fields = ['name', 'email', 'subject', 'message']
        missing_fields = []
        
        for field in required_fields:
            if not data.get(field) or not str(data.get(field)).strip():
                missing_fields.append(field)
        
        if missing_fields:
            app.logger.warning(f"Missing fields: {missing_fields}")
            return jsonify({
                'error': 'Validation failed',
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Email validation
        email = str(data.get('email', '')).strip().lower()
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        if not re.match(email_pattern, email):
            return jsonify({
                'error': 'Invalid email',
                'message': 'Please provide a valid email address'
            }), 400
        
        # Create submission object
        try:
            submission = ContactSubmission(
                name=str(data.get('name', '')).strip(),
                email=email,
                phone=str(data.get('phone', '')).strip() if data.get('phone') else None,
                company=str(data.get('company', '')).strip() if data.get('company') else None,
                budget=str(data.get('budget', '')) if data.get('budget') else None,
                project_type=str(data.get('project_type', '')) if data.get('project_type') else None,
                subject=str(data.get('subject', '')).strip(),
                message=str(data.get('message', '')).strip()
            )
            
            db.session.add(submission)
            db.session.commit()
            
            app.logger.info(f"Contact submission saved successfully. ID: {submission.id}")
            
            return jsonify({
                'ok': True,
                'message': 'Message sent successfully! I will get back to you soon.',
                'id': submission.id
            }), 200
            
        except Exception as db_error:
            db.session.rollback()
            app.logger.error(f"Database error: {str(db_error)}")
            app.logger.error(traceback.format_exc())
            return jsonify({
                'error': 'Database error',
                'message': 'Failed to save your message. Please try again later.'
            }), 500
            
    except Exception as e:
        app.logger.error(f"Unexpected error in contact route: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({
            'error': 'Server error',
            'message': 'An unexpected error occurred. Please try again.'
        }), 500

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    try:
        if not request.is_json:
            return jsonify({
                'error': 'Invalid request format',
                'message': 'Content-Type must be application/json'
            }), 400
            
        data = request.get_json()
        
        if not data:
            return jsonify({
                'response': "I didn't receive any message. How can I help you today?"
            }), 200
        
        user_message = str(data.get('message', '')).lower().strip()
        
        if not user_message:
            return jsonify({
                'response': "I didn't catch that. Could you please rephrase?"
            }), 200
        
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
        
        # Check for keyword matches
        for key, value in responses.items():
            if key in user_message:
                response_text = value
                break
        
        return jsonify({'response': response_text}), 200
        
    except Exception as e:
        app.logger.error(f"Chat error: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({
            'response': "I'm having trouble processing your request. Please try again in a moment."
        }), 200

# ============== ADMIN ROUTES ==============

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        
        if not email or not password:
            flash('Please provide both email and password')
            return render_template('admin/login.html')
        
        user = Admin.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password, password):
            session['admin_id'] = user.id
            session.permanent = True
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
    try:
        stats = {
            'total': ContactSubmission.query.count(),
            'unread': ContactSubmission.query.filter_by(status='unread').count(),
            'read': ContactSubmission.query.filter_by(status='read').count(),
            'replied': ContactSubmission.query.filter_by(status='replied').count(),
            'archived': ContactSubmission.query.filter_by(status='archived').count()
        }
        submissions = ContactSubmission.query.order_by(ContactSubmission.created_at.desc()).all()
        return render_template('admin/dashboard.html', stats=stats, submissions=submissions)
    except Exception as e:
        app.logger.error(f"Admin dashboard error: {str(e)}")
        flash('Error loading dashboard')
        return redirect(url_for('admin_login'))

@app.route('/api/admin/submissions', methods=['GET'])
@login_required
def get_submissions():
    try:
        status = request.args.get('status')
        query = ContactSubmission.query
        
        if status:
            query = query.filter_by(status=status)
            
        submissions = query.order_by(ContactSubmission.created_at.desc()).all()
        return jsonify([s.to_dict() for s in submissions])
    except Exception as e:
        app.logger.error(f"Get submissions error: {str(e)}")
        return jsonify({'error': 'Failed to load submissions'}), 500

@app.route('/api/admin/submissions/<int:id>', methods=['DELETE'])
@login_required
def delete_submission(id):
    try:
        sub = ContactSubmission.query.get_or_404(id)
        db.session.delete(sub)
        db.session.commit()
        return jsonify({'ok': True, 'message': 'Submission deleted'})
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Delete submission error: {str(e)}")
        return jsonify({'error': 'Failed to delete submission'}), 500

@app.route('/api/admin/submissions/<int:id>/status', methods=['PATCH'])
@login_required
def update_status(id):
    try:
        sub = ContactSubmission.query.get_or_404(id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        new_status = data.get('status')
        valid_statuses = ['unread', 'read', 'replied', 'archived']
        
        if new_status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
            
        sub.status = new_status
        db.session.commit()
        return jsonify({'ok': True, 'message': 'Status updated'})
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Update status error: {str(e)}")
        return jsonify({'error': 'Failed to update status'}), 500

# ============== DATABASE INITIALIZATION ==============

def init_db():
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            print("Database tables created successfully")
            
            # Create default admin if none exists
            if not Admin.query.first():
                admin = Admin(
                    email='admin@muhammadhaseeb.com',
                    password=generate_password_hash('admin123'),
                    name='Muhammad Haseeb'
                )
                db.session.add(admin)
                db.session.commit()
                print("Default admin created:")
                print("  Email: admin@muhammadhaseeb.com")
                print("  Password: admin123")
            else:
                print("Admin user already exists")
                
        except Exception as e:
            print(f"Error initializing database: {str(e)}")
            traceback.print_exc()

# ============== MAIN ==============

if __name__ == '__main__':
    init_db()
    
    # Run with detailed error logging
    app.run(
        debug=True,
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5000)),
        threaded=True
    )