// HBMP Meet Recorder - Content Script
// This script runs on Google Meet pages and adds a floating recording button

const API_BASE = 'http://localhost:3006';
let isRecording = false;
let isConnected = false;
let recordingTime = 0;
let timerInterval = null;

// Create floating recording control
function createRecordingControl() {
  // Check if already exists
  if (document.getElementById('hbmp-recorder')) {
    return;
  }

  // Create container
  const container = document.createElement('div');
  container.id = 'hbmp-recorder';
  container.className = 'hbmp-recorder-container';
  
  container.innerHTML = `
    <div class="hbmp-recorder-widget">
      <div class="hbmp-recorder-header">
        <span class="hbmp-recorder-logo">🎥</span>
        <span class="hbmp-recorder-title">OBS Recorder</span>
        <button class="hbmp-recorder-minimize" id="hbmp-minimize">−</button>
      </div>
      <div class="hbmp-recorder-body">
        <div class="hbmp-recorder-status" id="hbmp-status">
          <div class="hbmp-status-indicator" id="hbmp-indicator"></div>
          <span id="hbmp-status-text">Disconnected</span>
        </div>
        <div class="hbmp-recorder-timer" id="hbmp-timer" style="display: none;">
          <span class="hbmp-timer-icon">⏱️</span>
          <span id="hbmp-timer-text">00:00:00</span>
        </div>
        <div class="hbmp-recorder-actions">
          <button class="hbmp-btn hbmp-btn-connect" id="hbmp-connect">
            Connect to OBS
          </button>
          <button class="hbmp-btn hbmp-btn-record" id="hbmp-record" style="display: none;">
            <span class="hbmp-record-icon">⏺</span>
            Start Recording
          </button>
          <button class="hbmp-btn hbmp-btn-stop" id="hbmp-stop" style="display: none;">
            <span class="hbmp-stop-icon">⏹</span>
            Stop Recording
          </button>
        </div>
        <div class="hbmp-recorder-message" id="hbmp-message"></div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // Add event listeners
  setupEventListeners();

  // Check initial connection
  checkOBSConnection();
}

function setupEventListeners() {
  const connectBtn = document.getElementById('hbmp-connect');
  const recordBtn = document.getElementById('hbmp-record');
  const stopBtn = document.getElementById('hbmp-stop');
  const minimizeBtn = document.getElementById('hbmp-minimize');

  connectBtn.addEventListener('click', handleConnect);
  recordBtn.addEventListener('click', handleStartRecording);
  stopBtn.addEventListener('click', handleStopRecording);
  minimizeBtn.addEventListener('click', toggleMinimize);

  // Make draggable
  makeDraggable();
}

function makeDraggable() {
  const widget = document.querySelector('.hbmp-recorder-widget');
  const header = document.querySelector('.hbmp-recorder-header');
  
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  header.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    if (e.target.id === 'hbmp-minimize') return;
    
    initialX = e.clientX - widget.offsetLeft;
    initialY = e.clientY - widget.offsetTop;
    isDragging = true;
    header.style.cursor = 'grabbing';
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      widget.style.left = currentX + 'px';
      widget.style.top = currentY + 'px';
    }
  }

  function dragEnd() {
    isDragging = false;
    header.style.cursor = 'grab';
  }
}

function toggleMinimize() {
  const body = document.querySelector('.hbmp-recorder-body');
  const btn = document.getElementById('hbmp-minimize');
  
  if (body.style.display === 'none') {
    body.style.display = 'block';
    btn.textContent = '−';
  } else {
    body.style.display = 'none';
    btn.textContent = '+';
  }
}

async function checkOBSConnection() {
  try {
    const response = await fetch(`${API_BASE}/obs/status`);
    const data = await response.json();
    
    if (data.connected) {
      updateUI('connected');
      isConnected = true;
    }
  } catch (error) {
    console.log('OBS not connected yet');
  }
}

async function handleConnect() {
  const btn = document.getElementById('hbmp-connect');
  btn.disabled = true;
  btn.textContent = 'Connecting...';
  
  try {
    const response = await fetch(`${API_BASE}/obs/connect`, { method: 'POST' });
    const data = await response.json();
    
    if (data.success) {
      isConnected = true;
      updateUI('connected');
      showMessage('✅ Connected to OBS Studio', 'success');
    } else {
      updateUI('disconnected');
      showMessage('❌ ' + data.message, 'error');
    }
  } catch (error) {
    updateUI('disconnected');
    showMessage('❌ Connection failed. Is backend running?', 'error');
  }
}

async function handleStartRecording() {
  const btn = document.getElementById('hbmp-record');
  btn.disabled = true;
  
  try {
    const response = await fetch(`${API_BASE}/obs/recording/start`, { method: 'POST' });
    const data = await response.json();
    
    if (data.success) {
      isRecording = true;
      recordingTime = 0;
      updateUI('recording');
      startTimer();
      showMessage('🎥 Recording started!', 'success');
    } else {
      btn.disabled = false;
      showMessage('❌ ' + data.message, 'error');
    }
  } catch (error) {
    btn.disabled = false;
    showMessage('❌ Failed to start recording', 'error');
  }
}

async function handleStopRecording() {
  const btn = document.getElementById('hbmp-stop');
  btn.disabled = true;
  
  try {
    const response = await fetch(`${API_BASE}/obs/recording/stop`, { method: 'POST' });
    const data = await response.json();
    
    if (data.success) {
      isRecording = false;
      stopTimer();
      updateUI('connected');
      showMessage(`✅ Recording saved!\n${data.recordingPath || ''}`, 'success');
    } else {
      btn.disabled = false;
      showMessage('❌ ' + data.message, 'error');
    }
  } catch (error) {
    btn.disabled = false;
    showMessage('❌ Failed to stop recording', 'error');
  }
}

function updateUI(state) {
  const statusText = document.getElementById('hbmp-status-text');
  const indicator = document.getElementById('hbmp-indicator');
  const connectBtn = document.getElementById('hbmp-connect');
  const recordBtn = document.getElementById('hbmp-record');
  const stopBtn = document.getElementById('hbmp-stop');
  const timer = document.getElementById('hbmp-timer');

  switch (state) {
    case 'connected':
      statusText.textContent = 'Connected';
      indicator.className = 'hbmp-status-indicator connected';
      connectBtn.style.display = 'none';
      recordBtn.style.display = 'flex';
      recordBtn.disabled = false;
      stopBtn.style.display = 'none';
      timer.style.display = 'none';
      break;
      
    case 'recording':
      statusText.textContent = 'Recording';
      indicator.className = 'hbmp-status-indicator recording';
      connectBtn.style.display = 'none';
      recordBtn.style.display = 'none';
      stopBtn.style.display = 'flex';
      stopBtn.disabled = false;
      timer.style.display = 'flex';
      break;
      
    case 'disconnected':
    default:
      statusText.textContent = 'Disconnected';
      indicator.className = 'hbmp-status-indicator';
      connectBtn.style.display = 'flex';
      connectBtn.disabled = false;
      connectBtn.textContent = 'Connect to OBS';
      recordBtn.style.display = 'none';
      stopBtn.style.display = 'none';
      timer.style.display = 'none';
      break;
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    recordingTime++;
    const hours = Math.floor(recordingTime / 3600);
    const minutes = Math.floor((recordingTime % 3600) / 60);
    const seconds = recordingTime % 60;
    
    const timerText = document.getElementById('hbmp-timer-text');
    timerText.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  recordingTime = 0;
}

function showMessage(text, type = 'info') {
  const message = document.getElementById('hbmp-message');
  message.textContent = text;
  message.className = `hbmp-recorder-message ${type}`;
  message.style.display = 'block';
  
  setTimeout(() => {
    message.style.display = 'none';
  }, 5000);
}

// Initialize when Meet is loaded
function init() {
  // Wait for Meet to fully load
  const checkMeetLoaded = setInterval(() => {
    const meetControls = document.querySelector('[data-meeting-title]') || 
                        document.querySelector('[jsname]') ||
                        document.querySelector('.XCoPyb');
    
    if (meetControls || document.readyState === 'complete') {
      clearInterval(checkMeetLoaded);
      setTimeout(() => {
        createRecordingControl();
        console.log('🎥 HBMP Meet Recorder loaded!');
      }, 2000); // Wait 2 seconds after Meet loads
    }
  }, 500);
}

// Run when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

