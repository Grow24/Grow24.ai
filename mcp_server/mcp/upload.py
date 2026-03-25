#!/usr/bin/env python3
"""
Direct upload to Google Sheets (no confirmation needed)
"""

from sheets_uploader import SheetsUploader
import os
import sys
from dotenv import load_dotenv

load_dotenv()

def main(worksheet_name=None):
    print("="*80)
    print("Direct Upload to Google Sheets")
    print("="*80)
    
    # Get spreadsheet ID from .env
    spreadsheet_id = os.getenv('SPREADSHEET_ID')
    
    if spreadsheet_id:
        print(f"\n✅ Using Spreadsheet ID: {spreadsheet_id}")
    else:
        print("❌ SPREADSHEET_ID not found in .env")
        return
    
    # Get worksheet name - ask if not provided
    if not worksheet_name:
        worksheet_name = input("\n📝 Enter worksheet name (e.g., 'Test 7'): ").strip()
        if not worksheet_name:
            print("❌ No worksheet name provided!")
            return
    
    print(f"✅ Target worksheet: '{worksheet_name}'")
    
    # Initialize uploader
    uploader = SheetsUploader()
    
    # Check for themed file first, then latex, then cleaned, then scraped
    if os.path.exists('cleaned_questions_latex_themed.json'):
        json_file = 'cleaned_questions_latex_themed.json'
        print("✅ Using cleaned_questions_latex_themed.json (with LaTeX + Themes)")
    elif os.path.exists('cleaned_questions_latex.json'):
        json_file = 'cleaned_questions_latex.json'
        print("✅ Using cleaned_questions_latex.json (with LaTeX markup)")
    elif os.path.exists('cleaned_questions.json'):
        json_file = 'cleaned_questions.json'
        print("✅ Using cleaned_questions.json")
    else:
        json_file = 'scraped_questions.json'
        print("⚠️  cleaned_questions.json not found, using scraped_questions.json")
        print("   Run 'python fix.py' first for better results")
    
    # Preview data
    print("\n" + "="*80)
    print("Preview: First 3 Questions")
    print("="*80)
    uploader.preview_data(json_file=json_file, num_questions=3)
    
    # Connect to Google Sheets
    print("\n" + "="*80)
    print("Connecting to Google Sheets...")
    print("="*80)
    if not uploader.connect():
        return
    
    if not uploader.open_sheet(spreadsheet_id=spreadsheet_id, worksheet_name=worksheet_name):
        return
    
    # Upload questions
    print("\n" + "="*80)
    print("Uploading Questions...")
    print("="*80)
    uploader.upload_questions(json_file=json_file)
    
    print("\n" + "="*80)
    print("✅ COMPLETE!")
    print("="*80)
    print(f"\nView your sheet at:")
    print(f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit")

if __name__ == "__main__":
    # Allow worksheet name as command line argument
    worksheet = sys.argv[1] if len(sys.argv) > 1 else None
    main(worksheet)

