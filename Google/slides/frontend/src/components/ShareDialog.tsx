import { useState, useEffect } from 'react';

interface Permission {
  id: string;
  type: string;
  role: string;
  emailAddress?: string;
  displayName?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  presentationId: string;
  presentationName: string;
}

export default function ShareDialog({ isOpen, onClose, presentationId, presentationName }: Props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('writer');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3003";

  useEffect(() => {
    if (isOpen) {
      loadPermissions();
    }
  }, [isOpen, presentationId]);

  const loadPermissions = async () => {
    try {
      const res = await fetch(`${apiBase}/google/slides/${presentationId}/permissions`);
      const data = await res.json();
      setPermissions(data.permissions || []);
    } catch (err) {
      console.error('Failed to load permissions:', err);
    }
  };

  const shareWithUser = async () => {
    if (!email.trim()) {
      setMessage('Please enter an email address');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${apiBase}/google/slides/${presentationId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, type: 'user' }),
      });

      if (res.ok) {
        setMessage(`✅ Shared with ${email}`);
        setEmail('');
        loadPermissions();
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.error || 'Failed to share'}`);
      }
    } catch (err) {
      setMessage('❌ Network error');
    } finally {
      setLoading(false);
    }
  };

  const makePublic = async () => {
    if (!confirm('This will allow ANYONE with the link to edit this presentation. Continue?')) {
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${apiBase}/google/slides/${presentationId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'anyone', role: 'writer' }),
      });

      if (res.ok) {
        setMessage('✅ Presentation is now public (anyone can edit)');
        loadPermissions();
      } else {
        setMessage('❌ Failed to make public');
      }
    } catch (err) {
      setMessage('❌ Network error');
    } finally {
      setLoading(false);
    }
  };

  const removePermission = async (permissionId: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${apiBase}/google/slides/${presentationId}/permissions/${permissionId}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        setMessage('✅ Permission removed');
        loadPermissions();
      } else {
        setMessage('❌ Failed to remove permission');
      }
    } catch (err) {
      setMessage('❌ Network error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">Share Presentation</h2>
          <p className="text-sm text-gray-600 mt-1">{presentationName}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Share with specific user */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Share with specific user</h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && shareWithUser()}
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="writer">Can Edit</option>
                <option value="commenter">Can Comment</option>
                <option value="reader">Can View</option>
              </select>
              <button
                onClick={shareWithUser}
                disabled={loading}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
              >
                Share
              </button>
            </div>
          </div>

          {/* Make public */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Public access</h3>
            <button
              onClick={makePublic}
              disabled={loading}
              className="px-6 py-2 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 disabled:border-gray-400 disabled:text-gray-400"
            >
              🌐 Make Public (Anyone with link can edit)
            </button>
          </div>

          {/* Status message */}
          {message && (
            <div className={`p-3 rounded-lg ${message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* Current permissions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Who has access</h3>
            <div className="space-y-2">
              {permissions.length === 0 ? (
                <p className="text-sm text-gray-500">Loading permissions...</p>
              ) : (
                permissions.map((perm) => (
                  <div
                    key={perm.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {perm.type === 'anyone' ? '🌐 Anyone with the link' : perm.displayName || perm.emailAddress || 'Unknown'}
                      </p>
                      {perm.emailAddress && (
                        <p className="text-sm text-gray-600">{perm.emailAddress}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 capitalize">
                        {perm.role === 'writer' ? 'Can Edit' : perm.role === 'commenter' ? 'Can Comment' : 'Can View'}
                      </span>
                      {perm.type !== 'user' || perm.role !== 'owner' ? (
                        <button
                          onClick={() => removePermission(perm.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                        >
                          Remove
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">Owner</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
