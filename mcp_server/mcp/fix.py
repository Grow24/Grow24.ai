#!/usr/bin/env python3
"""
Auto-Fix Script - Detects and fixes common scraping errors
"""

import json
import re

def extract_question_from_page_text(page_text_sample):
    """Extract the actual question from page text"""
    try:
        # Strategy: Find everything between "Marks" line and "Previous" button
        # Then work backwards to find where options start
        
        # First, get the text block after marks
        marks_pattern = r'[+\-]\d+\s+Marks(?:,\s*[+\-]\d+\s+Marks)?\s*\n+(.+?)(?:Previous|Clear Response|Mark\n|Save and Next)'
        match = re.search(marks_pattern, page_text_sample, re.DOTALL)
        
        if not match:
            return None
        
        full_block = match.group(1).strip()
        lines = [l.strip() for l in full_block.split('\n') if l.strip()]
        
        if not lines:
            return None
        
        # Find where options likely start by looking for patterns
        option_start_idx = len(lines)
        
        # Look for lines that strongly indicate "end of question"
        question_end_patterns = [
            'if', 'is', 'equals', 'are', 'be', 'was', 'were', 'has', 'have',
            'to', 'of', 'in', 'at', 'by', 'from', 'with', 'than', 'when',
            'then', 'respectively', 'respectively.', 'cm', 'meters', 'nearest to'
        ]
        
        # First pass: Find the last line with a question-ending pattern
        for i in range(len(lines) - 1, -1, -1):
            line = lines[i].lower()
            
            # Check if this line ends with or contains question-ending words
            line_ends_question = any(line.endswith(suffix) or line == suffix for suffix in question_end_patterns)
            
            if line_ends_question:
                # Check if next lines look like options
                # Options are typically: short lines, numbers, single letters, or specific option text
                if i + 1 < len(lines):
                    next_lines = lines[i+1:min(i+6, len(lines))]  # Check next 5 lines
                    
                    # Count how many look like options
                    option_like = 0
                    for nl in next_lines:
                        # Short lines (< 30 chars) or pure numbers or ratios
                        if len(nl) <= 30 or nl.replace('.', '').replace('-', '').replace(',', '').replace(' ', '').isdigit() or ':' in nl:
                            option_like += 1
                    
                    # If 3+ of the next lines look like options, we found the split
                    if option_like >= 3:
                        option_start_idx = i + 1
                        break
        
        # Second pass: If no clear ending found, look for 4+ consecutive very short lines (<=10 chars)
        if option_start_idx == len(lines):
            consecutive_short = 0
            for i in range(len(lines) - 1, -1, -1):
                line = lines[i]
                if len(line) <= 10:
                    consecutive_short += 1
                    if consecutive_short >= 4:
                        option_start_idx = i
                else:
                    consecutive_short = 0
        
        # Extract question (everything before options)
        question_lines = lines[:option_start_idx]
        question = ' '.join(question_lines)
        
        # Clean up extra spaces
        question = ' '.join(question.split())
        
        return question if question else None
        
    except Exception as e:
        print(f"      Error extracting question: {e}")
        return None

def clean_question_text(question_text):
    """Remove UI elements and metadata from question text"""
    if not question_text:
        return question_text
    
    # Remove "Section X" prefix
    question_text = re.sub(r'^Section \d+', '', question_text)
    
    # Remove section names like "CAT 2022 - QA (Slot 2)"
    question_text = re.sub(r'CAT \d+ - [A-Z]+ \(Slot \d+\)', '', question_text)
    
    # Remove "Question X" prefix
    question_text = re.sub(r'Question \d+', '', question_text)
    
    # Remove marks like "+3 Marks" or "+3 Marks, -1 Marks"
    question_text = re.sub(r'[+\-]\d+\s+Marks(?:,\s*[+\-]\d+\s+Marks)?', '', question_text)
    
    # Remove any remaining UI text at the end (after options)
    ui_patterns = ['Previous', 'Clear Response', 'Mark', 'Save and Next', 'Time Left', 'Online Exercise']
    for pattern in ui_patterns:
        if pattern in question_text:
            idx = question_text.index(pattern)
            question_text = question_text[:idx]
    
    # Clean up whitespace
    question_text = ' '.join(question_text.split())
    question_text = question_text.strip()
    
    return question_text

def extract_options_from_page_text(page_text_sample, question_text):
    """Extract options from page text"""
    try:
        # Find question, then get text until "Previous"
        if question_text and question_text[:30] in page_text_sample:
            start = page_text_sample.index(question_text[:30]) + len(question_text)
        else:
            # Alternative: find after Question X and marks
            pattern = r'Question \d+\n\n[+\-\d\s,Marks]+\n\n.+?\n\n'
            match = re.search(pattern, page_text_sample, re.DOTALL)
            if match:
                start = match.end()
            else:
                return []
        
        # Get text until "Previous"
        try:
            end = page_text_sample.index('Previous', start)
        except:
            end = start + 500
        
        options_text = page_text_sample[start:end]
        
        # Split by double newlines
        lines = [l.strip() for l in options_text.split('\n') if l.strip()]
        
        # Filter options (skip very long lines and invalid options)
        options = []
        for line in lines:
            # Skip single character symbols like "+", "-", "=" etc
            if len(line) == 1 and line in ['+', '-', '=', '*', '/', '×', '÷']:
                continue
            # Skip very short lines (likely not real options)
            if len(line) < 1:
                continue
            # Accept reasonable length options
            if len(line) <= 100 and line:
                options.append(line)
                if len(options) >= 5:
                    break
        
        # Check if options are just placeholders (a, b, c, d)
        if len(options) == 4 and options == ['a', 'b', 'c', 'd']:
            # Placeholder options - McGraw Hill doesn't show actual option text
            return []
        
        return options[:5]
    except:
        return []

