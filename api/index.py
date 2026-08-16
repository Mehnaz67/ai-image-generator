import sys
import os

# Add root folder to sys.path so Vercel can locate app.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app