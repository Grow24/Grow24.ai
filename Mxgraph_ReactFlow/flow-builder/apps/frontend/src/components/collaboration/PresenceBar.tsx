import React from 'react';
import { CollabUser } from '../../hooks/useCollaboration';
import { Users, Wifi, WifiOff } from 'lucide-react';

interface PresenceBarProps {
  users: CollabUser[];
  isConnected: boolean;
  currentUser: CollabUser;
}

export const PresenceBar: React.FC<PresenceBarProps> = ({ users, isConnected, currentUser }) => {
  const allUsers = [currentUser, ...users];

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-sm">
      <div className="flex items-center gap-2">
        {isConnected ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        <span className="text-sm font-medium text-gray-700">
          {isConnected ? 'Connected' : 'Offline'}
        </span>
      </div>

      <div className="h-4 w-px bg-gray-300" />

      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">{allUsers.length} online</span>
      </div>

      <div className="flex -space-x-2">
        {allUsers.slice(0, 5).map((user, index) => (
          <div
            key={user.id}
            className="relative group"
            style={{ zIndex: allUsers.length - index }}
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs font-medium text-white"
              style={{ backgroundColor: user.color }}
              title={user.name}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {user.name}
              {user.id === currentUser.id && ' (You)'}
            </div>
          </div>
        ))}
        
        {allUsers.length > 5 && (
          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 shadow-sm flex items-center justify-center text-xs font-medium text-gray-600">
            +{allUsers.length - 5}
          </div>
        )}
      </div>
    </div>
  );
};