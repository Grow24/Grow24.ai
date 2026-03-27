import React, { useState, useEffect, useRef } from 'react';

interface DriveFolder {
  id: string;
  name: string;
  createdTime?: string;
  modifiedTime?: string;
}

interface OBSControlsProps {
  apiBase: string;
  onRecordingStart?: () => void;
  onRecordingStop?: (path: string) => void;
}

const OBSControls: React.FC<OBSControlsProps> = ({ apiBase, onRecordingStart, onRecordingStop }) => {
  const [connected, setConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00:00');
  const [recordingPath, setRecordingPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [obsInfo, setObsInfo] = useState<any>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Google Drive upload state
  const [showDriveUploadModal, setShowDriveUploadModal] = useState(false);
  const [lastRecordingPath, setLastRecordingPath] = useState('');
  const [driveFolders, setDriveFolders] = useState<DriveFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  
  // Move to Drive feature
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<any>(null);

  // Check OBS connection status on mount
  useEffect(() => {
    checkStatus();
    const interval = setInterval(() => {
      if (connected && isRecording) {
        getRecordingStatus();
      }
    }, 1000); // Update every second when recording

    return () => clearInterval(interval);
  }, [connected, isRecording]);

  // Update timer display
  useEffect(() => {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    setRecordingTime(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    );
  }, [timerSeconds]);

  const startTimer = () => {
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Reset and start timer
    setTimerSeconds(0);
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerSeconds(0);
  };

  const checkStatus = async () => {
    try {
      const res = await fetch(`${apiBase}/obs/status`);
      const data = await res.json();
      setConnected(data.connected);
      
      if (data.connected) {
        await getRecordingStatus();
      }
    } catch (err) {
      console.error('Error checking OBS status:', err);
      setConnected(false);
    }
  };

  const getRecordingStatus = async () => {
    try {
      const res = await fetch(`${apiBase}/obs/recording/status`);
      const data = await res.json();
      
      if (data.success) {
        setIsRecording(data.isRecording);
        setIsPaused(data.isPaused || false);
        setRecordingTime(data.recordingTime || '00:00:00');
        setRecordingPath(data.recordingPath || '');
      }
    } catch (err) {
      console.error('Error getting recording status:', err);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const res = await fetch(`${apiBase}/obs/connect`, { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        setConnected(true);
        setMessage('[SUCCESS] Connected to OBS Studio');
        
        // Get OBS info
        const infoRes = await fetch(`${apiBase}/obs/info`);
        const infoData = await infoRes.json();
        if (infoData.success) {
          setObsInfo(infoData);
        }
      } else {
        setMessage(`[ERROR] ${data.message || 'Failed to connect'}`);
        if (data.hint) {
          setMessage(prev => `${prev}\n[TIP] ${data.hint}`);
        }
      }
    } catch (err: any) {
      setMessage(`[ERROR] Connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    
    try {
      await fetch(`${apiBase}/obs/disconnect`, { method: 'POST' });
      setConnected(false);
      setIsRecording(false);
      setMessage('Disconnected from OBS');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartRecording = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const res = await fetch(`${apiBase}/obs/recording/start`, { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        setIsRecording(true);
        setRecordingPath(data.recordingPath || '');
        startTimer(); // Start the timer!
        setMessage('Recording started!');
        if (onRecordingStart) {
          onRecordingStart();
        }
      } else {
        setMessage(`[ERROR] ${data.message || 'Failed to start recording'}`);
      }
    } catch (err: any) {
      setMessage(`[ERROR] Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStopRecording = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const res = await fetch(`${apiBase}/obs/recording/stop`, { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        setIsRecording(false);
        setIsPaused(false);
        stopTimer(); // Stop the timer!
        const path = data.recordingPath || recordingPath;
        setMessage(`[SUCCESS] Recording saved to: ${path}`);
        setLastRecordingPath(path);
        
        // Show Google Drive upload prompt
        setShowDriveUploadModal(true);
        await fetchDriveFolders();
        
        if (onRecordingStop) {
          onRecordingStop(path);
        }
      } else {
        setMessage(`[ERROR] ${data.message || 'Failed to stop recording'}`);
      }
    } catch (err: any) {
      setMessage(`[ERROR] Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    setLoading(true);
    
    try {
      const res = await fetch(`${apiBase}/obs/recording/pause`, { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        setIsPaused(true);
        setMessage('Recording paused');
      } else {
        setMessage(`[ERROR] ${data.message}`);
      }
    } catch (err: any) {
      setMessage(`[ERROR] Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    
    try {
      const res = await fetch(`${apiBase}/obs/recording/resume`, { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        setIsPaused(false);
        setMessage('Recording resumed');
      } else {
        setMessage(`[ERROR] ${data.message}`);
      }
    } catch (err: any) {
      setMessage(`[ERROR] Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriveFolders = async () => {
    try {
      const res = await fetch(`${apiBase}/google/drive/folders`);
      const data = await res.json();
      
      if (data.success) {
        setDriveFolders(data.folders || []);
      }
    } catch (err) {
      console.error('Error fetching Drive folders:', err);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const res = await fetch(`${apiBase}/google/drive/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderName: newFolderName })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setDriveFolders([data.folder, ...driveFolders]);
        setSelectedFolderId(data.folder.id);
        setNewFolderName('');
        setShowCreateFolder(false);
        alert('Folder created successfully!');
      } else {
        alert('Failed to create folder: ' + data.error);
      }
    } catch (err: any) {
      alert('Error creating folder: ' + err.message);
    }
  };

  const handleUploadToDrive = async (shouldDelete: boolean = false) => {
    if (!lastRecordingPath) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const fileName = lastRecordingPath.split('/').pop() || 'recording.mkv';
      
      const res = await fetch(`${apiBase}/obs/recording/upload-to-drive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: lastRecordingPath,
          fileName: fileName,
          folderId: selectedFolderId || undefined
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUploadProgress(100);
        setUploadedFileInfo(data.file);
        
        if (shouldDelete) {
          // Show delete confirmation dialog
          setShowDeleteConfirm(true);
        } else {
          // Just show success and close
          alert(`✅ Recording uploaded to Google Drive!\n\nFile: ${data.file.name}\nView: ${data.file.webViewLink}`);
          setShowDriveUploadModal(false);
          setLastRecordingPath('');
        }
      } else {
        alert('❌ Failed to upload: ' + (data.error || data.details));
      }
    } catch (err: any) {
      alert('❌ Error uploading to Drive: ' + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteLocal = async () => {
    try {
      const res = await fetch(`${apiBase}/obs/recording/delete-local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: lastRecordingPath })
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert(`✅ Recording moved to Google Drive!\n\nLocal file deleted successfully.\n\nFile: ${uploadedFileInfo.name}\nView: ${uploadedFileInfo.webViewLink}`);
      } else {
        alert('⚠️ Upload succeeded but failed to delete local file:\n' + data.error + '\n\nFile is safe in Drive. You can manually delete it from:\n' + lastRecordingPath);
      }
    } catch (err: any) {
      alert('⚠️ Upload succeeded but error deleting local file:\n' + err.message + '\n\nFile is safe in Drive. You can manually delete it from:\n' + lastRecordingPath);
    } finally {
      setShowDeleteConfirm(false);
      setShowDriveUploadModal(false);
      setLastRecordingPath('');
      setUploadedFileInfo(null);
    }
  };

  const handleKeepLocal = () => {
    alert(`✅ Recording uploaded to Google Drive!\n\nLocal file kept at: ${lastRecordingPath}\n\nFile: ${uploadedFileInfo.name}\nView: ${uploadedFileInfo.webViewLink}`);
    setShowDeleteConfirm(false);
    setShowDriveUploadModal(false);
    setLastRecordingPath('');
    setUploadedFileInfo(null);
  };

  const handleSkipUpload = () => {
    setShowDriveUploadModal(false);
    setLastRecordingPath('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">OBS Studio Recording</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
        
        {!connected ? (
          <button
            onClick={handleConnect}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 font-medium"
          >
            Disconnect
          </button>
        )}
      </div>

      {/* OBS Info */}
      {connected && obsInfo && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>OBS {obsInfo.version}</span>
            <span>CPU: {obsInfo.stats?.cpuUsage?.toFixed(1)}%</span>
            <span>FPS: {obsInfo.stats?.fps?.toFixed(0)}</span>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      {connected && (
        <div className="space-y-4">
          {/* Recording Status - Timer */}
          {isRecording && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                  <span className="font-bold text-red-700">RECORDING</span>
                </div>
                <span className="font-mono text-2xl font-bold text-red-700">
                  {recordingTime}
                </span>
              </div>
            </div>
          )}

          {/* Simple 2-Button Layout */}
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 font-bold text-lg flex items-center justify-center gap-3 shadow-lg"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8"/>
              </svg>
              ● Start Recording
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 font-bold text-lg flex items-center justify-center gap-3 shadow-lg"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12"/>
              </svg>
              ● Stop Recording
            </button>
          )}

          {/* Message Display */}
          {message && (
            <div className={`p-3 rounded-lg text-sm whitespace-pre-line ${
              message.includes('❌') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      )}

      {/* Setup Instructions */}
      {!connected && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-bold text-blue-900 mb-2">Setup Required:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Open <strong>OBS Studio</strong></li>
            <li>Go to: <strong>Tools → WebSocket Server Settings</strong></li>
            <li>Check <strong>"Enable WebSocket server"</strong></li>
            <li>Note the port (default: <strong>4455</strong>)</li>
            <li>Click <strong>"Connect"</strong> above</li>
          </ol>
        </div>
      )}

      {/* Google Drive Upload Modal */}
      {showDriveUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 18l2-2v6h-6l2-2-4-4zm2-10l-2-2-4 4-4-4-2 2 4 4-4 4 2 2 4-4 4 4 2-2-4-4z"/>
                    </svg>
                    Upload to Google Drive
                  </h2>
                  <p className="text-blue-100 mt-1 text-sm">Recording saved locally. Upload to cloud for backup?</p>
                </div>
                <button
                  onClick={handleSkipUpload}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
                  disabled={isUploading}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Recording Info */}
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  Recording File
                </h3>
                <p className="text-sm text-gray-700 font-mono break-all">
                  {lastRecordingPath.split('/').pop()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Saved locally at: {lastRecordingPath}
                </p>
              </div>

              {/* Folder Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Destination Folder (Optional)
                </label>
                
                {showCreateFolder ? (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleCreateFolder}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateFolder(false);
                        setNewFolderName('');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCreateFolder(true)}
                    className="mb-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Folder
                  </button>
                )}

                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition">
                    <input
                      type="radio"
                      name="folder"
                      checked={selectedFolderId === ''}
                      onChange={() => setSelectedFolderId('')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <p className="font-medium text-gray-900">My Drive (Root)</p>
                      <p className="text-xs text-gray-500">Upload to root folder</p>
                    </div>
                  </label>

                  {driveFolders.map((folder) => (
                    <label
                      key={folder.id}
                      className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition"
                    >
                      <input
                        type="radio"
                        name="folder"
                        checked={selectedFolderId === folder.id}
                        onChange={() => setSelectedFolderId(folder.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{folder.name}</p>
                        {folder.modifiedTime && (
                          <p className="text-xs text-gray-500">
                            Modified: {new Date(folder.modifiedTime).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {driveFolders.length === 0 && !showCreateFolder && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No folders found. Upload to root or create a new folder.
                  </p>
                )}
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Uploading...</span>
                    <span className="text-gray-900 font-semibold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
              <div className="space-y-3">
                {/* Action Buttons */}
                <div className="flex justify-between items-center gap-3">
                  <button
                    onClick={handleSkipUpload}
                    disabled={isUploading}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition disabled:opacity-50"
                  >
                    Keep Local Only
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUploadToDrive(false)}
                      disabled={isUploading}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition disabled:opacity-50 shadow-lg flex items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Copying...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy to Drive
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleUploadToDrive(true)}
                      disabled={isUploading}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold transition disabled:opacity-50 shadow-lg flex items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Moving...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Move to Drive
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Help Text */}
                <p className="text-xs text-gray-500 text-center">
                  <span className="font-semibold">Copy:</span> Upload & keep local · 
                  <span className="font-semibold ml-1">Move:</span> Upload & delete local
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold">Upload Successful!</h2>
                  <p className="text-green-100 text-sm mt-1">Your recording is now on Google Drive</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <p className="text-green-900 font-semibold mb-2">📁 {uploadedFileInfo?.name}</p>
                <a 
                  href={uploadedFileInfo?.webViewLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm underline flex items-center gap-1"
                >
                  View in Google Drive
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <p className="text-gray-900 font-semibold mb-2">🗑️ Delete local copy?</p>
                <p className="text-gray-700 text-sm mb-3">
                  Your file is safely stored in Google Drive. Do you want to delete the local copy to free up disk space?
                </p>
                <p className="text-xs text-gray-500 font-mono break-all bg-white p-2 rounded border border-gray-200">
                  📂 {lastRecordingPath}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={handleKeepLocal}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
              >
                Keep Local Copy
              </button>
              <button
                onClick={handleDeleteLocal}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-semibold transition shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Local File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OBSControls;

