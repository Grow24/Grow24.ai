import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward,
  Eye,
  EyeOff,
  Activity,
  ChevronDown
} from 'lucide-react';

interface ExecutionControlsProps {
  isExecuting: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onSpeedChange: (speed: number) => void;
  onCinematicToggle: (enabled: boolean) => void;
  activeRequests?: number;
  compact?: boolean;
}

const SPEED_OPTIONS = [
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 2, label: '2x' },
  { value: 5, label: '5x' }
];

export const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  isExecuting,
  onPlay,
  onPause,
  onReplay,
  onSpeedChange,
  onCinematicToggle,
  activeRequests = 0,
  compact = false
}) => {
  const [speed, setSpeed] = useState(1);
  const [cinematicMode, setCinematicMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  const handleCinematicToggle = () => {
    const newMode = !cinematicMode;
    setCinematicMode(newMode);
    onCinematicToggle(newMode);
  };

  const handlePlayPause = () => {
    if (isExecuting && !isPaused) {
      setIsPaused(true);
      onPause();
    } else {
      setIsPaused(false);
      onPlay();
    }
  };

  // Compact navbar version
  if (compact) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          {isExecuting && !isPaused ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Playback
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50 min-w-[200px]"
            >
              {/* Main Controls */}
              <div className="flex items-center gap-2 mb-3">
                <Button
                  variant={isExecuting && !isPaused ? "default" : "outline"}
                  size="sm"
                  onClick={handlePlayPause}
                  className="gap-2 flex-1"
                >
                  {isExecuting && !isPaused ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Play
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReplay}
                  disabled={isExecuting && !isPaused}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Speed Controls */}
              <div className="mb-3">
                <div className="text-xs text-slate-600 mb-2">Speed</div>
                <div className="flex gap-1">
                  {SPEED_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={speed === option.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleSpeedChange(option.value)}
                      className="px-2 py-1 text-xs flex-1"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Cinematic Mode */}
              <Button
                variant={cinematicMode ? "default" : "outline"}
                size="sm"
                onClick={handleCinematicToggle}
                className="gap-2 w-full"
              >
                {cinematicMode ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Cinematic
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Normal
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Original full version
  return (
    <motion.div
      className="fixed top-1/2 right-4 z-50 -translate-y-1/2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 p-4">
        {/* Active Requests Counter */}
        {activeRequests > 0 && (
          <motion.div
            className="flex items-center gap-2 mb-3 px-3 py-2 bg-cyan-50 rounded-lg border border-cyan-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Activity className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-medium text-cyan-700">
              Active Requests: {activeRequests}
            </span>
            <motion.div
              className="w-2 h-2 bg-cyan-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}

        {/* Main Controls */}
        <div className="flex items-center gap-2 mb-3">
          <Button
            variant={isExecuting && !isPaused ? "default" : "outline"}
            size="sm"
            onClick={handlePlayPause}
            className="gap-2"
          >
            {isExecuting && !isPaused ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {isExecuting ? 'Resume' : 'Play'}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onReplay}
            className="gap-2"
            disabled={isExecuting && !isPaused}
          >
            <RotateCcw className="w-4 h-4" />
            Replay
          </Button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 mb-3">
          <FastForward className="w-4 h-4 text-gray-500 mr-2" />
          {SPEED_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={speed === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => handleSpeedChange(option.value)}
              className="px-2 py-1 text-xs min-w-0"
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Cinematic Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={cinematicMode ? "default" : "outline"}
            size="sm"
            onClick={handleCinematicToggle}
            className="gap-2 flex-1"
          >
            {cinematicMode ? (
              <>
                <Eye className="w-4 h-4" />
                Cinematic
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                Normal
              </>
            )}
          </Button>
        </div>

        {/* Execution Status */}
        {isExecuting && (
          <motion.div
            className="mt-3 pt-3 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {isPaused ? 'Execution Paused' : 'Executing Flow...'}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};