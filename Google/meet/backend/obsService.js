import OBSWebSocket from 'obs-websocket-js';

// OBS WebSocket client instance
let obs = null;
let isConnected = false;
let currentRecordingPath = null;

// OBS WebSocket connection settings (default OBS Studio 28+ values)
const OBS_HOST = process.env.OBS_HOST || 'localhost';
const OBS_PORT = process.env.OBS_PORT || 4455;
const OBS_PASSWORD = process.env.OBS_PASSWORD || ''; // Set in OBS: Tools > WebSocket Server Settings

/**
 * Initialize OBS WebSocket connection
 */
async function connectOBS() {
  try {
    if (!obs) {
      obs = new OBSWebSocket();
    }

    // Check if already connected
    if (isConnected) {
      console.log('✅ OBS already connected');
      return { success: true, message: 'Already connected' };
    }

    // Connect to OBS WebSocket
    await obs.connect(`ws://${OBS_HOST}:${OBS_PORT}`, OBS_PASSWORD, {
      rpcVersion: 1,
    });

    isConnected = true;
    console.log(`✅ Connected to OBS Studio at ${OBS_HOST}:${OBS_PORT}`);

    // Setup event listeners
    obs.on('RecordStateChanged', (data) => {
      console.log(`🎥 OBS Recording state changed:`, data);
      if (data.outputState === 'OBS_WEBSOCKET_OUTPUT_STOPPED') {
        console.log(`📁 Recording saved to: ${currentRecordingPath}`);
      }
    });

    obs.on('ConnectionClosed', () => {
      console.log('⚠️ OBS WebSocket connection closed');
      isConnected = false;
    });

    return { success: true, message: 'Connected to OBS Studio' };
  } catch (error) {
    console.error('❌ Failed to connect to OBS:', error.message);
    isConnected = false;
    return { 
      success: false, 
      message: `Failed to connect: ${error.message}`,
      hint: 'Make sure OBS Studio is running and WebSocket server is enabled'
    };
  }
}

/**
 * Disconnect from OBS WebSocket
 */
async function disconnectOBS() {
  try {
    if (obs && isConnected) {
      await obs.disconnect();
      isConnected = false;
      console.log('✅ Disconnected from OBS');
    }
    return { success: true, message: 'Disconnected' };
  } catch (error) {
    console.error('❌ Error disconnecting from OBS:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Get OBS connection status
 */
function getStatus() {
  return {
    connected: isConnected,
    host: OBS_HOST,
    port: OBS_PORT,
  };
}

/**
 * Start recording in OBS
 */
async function startRecording() {
  try {
    // Ensure connected
    if (!isConnected) {
      const connectResult = await connectOBS();
      if (!connectResult.success) {
        return connectResult;
      }
    }

    // Check if already recording
    const recordStatus = await obs.call('GetRecordStatus');
    if (recordStatus.outputActive) {
      return { 
        success: false, 
        message: 'Recording is already active',
        isRecording: true
      };
    }

    // Start recording
    await obs.call('StartRecord');
    console.log('🎥 Started recording in OBS');

    // Get recording info
    const status = await obs.call('GetRecordStatus');
    currentRecordingPath = status.outputPath || 'Unknown';

    return { 
      success: true, 
      message: 'Recording started',
      isRecording: true,
      recordingPath: currentRecordingPath
    };
  } catch (error) {
    console.error('❌ Error starting recording:', error.message);
    return { 
      success: false, 
      message: `Failed to start recording: ${error.message}`,
      isRecording: false
    };
  }
}

/**
 * Stop recording in OBS
 */
async function stopRecording() {
  try {
    if (!isConnected) {
      return { 
        success: false, 
        message: 'Not connected to OBS',
        isRecording: false
      };
    }

    // Check if currently recording
    const recordStatus = await obs.call('GetRecordStatus');
    if (!recordStatus.outputActive) {
      return { 
        success: false, 
        message: 'No active recording to stop',
        isRecording: false
      };
    }

    // Get the path before stopping
    const pathBeforeStop = recordStatus.outputPath || currentRecordingPath;

    // Stop recording
    const stopResponse = await obs.call('StopRecord');
    console.log('🛑 Stopped recording in OBS');

    // Wait a moment for the file to be saved
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Try to get the final path from the stop response or previous status
    let savedPath = stopResponse?.outputPath || pathBeforeStop || currentRecordingPath;
    
    // If still unknown, try one more status check
    if (!savedPath || savedPath === 'Unknown') {
      try {
        const finalStatus = await obs.call('GetRecordStatus');
        savedPath = finalStatus.outputPath || savedPath;
      } catch (err) {
        console.log('Could not get final status:', err.message);
      }
    }

    console.log(`📁 Recording saved to: ${savedPath}`);
    currentRecordingPath = savedPath;

    return { 
      success: true, 
      message: 'Recording stopped',
      isRecording: false,
      recordingPath: savedPath,
      outputPath: savedPath
    };
  } catch (error) {
    console.error('❌ Error stopping recording:', error.message);
    return { 
      success: false, 
      message: `Failed to stop recording: ${error.message}`,
      isRecording: false
    };
  }
}

/**
 * Get current recording status
 */
async function getRecordingStatus() {
  try {
    if (!isConnected) {
      return { 
        success: false, 
        message: 'Not connected to OBS',
        isRecording: false
      };
    }

    const status = await obs.call('GetRecordStatus');
    return { 
      success: true,
      isRecording: status.outputActive,
      isPaused: status.outputPaused || false,
      recordingTime: status.outputTimecode || '00:00:00',
      recordingPath: status.outputPath || currentRecordingPath || 'Unknown'
    };
  } catch (error) {
    console.error('❌ Error getting recording status:', error.message);
    return { 
      success: false, 
      message: error.message,
      isRecording: false
    };
  }
}

/**
 * Pause recording
 */
async function pauseRecording() {
  try {
    if (!isConnected) {
      return { success: false, message: 'Not connected to OBS' };
    }

    await obs.call('PauseRecord');
    console.log('⏸️ Paused recording in OBS');
    return { success: true, message: 'Recording paused' };
  } catch (error) {
    console.error('❌ Error pausing recording:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Resume recording
 */
async function resumeRecording() {
  try {
    if (!isConnected) {
      return { success: false, message: 'Not connected to OBS' };
    }

    await obs.call('ResumeRecord');
    console.log('▶️ Resumed recording in OBS');
    return { success: true, message: 'Recording resumed' };
  } catch (error) {
    console.error('❌ Error resuming recording:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Get OBS version and stats
 */
async function getOBSInfo() {
  try {
    if (!isConnected) {
      await connectOBS();
    }

    const version = await obs.call('GetVersion');
    const stats = await obs.call('GetStats');
    
    return {
      success: true,
      version: version.obsVersion,
      websocketVersion: version.obsWebSocketVersion,
      platform: version.platform,
      stats: {
        fps: stats.activeFps,
        cpuUsage: stats.cpuUsage,
        memoryUsage: stats.memoryUsage,
      }
    };
  } catch (error) {
    console.error('❌ Error getting OBS info:', error.message);
    return { success: false, message: error.message };
  }
}

export {
  connectOBS,
  disconnectOBS,
  getStatus,
  startRecording,
  stopRecording,
  getRecordingStatus,
  pauseRecording,
  resumeRecording,
  getOBSInfo
};

