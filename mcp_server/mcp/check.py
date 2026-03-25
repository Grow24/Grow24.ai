#!/usr/bin/env python3
"""
Quality Check Script - Validates scraped questions with Unicode support
"""

import json
import sys
import os
import re

def quality_check():
    """Check all questions for common issues"""
    
    # Check cleaned version if it exists, otherwise check scraped version
    if os.path.exists('cleaned_questions.json'):
        filename = 'cleaned_questions.json'
        print("Checking: cleaned_questions.json (fixed version)")
    else:
        filename = 'scraped_questions.json'
        print("Checking: scraped_questions.json (original)")
    
    with open(filename, 'r') as f:
        questions = json.load(f)
    
    # Handle both formats (original and cleaned)
    is_cleaned = isinstance(questions[0].get('question_id'), str)
    
    print("="*80)
    print(f"QUALITY CHECK - {len(questions)} Questions")
    print("="*80)
    
    issues_found = []
    warnings = []
    
    for i, q in enumerate(questions, 1):
        question_issues = []
        question_warnings = []
        
        # Get question text (handle both formats)
        question_text = q.get('question', '')
        
        # Check 1: Question text contains UI elements
        ui_phrases = ['Previous', 'Clear Response', 'Mark', 'Save and Next', 
                     'Time Taken', 'Online Exercise', 'Submit Assessment']
        if any(phrase in question_text for phrase in ui_phrases):
            question_issues.append("Contains UI text instead of question")
        
        # Check 2: Question too short
        if len(question_text) < 20:
            question_warnings.append(f"Very short question ({len(question_text)} chars)")
        
        # Check 3: Check if options in page_text but not captured
        if 'page_text_sample' in q:
            # Look for common option patterns
            page_text = q['page_text_sample']
            # Check if page has "a\n\nb\n\nc\n\nd" pattern but options don't have them
            if '\na\n\nb\n\nc\n\nd\n' in page_text:
                if 'a' not in str(q.get('options', [])):
                    question_issues.append("Has a/b/c/d options in page but not captured")
        
        # Check 4: Has marks info
        if not q.get('marks'):
            question_warnings.append("No marks information")
        
        # Report
        if question_issues or question_warnings:
            print(f"\nQ{i:02d}: {question_text[:60]}...")
            if question_issues:
                print(f"  ❌ ISSUES: {'; '.join(question_issues)}")
                issues_found.append(i)
            if question_warnings:
                print(f"  ⚠️  WARNINGS: {'; '.join(question_warnings)}")
                warnings.append(i)
    
    # Check for Unicode math characters
    print(f"\n{'='*80}")
    print("UNICODE MATH CHECK")
    print(f"{'='*80}")
    
    unicode_math_pattern = re.compile(r'[₀-₉⁰-⁹√∫∑∏π∞≠≤≥±×÷∈∉⊂⊃∪∩]')
    unicode_count = 0
    
    for i, q in enumerate(questions, 1):
        question_text = q.get('question', '')
        if unicode_math_pattern.search(question_text):
            unicode_count += 1
            has_readable = 'question_readable' in q
            print(f"Q{i:02d}: Unicode math detected {'✓ (readable version exists)' if has_readable else '⚠️  (no readable version)'}")
    
    print(f"\nQuestions with Unicode math: {unicode_count}/{len(questions)}")
    
    # Summary
    print(f"\n{'='*80}")
    print("QUALITY CHECK SUMMARY")
    print(f"{'='*80}")
    print(f"Total Questions: {len(questions)}")
    print(f"🔢 Unicode Math: {unicode_count}")
    
    if issues_found:
        print(f"❌ Issues Found: {len(issues_found)} questions {issues_found}")
        print("   These MUST be fixed before uploading to sheets!")
        return False
    elif warnings:
        print(f"⚠️  Warnings: {len(warnings)} questions {warnings}")
        print("   Review these questions manually")
        print("✅ No critical issues - safe to upload")
        return True
    else:
        print("✅ ALL QUESTIONS PASS - Ready to upload!")
        return True

if __name__ == "__main__":
    passed = quality_check()
    sys.exit(0 if passed else 1)

