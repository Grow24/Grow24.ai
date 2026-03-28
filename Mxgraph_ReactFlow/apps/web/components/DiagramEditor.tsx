'use client'

import { useCallback, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  NodeChange,
  EdgeChange,
  Background,
  Controls,
  MiniMap,
  ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { type RFGraph, type ValidationIssue } from '@hbmp/shared-types'
import { apiUrl } from '@/lib/api'
import { useConnectionValidation } from '../hooks/useConnectionValidation'
import { CustomNode } from './nodes/CustomNode'
import { CustomEdge } from './edges/CustomEdge'
import { DatasetNode } from './nodes/DatasetNode'
import { ServiceNode } from './nodes/ServiceNode'
import { ProcessTaskNode } from './nodes/ProcessTaskNode'
import { GatewayNode } from './nodes/GatewayNode'
import { EventNode } from './nodes/EventNode'
import { ReportNode } from './nodes/ReportNode'
import { ApiNode } from './nodes/ApiNode'
import { DbNode } from './nodes/DbNode'
import { LaneNode } from './nodes/LaneNode'

// Move nodeTypes and edgeTypes outside component to prevent recreation
const nodeTypes = {
  customNode: CustomNode,
  dataset: DatasetNode,
  service: ServiceNode,
  processTask: ProcessTaskNode,
  gateway: GatewayNode,
  event: EventNode,
  report: ReportNode,
  api: ApiNode,
  db: DbNode,
  lane: LaneNode,
  // Legacy aliases
  task: ProcessTaskNode,
  database: DatasetNode,
}

const edgeTypes = {
  customEdge: CustomEdge,
}

interface DiagramEditorProps {
  graph: RFGraph
  validationIssues: ValidationIssue[]
  onChange: (graph: RFGraph) => void
}

export function DiagramEditor({ graph, validationIssues, onChange }: DiagramEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(graph.edges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [connectionFeedback, setConnectionFeedback] = useState<string | null>(null)
  
  const { validateConnection, isValidConnection } = useConnectionValidation()

  const onConnect = useCallback(
    (params: Connection) => {
      // Validate the connection using registry rules
      const validationResult = validateConnection(params)
      
      if (!validationResult.isValid) {
        // Show error feedback to user
        setConnectionFeedback(`⚠️ ${validationResult.reason}`)
        setTimeout(() => setConnectionFeedback(null), 3000)
        return // Block the connection
      }
      
      // Show success feedback for warnings
      if (validationResult.level === 'warning') {
        setConnectionFeedback(`⚠️ Warning: ${validationResult.reason}`)
        setTimeout(() => setConnectionFeedback(null), 3000)
      }
      
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'customEdge',
        data: {
          portType: params.sourceHandle ? 'typed' : 'default',
          validationLevel: validationResult.level
        }
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges, validateConnection]
  )

  // Handle drag and drop from node palette
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowInstance) return

      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      if (!type) return

      try {
        const nodeData = JSON.parse(type)
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })

        const newNode: Node = {
          id: `node-${Date.now()}`,
          type: nodeData.nodeKind === 'processTask' ? 'processTask' : 
                nodeData.nodeKind === 'gateway' ? 'gateway' :
                nodeData.nodeKind === 'event' ? 'event' :
                nodeData.nodeKind === 'dataset' ? 'dataset' :
                nodeData.nodeKind === 'service' ? 'service' :
                nodeData.nodeKind === 'api' ? 'api' :
                nodeData.nodeKind === 'db' ? 'db' :
                nodeData.nodeKind === 'lane' ? 'lane' : 'customNode',
          position,
          data: { 
            label: nodeData.label, 
            kind: nodeData.nodeKind,
            ...(nodeData.nodeKind === 'lane' ? {
              width: 400,
              height: 200,
              department: 'Department',
              owner: 'Owner'
            } : {})
          },
        }

        setNodes((nds) => nds.concat(newNode))
      } catch (error) {
        console.error('Failed to parse node data:', error)
      }
    },
    [reactFlowInstance, setNodes]
  )

  // Swimlane layout handler
  const handleSwimlaneLayout = useCallback(async () => {
    try {
      const currentGraph = {
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.type as any,
          position: n.position,
          data: n.data
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          data: e.data
        }))
      }

      const response = await fetch(apiUrl('/api/layout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          graph: currentGraph,
          options: { laneAware: true }
        })
      })

      if (response.ok) {
        const result = await response.json()
        setNodes(result.graph.nodes.map((n: any) => ({
          ...n,
          position: n.position
        })))
        console.log('Swimlane layout applied successfully')
      }
    } catch (error) {
      console.error('Failed to apply swimlane layout:', error)
    }
  }, [nodes, edges, setNodes])

  // Auto-assign nodes to lanes when they overlap
  const handleNodeDrag = useCallback((event: MouseEvent, node: Node) => {
    const lanes = nodes.filter(n => n.type === 'lane')
    
    for (const lane of lanes) {
      const laneX = lane.position.x
      const laneY = lane.position.y
      const laneWidth = (lane.data as any)?.width || 300
      const laneHeight = (lane.data as any)?.height || 200
      
      // Check if node is within lane bounds
      if (node.position.x >= laneX && 
          node.position.x <= laneX + laneWidth &&
          node.position.y >= laneY + 30 && // Account for lane header
          node.position.y <= laneY + laneHeight) {
        
        // Assign node to this lane
        setNodes(nds => nds.map(n => 
          n.id === node.id 
            ? { ...n, data: { ...n.data, laneId: lane.id } }
            : n
        ))
        break
      }
    }
  }, [nodes, setNodes])

  const onInit = useCallback((reactFlowInstance: ReactFlowInstance) => {
    console.log('React Flow initialized:', reactFlowInstance)
    setReactFlowInstance(reactFlowInstance)
  }, [])

  // Get validation issues for specific nodes/edges
  const getNodeIssues = (nodeId: string) => {
    return validationIssues.filter(issue => issue.id === nodeId)
  }

  const getEdgeIssues = (edgeId: string) => {
    return validationIssues.filter(issue => issue.id === edgeId)
  }

  // Enhance nodes with validation issues
  const nodesWithValidation = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      validationIssues: getNodeIssues(node.id),
    },
  }))

  // Enhance edges with validation issues
  const edgesWithValidation = edges.map(edge => ({
    ...edge,
    data: {
      ...edge.data,
      validationIssues: getEdgeIssues(edge.id),
    },
  }))

  // Update parent component when nodes or edges change
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes)
    // Update parent with new graph data after a short delay to batch changes
    setTimeout(() => {
      const updatedGraph: RFGraph = {
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.type as any,
          position: n.position,
          data: n.data
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label as string,
          data: e.data
        })),
        meta: graph.meta
      }
      onChange(updatedGraph)
    }, 100)
  }, [onNodesChange, nodes, edges, onChange, graph.meta])

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes)
    // Update parent with new graph data after a short delay to batch changes
    setTimeout(() => {
      const updatedGraph: RFGraph = {
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.type as any,
          position: n.position,
          data: n.data
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label as string,
          data: e.data
        })),
        meta: graph.meta
      }
      onChange(updatedGraph)
    }, 100)
  }, [onEdgesChange, nodes, edges, onChange, graph.meta])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodesWithValidation}
        edges={edgesWithValidation}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={'smoothstep' as any}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#f1f1f1" gap={16} />
        <Controls />
        
        {/* Custom Swimlane Controls */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleSwimlaneLayout}
            className="px-3 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors text-sm font-medium"
            title="Auto-layout nodes in swimlanes using mxGraph"
          >
            🏊 Layout Lanes
          </button>
        </div>
        
        <MiniMap
          nodeColor={(node) => {
            const issues = getNodeIssues(node.id)
            if (issues.some(issue => issue.level === 'error')) return '#ef4444'
            if (issues.some(issue => issue.level === 'warn')) return '#f59e0b'
            return '#6b7280'
          }}
          maskColor="rgb(240, 242, 247, 0.7)"
          position="top-right"
        />
      </ReactFlow>
      
      {/* Connection Validation Feedback */}
      {connectionFeedback && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 max-w-md">
            <div className="text-sm text-gray-800">{connectionFeedback}</div>
          </div>
        </div>
      )}
    </div>
  )
}