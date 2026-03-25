import asyncio
import json
from playwright.async_api import async_playwright
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class InteractiveScraper:
    def __init__(self, section_type='QA'):
        self.email = os.getenv('MCGRAW_EMAIL')
        self.password = os.getenv('MCGRAW_PASSWORD')
        self.base_url = os.getenv('BASE_URL')
        self.scraped_data = []
        self.section_type = section_type.upper()
        
        # Create numbered scrape folders
        from pathlib import Path
        self.base_screenshot_dir = Path("debug_screenshots")
        self.base_screenshot_dir.mkdir(exist_ok=True)
        
        # Find next scrape number
        existing_scrapes = [d for d in self.base_screenshot_dir.iterdir() 
                          if d.is_dir() and d.name.startswith('scrape_')]
        if existing_scrapes:
            numbers = [int(d.name.split('_')[1]) for d in existing_scrapes 
                      if d.name.split('_')[1].isdigit()]
            next_num = max(numbers) + 1 if numbers else 1
        else:
            next_num = 1
        
        # Create this scrape's folder with section type
        folder_name = f"scrape_{next_num}_{self.section_type}"
        self.screenshot_dir = self.base_screenshot_dir / folder_name
        self.screenshot_dir.mkdir(exist_ok=True)
        
        # Create images folder for this scrape
        self.image_dir = self.screenshot_dir / "images"
        self.image_dir.mkdir(exist_ok=True)
        
        print(f"\n🎯 Section Type: {self.section_type}")
        print(f"📁 Screenshots will be saved to: {self.screenshot_dir}")
        print(f"📁 Images will be saved to: {self.image_dir}")
    
    async def download_image(self, page, img_url, question_num, img_index):
        """Download image from URL using Playwright's request API"""
        try:
            # Skip blob URLs and data URLs - they're captured in screenshots
            if img_url.startswith('blob:') or img_url.startswith('data:'):
                return {
                    'src': img_url,
                    'type': 'blob/data',
                    'note': 'Captured in screenshot only'
                }
            
            # Make URL absolute if relative
            if img_url.startswith('/'):
                img_url = f"https://edge.mheducation.co.in{img_url}"
            elif not img_url.startswith('http'):
                return {
                    'src': img_url,
                    'type': 'invalid',
                    'error': 'Not a valid URL'
                }
            
            # Download the image using Playwright's request context
            response = await page.request.get(img_url)
            if response.ok:
                img_data = await response.body()
                
                # Determine extension from content-type or URL
                ext = 'png'
                content_type = response.headers.get('content-type', '')
                if 'jpeg' in content_type or 'jpg' in content_type or img_url.endswith(('.jpg', '.jpeg')):
                    ext = 'jpg'
                elif 'svg' in content_type or img_url.endswith('.svg'):
                    ext = 'svg'
                elif 'gif' in content_type or img_url.endswith('.gif'):
                    ext = 'gif'
                
                img_filename = f"question_{question_num}_img_{img_index}.{ext}"
                img_path = str(self.image_dir / img_filename)
                
                with open(img_path, 'wb') as f:
                    f.write(img_data)
                
                print(f"    📥 Downloaded image {img_index}: {img_filename}")
                return {
                    'src': img_url,
                    'type': 'downloaded',
                    'savedAs': img_path
                }
            else:
                return {
                    'src': img_url,
                    'type': 'failed',
                    'error': f'HTTP {response.status}'
                }
        except Exception as e:
            return {
                'src': img_url,
                'type': 'error',
                'error': str(e)
            }
    
    def unicode_to_readable(self, text):
        """Convert Unicode math characters to readable ASCII equivalents"""
        # Subscript mapping
        subscripts = {
            '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
            '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
            'ₐ': 'a', 'ₑ': 'e', 'ₒ': 'o', 'ₓ': 'x', 'ₕ': 'h',
            'ₖ': 'k', 'ₗ': 'l', 'ₘ': 'm', 'ₙ': 'n', 'ₚ': 'p',
            'ₛ': 's', 'ₜ': 't'
        }
        
        # Superscript mapping
        superscripts = {
            '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
            '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
            'ⁿ': 'n', '⁺': '+', '⁻': '-', '⁼': '=', '⁽': '(',
            '⁾': ')', 'ⁱ': 'i', 'ˣ': 'x'
        }
        
        # Math symbols (keep some, replace others for readability)
        math_symbols = {
            '√': 'sqrt',
            '∫': 'integral',
            '∑': 'sum',
            '∏': 'product',
            '≠': '!=',
            '≤': '<=',
            '≥': '>=',
            '±': '+/-',
            '×': '*',
            '÷': '/',
            '∈': 'in',
            '∉': 'not in',
            '⊂': 'subset',
            '⊃': 'superset',
            '∪': 'union',
            '∩': 'intersection'
        }
        
        result = text
        
        # Convert subscripts
        for unicode_char, ascii_char in subscripts.items():
            result = result.replace(unicode_char, ascii_char)
        
        # Convert superscripts
        for unicode_char, ascii_char in superscripts.items():
            result = result.replace(unicode_char, '^' + ascii_char)
        
        # Convert math symbols
        for unicode_char, ascii_equiv in math_symbols.items():
            result = result.replace(unicode_char, ascii_equiv)
        
        return result
        
    async def login(self, page):
        """Login to McGraw Hill Edge platform"""
        print("Navigating to login page...")
        await page.goto(f"{self.base_url}/v3/myaccount/login", wait_until='domcontentloaded')
        
        # Wait for page to load
        await page.wait_for_timeout(3000)
        
        # Try to find and click the login button if it exists
        try:
            login_btn = await page.query_selector('a:has-text("Login"), button:has-text("Login"), a:has-text("Sign In")')
            if login_btn:
                await login_btn.click()
                await page.wait_for_timeout(1000)
        except:
            pass
        
        # Wait for visible email input field
        await page.wait_for_selector('input[name="email"]', state='visible', timeout=10000)
        
        # Fill credentials - use the first visible field
        email_inputs = await page.query_selector_all('input[name="email"]')
        for email_input in email_inputs:
            if await email_input.is_visible():
                await email_input.fill(self.email)
                break
        
        # Fill password
        password_inputs = await page.query_selector_all('input[name="password"]')
        for password_input in password_inputs:
            if await password_input.is_visible():
                await password_input.fill(self.password)
                break
        
        # Click login/submit button - find the visible one
        submit_buttons = await page.query_selector_all('button[type="submit"]')
        for button in submit_buttons:
            if await button.is_visible():
                await button.click()
                break
        
        # Wait for successful login
        await page.wait_for_timeout(3000)
        print("Login successful!")
        
    async def scrape_question(self, page):
        """Scrape current question and options with Unicode math preservation"""
        try:
            # Wait for content to load
            await page.wait_for_timeout(1500)
            
            question_num = len(self.scraped_data) + 1
            
            # Extract passage, question, and options separately
            question_data = await page.evaluate('''() => {
                // For VARC/DI questions: Find BOTH the passage container (left) and question container (right)
                
                // 1. First, try to find the passage/paragraph box (left side)
                let passageEl = null;
                const passageSelectors = [
                    'div[class*="Paragraph"]',
                    'div[class*="paragraph"]',
                    'div[class*="comprehension"]',
                    'div[class*="passage"]'
                ];
                
                for (const selector of passageSelectors) {
                    passageEl = document.querySelector(selector);
                    if (passageEl && passageEl.textContent.includes('Comprehension')) {
                        break;
                    }
                }
                
                // 2. Now find the ACTUAL question container (right side)
                // This should contain "Question N" and the question text
                const questionSelectors = [
                    'div[class*="question_main_container"]',
                    'div[class*="question-container"]',
                    'div[class*="questionContainer"]',
                    '.question-text',
                    '[class*="question_"]'
                ];
                
                let questionEl = null;
                let usedSelector = null;
                
                // Try to find element that contains "Question" text AND is NOT the passage
                for (const selector of questionSelectors) {
                    const candidates = document.querySelectorAll(selector);
                    for (const candidate of candidates) {
                        const text = candidate.textContent;
                        // Must have substantial text and NOT be the passage container
                        if (text.length > 20 && 
                            text.length < 5000 &&
                            candidate !== passageEl &&
                            !candidate.contains(passageEl)) {
                            questionEl = candidate;
                            usedSelector = selector;
                            break;
                        }
                    }
                    if (questionEl) break;
                }
                
                // 3. If still no question container, find the main content area (excluding passage)
                if (!questionEl) {
                    const divs = Array.from(document.querySelectorAll('div'));
                    questionEl = divs.find(div => {
                        const text = div.textContent.trim();
                        return text.length > 50 && 
                               text.length < 5000 && 
                               div !== passageEl &&
                               !div.contains(passageEl) &&
                               (text.includes('Question') || text.match(/^[A-D]\\.|\\d+\\./));
                    });
                }
                
                if (!questionEl) return { 
                    passage: '', 
                    question: '', 
                    options: [],
                    fullText: '', 
                    html: '', 
                    hasMathUnicode: false 
                };
                
                // Extract passage text separately if it exists
                let passage = '';
                if (passageEl) {
                    const passageClone = passageEl.cloneNode(true);
                    // Remove UI elements from passage
                    passageClone.querySelectorAll('button, .btn, [class*="navigation"]').forEach(el => el.remove());
                    let passageText = passageClone.innerText || passageClone.textContent;
                    // Remove "Paragraph" and "Comprehension:" labels
                    passageText = passageText.replace(/^Paragraph\\s*/i, '');
                    passageText = passageText.replace(/^Comprehension\\s*:\\s*/i, '');
                    passageText = passageText.replace(/The passage below is accompanied by.*?question\\./gi, '');
                    passageText = passageText.replace(/Based on the passage.*?question\\./gi, '');
                    passage = passageText.trim();
                }
                
                // Clone question element to manipulate without affecting original
                const clone = questionEl.cloneNode(true);
                
                // AGGRESSIVE UI REMOVAL - Remove ALL non-content elements
                const uiSelectors = [
                    'button',
                    '.btn',
                    '[class*="navigation"]',
                    '[class*="header"]',
                    '[class*="title"]',
                    '[class*="section"]',
                    '[class*="marks"]',
                    '[class*="timer"]',
                    '[class*="question_no"]',
                    '[class*="question-no"]',
                    '[class*="question_main_title"]',
                    'span[id=""]',  // Empty spans used for UI
                    '.examsystem_question_main_title_section_no___JTlP',
                    '.examsystem_question_main_title_section_name__oi_mv',
                    '.examsystem_question_main_title_question_no__tLTzu',
                    '.examsystem_question_main_title_marks__g2dql'
                ];
                
                uiSelectors.forEach(selector => {
                    clone.querySelectorAll(selector).forEach(el => el.remove());
                });
                
                // Get full text from cleaned clone (this is the QUESTION area, not passage)
                let fullText = clone.innerText || clone.textContent;
                fullText = fullText.replace(/\\n\\n+/g, '\\n').trim();
                
                // Remove common UI text patterns from fullText
                fullText = fullText.replace(/^SECTION \\d+.*?\\n/i, '');
                fullText = fullText.replace(/^CAT.*?\\(Slot \\d+\\)\\n/gm, '');
                fullText = fullText.replace(/^Question \\d+\\n/i, '');
                fullText = fullText.replace(/\\+\\d+ Marks,?\\s*-\\d+ Marks/gi, '');
                fullText = fullText.replace(/Time Left:.*$/gm, '');
                fullText = fullText.trim();
                
                // Now extract question and options from questionEl more explicitly
                // Look for specific question text element (not from fullText which may be unreliable)
                let question = '';
                let options = [];
                
                // Try to find the actual question text element within questionEl
                // The question is usually in a specific paragraph or div, separate from options
                const questionTextSelectors = [
                    'p', 'div[class*="question"]', 'div[class*="text"]',
                    'span', 'div'
                ];
                
                // Get all text-containing elements
                const textElements = Array.from(questionEl.querySelectorAll('p, div, span'));
                
                // Filter to find the main question text (usually longer paragraph)
                let questionElement = null;
                let maxLength = 0;
                let bestScore = 0;
                
                // Question markers that indicate actual question text
                const questionMarkers = [
                    /\\?\\s*$/,  // Ends with question mark
                    /^Directions?/i,
                    /^Direction for the question/i,
                    /Which of the following/i,
                    /According to/i,
                    /All of the following/i,
                    /In the context of/i,
                    /It can be inferred/i,
                    /Given that/i,
                    /If .* then/i,
                    /What is/i,
                    /What would/i,
                    /How many/i,
                    /Choose the/i,
                    /Select the/i,
                    /EXCEPT:/i,
                    /NOT given/i,
                    /cannot be reached/i
                ];
                
                for (const el of textElements) {
                    const text = el.textContent.trim();
                    // Skip if it's too short, or looks like UI elements
                    if (text.length < 20) continue;
                    if (text.match(/^SECTION/i)) continue;
                    if (text.match(/^Question \\d+/i)) continue;
                    if (text.match(/^\\+\\d+ Marks/i)) continue;
                    if (text.match(/^CAT \\d{4}/i)) continue;
                    // Skip if it looks like just options (starts with letter/number and is short)
                    if (text.match(/^[A-E]\\./) && text.length < 100) continue;
                    if (text.match(/^Option \\d+/i)) continue;
                    
                    // Calculate score based on question markers
                    let score = 0;
                    for (const marker of questionMarkers) {
                        if (text.match(marker)) {
                            score += 10;
                        }
                    }
                    
                    // Prefer elements with question markers, then by length
                    const totalScore = score * 1000 + text.length;
                    
                    // This might be the question - prefer text with question markers
                    if (totalScore > bestScore && !el.querySelector('[class*="option"]')) {
                        bestScore = totalScore;
                        maxLength = text.length;
                        questionElement = el;
                    }
                }
                
                // Extract question text
                if (questionElement) {
                    question = questionElement.textContent.trim();
                    // Clean up
                    question = question.replace(/^SECTION.*?\\n/i, '');
                    question = question.replace(/^CAT.*?\\n/i, '');
                    question = question.replace(/^Question \\d+\\n/i, '');
                    question = question.replace(/\\+\\d+ Marks,?\\s*-\\d+ Marks/gi, '');
                } else {
                    // Fallback: use fullText approach
                    const lines = fullText.split('\\n');
                    let optionsStartIndex = -1;
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (line.match(/^[A-E]\\./i) || line.match(/^Option \\d+/i)) {
                            optionsStartIndex = i;
                            break;
                        }
                    }
                    if (optionsStartIndex > 0) {
                        question = lines.slice(0, optionsStartIndex).join('\\n').trim();
                    } else {
                        question = fullText;
                    }
                }
                
                // Now extract options - look for elements that look like options
                const optionElements = Array.from(questionEl.querySelectorAll('div, p, span'));
                for (const el of optionElements) {
                    const text = el.textContent.trim();
                    // Check if this looks like an option
                    if (text.match(/^[A-E]\\.\\s*.+/i) || text.match(/^Option \\d+:?\\s*.+/i)) {
                        let cleanOption = text.replace(/^[A-E]\\.\\s*/i, '');
                        cleanOption = cleanOption.replace(/^Option \\d+:?\\s*/i, '');
                        cleanOption = cleanOption.replace(/^\\d+\\.\\s*/, '');
                        if (cleanOption && cleanOption.length > 2 && cleanOption.length < 300) {
                            options.push(cleanOption);
                        }
                    }
                }
                
                // Get HTML for reference
                let html = clone.innerHTML;
                
                // Check for Unicode math characters
                let hasMathUnicode = false;
                for (let i = 0; i < fullText.length; i++) {
                    const code = fullText.charCodeAt(i);
                    if ((code >= 8320 && code <= 8329) || 
                        (code >= 8304 && code <= 8313) ||
                        (code >= 8704 && code <= 8959) ||
                        code === 178 || code === 179 || code === 185) {
                        hasMathUnicode = true;
                        break;
                    }
                }
                
                // Extract all images inside the question container
                const images = Array.from(questionEl.querySelectorAll('img'));
                const imageSrcs = images.map(img => img.getAttribute('src')).filter(Boolean);
                
                // Create a clean container for screenshot with ONLY content (passage + question + options)
                const cleanContainer = document.createElement('div');
                cleanContainer.setAttribute('data-screenshot-target', 'true');
                cleanContainer.style.padding = '20px';
                cleanContainer.style.backgroundColor = '#ffffff';
                cleanContainer.style.fontFamily = 'Arial, sans-serif';
                cleanContainer.style.fontSize = '14px';
                cleanContainer.style.lineHeight = '1.6';
                cleanContainer.style.maxWidth = '900px';
                
                // Add passage if exists (in a styled div)
                if (passage && passage.length > 50) {
                    const passageDiv = document.createElement('div');
                    passageDiv.style.marginBottom = '20px';
                    passageDiv.style.padding = '15px';
                    passageDiv.style.backgroundColor = '#f8f9fa';
                    passageDiv.style.borderLeft = '4px solid #007bff';
                    passageDiv.style.borderRadius = '4px';
                    passageDiv.innerHTML = '<strong style="color: #007bff; display: block; margin-bottom: 10px;">Passage:</strong>' + passage.replace(/\\n/g, '<br>');
                    cleanContainer.appendChild(passageDiv);
                }
                
                // Add question (in a styled div)
                if (question && question.length > 10) {
                    const questionDiv = document.createElement('div');
                    questionDiv.style.marginBottom = '15px';
                    questionDiv.style.fontWeight = 'bold';
                    questionDiv.style.fontSize = '15px';
                    questionDiv.innerHTML = question.replace(/\\n/g, '<br>');
                    cleanContainer.appendChild(questionDiv);
                }
                
                // Add options (in a styled list)
                if (options.length > 0) {
                    const optionsDiv = document.createElement('div');
                    optionsDiv.style.marginTop = '15px';
                    
                    options.slice(0, 5).forEach((opt, idx) => {
                        const optDiv = document.createElement('div');
                        optDiv.style.padding = '10px';
                        optDiv.style.marginBottom = '8px';
                        optDiv.style.border = '1px solid #ddd';
                        optDiv.style.borderRadius = '4px';
                        optDiv.style.backgroundColor = '#ffffff';
                        optDiv.innerHTML = `<strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}`;
                        optionsDiv.appendChild(optDiv);
                    });
                    
                    cleanContainer.appendChild(optionsDiv);
                }
                
                // Append to body (temporarily, for screenshot)
                document.body.appendChild(cleanContainer);
                
                return { 
                    passage: passage,
                    question: question,
                    options: options.slice(0, 5),  // Max 5 options
                    fullText: fullText,
                    html: html,
                    hasMathUnicode: hasMathUnicode,
                    imageSrcs: imageSrcs,
                    hasElement: true,
                    cleanContainerCreated: true
                };
            }''')
            
            # Extract and download images
            downloaded_images = []
            img_srcs = question_data.get('imageSrcs', [])
            if img_srcs:
                print(f"  🖼️  Found {len(img_srcs)} images, downloading...")
                for idx, img_src in enumerate(img_srcs, 1):
                    result = await self.download_image(page, img_src, question_num, idx)
                    downloaded_images.append(result)
            
            # Take FULL PAGE screenshot - simple and reliable
            try:
                screenshot_path = str(self.screenshot_dir / f'question_{question_num}.png')
                
                # Simple full page screenshot - captures everything reliably
                await page.screenshot(
                    path=screenshot_path,
                    full_page=True
                )
                print(f"  📸 Full page screenshot saved")
                
            except Exception as e:
                print(f"  ⚠️  Screenshot error: {e}")
                try:
                    await page.screenshot(
                        path=f'debug_screenshots/question_{question_num}.png',
                        full_page=True  # Capture entire scrollable page
                    )
                    print(f"  📸 Full page screenshot saved (error fallback)")
                except:
                    pass
            
            # Extract data from the structured response
            passage = question_data.get('passage', '')
            question_text = question_data.get('question', '') or question_data.get('fullText', '') or "Question not found"
            extracted_options = question_data.get('options', [])
            full_text = question_data.get('fullText', '')
            question_html = question_data.get('html', '')
            has_math_unicode = question_data.get('hasMathUnicode', False)
            
            # Get all text on the page for additional extraction
            page_text = await page.evaluate('() => document.body.innerText')
            
            # Extract question marks/points
            marks = ""
            for line in page_text.split('\n'):
                if 'Mark' in line and ('+' in line or '-' in line):
                    marks = line.strip()
                    break
            
            # Get section info
            section = "Unknown Section"
            for line in page_text.split('\n'):
                if 'SECTION' in line.upper() or 'CAT' in line or 'Slot' in line:
                    section = line.strip()
                    break
            
            question_num = len(self.scraped_data) + 1
            
            # Create readable versions (convert Unicode subscripts/superscripts)
            passage_readable = self.unicode_to_readable(passage) if passage else ''
            question_readable = self.unicode_to_readable(question_text)
            full_text_readable = self.unicode_to_readable(full_text)
            
            # Build question entry with separate passage, question, and options
            question_entry = {
                'timestamp': datetime.now().isoformat(),
                'url': page.url,
                'section': section,
                'passage': passage,  # NEW: Comprehension passage (if present)
                'passage_readable': passage_readable,  # Plain text version
                'question': question_text,  # The actual question
                'question_readable': question_readable,  # Plain text version
                'full_text': full_text,  # Complete text (passage + question + options)
                'full_text_readable': full_text_readable,  # Plain text version
                'question_html': question_html[:1000] if question_html else '',
                'has_math_unicode': has_math_unicode,
                'marks': marks,
                'options': extracted_options,  # Options extracted from content
                'page_text_sample': page_text[:3000],  # Increased for longer passages
                'screenshot': str(self.screenshot_dir / f'question_{question_num}.png'),
                'images': downloaded_images,  # Downloaded images metadata
                'image_count': len(downloaded_images)  # Quick count
            }
            
            self.scraped_data.append(question_entry)
            
            # Print summary
            if passage:
                print(f"✅ Scraped: [PASSAGE + QUESTION]")
                print(f"   Passage: {passage_readable[:50]}...")
                print(f"   Question: {question_readable[:50]}...")
            else:
                print(f"✅ Scraped: {question_readable[:60]}...")
            
            if has_math_unicode:
                print(f"   🔢 Unicode math: Yes ✓")
            print(f"   Options: {len(extracted_options)} found")
            if downloaded_images:
                successful_downloads = sum(1 for img in downloaded_images if img['type'] == 'downloaded')
                print(f"   🖼️  Images: {successful_downloads}/{len(downloaded_images)} downloaded")
            
            return question_entry
            
        except Exception as e:
            print(f"Error scraping question: {e}")
            return None
    
    async def navigate_questions(self, page, total_questions=None):
        """Navigate through all questions and scrape them"""
        # If total_questions not provided, try to auto-detect or use a high number
        if total_questions is None:
            # Try to detect total questions from page
            try:
                total_from_page = await page.evaluate(r'''() => {
                    // Look for question counter like "5 / 24"
                    const text = document.body.innerText;
                    const match = text.match(/(\d+)\s*\/\s*(\d+)/);
                    if (match) {
                        return parseInt(match[2]);
                    }
                    return null;
                }''')
                if total_from_page:
                    total_questions = total_from_page
                    print(f"✨ Auto-detected {total_questions} questions in this test")
                else:
                    total_questions = 50  # Default high number
                    print(f"⚠️  Could not auto-detect question count, will scrape until no 'Next' button (max {total_questions})")
            except:
                total_questions = 50  # Fallback
                print(f"⚠️  Could not auto-detect question count, will scrape until no 'Next' button (max {total_questions})")
        
        print(f"\nStarting to scrape up to {total_questions} questions...")
        print("=" * 60)
        
        for i in range(total_questions):
            print(f"\nQuestion {i+1}/{total_questions}:")
            
            # Scrape current question
            await self.scrape_question(page)
            
            # Click next button if not the last question
            if i < total_questions - 1:
                try:
                    # Wait for UI to stabilize
                    await page.wait_for_timeout(800)
                    
                    # Try multiple button selectors for McGraw Hill Edge
                    next_button = None
                    button_selectors = [
                        'button:has-text("Save and Next")',
                        'button:has-text("Save & Next")',
                        'button:has-text("Next")',
                        'button[class*="next"]',
                        '[data-testid*="next"]'
                    ]
                    
                    for selector in button_selectors:
                        try:
                            btn = await page.query_selector(selector)
                            if btn and await btn.is_visible():
                                next_button = btn
                                break
                        except:
                            continue
                    
                    if next_button:
                        await next_button.click()
                        await page.wait_for_timeout(1500)
                        print(f"  ➡️  Moving to question {i+2}...")
                    else:
                        # Debug: List all visible buttons
                        buttons = await page.evaluate('''() => {
                            return Array.from(document.querySelectorAll('button'))
                                .filter(b => b.offsetParent !== null)
                                .map(b => b.textContent.trim())
                                .slice(0, 5);
                        }''')
                        print(f"  ⚠️  No Next button found. Visible buttons: {buttons}")
                        print(f"  💡 Stopping at question {i+1}. You may need to click Next manually next time.")
                        break
                except Exception as e:
                    print(f"  ⚠️  Error navigating: {e}")
                    break
        
        print("\n" + "=" * 60)
        print(f"✅ Completed scraping {len(self.scraped_data)} questions!")
    
    async def save_data(self, filename='scraped_questions.json'):
        """Save scraped data to JSON file"""
        # Save to scrape folder
        json_path = self.screenshot_dir / 'scraped_questions.json'
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(self.scraped_data, f, indent=2, ensure_ascii=False)
        
        # Also save to root for backward compatibility
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.scraped_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n📁 All data saved to: {self.screenshot_dir}/")
        print(f"   ✅ Screenshots: {len(self.scraped_data)} images")
        print(f"   ✅ Downloaded images: {sum(q.get('image_count', 0) for q in self.scraped_data)} files")
        print(f"   ✅ JSON data: scraped_questions.json")
        print(f"\n💾 Also saved to root: {filename} (for backward compatibility)")
    
    async def run(self):
        """Main execution method - INTERACTIVE MODE"""
        async with async_playwright() as p:
            # Launch browser (visible mode)
            browser = await p.chromium.launch(headless=False)
            context = await browser.new_context()
            page = await context.new_page()
            
            # Create debug folder
            os.makedirs('debug_screenshots', exist_ok=True)
            
            try:
                # Login
                await self.login(page)
                
                print("\n" + "=" * 60)
                print("LOGIN SUCCESSFUL!")
                print("=" * 60)
                print("\nINSTRUCTIONS:")
                print("1. The browser window is now open")
                print("2. Manually navigate to your exam/test")
                print("3. Go to the FIRST question you want to scrape")
                print("4. Then come back here and press ENTER")
                print("=" * 60)
                
                # Wait for user to navigate
                input("\nPress ENTER when you're ready to start scraping...")
                
                # Now scrape
                await self.navigate_questions(page)
                
                # Save data
                await self.save_data()
                
                print("\n✅ Scraping complete! Check scraped_questions.json")
                print("📸 Screenshots saved to debug_screenshots/")
                
                # Keep browser open for a bit
                print("\nBrowser will close in 10 seconds...")
                await page.wait_for_timeout(10000)
                
            except Exception as e:
                print(f"\n❌ Error during scraping: {e}")
                # Save whatever we have
                if self.scraped_data:
                    await self.save_data('partial_scraped_questions.json')
                    print("Partial data saved to partial_scraped_questions.json")
            
            finally:
                await browser.close()

# Run the scraper
async def main():
    print("\n" + "="*60)
    print("McGRAW HILL EDGE SCRAPER")
    print("="*60)
    print("\nWhich section are you scraping?")
    print("  1. QA (Quantitative Aptitude)")
    print("  2. VARC (Verbal Ability & Reading Comprehension)")
    print("  3. DI & LR (Data Interpretation & Logical Reasoning)")
    print("")
    
    while True:
        choice = input("Enter choice (1/2/3): ").strip()
        if choice == '1':
            section_type = 'QA'
            break
        elif choice == '2':
            section_type = 'VARC'
            break
        elif choice == '3':
            section_type = 'DILR'
            break
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")
    
    print(f"\n✅ Selected: {section_type}")
    print("="*60)
    
    scraper = InteractiveScraper(section_type=section_type)
    await scraper.run()

if __name__ == "__main__":
    asyncio.run(main())