def auto_fix_questions():
    """Automatically detect and fix common issues"""
    
    print("="*80)
    print("AUTO-FIX: Detecting and Fixing Questions")
    print("="*80)
    
    # Load original scraped data (with passages if available)
    # Try to load from extract_passages.py output first, then fall back to raw scrape
    import os
    if os.path.exists('cleaned_questions_with_passages.json'):
        input_file = 'cleaned_questions_with_passages.json'
        print("📖 Reading from cleaned_questions_with_passages.json (with passages)")
    else:
        input_file = 'scraped_questions.json'
        print("📖 Reading from scraped_questions.json (raw scrape)")
    
    with open(input_file, 'r') as f:
        questions = json.load(f)
    
    fixed_count = 0
    fixed_questions = []
    
    # Check each question
    for i, q in enumerate(questions, 1):
        question_id = f'Q{i:03d}'
        
        # ALWAYS try to extract from page_text_sample (most reliable source)
        page_text_sample = q.get('page_text_sample', '')
        correct_question = extract_question_from_page_text(page_text_sample)
        
        if correct_question:
            print(f"\n✅ Q{i:02d}: Extracted from page text")
            print(f"   Question: {correct_question[:80]}...")
            
            # Extract options
            options = extract_options_from_page_text(page_text_sample, correct_question)
            print(f"   Options: {len(options)} found")
            if options:
                print(f"   {options}")
            
            fixed_count += 1
        else:
            # Fallback: use scraped question (already in JSON)
            print(f"\n⚠️  Q{i:02d}: Could not extract from page text, using scraped data")
            correct_question = q.get('question', 'Question not found')
            options = extract_options_from_page_text(page_text_sample, correct_question)
        
        # Clean the question text to remove UI elements
        correct_question = clean_question_text(correct_question)
        
        # Extract section from page_text_sample
        section = 'Unknown Section'
        page_text = q.get('page_text_sample', '')
        section_match = re.search(r'CAT \d+ - [A-Z]+ \(Slot \d+\)', page_text)
        if section_match:
            section = section_match.group(0)
        elif 'CAT' in page_text:
            # Fallback: try to extract from question_readable
            readable = q.get('question_readable', '')
            section_match = re.search(r'CAT \d+ - [A-Z]+ \(Slot \d+\)', readable)
            if section_match:
                section = section_match.group(0)
        
        # Create fixed question with Unicode math support
        fixed_q = {
            'question_id': question_id,
            'section': section,
            'passage': q.get('passage', ''),  # NEW: Preserve passage for DI/VARC
            'passage_readable': q.get('passage_readable', ''),  # NEW: Preserve readable passage
            'order': i,
            'type': 'MCQ' if options else 'TEXT',
            'question': correct_question,
            'question_readable': q.get('question_readable', correct_question),
            'question_html': q.get('question_html', ''),
            'has_math_unicode': q.get('has_math_unicode', False),
            'marks': q.get('marks', ''),
            'option1': options[0] if len(options) > 0 else '',
            'option2': options[1] if len(options) > 1 else '',
            'option3': options[2] if len(options) > 2 else '',
            'option4': options[3] if len(options) > 3 else '',
            'option5': options[4] if len(options) > 4 else '',
            'screenshot': q.get('screenshot', ''),
            'required': 'TRUE'
        }
        
        fixed_questions.append(fixed_q)
    
    # Save fixed version
    with open('cleaned_questions.json', 'w', encoding='utf-8') as f:
        json.dump(fixed_questions, f, indent=2, ensure_ascii=False)
    
    print("\n" + "="*80)
    print(f"✅ AUTO-FIX COMPLETE!")
    print(f"   Fixed {fixed_count} questions with issues")
    print(f"   Processed all {len(fixed_questions)} questions")
    print(f"   Saved to: cleaned_questions.json")
    print("="*80)
    
    # Final quality check
    print("\nRunning final quality check...")
    ui_phrases = ['Previous', 'Clear Response', 'Mark', 'Save and Next', 
                 'Time Taken', 'Online Exercise']
    still_have_issues = []
    for i, q in enumerate(fixed_questions, 1):
        if any(phrase in q['question'] for phrase in ui_phrases):
            still_have_issues.append(i)
    
    if still_have_issues:
        print(f"⚠️  Questions still need manual review: {still_have_issues}")
        return False
    else:
        print("✅ All questions verified - ready to upload!")
        return True

if __name__ == "__main__":
    success = auto_fix_questions()
    
    if success:
        print("\n" + "="*80)
        print("NEXT STEP: Upload to Google Sheets")
        print("="*80)
        print("\nRun: python rescrape_and_upload.py")
        print("Or: python upload_now.py \"Your Worksheet Name\"")

