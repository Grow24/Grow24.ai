import { FlowRunner } from './FlowRunner';

export interface ExecutionEvent {
  type: 'node-start' | 'node-end' | 'edge-taken' | 'node-error' | 'flow-complete';
  id: string;
  runId: string;
  timestamp: number;
  data?: any;
}

export class FlowExecutionStream {
  static emit(flowId: string, event: ExecutionEvent) {
    // No-op for single user mode
  }
  
  static async runFlowWithEvents(flowData: any, inputContext: any = {}, flowId: string = 'flow') {
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      // Find start node
      const startNode = flowData.nodes.find((n: any) => n.type === 'start');
      if (!startNode) throw new Error('No start node found');
      
      let currentNodeId = startNode.id;
      let context = { ...inputContext };
      const visitedNodes = new Set<string>();
      
      while (currentNodeId && !visitedNodes.has(currentNodeId)) {
        visitedNodes.add(currentNodeId);
        const currentNode = flowData.nodes.find((n: any) => n.id === currentNodeId);
        
        if (!currentNode) break;
        
        // Emit node start
        this.emit(flowId, {
          type: 'node-start',
          id: currentNodeId,
          runId,
          timestamp: Date.now(),
          data: { node: currentNode, context }
        });
        
        await delay(800); // Animation timing
        
        // Process node
        let nextNodeId: string | null = null;
        let edgeLabel = '';
        
        try {
          switch (currentNode.type) {
            case 'start':
              nextNodeId = this.getNextNode(flowData, currentNodeId);
              break;
              
            case 'decision':
              const result = this.evaluateDecision(currentNode, context, flowData);
              nextNodeId = result.nextNodeId;
              edgeLabel = result.label;
              break;
              
            case 'action':
              await this.executeAction(currentNode, context);
              nextNodeId = this.getNextNode(flowData, currentNodeId);
              break;
              
            case 'end':
              nextNodeId = null;
              break;
              
            default:
              nextNodeId = this.getNextNode(flowData, currentNodeId);
          }
          
          // Emit node end
          this.emit(flowId, {
            type: 'node-end',
            id: currentNodeId,
            runId,
            timestamp: Date.now(),
            data: { success: true, context }
          });
          
          await delay(300);
          
          // Emit edge taken if there's a next node
          if (nextNodeId) {
            const edge = flowData.edges.find((e: any) => 
              e.source === currentNodeId && e.target === nextNodeId
            );
            
            this.emit(flowId, {
              type: 'edge-taken',
              id: edge?.id || `${currentNodeId}-${nextNodeId}`,
              runId,
              timestamp: Date.now(),
              data: { 
                source: currentNodeId, 
                target: nextNodeId, 
                label: edgeLabel || edge?.label 
              }
            });
            
            await delay(600); // Edge animation time
          }
          
        } catch (error) {
          this.emit(flowId, {
            type: 'node-error',
            id: currentNodeId,
            runId,
            timestamp: Date.now(),
            data: { error: error.message }
          });
          break;
        }
        
        currentNodeId = nextNodeId;
      }
      
      // Emit flow complete
      this.emit(flowId, {
        type: 'flow-complete',
        id: 'flow',
        runId,
        timestamp: Date.now(),
        data: { context, success: true }
      });
      
      return { success: true, context, runId };
      
    } catch (error) {
      this.emit(flowId, {
        type: 'node-error',
        id: 'flow',
        runId,
        timestamp: Date.now(),
        data: { error: error.message }
      });
      
      return { success: false, error: error.message, runId };
    }
  }
  
  private static getNextNode(flowData: any, currentNodeId: string): string | null {
    const edge = flowData.edges.find((e: any) => e.source === currentNodeId);
    return edge?.target || null;
  }
  
  private static evaluateDecision(node: any, context: any, flowData: any) {
    const conditions = node.data.conditions || [];
    
    for (const condition of conditions) {
      try {
        // Simple expression evaluation (extend as needed)
        const result = this.evaluateExpression(condition.condition, context);
        if (result) {
          const edge = this.findEdgeByLabel(node.id, condition.label, flowData);
          return { nextNodeId: edge?.target, label: condition.label };
        }
      } catch (error) {
        console.error('Condition evaluation error:', error);
      }
    }
    
    // Default path
    const defaultEdge = this.findEdgeByLabel(node.id, node.data.defaultPath, flowData);
    return { nextNodeId: defaultEdge?.target, label: node.data.defaultPath };
  }
  
  private static findEdgeByLabel(sourceId: string, label: string, flowData?: any) {
    if (!flowData) return null;
    return flowData.edges.find((e: any) => e.source === sourceId && e.label === label);
  }
  
  private static evaluateExpression(expression: string, context: any): boolean {
    // Simple evaluation - extend with proper expression parser
    try {
      const func = new Function('context', `with(context) { return ${expression}; }`);
      return Boolean(func(context));
    } catch {
      return false;
    }
  }
  
  private static async executeAction(node: any, context: any) {
    // Simulate action execution
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch (node.data.actionType) {
      case 'email':
        context.emailSent = true;
        break;
      case 'api':
        context.apiCalled = true;
        break;
      case 'db':
        context.dbUpdated = true;
        break;
    }
  }
}