import React from 'react';
import { motion } from 'framer-motion';
import { Handle, Position } from '@xyflow/react';

interface AnimatedNodeWrapperProps {
  children: React.ReactNode;
  nodeId: string;
  type: string;
  isActive?: boolean;
  isCompleted?: boolean;
  hasError?: boolean;
  cinematicMode?: boolean;
}

const COLORS = {
  active: '#00E0FF',
  completed: '#00B67A',
  pending: '#B0B7C3',
  error: '#FF6B6B'
};

export const AnimatedNodeWrapper: React.FC<AnimatedNodeWrapperProps> = ({
  children,
  nodeId,
  type,
  isActive = false,
  isCompleted = false,
  hasError = false,
  cinematicMode = false
}) => {
  const getNodeColor = () => {
    if (hasError) return COLORS.error;
    if (isActive) return COLORS.active;
    if (isCompleted) return COLORS.completed;
    return COLORS.pending;
  };

  const getNodeStyle = () => {
    const baseStyle = {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: `2px solid ${getNodeColor()}`,
      borderRadius: '12px',
      boxShadow: isActive 
        ? `0 8px 32px ${getNodeColor()}40, 0 0 0 1px ${getNodeColor()}20`
        : '0 4px 16px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(8px)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontWeight: 500
    };

    if (cinematicMode && !isActive && !isCompleted) {
      return {
        ...baseStyle,
        opacity: 0.5,
        filter: 'brightness(0.7)'
      };
    }

    return baseStyle;
  };

  return (
    <motion.div
      className="relative"
      style={getNodeStyle()}
      animate={{
        scale: isActive ? 1.05 : 1,
        rotateY: isActive ? [0, 2, 0] : 0
      }}
      transition={{
        duration: isActive ? 2 : 0.3,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut"
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {/* Ambient Glow */}
      {(isActive || isCompleted) && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${getNodeColor()}30 0%, transparent 70%)`,
            filter: 'blur(12px)',
            zIndex: -1
          }}
          animate={{
            scale: isActive ? [1, 1.3, 1] : 1,
            opacity: isActive ? [0.6, 1, 0.6] : 0.8
          }}
          transition={{
            duration: isActive ? 3 : 0.5,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Pulse Ring for Active Nodes */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 pointer-events-none"
          style={{
            borderColor: getNodeColor(),
            zIndex: -1
          }}
          animate={{
            scale: [1, 1.2, 1.4],
            opacity: [0.8, 0.4, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      )}

      {/* Node Content */}
      <div className="relative z-10 p-4">
        {children}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-white"
        style={{
          background: getNodeColor(),
          boxShadow: `0 0 8px ${getNodeColor()}60`
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-white"
        style={{
          background: getNodeColor(),
          boxShadow: `0 0 8px ${getNodeColor()}60`
        }}
      />

      {/* Status Indicator */}
      {(isActive || isCompleted || hasError) && (
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white"
          style={{ 
            background: getNodeColor(),
            boxShadow: `0 0 12px ${getNodeColor()}80`
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: "backOut" }}
        >
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: getNodeColor() }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};