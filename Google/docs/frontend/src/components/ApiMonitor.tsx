import { useState } from "react";

interface ApiCall {
  id: number;
  timestamp: string;
  method: string;
  endpoint: string;
  request?: unknown;
  response?: unknown;
  status: number;
}

export default function ApiMonitor() {
  const [calls, setCalls] = useState<ApiCall[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<ApiCall | null>(null);

  // Expose a global function to log API calls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).logApiCall = (call: ApiCall) => {
    setCalls((prev) => [call, ...prev].slice(0, 50)); // Keep last 50 calls
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 z-50"
        title="API Monitor"
      >
        <span className="text-xl">🔍</span>
        {calls.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {calls.length}
          </span>
        )}
      </button>

      {/* Monitor Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[600px] h-[500px] bg-white border-2 border-purple-600 rounded-lg shadow-2xl z-50 flex flex-col">
          <div className="bg-purple-600 text-white p-3 flex items-center justify-between rounded-t-lg">
            <h3 className="font-bold text-lg">🔍 API Monitor</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCalls([])}
                className="bg-purple-700 px-3 py-1 rounded text-sm hover:bg-purple-800"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-purple-700 px-3 py-1 rounded text-sm hover:bg-purple-800"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Call List */}
            <div className="w-1/2 border-r overflow-y-auto">
              {calls.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No API calls yet. Make some requests!
                </div>
              ) : (
                calls.map((call) => (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className={`p-3 border-b cursor-pointer hover:bg-purple-50 ${
                      selectedCall?.id === call.id ? "bg-purple-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          call.method === "GET"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {call.method}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          call.status === 200
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {call.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 truncate">
                      {call.endpoint}
                    </div>
                    <div className="text-xs text-gray-400">{call.timestamp}</div>
                  </div>
                ))
              )}
            </div>

            {/* Call Details */}
            <div className="w-1/2 overflow-y-auto bg-gray-50 p-4">
              {selectedCall ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-purple-700 mb-2">📤 Request</h4>
                    <div className="bg-white p-3 rounded border text-xs font-mono overflow-x-auto">
                      <div className="mb-2">
                        <span className="font-bold text-green-600">{selectedCall.method}</span>{" "}
                        <span className="text-blue-600">{selectedCall.endpoint}</span>
                      </div>
                      {selectedCall.request && (
                        <pre className="text-gray-700">
                          {JSON.stringify(selectedCall.request, null, 2) as string}
                        </pre>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-purple-700 mb-2">📥 Response</h4>
                    <div className="bg-white p-3 rounded border text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto">
                      <pre className="text-gray-700">
                        {JSON.stringify(selectedCall.response, null, 2) as string}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Select an API call to see details
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
