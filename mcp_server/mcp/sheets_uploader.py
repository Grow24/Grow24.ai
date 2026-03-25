#!/usr/bin/env python3
"""
Upload scraped questions to Google Sheets
"""

import json
import re
import os
import gspread
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SheetsUploader:
    def __init__(self, credentials_file=None, spreadsheet_url=None):
        """Initialize Google Sheets connection"""
        # Get from .env if not provided
        self.credentials_file = credentials_file or os.getenv('GOOGLE_APPLICATION_CREDENTIALS', 'credentials.json')
        self.spreadsheet_url = spreadsheet_url or os.getenv('SPREADSHEET_URL')
        
        # Define the scope
        self.scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/drive'
        ]
        
        self.client = None
        self.sheet = None
        
    def connect(self):
        """Connect to Google Sheets"""
        try:
            creds = Credentials.from_service_account_file(
                self.credentials_file, 
                scopes=self.scope
            )
            self.client = gspread.authorize(creds)
            print("✅ Connected to Google Sheets API")
            return True
        except FileNotFoundError:
            print("❌ credentials.json not found!")
            print("   Please follow the setup instructions in SHEETS_SETUP.md")
            return False
        except Exception as e:
            print(f"❌ Error connecting to Google Sheets: {e}")
            return False
    
    def open_sheet(self, url=None, spreadsheet_id=None, worksheet_name=None):
        """Open a Google Sheet by URL or ID, create worksheet if it doesn't exist"""
        url = url or self.spreadsheet_url
        spreadsheet_id = spreadsheet_id or os.getenv('SPREADSHEET_ID')
        worksheet_name = worksheet_name or os.getenv('WORKSHEET_NAME', 'sheet1')
        
        if not url and not spreadsheet_id:
            print("❌ No spreadsheet URL or ID provided!")
            return False
        
        try:
            # Try to open by ID first (faster), then by URL
            if spreadsheet_id:
                spreadsheet = self.client.open_by_key(spreadsheet_id)
            else:
                spreadsheet = self.client.open_by_url(url)
            
            # Try to open specific worksheet by name
            try:
                if worksheet_name.lower() == 'sheet1':
                    self.sheet = spreadsheet.sheet1
                else:
                    self.sheet = spreadsheet.worksheet(worksheet_name)
                print(f"✅ Opened existing worksheet: '{self.sheet.title}'")
            except:
                # Worksheet doesn't exist - create it
                print(f"📝 Worksheet '{worksheet_name}' not found, creating new worksheet...")
                try:
                    self.sheet = spreadsheet.add_worksheet(
                        title=worksheet_name,
                        rows=100,  # Start with 100 rows
                        cols=20    # 20 columns for all question data
                    )
                    print(f"✅ Created new worksheet: '{self.sheet.title}'")
                except Exception as create_error:
                    print(f"❌ Error creating worksheet: {create_error}")
                    print(f"⚠️  Falling back to first sheet")
                    self.sheet = spreadsheet.sheet1
                    print(f"✅ Opened worksheet: '{self.sheet.title}'")
            
            return True
        except Exception as e:
            print(f"❌ Error opening spreadsheet: {e}")
            print("   Make sure you've shared the sheet with the service account email")
            return False
    
    def extract_options_from_text(self, page_text_sample, question_text):
        """Extract actual answer options from page text"""
        if not page_text_sample or not question_text:
            return []
        
        # Find where the question ends in the page text
        try:
            question_end = page_text_sample.index(question_text) + len(question_text)
            text_after_question = page_text_sample[question_end:]
        except ValueError:
            # Question not found in page text, try alternative approach
            text_after_question = page_text_sample
        
        # Split by newlines (single and double)
        lines = []
        for line in text_after_question.split('\n'):
            line = line.strip()
            if line:
                lines.append(line)
        
        # Filter out UI elements and keep only likely answer options
        ui_elements = {
            'exit', 'submit', 'assessment', 'previous', 'clear', 'response',
            'mark', 'save', 'next', 'time', 'left', 'online', 'exercise',
            'section', 'question', 'answered', 'unanswered', 'review', 'marked',
            'slot', 'cat', 'jee', 'neet'
        }
        
        options = []
        for line in lines:
            # Skip empty lines
            if not line:
                continue
            
            # Skip if it's a UI element
            if any(ui in line.lower() for ui in ui_elements):
                continue
            
            # Skip if it's just a number by itself (1-2 digits, likely question numbers)
            if re.match(r'^\d{1,2}$', line):
                continue
            
            # Skip if it's very long (likely part of question or explanation)
            if len(line) > 80:
                continue
            
            # Skip if it contains "Sections" or timestamps with colons
            if 'Sections' in line or 'SECTION' in line:
                continue
            
            # Skip time patterns like "00:39:51"
            if re.match(r'^\d{2}:\d{2}:\d{2}$', line):
                continue
            
            # Skip patterns like "0/22"
            if re.match(r'^\d+/\d+', line):
                continue
            
            # Allow single letters that are likely options (a, b, c, d, e)
            if len(line) == 1:
                # Keep if it's a, b, c, d, e (common MCQ options)
                if line.lower() in ['a', 'b', 'c', 'd', 'e']:
                    options.append(line)
                continue
            
            # Skip patterns like "40m" (duration)
            if re.match(r'^\d+m$', line):
                continue
            
            # Skip patterns like "0 Mar" or "0 Answered"
            if re.match(r'^\d+\s+\w+$', line) and len(line) < 15:
                continue
            
            # This looks like an option
            if line and len(line) <= 80:
                # Clean up the option
                line = line.strip()
                
                # Skip if it's already in the list
                if line not in options:
                    options.append(line)
                
                # Limit to reasonable number of options
                if len(options) >= 5:
                    break
        
        return options[:5]  # Return max 5 options
    
    def filter_options(self, options_array):
        """Filter UI elements from options array"""
        if not options_array:
            return []
        
        ui_elements = {
            'exit', 'submit', 'assessment', 'previous', 'clear', 'response',
            'mark', 'save', 'next', 'question '
        }
        
        filtered = []
        for opt in options_array:
            opt_lower = opt.lower()
            
            # Skip UI elements
            if any(ui in opt_lower for ui in ui_elements):
                continue
            
            # Skip "Question N" patterns
            if re.match(r'^question\s+\d+$', opt_lower):
                continue
            
            filtered.append(opt)
        
        return filtered[:5]  # Return max 5 options
    
    def prepare_row_data(self, question_data, question_number):
        """Prepare a row of data for the sheet with math equation support"""
        # Extract question ID (use question number or provided ID)
        question_id = question_data.get('question_id', f"Q{question_number:03d}")
        
        # Extract section (clean it up)
        section = question_data.get('section', '').split('\n')[0].strip()
        if 'CAT' in question_data.get('page_text_sample', ''):
            section_match = re.search(r'CAT \d+ - [A-Z]+ \(Slot \d+\)', 
                                     question_data.get('page_text_sample', ''))
            if section_match:
                section = section_match.group(0)
        
        # Question text (prefer Unicode, fallback to readable)
        question_text = question_data.get('question', '')
        question_readable = question_data.get('question_readable', question_text)
        has_math_unicode = question_data.get('has_math_unicode', False)
        
        # Use Unicode version for display (better for math)
        # But include readable version as comment if different
        if has_math_unicode and question_text != question_readable:
            question_text_display = f"{question_text} [ASCII: {question_readable[:80]}...]"
        else:
            question_text_display = question_text
        
        # Extract options - handle both old and new format
        if 'option1' in question_data:
            # New cleaned format
            options = [
                question_data.get('option1', ''),
                question_data.get('option2', ''),
                question_data.get('option3', ''),
                question_data.get('option4', ''),
                question_data.get('option5', '')
            ]
            options = [opt for opt in options if opt]  # Remove empty
        else:
            # Old format - extract from page text
            options = self.extract_options_from_text(
                question_data.get('page_text_sample', ''),
                question_text
            )
            
            if not options or len(options) < 2:
                # Fallback to filtered options array
                options = self.filter_options(question_data.get('options', []))
        
        # Type - assume MCQ if we have options
        question_type = question_data.get('type', "MCQ" if options else "TEXT")
        
        # Required - assume TRUE
        required = question_data.get('required', "TRUE")
        
        # Clean the question text to remove UI elements
        question_text_display = self.clean_question_text(question_text_display)
        
        # Extract theme from question data (if available)
        theme = question_data.get('theme', '')
        
        # Extract passage (for DI/VARC questions with comprehension)
        passage = question_data.get('passage', '') or question_data.get('passage_readable', '')
        # Clean passage text as well
        if passage:
            passage = self.clean_question_text(passage)
        
        # Prepare row matching the new sheet structure
        row = [
            question_id,           # QuestionId
            section,               # Section
            passage,               # Passage (NEW: for comprehension/DI)
            theme,                 # Theme (topic/category)
            question_number,       # Order
            question_type,         # Type
            question_text_display, # QuestionText (cleaned)
            "",                    # ImageUrl (empty - can be added manually later)
            required,              # Required
            options[0] if len(options) > 0 else "",  # Option1
            "",                    # Option1ImageUrl
            options[1] if len(options) > 1 else "",  # Option2
            "",                    # Option2ImageUrl
            options[2] if len(options) > 2 else "",  # Option3
            "",                    # Option3ImageUrl
            options[3] if len(options) > 3 else "",  # Option4
            "",                    # Option4ImageUrl
            options[4] if len(options) > 4 else "",  # Option5
            "",                    # Option5ImageUrl
            "",                    # ConstraintsJson
            "",                    # TimerSeconds
            "",                    # GoToSectionOnOption
        ]
        
        return row
    
    def clean_question_text(self, question_text):
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
        
        # Remove [ASCII: ...] annotations
        question_text = re.sub(r'\s*\[ASCII:.*?\]', '', question_text)
        
        # Remove any remaining UI text
        ui_patterns = ['Previous', 'Clear Response', 'Mark', 'Save and Next', 'Time Left', 'Online Exercise']
        for pattern in ui_patterns:
            if pattern in question_text:
                idx = question_text.index(pattern)
                question_text = question_text[:idx]
        
        # Clean up whitespace
        question_text = ' '.join(question_text.split())
        question_text = question_text.strip()
        
        return question_text
    
    def write_headers(self):
        """Write the header row to the sheet"""
        headers = [
            'QuestionId',
            'Section',
            'Passage',  # NEW: For comprehension/DI passages
            'Theme',  # Topic/Category for the question
            'Order',
            'Type',
            'QuestionText',
            'ImageUrl',
            'Required',
            'Option1',
            'Option1ImageUrl',
            'Option2',
            'Option2ImageUrl',
            'Option3',
            'Option3ImageUrl',
            'Option4',
            'Option4ImageUrl',
            'Option5',
            'Option5ImageUrl',
            'ConstraintsJson',
            'TimerSeconds',
            'GoToSectionOnOption'
        ]
        
        try:
            self.sheet.update('A1:V1', [headers], value_input_option='USER_ENTERED')
            print("✅ Headers written successfully")
            return True
        except Exception as e:
            print(f"❌ Error writing headers: {e}")
            return False
    
    def upload_questions(self, json_file='scraped_questions.json', start_row=2, write_headers=True):
        """Upload all questions from JSON to Google Sheets"""
        # Load JSON data
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                questions = json.load(f)
            print(f"✅ Loaded {len(questions)} questions from {json_file}")
        except FileNotFoundError:
            print(f"❌ File not found: {json_file}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON: {e}")
            return False
        
        # Write headers if requested
        if write_headers and start_row == 2:
            print("\n📝 Writing headers...")
            self.write_headers()
        
        # Prepare all rows
        rows = []
        for i, q in enumerate(questions, 1):
            row = self.prepare_row_data(q, i)
            rows.append(row)
        
        # Upload to sheet
        try:
            # Get the range (starting from row 2 to skip header)
            end_row = start_row + len(rows) - 1
            range_name = f'A{start_row}:V{end_row}'
            
            print(f"\n📤 Uploading {len(rows)} questions to Google Sheets...")
            print(f"   Range: {range_name}")
            
            # Update the sheet
            self.sheet.update(range_name, rows, value_input_option='USER_ENTERED')
            
            print(f"✅ Successfully uploaded {len(rows)} questions!")
            print(f"   Check your Google Sheet: {self.spreadsheet_url}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error uploading to sheet: {e}")
            return False
    
    def preview_data(self, json_file='scraped_questions.json', num_questions=3):
        """Preview how the data will look before uploading"""
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                questions = json.load(f)
            
            print("\n" + "="*80)
            print(f"PREVIEW: First {num_questions} questions")
            print("="*80)
            
            for i, q in enumerate(questions[:num_questions], 1):
                row = self.prepare_row_data(q, i)
                print(f"\nQuestion {i}:")
                print(f"  ID: {row[0]}")
                print(f"  Section: {row[1]}")
                print(f"  Type: {row[3]}")
                print(f"  Text: {row[4][:80]}...")
                print(f"  Options: {[opt for opt in row[7:16:2] if opt]}")
            
            print("\n" + "="*80)
            return True
            
        except Exception as e:
            print(f"❌ Error previewing data: {e}")
            return False

