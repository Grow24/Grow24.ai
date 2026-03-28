'use client'

import { useState } from 'react'
import { type RFGraph, type ValidationIssue, type RFNode } from '@hbmp/shared-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'

interface PropertiesPanelProps {
  graph: RFGraph
  validationIssues: ValidationIssue[]
  onChange: (graph: RFGraph) => void
}

export function PropertiesPanel({ graph, validationIssues, onChange }: PropertiesPanelProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)

  const selectedNode = selectedNodeId ? graph.nodes.find(n => n.id === selectedNodeId) : null
  const selectedEdge = selectedEdgeId ? graph.edges.find(e => e.id === selectedEdgeId) : null

  const nodeIssues = validationIssues.filter(issue => 
    issue.id === selectedNodeId
  )
  const edgeIssues = validationIssues.filter(issue => 
    issue.id === selectedEdgeId
  )
  const globalIssues = validationIssues.filter(issue => !issue.id || issue.id === 'graph')

  const updateNodeProperty = (nodeId: string, property: string, value: any) => {
    const updatedNodes = graph.nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            [property]: value
          }
        }
      }
      return node
    })

    onChange({
      ...graph,
      nodes: updatedNodes
    })
  }

  const updateEdgeProperty = (edgeId: string, property: string, value: any) => {
    const updatedEdges = graph.edges.map(edge => {
      if (edge.id === edgeId) {
        return {
          ...edge,
          data: {
            ...edge.data,
            [property]: value
          }
        }
      }
      return edge
    })

    onChange({
      ...graph,
      edges: updatedEdges
    })
  }

  const IssuesList = ({ issues }: { issues: ValidationIssue[] }) => (
    <div className="space-y-2">
      {issues.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          No issues found
        </div>
      ) : (
        issues.map((issue, index) => (
          <div
            key={index}
            className={`
              flex items-start gap-2 p-2 rounded text-sm
              ${issue.level === 'error' ? 'bg-red-50 text-red-700' :
                issue.level === 'warn' ? 'bg-yellow-50 text-yellow-700' :
                'bg-blue-50 text-blue-700'}
            `}
          >
            {issue.level === 'error' ? (
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            ) : issue.level === 'warn' ? (
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            ) : (
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="font-medium">{issue.message}</div>
              {issue.path && (
                <div className="text-xs mt-1 opacity-80">{issue.path}</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Properties</h2>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="selection" className="h-full">
          <TabsList className="grid w-full grid-cols-3 m-2">
            <TabsTrigger value="selection">Selection</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="selection" className="p-4 space-y-4">
            {selectedNode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Node Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="node-label">Label</Label>
                    <Input
                      id="node-label"
                      value={selectedNode.data?.label || ''}
                      onChange={(e) => updateNodeProperty(selectedNode.id, 'label', e.target.value)}
                      placeholder="Enter node label"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="node-description">Description</Label>
                    <Textarea
                      id="node-description"
                      value={selectedNode.data?.props?.description || ''}
                      onChange={(e) => updateNodeProperty(selectedNode.id, 'description', e.target.value)}
                      placeholder="Enter node description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Node Type</Label>
                    <Badge variant="secondary">
                      {selectedNode.data?.kind || 'Unknown'}
                    </Badge>
                  </div>

                  {nodeIssues.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <Label>Issues</Label>
                        <IssuesList issues={nodeIssues} />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {selectedEdge && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Edge Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="edge-label">Label</Label>
                    <Input
                      id="edge-label"
                      value={selectedEdge.label || ''}
                      onChange={(e) => updateEdgeProperty(selectedEdge.id, 'label', e.target.value)}
                      placeholder="Enter edge label"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edge-condition">Condition</Label>
                    <Input
                      id="edge-condition"
                      value={selectedEdge.data?.relation || ''}
                      onChange={(e) => updateEdgeProperty(selectedEdge.id, 'relation', e.target.value)}
                      placeholder="Enter condition (for decision flows)"
                    />
                  </div>

                  {edgeIssues.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <Label>Issues</Label>
                        <IssuesList issues={edgeIssues} />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {!selectedNode && !selectedEdge && (
              <div className="text-center py-8 text-gray-500">
                <p>Select a node or edge to view its properties</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="validation" className="p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Validation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <IssuesList issues={validationIssues} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Diagram Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Nodes:</span>
                  <Badge variant="secondary">{graph.nodes.length}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Edges:</span>
                  <Badge variant="secondary">{graph.edges.length}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Issues:</span>
                  <Badge 
                    variant={validationIssues.length > 0 ? "destructive" : "secondary"}
                  >
                    {validationIssues.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Global Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <IssuesList issues={globalIssues} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}