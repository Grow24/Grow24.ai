#!/usr/bin/env python3
"""
Convert Unicode math and plain text math notation to LaTeX format (Version 2 - Improved)
"""

import json
import re

def convert_to_latex(text):
    """Convert common math patterns to LaTeX with better context awareness"""
    if not text:
        return text
    
    result = text
    
    # Convert Unicode characters first
    superscript_map = {
        '²': '^2', '³': '^3', '⁴': '^4', 'ⁿ': '^n',
        '⁺': '+', '⁻': '-', '⁰': '^0', '¹': '^1'
    }
    subscript_map = {
        '₀': '_0', '₁': '_1', '₂': '_2', '₃': '_3', '₄': '_4',
        '₅': '_5', '₆': '_6', '₇': '_7', '₈': '_8', '₉': '_9', 'ₙ': '_n'
    }
    
    for uni, latex in superscript_map.items():
        result = result.replace(uni, f'${latex}$')
    for uni, latex in subscript_map.items():
        result = result.replace(uni, f'${latex}$')
    
    # Clean up dashes
    result = result.replace('–', '-').replace('−', '-')
    
    # Math symbols
    result = result.replace('≤', r'$\leq$')
    result = result.replace('≥', r'$\geq$')
    result = result.replace('≠', r'$\neq$')
    result = result.replace('√', r'$\sqrt{}$')
    
    # Context-aware pattern matching:
    # If we see "sequence of" or "x1, x2," → it's a SEQUENCE (subscripts)
    is_sequence_context = bool(re.search(r'sequence|x1,\s*x2|x1\s*[-–]\s*x2\s*\+\s*x3', result))
    
    if is_sequence_context:
        # SEQUENCE MODE: x1, x2, x3, ... xn, x49, x50 → subscripts
        result = re.sub(r'\b([xyz])(\d+)\b', r'$\1_{\2}$', result)
        result = re.sub(r'\b([xyz])n\b', r'$\1_n$', result)
    else:
        # EQUATION MODE: x2, y2, n2, ax2, bx2 → superscripts (squared)
        result = re.sub(r'([a-z])2\b', r'$\1^2$', result)
        result = re.sub(r'([a-z])3\b', r'$\1^3$', result)
        result = re.sub(r'([a-z])4\b', r'$\1^4$', result)
    
    # Clean up double/adjacent $
    result = re.sub(r'\$+', '$', result)
    result = re.sub(r'\$\s*\$', '', result)
    result = re.sub(r'\$([^$]*)\$\s*\$([^$]*)\$', r'$\1 \2$', result)
    
    return result

def add_latex_to_questions(input_file='cleaned_questions.json', output_file='cleaned_questions_latex.json'):
    """Add LaTeX markup to questions"""
    
    print("="*80)
    print("Adding LaTeX Markup to Questions (Version 2)")
    print("="*80)
    
    with open(input_file, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print(f"\n✅ Loaded {len(questions)} questions from {input_file}")
    
    latex_added_count = 0
    for i, q in enumerate(questions, 1):
        original_text = q.get('question', '')
        latex_text = convert_to_latex(original_text)
        
        if latex_text != original_text:
            print(f"\nQ{i:02d}: Added LaTeX markup")
            print(f"  Before: {original_text[:80]}...")
            print(f"  After:  {latex_text[:80]}...")
            latex_added_count += 1
        
        q['question'] = latex_text
        
        # Convert options too
        for j in range(1, 6):
            option_key = f'option{j}'
            if option_key in q and q[option_key]:
                original_option = q[option_key]
                latex_option = convert_to_latex(original_option)
                if latex_option != original_option:
                    print(f"  Option{j}: {original_option} → {latex_option}")
                q[option_key] = latex_option
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    
    print("\n" + "="*80)
    print(f"✅ LaTeX markup added to {latex_added_count} questions")
    print(f"✅ Saved to: {output_file}")
    print("="*80)
    print(f"\nNext step: Upload to Google Sheets")
    print(f"  ./venv/bin/python upload.py \"CAT 2022 - QA (Slot 2)\"")

if __name__ == "__main__":
    add_latex_to_questions()