def main():
    """Main function"""
    print("="*80)
    print("Google Sheets Uploader for Scraped Questions")
    print("="*80)
    
    # Check if we have credentials from .env
    spreadsheet_id = os.getenv('SPREADSHEET_ID')
    spreadsheet_url = os.getenv('SPREADSHEET_URL')
    
    if not spreadsheet_id and not spreadsheet_url:
        # Get spreadsheet URL from user
        print("\nPlease provide your Google Sheet URL:")
        print("(The URL should look like: https://docs.google.com/spreadsheets/d/...)")
        spreadsheet_url = input("\nSpreadsheet URL: ").strip()
        
        if not spreadsheet_url:
            print("❌ No URL provided. Exiting.")
            return
    else:
        if spreadsheet_id:
            print(f"\n✅ Using Spreadsheet ID from .env: {spreadsheet_id}")
        elif spreadsheet_url:
            print(f"\n✅ Using Spreadsheet URL from .env")
    
    # Initialize uploader (will use .env credentials automatically)
    uploader = SheetsUploader(
        spreadsheet_url=spreadsheet_url
    )
    
    # Preview data first
    print("\n" + "="*80)
    print("Step 1: Preview Data")
    print("="*80)
    uploader.preview_data()
    
    # Confirm before uploading
    print("\n" + "="*80)
    confirm = input("\nDo you want to upload this data to Google Sheets? (yes/no): ").strip().lower()
    
    if confirm not in ['yes', 'y']:
        print("❌ Upload cancelled.")
        return
    
    # Connect to Google Sheets
    print("\n" + "="*80)
    print("Step 2: Connect to Google Sheets")
    print("="*80)
    if not uploader.connect():
        return
    
    if not uploader.open_sheet():
        return
    
    # Upload questions
    print("\n" + "="*80)
    print("Step 3: Upload Questions")
    print("="*80)
    uploader.upload_questions()
    
    print("\n" + "="*80)
    print("✅ DONE!")
    print("="*80)

if __name__ == "__main__":
    main()

