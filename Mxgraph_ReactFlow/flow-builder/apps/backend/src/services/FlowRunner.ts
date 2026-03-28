import { evaluate } from '../lib/expression';
import { FlowGraph } from '../lib/graph';

export interface RunResult {
  status: 'completed' | 'error';
  logs: string[];
  outputContext: Record<string, any>;
}

export interface FlowData {
  nodes: Array<{
    id: string;
    type: string;
    data: any;
  }>;
  edges: Array<{
    source: string;
    target: string;
    sourceHandle?: string;
    label?: string;
  }>;
}

export class FlowRunner {
  static async run(flow: FlowData, inputContext: Record<string, any> = {}): Promise<RunResult> {
    const logs: string[] = [];
    const context = { ...inputContext };
    
    try {
      // Find start node
      const startNode = flow.nodes.find(n => n.type === 'start');
      if (!startNode) {
        throw new Error('No start node found');
      }
      
      logs.push(`Starting flow execution from node: ${startNode.id}`);
      
      // Execute flow
      await this.executeNode(startNode.id, flow, context, logs);
      
      return {
        status: 'completed',
        logs,
        outputContext: context
      };
    } catch (error) {
      logs.push(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        status: 'error',
        logs,
        outputContext: context
      };
    }
  }
  
  private static async executeNode(
    nodeId: string,
    flow: FlowData,
    context: Record<string, any>,
    logs: string[]
  ): Promise<void> {
    const node = flow.nodes.find(n => n.id === nodeId);
    if (!node) {
      throw new Error(`Node not found: ${nodeId}`);
    }
    
    logs.push(`Executing ${node.type} node: ${node.id}`);
    
    switch (node.type) {
      case 'start':
        logs.push(`Start: ${node.data.label}`);
        break;
        
      case 'screen':
        logs.push(`Screen: ${node.data.label} - Collecting user input`);
        // Simulate screen input
        if (node.data.formSchema) {
          logs.push(`Form schema: ${JSON.stringify(node.data.formSchema)}`);
        }
        break;
        
      case 'decision':
        logs.push(`Decision: ${node.data.label}`);
        // Use legacyConditions if available (from ConfigAdapter), otherwise use conditions
        const conditions = node.data.legacyConditions || node.data.conditions || [];
        logs.push(`Evaluating ${conditions.length} condition(s)`);
        
        // Log context and conditions for debugging
        logs.push(`Available context: ${JSON.stringify(context)}`);
        conditions.forEach((condition: any, index: number) => {
          try {
            const result = evaluate(condition.expression, context);
            logs.push(`Condition ${index + 1}: ${condition.label} (${condition.expression}) = ${result}`);
            if (result) {
              context[`decision_${node.id}_result`] = condition.label;
              context[`decision_${node.id}_condition`] = condition.id;
            }
          } catch (error) {
            logs.push(`Condition ${index + 1}: ${condition.label} - evaluation error: ${error}`);
            logs.push(`Expression: ${condition.expression}`);
          }
        });
        break;
        
      case 'action':
        logs.push(`Action: ${node.data.label}`);
        logs.push(`Action Type: ${node.data.actionType}`);
        
        // Generate action-specific output based on the action label and type
        const actionResult = {
          actionExecuted: node.data.label,
          actionType: node.data.actionType,
          timestamp: new Date().toISOString(),
          success: true
        };
        
        // Add action-specific data based on the label
        if (node.data.label.toLowerCase().includes('approval')) {
          actionResult.emailType = 'approval';
          actionResult.status = 'approved';
          context.customerStatus = 'approved';
        } else if (node.data.label.toLowerCase().includes('rejection')) {
          actionResult.emailType = 'rejection';
          actionResult.status = 'rejected';
          context.customerStatus = 'rejected';
        }
        
        context[`action_${node.id}_result`] = actionResult;
        logs.push(`Action completed: ${JSON.stringify(actionResult)}`);
        break;
        
      case 'process':
        logs.push(`Process: ${node.data.label}`);
        if (node.data.description) {
          logs.push(`Description: ${node.data.description}`);
        }
        // Add process completion to context
        context[`process_${node.id}_completed`] = true;
        context[`process_${node.id}_timestamp`] = new Date().toISOString();
        logs.push(`Process execution completed`);
        break;
        
      case 'connector':
        logs.push(`Connector: ${node.data.label} - Junction point`);
        // Track connector passage
        context[`connector_${node.id}_passed`] = true;
        break;
        
      case 'subflow':
        logs.push(`Subflow: ${node.data.label} - Reference: ${node.data.refId}`);
        break;
        
      case 'document':
        logs.push(`Document: ${node.data.label} - Diagrammatic element (no execution)`);
        context[`document_${node.id}_referenced`] = true;
        break;
        
      case 'database':
        logs.push(`Database: ${node.data.label} - Diagrammatic element (no execution)`);
        context[`database_${node.id}_referenced`] = true;
        break;
        
      case 'inputoutput':
        logs.push(`Input/Output: ${node.data.label} - Diagrammatic element (no execution)`);
        context[`inputoutput_${node.id}_referenced`] = true;
        break;
        
      case 'annotation':
        logs.push(`Annotation: ${node.data.label} - Diagrammatic element (no execution)`);
        context[`annotation_${node.id}_referenced`] = true;
        break;
        
      case 'end':
        logs.push(`End: ${node.data.label} - Flow completed`);
        return; // Stop execution
    }
    
    // Find next nodes
    const nextEdges = flow.edges.filter(e => e.source === nodeId);
    
    if (nextEdges.length === 0 && node.type !== 'end') {
      logs.push(`Warning: No outgoing edges from node ${nodeId}`);
      return;
    }
    
    // Execute next nodes based on node type
    if (node.type === 'decision') {
      // Use legacyConditions if available (from ConfigAdapter), otherwise use conditions
      const conditions = node.data.legacyConditions || node.data.conditions || [];
      let selectedPath = null;
      
      // Evaluate conditions to find the first matching one
      for (const condition of conditions) {
        try {
          if (evaluate(condition.expression, context)) {
            selectedPath = condition;
            context[`decision_${node.id}_result`] = condition.label;
            context[`decision_${node.id}_path`] = condition.id;
            logs.push(`Decision path selected: ${condition.label}`);
            break;
          }
        } catch (error) {
          logs.push(`Condition evaluation error: ${condition.expression} - ${error}`);
        }
      }
      
      // Follow only ONE path based on the decision
      if (selectedPath) {
        // For approved condition, follow first edge (to approval path)
        if (selectedPath.id === 'approved') {
          const approvalEdge = nextEdges[0]; // First edge goes to approval
          if (approvalEdge) {
            logs.push(`Following approval path: ${approvalEdge.source} → ${approvalEdge.target}`);
            await this.executeNode(approvalEdge.target, flow, context, logs);
          }
        } else {
          // For rejected condition, follow second edge (to rejection path)
          const rejectionEdge = nextEdges[1]; // Second edge goes to rejection
          if (rejectionEdge) {
            logs.push(`Following rejection path: ${rejectionEdge.source} → ${rejectionEdge.target}`);
            await this.executeNode(rejectionEdge.target, flow, context, logs);
          }
        }
      } else {
        // No condition met, follow default (first edge)
        const defaultEdge = nextEdges[0];
        if (defaultEdge) {
          logs.push(`Following default path: ${defaultEdge.source} → ${defaultEdge.target}`);
          await this.executeNode(defaultEdge.target, flow, context, logs);
        }
      }
    } else {
      // For non-decision nodes, follow first edge only
      const nextEdge = nextEdges[0];
      if (nextEdge) {
        const edgeLabel = nextEdge.label ? ` (${nextEdge.label})` : '';
        logs.push(`Following edge${edgeLabel}: ${nextEdge.source} → ${nextEdge.target}`);
        await this.executeNode(nextEdge.target, flow, context, logs);
      }
    }
  }
  
