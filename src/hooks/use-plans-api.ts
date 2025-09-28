/**
 * Plans API Hook
 * React hook for plan management functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { plansAPI, Plan, PlanSummary, CreatePlanRequest, ChatResponse } from '@/services/plans-api';

export interface UsePlansAPIReturn {
  // State
  isLoading: boolean;
  error: string | null;
  currentPlan: Plan | null;
  plans: PlanSummary[];
  chatHistory: any[];
  isDraftMode: boolean;

  // Actions
  createPlan: (data: CreatePlanRequest) => Promise<Plan | null>;
  loadPlan: (planId: string) => Promise<Plan | null>;
  loadPlans: () => Promise<PlanSummary[]>;
  sendMessage: (planId: string, message: string) => Promise<ChatResponse | null>;
  confirmPlan: (planId: string) => Promise<Plan | null>;
  updatePlan: (planId: string, updates: Partial<Plan>) => Promise<Plan | null>;
  deletePlan: (planId: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentPlan: () => void;
  setDraftMode: (enabled: boolean) => void;
}

export const usePlansAPI = (): UsePlansAPIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isDraftMode, setIsDraftMode] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentPlan = useCallback(() => {
    setCurrentPlan(null);
    setChatHistory([]);
    setIsDraftMode(false);
  }, []);

  const setDraftMode = useCallback((enabled: boolean) => {
    setIsDraftMode(enabled);
  }, []);

  const createPlan = useCallback(async (data: CreatePlanRequest): Promise<Plan | null> => {
    console.log('🎯 usePlansAPI.createPlan called with:', data);
    setIsLoading(true);
    setError(null);

    try {
      console.log('📡 Calling plansAPI.createPlan...');
      const response = await plansAPI.createPlan(data);
      console.log('📡 plansAPI.createPlan response:', response);

      if (response.ok && response.data) {
        const newPlan = response.data;
        console.log('✅ Plan created successfully:', newPlan);
        
        setCurrentPlan(newPlan);
        setChatHistory(newPlan.conversation_history || []);

        // Add to plans list
        const planSummary: PlanSummary = {
          plan_id: newPlan.plan_id,
          name: plansAPI.generatePlanName(newPlan),
          created_at: newPlan.created_at || new Date().toISOString(),
          status: newPlan.status || 'draft'
        };
        console.log('📝 Adding plan summary to list:', planSummary);
        setPlans(prev => [planSummary, ...prev]);

        return newPlan;
      } else {
        console.error('❌ Plan creation failed:', response.error);
        setError(response.error || 'Failed to create plan');
        return null;
      }
    } catch (err) {
      console.error('💥 Exception in createPlan:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create plan';
      setError(errorMessage);
      return null;
    } finally {
      console.log('🏁 createPlan finished, setting loading to false');
      setIsLoading(false);
    }
  }, []);

  const loadPlan = useCallback(async (planId: string): Promise<Plan | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await plansAPI.getPlan(planId);

      if (response.ok && response.data) {
        const plan = response.data;
        setCurrentPlan(plan);
        setChatHistory(plan.conversation_history || []);
        setIsDraftMode(plansAPI.hasDraftChanges(plan));
        return plan;
      } else {
        setError(response.error || 'Failed to load plan');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load plan';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPlans = useCallback(async (): Promise<PlanSummary[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await plansAPI.getPlans();

      if (response.ok && response.data) {
        setPlans(response.data.plans);
        return response.data.plans;
      } else {
        setError(response.error || 'Failed to load plans');
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load plans';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (
    planId: string,
    message: string
  ): Promise<ChatResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await plansAPI.chatWithPlan(planId, message);

      if (response.ok && response.data) {
        const chatResponse = response.data;

        // Log the complete chat response
        console.log('🤖 Complete chat response:', JSON.stringify(chatResponse, null, 2));
        console.log('🎯 Response action:', chatResponse.action);
        console.log('💬 Response message:', chatResponse.response);
        console.log('📦 Response payload:', chatResponse.payload);

        // Add user message to chat history
        const userMessage = {
          role: 'user' as const,
          content: message,
          timestamp: new Date().toISOString()
        };
        setChatHistory(prev => [...prev, userMessage]);

        // Handle response based on new format
        if (chatResponse.action === 'propose_draft_plan' && chatResponse.payload) {
          // Update current plan with new draft data
          if (currentPlan) {
            const updatedPlan: Plan = {
              ...currentPlan,
              draft_itinerary: {
                stops: chatResponse.payload.itinerary
              },
              payload: {
                ...currentPlan.payload,
                map_data: chatResponse.payload.map_data
              }
            };
            setCurrentPlan(updatedPlan);
            setIsDraftMode(true);
          }

          // Add AI response to chat history
          const aiMessage = {
            role: 'assistant' as const,
            content: chatResponse.response,
            timestamp: new Date().toISOString()
          };
          setChatHistory(prev => [...prev, aiMessage]);
        } else {
          // Add AI text response to chat history
          const aiMessage = {
            role: 'assistant' as const,
            content: chatResponse.response,
            timestamp: new Date().toISOString()
          };
          setChatHistory(prev => [...prev, aiMessage]);
        }

        return chatResponse;
      } else {
        setError(response.error || 'Failed to send message');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmPlan = useCallback(async (planId: string): Promise<Plan | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await plansAPI.confirmPlan(planId);

      if (response.ok && response.data) {
        const confirmedPlan = response.data;
        setCurrentPlan(confirmedPlan);
        setIsDraftMode(false);
        return confirmedPlan;
      } else {
        setError(response.error || 'Failed to confirm plan');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm plan';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePlan = useCallback(async (
    planId: string,
    updates: Partial<Plan>
  ): Promise<Plan | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await plansAPI.updatePlan(planId, updates);

      if (response.ok && response.data) {
        const updatedPlan = response.data;
        setCurrentPlan(updatedPlan);

        // Update plans list if name changed
        if (updates.name) {
          setPlans(prev => prev.map(plan =>
            plan.plan_id === planId ? { ...plan, name: updates.name! } : plan
          ));
        }

        return updatedPlan;
      } else {
        setError(response.error || 'Failed to update plan');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update plan';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePlan = useCallback(async (planId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await plansAPI.deletePlan(planId);

      if (response.ok) {
        // Remove from plans list
        setPlans(prev => prev.filter(plan => plan.plan_id !== planId));

        // Clear current plan if it was deleted
        if (currentPlan?.plan_id === planId) {
          clearCurrentPlan();
        }

        return true;
      } else {
        setError(response.error || 'Failed to delete plan');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete plan';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentPlan, clearCurrentPlan]);

  return {
    // State
    isLoading,
    error,
    currentPlan,
    plans,
    chatHistory,
    isDraftMode,

    // Actions
    createPlan,
    loadPlan,
    loadPlans,
    sendMessage,
    confirmPlan,
    updatePlan,
    deletePlan,
    clearError,
    clearCurrentPlan,
    setDraftMode,
  };
};

export default usePlansAPI;