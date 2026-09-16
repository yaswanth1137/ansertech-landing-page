import { useState, useCallback } from 'react';
import { api } from '@/services/apiClient';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required: string[];
  };
}

export interface AgentToolConfig {
  agent_id: string;
  enabled_tools: string[];
  all_tools: string[];
}

export interface ToolSettings {
  [toolName: string]: {
    enabled: boolean;
    config?: Record<string, unknown>;
  };
}

export interface TestToolResult {
  tool_name: string;
  arguments: Record<string, unknown>;
  result: {
    success: boolean;
    message: string;
    [key: string]: unknown;
  };
}

export function useAgentTools() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [definitions, setDefinitions] = useState<ToolDefinition[]>([]);
  const [agentConfig, setAgentConfig] = useState<AgentToolConfig | null>(null);

  // Fetch all tool definitions
  const fetchDefinitions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/tools/definitions/');
      setDefinitions(response.data.tools || []);
      return response.data.tools;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tool definitions';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch agent's tool configuration
  const fetchAgentTools = useCallback(async (agentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tools/agents/${agentId}/tools/`);
      setAgentConfig(response.data);
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch agent tools';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update agent's tool configuration
  const updateAgentTools = useCallback(async (agentId: string, toolSettings: ToolSettings) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/tools/agents/${agentId}/tools/`, {
        tool_settings: toolSettings
      });
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update agent tools';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Test a tool (development only)
  const testTool = useCallback(async (
    toolName: string, 
    args: Record<string, unknown>,
    agentId?: string
  ): Promise<TestToolResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/tools/test/', {
        tool_name: toolName,
        arguments: args,
        agent_id: agentId
      });
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to test tool';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    definitions,
    agentConfig,
    fetchDefinitions,
    fetchAgentTools,
    updateAgentTools,
    testTool
  };
}

export default useAgentTools;