  private static async executeAction(
    node: any,
    context: Record<string, any>,
    logs: string[]
  ): Promise<void> {
    const { actionType, config, outputVar } = node.data;
    let actionResult: any = null;
    
    try {
      const parsedConfig = typeof config === 'string' ? JSON.parse(config) : config;
      
      switch (actionType) {
        case 'email':
          const emailTo = this.replaceVariables(parsedConfig?.to || '', context);
          const emailSubject = this.replaceVariables(parsedConfig?.subject || '', context);
          const template = parsedConfig?.template || 'default';
          
          logs.push(`Email Action: ${emailTo}`);
          logs.push(`Subject: ${emailSubject}`);
          logs.push(`Template: ${template}`);
          
          // Calculate derived values based on context
          actionResult = {
            emailSent: true,
            recipient: emailTo,
            subject: emailSubject,
            template: template,
            sentAt: new Date().toISOString()
          };
          break;
          
        case 'api':
          const endpoint = this.replaceVariables(parsedConfig?.endpoint || '', context);
          const method = parsedConfig?.method || 'GET';
          const headers = parsedConfig?.headers || {};
          const body = parsedConfig?.data ? this.replaceVariables(JSON.stringify(parsedConfig.data), context) : null;
          
          logs.push(`API Call: ${method} ${endpoint}`);
          if (headers.Authorization) logs.push(`Auth: ${headers.Authorization}`);
          if (body) logs.push(`Payload: ${body}`);
          
          // Simulate API response based on context
          actionResult = {
            success: true,
            endpoint: endpoint,
            method: method,
            statusCode: 200,
            responseData: this.generateApiResponse(context, parsedConfig)
          };
          break;
          
        case 'db':
          const operation = parsedConfig?.operation || 'insert';
          const table = parsedConfig?.table || 'records';
          const data = parsedConfig?.data ? this.processDbData(parsedConfig.data, context) : {};
          
          logs.push(`DB ${operation.toUpperCase()}: ${table}`);
          logs.push(`Data: ${JSON.stringify(data)}`);
          
          actionResult = {
            operation: operation,
            table: table,
            data: data,
            recordId: this.generateId(context),
            success: true
          };
          break;
          
        default:
          throw new Error(`Unsupported action type: ${actionType}`);
      }
      
      // Set output variable with actual computed result
      if (outputVar) {
        context[outputVar] = actionResult;
        logs.push(`Variable ${outputVar} = ${JSON.stringify(actionResult)}`);
      }
      
    } catch (error) {
      logs.push(`Action execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      actionResult = { error: error instanceof Error ? error.message : 'Unknown error' };
      if (outputVar) {
        context[outputVar] = actionResult;
      }
    }
  }
  
  private static replaceVariables(template: string, context: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return context[varName]?.toString() || match;
    });
  }
  
  private static processDbData(data: any, context: Record<string, any>): any {
    const processedData = { ...data };
    Object.keys(processedData).forEach(key => {
      if (typeof processedData[key] === 'string') {
        processedData[key] = this.replaceVariables(processedData[key], context);
      }
    });
    return processedData;
  }
  
  private static generateApiResponse(context: Record<string, any>, config: any): any {
    // Generate response based on context and config
    return {
      id: this.generateId(context),
      status: 'processed',
      timestamp: new Date().toISOString(),
      contextData: Object.keys(context).reduce((acc, key) => {
        if (!key.startsWith('action_') && !key.startsWith('decision_')) {
          acc[key] = context[key];
        }
        return acc;
      }, {} as Record<string, any>)
    };
  }
  
  private static generateId(context: Record<string, any>): string {
    const hash = Object.values(context).join('').length;
    return `${Date.now()}-${hash}`;
  }
}