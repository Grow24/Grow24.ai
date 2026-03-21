import { useMemo, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionMode,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { Document, DocumentListItem } from '@/api/documents.api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Lock, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

import { FlowNodeViewModel, LevelStatus } from '@/utils/workflow';

interface ProcessFlowProps {
  document: Document;
  projectDocuments?: DocumentListItem[];
  flowNodes?: FlowNodeViewModel[];
  levelStatuses?: LevelStatus[];
  onTabChange?: (tab: string) => void;
}

type FlowNodeStatus = 'completed' | 'current' | 'pending' | 'locked';

interface FlowNodeData {
  label: string;
  documentType?: string;
  status: FlowNodeStatus;
  level: 'C' | 'L' | 'I';
  description?: string;
  documentId?: string;
  documentStatus?: string;
  checklistPercent?: number;
  isCurrentDocument?: boolean;
  requiredDocType?: string; // For locked nodes - what document needs to be approved
  requiredDocLabel?: string; // Human-readable label for prerequisite
}

const NODE_WIDTH = 220;
const NODE_HEIGHT = 120;
const HORIZONTAL_SPACING = 300;
const VERTICAL_SPACING = 180;

// Define flow structure based on CLIPON flow
const getFlowNodes = (
  documentStatuses: Map<string, string>,
  currentDocumentId?: string,
  currentDocumentType?: string,
  projectDocuments?: DocumentListItem[]
): Node<FlowNodeData>[] => {
  const getNodeStatus = (
    docType: string,
    requiredDocType?: string
  ): FlowNodeStatus => {
    const docStatus = documentStatuses.get(docType);
    const requiredStatus = requiredDocType
      ? documentStatuses.get(requiredDocType)
      : null;

    // Check if prerequisites are met - if required doc exists but not approved, lock
    if (requiredDocType && documentStatuses.has(requiredDocType) && requiredStatus !== 'APPROVED') {
      return 'locked';
    }

    // If doc doesn't exist and prerequisite not met, also lock
    if (requiredDocType && !documentStatuses.has(requiredDocType)) {
      return 'locked';
    }

    if (docStatus === 'APPROVED') {
      return 'completed';
    }
    if (docStatus === 'UNDER_REVIEW' || docStatus === 'DRAFT') {
      return 'current';
    }
    return 'pending';
  };

  const getRequiredDocLabel = (docType: string): string => {
    const docMap: Record<string, string> = {
      'BUSINESS_CASE': 'Business Case',
      'BRD': 'BRD',
      'SRS': 'SRS',
      'UAT_PLAN': 'UATP',
      'UATP': 'UATP',
      'SIT_PLAN': 'SIT Plan',
      'UTP': 'UTP',
    };
    return docMap[docType] || docType;
  };

  const getDocumentInfo = (docType: string) => {
    if (!projectDocuments) return null;
    return projectDocuments.find((doc) => {
      const templateCode = doc.templateName.toUpperCase().replace(/\s+/g, '_');
      if (docType === 'BUSINESS_CASE' && templateCode.includes('BUSINESS_CASE')) return true;
      if (docType === 'BRD' && (templateCode.includes('BRD') || templateCode.includes('BRS'))) return true;
      if (docType === 'SRS' && templateCode.includes('SRS')) return true;
      if ((docType === 'UAT_PLAN' || docType === 'UATP') && (templateCode.includes('UAT') || templateCode === 'UATP')) return true;
      if (docType === 'SIT_PLAN' && templateCode.includes('SIT')) return true;
      if (docType === 'UTP' && (templateCode.includes('UTP') || templateCode.includes('UNIT'))) return true;
      return false;
    });
  };

  const nodes: Node<FlowNodeData>[] = [
    {
      id: 'start',
      type: 'default',
      position: { x: 0, y: VERTICAL_SPACING },
      data: {
        label: 'Start',
        status: 'completed',
        level: 'C',
      },
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fontSize: '14px',
      },
    },
    {
      id: 'business-case',
      type: 'default',
      position: { x: HORIZONTAL_SPACING, y: 0 },
      data: {
        label: 'Business Case',
        documentType: 'BUSINESS_CASE',
        status: getNodeStatus('BUSINESS_CASE'),
        level: 'C',
        description: 'Conceptual level document',
        documentId: getDocumentInfo('BUSINESS_CASE')?.id,
        documentStatus: documentStatuses.get('BUSINESS_CASE'),
        checklistPercent: 0, // TODO: Get from checklist API
        isCurrentDocument: currentDocumentType === 'BUSINESS_CASE',
      },
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fontSize: '14px',
      },
    },
    {
      id: 'brd',
      type: 'default',
      position: { x: HORIZONTAL_SPACING * 2, y: 0 },
      data: {
        label: 'BRD/BRS',
        documentType: 'BRD',
        status: getNodeStatus('BRD', 'BUSINESS_CASE'),
        level: 'C',
        description: 'Business Requirements',
        documentId: getDocumentInfo('BRD')?.id,
        documentStatus: documentStatuses.get('BRD'),
        checklistPercent: 0,
        isCurrentDocument: currentDocumentType === 'BRD',
        requiredDocType: 'BUSINESS_CASE',
        requiredDocLabel: getRequiredDocLabel('BUSINESS_CASE'),
      },
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fontSize: '14px',
      },
    },
    {
      id: 'srs',
      type: 'default',
      position: { x: HORIZONTAL_SPACING * 3, y: 0 },
      data: {
        label: 'SRS',
        documentType: 'SRS',
        status: getNodeStatus('SRS', 'BRD'),
        level: 'L',
        description: 'System Requirements',
        documentId: getDocumentInfo('SRS')?.id,
        documentStatus: documentStatuses.get('SRS'),
        checklistPercent: 0,
        isCurrentDocument: currentDocumentType === 'SRS',
        requiredDocType: 'BRD',
        requiredDocLabel: getRequiredDocLabel('BRD'),
      },
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fontSize: '14px',
      },
    },
    {
      id: 'uat-plan',
      type: 'default',
      position: { x: HORIZONTAL_SPACING * 2, y: VERTICAL_SPACING },
      data: {
        label: 'UATP',
        documentType: 'UATP',
        status: getNodeStatus('UATP', 'BRD'),
        level: 'L',
        description: 'User Acceptance Test Plan',
        documentId: getDocumentInfo('UATP')?.id,
        documentStatus: documentStatuses.get('UATP'),
        checklistPercent: 0,
        isCurrentDocument: currentDocumentType === 'UATP' || currentDocumentType === 'UAT_PLAN',
        requiredDocType: 'BRD',
        requiredDocLabel: getRequiredDocLabel('BRD'),
      },
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fontSize: '14px',
      },
    },
    {
      id: 'sit-plan',
      type: 'default',
      position: { x: HORIZONTAL_SPACING * 3, y: VERTICAL_SPACING },
      data: {
        label: 'SIT Plan',
        documentType: 'SIT_PLAN',
        status: getNodeStatus('SIT_PLAN', 'UATP'),
        level: 'I',
        description: 'System Integration Test',
        documentId: getDocumentInfo('SIT_PLAN')?.id,
        documentStatus: documentStatuses.get('SIT_PLAN'),
        checklistPercent: 0,
        isCurrentDocument: currentDocumentType === 'SIT_PLAN',
        requiredDocType: 'UATP',
        requiredDocLabel: getRequiredDocLabel('UATP'),
      },
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fontSize: '14px',
      },
    },
    {
      id: 'utp',
      type: 'default',
      position: { x: HORIZONTAL_SPACING * 4, y: VERTICAL_SPACING },
      data: {
        label: 'UTP',
        documentType: 'UTP',
        status: getNodeStatus('UTP', 'UATP'),
        level: 'I',
        description: 'Unit Test Plan',
        documentId: getDocumentInfo('UTP')?.id,
        documentStatus: documentStatuses.get('UTP'),
        checklistPercent: 0,
        isCurrentDocument: currentDocumentType === 'UTP',
        requiredDocType: 'UATP',
        requiredDocLabel: getRequiredDocLabel('UATP'),
      },
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fontSize: '14px',
      },
    },
    {
      id: 'end',
      type: 'default',
      position: { x: HORIZONTAL_SPACING * 5, y: VERTICAL_SPACING / 2 },
      data: {
        label: 'Complete',
        status: 'pending',
        level: 'I',
      },
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        fontSize: '14px',
      },
    },
  ];

  return nodes;
};

