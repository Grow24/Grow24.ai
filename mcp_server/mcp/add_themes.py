#!/usr/bin/env python3
"""
Auto-classify questions into themes/topics based on content
"""

import json
import re
from pathlib import Path

# Theme keywords mapping
THEME_KEYWORDS = {
    'Algebra': [
        r'\bx\b', r'\by\b', r'\bz\b',  # Variables
        r'equation', r'linear', r'quadratic', r'polynomial',
        r'root', r'solve', r'coefficient', r'expression',
        r'variable', r'factor', r'expand', r'simplify'
    ],
    'Geometry': [
        r'triangle', r'circle', r'square', r'rectangle', r'polygon',
        r'angle', r'area', r'perimeter', r'volume', r'radius',
        r'diameter', r'side', r'diagonal', r'parallel', r'perpendicular',
        r'trapezium', r'rhombus', r'parallelogram'
    ],
    'Arithmetic': [
        r'percentage', r'ratio', r'proportion', r'average',
        r'mean', r'median', r'profit', r'loss', r'discount',
        r'interest', r'principal', r'amount', r'price',
        r'cost', r'earn', r'spend', r'save', r'invest'
    ],
    'Probability': [
        r'probability', r'chance', r'random', r'dice',
        r'coin', r'card', r'likely', r'event', r'outcome',
        r'favorable', r'sample space'
    ],
    'Number Theory': [
        r'prime', r'composite', r'divisor', r'factor',
        r'multiple', r'remainder', r'modulo', r'gcd', r'lcm',
        r'integer', r'natural number', r'whole number'
    ],
    'Combinatorics': [
        r'permutation', r'combination', r'arrange',
        r'distribute', r'select', r'choose', r'ways to',
        r'committee', r'group'
    ],
    'Functions': [
        r'function', r'domain', r'range', r'f\(', r'g\(',
        r'inverse', r'composition', r'logarithm', r'log',
        r'exponential', r'polynomial function'
    ],
    'Sequences & Series': [
        r'sequence', r'series', r'arithmetic progression',
        r'geometric progression', r'a\.p\.', r'g\.p\.',
        r'term', r'sum of', r'nth term'
    ],
    'Inequalities': [
        r'inequality', r'greater than', r'less than',
        r'maximum', r'minimum', r'range of', r'interval'
    ],
    'Work & Time': [
        r'work', r'complete', r'task', r'hours', r'days',
        r'pipe', r'fill', r'drain', r'together', r'alone',
        r'efficiency'
    ],
    'Speed & Distance': [
        r'speed', r'distance', r'time', r'velocity',
        r'train', r'car', r'bus', r'travel', r'journey',
        r'overtake', r'meet', r'opposite direction'
    ],
    'Mensuration': [
        r'area', r'volume', r'surface area', r'curved surface',
        r'cylinder', r'cone', r'sphere', r'cube', r'cuboid',
        r'prism', r'pyramid'
    ],
}

def classify_question(question_text):
    """
    Classify a question into a theme based on keywords
    Returns the most matching theme or 'General' if no match
    """
    if not question_text:
        return 'General'
    
    text_lower = question_text.lower()
    theme_scores = {}
    
    # Count keyword matches for each theme
    for theme, keywords in THEME_KEYWORDS.items():
        score = 0
        for keyword_pattern in keywords:
            matches = re.findall(keyword_pattern, text_lower, re.IGNORECASE)
            score += len(matches)
        
        if score > 0:
            theme_scores[theme] = score
    
    # Return theme with highest score
    if theme_scores:
        best_theme = max(theme_scores, key=theme_scores.get)
        return best_theme
    
    return 'General'

def add_themes_to_questions(input_file, output_file=None):
    """
    Read questions from JSON, classify them, and add theme field
    """
    # Read input file
    input_path = Path(input_file)
    if not input_path.exists():
        print(f"❌ File not found: {input_file}")
        return False
    
    print(f"📖 Reading questions from {input_file}...")
    with open(input_path, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print(f"✅ Loaded {len(questions)} questions")
    
    # Classify each question
    print("\n🔍 Classifying questions by theme...")
    theme_counts = {}
    
    for i, question in enumerate(questions, 1):
        question_text = question.get('question', '')
        theme = classify_question(question_text)
        question['theme'] = theme
        
        # Count themes
        theme_counts[theme] = theme_counts.get(theme, 0) + 1
        
        # Show progress every 5 questions
        if i % 5 == 0 or i == len(questions):
            print(f"  Classified {i}/{len(questions)} questions...", end='\r')
    
    print(f"\n✅ Classification complete!")
    
    # Display theme distribution
    print("\n📊 Theme Distribution:")
    for theme, count in sorted(theme_counts.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / len(questions)) * 100
        print(f"  {theme:20s}: {count:3d} questions ({percentage:5.1f}%)")
    
    # Determine output file
    if not output_file:
        # Create output filename based on input
        if '_themed' in input_file:
            output_file = input_file
        else:
            output_file = str(input_path.parent / input_path.name.replace('.json', '_themed.json'))
    
    # Write output file
    print(f"\n💾 Writing to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Saved {len(questions)} questions with themes to {output_file}")
    
    # Show sample questions
    print("\n📝 Sample Classifications:")
    for i, question in enumerate(questions[:3], 1):
        theme = question.get('theme', 'Unknown')
        text_preview = question.get('question', '')[:80]
        print(f"\n  Q{i}: [{theme}]")
        print(f"      {text_preview}...")
    
    return True

def main():
    """Main function"""
    import sys
    
    print("="*80)
    print("Auto-Theme Classifier for Questions")
    print("="*80)
    
    # Default to cleaned_questions_latex.json
    input_file = 'cleaned_questions_latex.json'
    
    # Allow command-line argument
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    
    # Process
    success = add_themes_to_questions(input_file)
    
    if success:
        print("\n" + "="*80)
        print("✅ DONE! Questions have been classified into themes.")
        print("="*80)
        print("\nYou can now upload using:")
        print("  python upload.py \"CAT 2022 - QA (Slot 2)\"")
    else:
        print("\n❌ Failed to process questions")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
