#!/usr/bin/env python3
"""
Extract passages from page_text_sample for DI/LR questions
"""

import json
import re

def extract_passage_from_page_text(page_text, question_text):
    """
    Extract the passage/paragraph that appears before the question
    Handles both DI/LR and VARC (Reading Comprehension) passages
    """
    if not page_text or not question_text:
        return ""
    
    # Method 1: VARC format - Look for "Comprehension:" marker
    if 'Comprehension:' in page_text or 'Comprehension :' in page_text:
        # For VARC, extract everything after "Comprehension:"
        # The page_text_sample contains the passage (it's not followed by clear markers)
        pattern = r'Comprehension\s*:?\s*(.+)'
        match = re.search(pattern, page_text, re.DOTALL | re.IGNORECASE)
        if match:
            passage = match.group(1).strip()
            
            # Remove the instruction line if present
            lines = passage.split('\n')
            passage_lines = []
            
            for line in lines:
                line_stripped = line.strip()
                # Skip instruction lines
                if not line_stripped:
                    continue
                if 'passage below is accompanied' in line_stripped.lower():
                    continue
                if 'based on the passage' in line_stripped.lower():
                    continue
                if 'choose the best answer' in line_stripped.lower():
                    continue
                # Add actual passage content
                if len(line_stripped) > 20:  # Meaningful content
                    passage_lines.append(line_stripped)
            
            if passage_lines:
                passage = '\n\n'.join(passage_lines)
                if len(passage) > 100:  # Valid passage
                    return passage
    
    # Method 2: Generic "Paragraph" marker (DI/LR format)
    if 'Paragraph' in page_text:
        # Extract text between "Paragraph" and "SECTION" or question number
        pattern = r'Paragraph\s+(.*?)(?:SECTION|Question \d+)'
        match = re.search(pattern, page_text, re.DOTALL)
        if match:
            passage = match.group(1).strip()
            # Remove "Comprehension:" prefix if present
            if passage.startswith('Comprehension'):
                lines = passage.split('\n', 2)
                if len(lines) > 2:
                    passage = lines[2]
            # Clean up the passage
            passage = re.sub(r'\n\n+', '\n\n', passage)
            passage = passage.strip()
            if len(passage) > 100:  # Valid passage
                return passage
    
    # Method 3: Fallback - Look for long text block before "SECTION"
    if 'SECTION' in page_text:
        parts = page_text.split('SECTION', 1)
        before_section = parts[0]
        
        # Remove UI elements at the start
        lines = before_section.split('\n')
        passage_lines = []
        started = False
        
        for line in lines:
            line = line.strip()
            # Skip UI elements
            if any(x in line for x in ['Sections', 'Exit', 'Submit', 'Assessment']):
                continue
            # Skip if it's just "Paragraph" or "Comprehension:"
            if line in ['Paragraph', 'Comprehension:', 'Comprehension']:
                started = True
                continue
            if started and line and len(line) > 20:
                passage_lines.append(line)
        
        if passage_lines:
            passage = '\n\n'.join(passage_lines)
            if len(passage) > 100:
                return passage
    
    return ""

def main():
    print("="*80)
    print("Extracting Passages from page_text_sample")
    print("="*80)
    
    # Read the SCRAPED questions (has page_text_sample)
    with open('scraped_questions.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print(f"\n✅ Loaded {len(questions)} questions")
    
    # Extract passages
    passages_found = 0
    for i, q in enumerate(questions, 1):
        page_text = q.get('page_text_sample', '')
        question_text = q.get('question', '')
        
        # Try to extract passage
        passage = extract_passage_from_page_text(page_text, question_text)
        
        if passage:
            q['passage'] = passage
            q['passage_readable'] = passage
            passages_found += 1
            print(f"  ✅ Q{i:02d}: Found passage ({len(passage)} chars)")
        else:
            print(f"  ⚠️  Q{i:02d}: No passage found")
    
    # Save updated questions
    output_file = 'cleaned_questions_with_passages.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    
    print(f"\n" + "="*80)
    print(f"✅ Extracted passages for {passages_found}/{len(questions)} questions")
    print(f"✅ Saved to: {output_file}")
    print("="*80)
    
    # Show sample passage
    if passages_found > 0:
        for q in questions:
            if q.get('passage'):
                print(f"\n📝 Sample Passage (Q{questions.index(q)+1}):")
                print(f"{q['passage'][:300]}...")
                break
    
    print(f"\nNext step: Run the workflow again:")
    print(f"  cp {output_file} cleaned_questions.json")
    print(f"  python3 add_latex_v2.py")
    print(f"  python3 add_themes.py")
    print(f'  python3 upload.py "CAT 2022 - DI & LR (Slot 1)"')

if __name__ == "__main__":
    main()