const getFlowEdges = (): Edge[] => {
  return [
    {
      id: 'start-business-case',
      source: 'start',
      target: 'business-case',
      type: 'smoothstep',
      animated: false,
      style: { strokeWidth: 3 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
    },
    {
      id: 'business-case-brd',
      source: 'business-case',
      target: 'brd',
      type: 'smoothstep',
      animated: false,
      style: { strokeWidth: 3 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
    },
    {
      id: 'brd-srs',
      source: 'brd',
      target: 'srs',
      type: 'smoothstep',
      animated: false,
      style: { strokeWidth: 3 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
    },
    {
      id: 'brd-uat',
      source: 'brd',
      target: 'uat-plan',
      type: 'smoothstep',
      animated: false,
      style: { strokeWidth: 3 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
    },
    {
      id: 'sit-end',
      source: 'sit-plan',
      target: 'end',
      type: 'smoothstep',
      animated: false,
      style: { strokeWidth: 3 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
    },
    {
      id: 'utp-end',
      source: 'utp',
      target: 'end',
      type: 'smoothstep',
      animated: false,
      style: { strokeWidth: 3 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
    },
  ];
};

// Custom node component with animations
interface CustomNodeProps {
  data: FlowNodeData;
  selected?: boolean;
  onNodeClick?: (nodeData: FlowNodeData) => void;
}

const CustomNode = ({ data, selected, onNodeClick }: CustomNodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusColor = (status: FlowNodeStatus, isCurrent: boolean, documentStatus?: string) => {
    // Current open document: highlighted with ring + stronger opacity
    if (isCurrent) {
      return 'bg-blue-400 border-blue-700 border-4 text-blue-950 shadow-xl ring-4 ring-blue-300 ring-opacity-75 opacity-100';
    }
    
    switch (status) {
      case 'completed':
        // Approved nodes: solid
        return 'bg-green-300 border-green-600 border-4 text-green-950 opacity-100';
      case 'current':
        // Draft/Review nodes: medium opacity
        const isDraft = documentStatus === 'DRAFT';
        return isDraft 
          ? 'bg-blue-200 border-blue-600 border-4 text-blue-950 opacity-75'
          : 'bg-amber-200 border-amber-600 border-4 text-amber-950 opacity-80';
      case 'pending':
        return 'bg-gray-200 border-gray-400 border-4 text-gray-800 opacity-70';
      case 'locked':
        // Locked nodes: greyed + reduced opacity
        return 'bg-gray-100 border-gray-300 border-2 text-gray-500 opacity-50';
      default:
        return 'bg-gray-200 border-gray-400 border-4 opacity-70';
    }
  };

  const getStatusIcon = (status: FlowNodeStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'current':
        return <Circle className="h-5 w-5 text-blue-600 fill-blue-600" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return 'Not Started';
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const tooltipText = data.status === 'locked' && data.requiredDocLabel
    ? `Requires ${data.requiredDocLabel} approval`
    : null;

  return (
    <div className="relative group">
      <motion.div
        initial={false}
        whileHover={{ scale: data.status === 'locked' ? 1 : 1.05 }}
        onClick={() => onNodeClick?.(data)}
        onMouseEnter={() => data.status === 'locked' && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'relative rounded-lg border-4 p-4 shadow-lg min-w-[200px] transition-all',
          data.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer',
          getStatusColor(data.status, data.isCurrentDocument || false, data.documentStatus)
        )}
      >
      {/* Source handle (right side) */}
      <Handle 
        type="source" 
        position={Position.Right}
        style={{ width: 12, height: 12, background: '#3b82f6', border: '2px solid white' }}
      />
      
      {/* Target handle (left side) */}
      <Handle 
        type="target" 
        position={Position.Left}
        style={{ width: 12, height: 12, background: '#3b82f6', border: '2px solid white' }}
      />
      
      {/* "You are here" badge for current document */}
      {data.isCurrentDocument && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          You are here
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon(data.status)}
        <div className="font-bold text-base">{data.label}</div>
      </div>
      
      {/* Status chip */}
      {data.documentStatus && (
        <Badge 
          variant="outline" 
          className={cn(
            'text-xs font-semibold mb-2',
            data.documentStatus === 'APPROVED' && 'bg-green-100 text-green-800 border-green-300',
            data.documentStatus === 'UNDER_REVIEW' && 'bg-amber-100 text-amber-800 border-amber-300',
            data.documentStatus === 'DRAFT' && 'bg-gray-100 text-gray-800 border-gray-300'
          )}
        >
          {formatStatus(data.documentStatus)}
        </Badge>
      )}
      
      {/* Checklist indicator */}
      {data.checklistPercent !== undefined && data.checklistPercent > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
          <CheckCircle2 className="h-3 w-3" />
          <span>{data.checklistPercent}%</span>
        </div>
      )}
      
      {data.description && (
        <div className="text-sm text-gray-700 mt-1 font-medium">
          {data.description}
        </div>
      )}
      <Badge variant="outline" className="mt-2 text-xs font-semibold">
        Level: {data.level}
      </Badge>
      
      {/* Tooltip for locked nodes */}
      {showTooltip && tooltipText && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
          {tooltipText}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </motion.div>
    </div>
  );
};

// Create node types with click handler (memoized to prevent re-renders)
const createNodeTypes = (onNodeClick: (data: FlowNodeData) => void) => {
  const nodeTypes = {
    default: (props: any) => <CustomNode {...props} onNodeClick={onNodeClick} />,
  };
  return nodeTypes;
};

export default function ProcessFlow({
  document,
  projectDocuments = [],
  onTabChange,
}: ProcessFlowProps) {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  // Build map of document types to their statuses
  const documentStatuses = useMemo(() => {
    const statusMap = new Map<string, string>();
    
    // Add current document
    if (document.template.code) {
      statusMap.set(document.template.code, document.status);
    }

    // Add project documents
    projectDocuments.forEach((doc) => {
      // Map template names/codes to document types
      const templateCode = doc.templateName.toUpperCase().replace(/\s+/g, '_');
      if (templateCode.includes('BUSINESS_CASE') || templateCode === 'BUSINESS_CASE') {
        statusMap.set('BUSINESS_CASE', doc.status);
      } else if (templateCode.includes('BRD') || templateCode.includes('BRS')) {
        statusMap.set('BRD', doc.status);
      } else if (templateCode.includes('SRS')) {
        statusMap.set('SRS', doc.status);
      } else if (templateCode.includes('UAT') || templateCode === 'UATP') {
        statusMap.set('UATP', doc.status);
      } else if (templateCode.includes('SIT')) {
        statusMap.set('SIT_PLAN', doc.status);
      } else if (templateCode.includes('UTP') || templateCode.includes('UNIT')) {
        statusMap.set('UTP', doc.status);
      }
    });

    return statusMap;
  }, [document, projectDocuments]);

  const currentDocumentType = document.template.code;

  const initialNodes = useMemo(
    () => getFlowNodes(documentStatuses, document.id, currentDocumentType, projectDocuments),
    [documentStatuses, document.id, currentDocumentType, projectDocuments]
  );
  const initialEdges = useMemo(() => getFlowEdges(), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [highlightedEdge, setHighlightedEdge] = useState<string | null>(null);

  const handleNodeClick = useCallback((nodeData: FlowNodeData) => {
    // Handle locked nodes with clear prerequisite message
    if (nodeData.status === 'locked') {
      const prerequisiteMsg = nodeData.requiredDocLabel
        ? `Unlock by approving ${nodeData.requiredDocLabel}`
        : 'Prerequisites must be completed first';
      toast({
        title: `${nodeData.label} is locked`,
        description: prerequisiteMsg,
        variant: 'destructive',
      });
      return;
    }

    // Navigate to document if it exists
    if (nodeData.documentId && projectId && projectDocuments) {
      const doc = projectDocuments.find((d) => d.id === nodeData.documentId);
      if (doc && doc.docketId) {
        navigate(`/projects/${projectId}/dockets/${doc.docketId}/documents/${nodeData.documentId}`);
      } else {
        toast({
          title: `Opening ${nodeData.label}`,
          description: 'Document not found in project',
          variant: 'destructive',
        });
      }
    } else if (!nodeData.documentId) {
      // Document doesn't exist yet
      toast({
        title: 'Document not created',
        description: `Create ${nodeData.label} to proceed`,
      });
    }
  }, [projectId, projectDocuments, navigate, toast]);

  // Memoize node types to prevent unnecessary re-renders
  const nodeTypes = useMemo(
    () => createNodeTypes(handleNodeClick),
    [handleNodeClick]
  );

  // Update nodes when document statuses change
  useEffect(() => {
    const updatedNodes = getFlowNodes(documentStatuses, document.id, currentDocumentType, projectDocuments);
    setNodes(updatedNodes);
  }, [documentStatuses, document.id, currentDocumentType, projectDocuments, setNodes]);

  // Animate edges based on completion status with enhanced highlighting
  useEffect(() => {
    setEdges((currentEdges) => {
      return currentEdges.map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        
        const sourceCompleted = sourceNode?.data.status === 'completed';
        const targetCompleted = targetNode?.data.status === 'completed';
        const targetCurrent = targetNode?.data.status === 'current';
        const shouldAnimate = sourceCompleted || targetCurrent;
        const isCompleted = sourceCompleted && (targetCompleted || targetCurrent);

        return {
          ...edge,
          animated: shouldAnimate,
          style: {
            ...edge.style,
            stroke: isCompleted ? '#10b981' : shouldAnimate ? '#3b82f6' : '#64748b',
            strokeWidth: isCompleted ? 5 : shouldAnimate ? 4 : 3,
            opacity: sourceNode?.data.status === 'locked' || targetNode?.data.status === 'locked' ? 0.4 : 1,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: isCompleted ? '#10b981' : shouldAnimate ? '#3b82f6' : '#64748b',
          },
        };
      });
    });
  }, [nodes, setEdges]);

  // Auto-highlight edges on mount and when status changes with zoom effect
  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const currentEdges = edges.filter((e) => e.animated);
    if (currentEdges.length > 0) {
      // Highlight edges one by one with delay
      currentEdges.forEach((edge, index) => {
        setTimeout(() => {
          setHighlightedEdge(edge.id);
          // Temporarily select edge for visual highlight
          try {
            const edgeElement = document.querySelector(`[data-id="${edge.id}"]`);
            if (edgeElement && edgeElement instanceof HTMLElement) {
              edgeElement.classList.add('selected');
              setTimeout(() => {
                if (edgeElement instanceof HTMLElement) {
                  edgeElement.classList.remove('selected');
                }
              }, 2000);
            }
          } catch (error) {
            // Silently ignore DOM errors
            console.debug('Could not highlight edge:', error);
          }
          setTimeout(() => {
            setHighlightedEdge(null);
          }, 2000);
        }, index * 800);
      });
    }
  }, [edges, nodes]);

  // Determine SDLC position
  const getSDLCPosition = useMemo(() => {
    const currentDocStatus = document.status;
    const currentDocType = document.template.code;
    
    if (currentDocStatus === 'APPROVED') {
      // Find next unlocked document
      if (currentDocType === 'BUSINESS_CASE') return 'Conceptual Phase - Ready for BRD';
      if (currentDocType === 'BRD') return 'Conceptual Phase - Ready for SRS';
      if (currentDocType === 'SRS') return 'Logical Phase - Ready for Test Plans';
      return 'SDLC progression complete';
    }
    
    if (currentDocStatus === 'UNDER_REVIEW') {
      return `Conceptual Phase - ${document.template.name} under review`;
    }
    
    if (currentDocStatus === 'DRAFT') {
      const level = document.level === 'C' ? 'Conceptual' : document.level === 'L' ? 'Logical' : 'Implementation';
      return `${level} Phase - Working on ${document.template.name}`;
    }
    
    return 'SDLC Status';
  }, [document]);

  return (
    <div className="w-full space-y-2">
      {/* SDLC Position Indicator */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Where am I in SDLC?
              </div>
              <div className="text-base font-bold text-foreground">
                {getSDLCPosition}
              </div>
            </div>
            {document.status === 'APPROVED' && (
              <Badge variant="success" className="text-sm px-3 py-1">
                ✓ Approved
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center gap-4 text-xs flex-wrap">
            <span className="font-semibold">Legend:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-green-300 border-2 border-green-600 opacity-100" />
              <span>Approved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-blue-400 border-2 border-blue-700 ring-2 ring-blue-300" />
              <span>Current Document</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-blue-200 border-2 border-blue-600 opacity-75" />
              <span>Draft/Review</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-gray-200 border-2 border-gray-400 opacity-70" />
              <span>Not Started</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-300 opacity-50" />
              <Lock className="h-3 w-3 ml-0.5" />
              <span>Locked</span>
            </div>
            {onTabChange && (
              <Button
                variant="outline"
                size="sm"
                className="ml-auto h-7 text-xs"
                onClick={() => onTabChange('workflow')}
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                View Workflow
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-[700px]">
        <CardContent className="p-0 h-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              fitView
              minZoom={0.2}
              maxZoom={2.5}
              defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
              panOnScroll={true}
              zoomOnScroll={true}
              zoomOnPinch={true}
              zoomOnDoubleClick={true}
              preventScrolling={false}
              style={{ background: '#f8fafc' }}
            >
            <Background color="#e1e5e9" gap={20} size={1} />
            <Controls 
              showZoom={true}
              showFitView={true}
              showInteractive={true}
              style={{ button: { backgroundColor: 'white', border: '1px solid #cbd5e1' } }}
            />
            <MiniMap
              nodeColor={(node) => {
                const status = (node.data as FlowNodeData).status;
                if (status === 'completed') return '#10b981';
                if (status === 'current') return '#3b82f6';
                if (status === 'locked') return '#9ca3af';
                return '#d1d5db';
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </motion.div>
      </CardContent>
    </Card>
    </div>
  );
}

