from flask import Blueprint, render_template, request, redirect, url_for
from flask_login import login_required, current_user
from models import db, Stat

main_bp = Blueprint('main', __name__, template_folder='../templates')

@main_bp.route('/')
@login_required
def index():
    return render_template('index.html')

@main_bp.route('/submit', methods=['POST'])
@login_required
def submit():
    wpm = float(request.form['wpm'])
    accuracy = float(request.form['accuracy'])
    new_stat = Stat(wpm=wpm, accuracy=accuracy, user_id=current_user.id)
    db.session.add(new_stat)
    db.session.commit()
    return redirect(url_for('main.stats'))

@main_bp.route('/stats')
@login_required
def stats():
    stats_objects = Stat.query.filter_by(user_id=current_user.id).all()
    
    # Convert to JSON-serializable format
    stats = [
        {
            "wpm": s.wpm,
            "accuracy": s.accuracy,
            "date": s.date.isoformat()  # convert datetime to string
        }
        for s in stats_objects
    ]
    
    return render_template('stats.html', stats=stats)
