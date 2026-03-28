import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Users, Activity } from 'lucide-react';

interface CollaborationStatusProps {
  isConnected: boolean;
  userCount: number;
  className?: string;
}

export const CollaborationStatus: React.FC<CollaborationStatusProps> = ({
  isConnected,
  userCount,
  className = ''
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isConnected 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}
      >
        {isConnected ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span>{isConnected ? 'Live' : 'Offline'}</span>
        {isConnected && (
          <>
            <Users className="w-4 h-4" />
            <span>{userCount}</span>
          </>
        )}
      </button>

      {showDetails && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Collaboration Status</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Connection:</span>
                <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Active Users:</span>
                <span>{userCount}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Real-time Sync:</span>
                <span className={isConnected ? 'text-green-600' : 'text-gray-500'}>
                  {isConnected ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {!isConnected && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                <strong>Offline Mode:</strong> Changes will sync when connection is restored.
              </div>
            )}

            {isConnected && userCount > 1 && (
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <strong>Live Collaboration:</strong> {userCount} users are editing simultaneously.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};