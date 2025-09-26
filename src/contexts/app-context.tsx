'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TravelStyle, Stop, TravelGroup, AIInsight, ItineraryData } from '@/types';

// State interfaces
export interface AppState {
  // User preferences
  selectedStyles: TravelStyle[];
  travelContext: {
    location: string;
    group: TravelGroup;
    duration: number;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'full-day';
    budget: number;
    mobilityNeeds: string[];
  } | null;

  // Current itinerary
  currentItinerary: ItineraryData | null;
  isGeneratingItinerary: boolean;

  // UI state
  currentScreen: 'welcome' | 'style-selection' | 'context-setup' | 'ai-planning' | 'itinerary' | 'conversational';
  isChatOpen: boolean;

  // Chat state
  chatMessages: ChatMessage[];
  isAIResponding: boolean;

  // Selected stop for detail view
  selectedStop: Stop | null;
  isStopDetailOpen: boolean;

  // Maps integration
  isMapsModalOpen: boolean;
  selectedMapApp: string | null;

  // Errors and loading states
  error: string | null;
  isLoading: boolean;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  data?: any; // Additional data for structured messages
}

// Action types
export type AppAction =
  // Style selection
  | { type: 'SET_SELECTED_STYLES'; payload: TravelStyle[] }

  // Context setup
  | { type: 'SET_TRAVEL_CONTEXT'; payload: AppState['travelContext'] }

  // Screen navigation
  | { type: 'SET_CURRENT_SCREEN'; payload: AppState['currentScreen'] }

  // Itinerary management
  | { type: 'SET_GENERATING_ITINERARY'; payload: boolean }
  | { type: 'SET_CURRENT_ITINERARY'; payload: ItineraryData }
  | { type: 'UPDATE_STOP'; payload: { stopId: string; updates: Partial<Stop> } }
  | { type: 'REMOVE_STOP'; payload: string }
  | { type: 'ADD_STOP'; payload: Stop }
  | { type: 'REORDER_STOPS'; payload: { fromIndex: number; toIndex: number } }

  // Chat functionality
  | { type: 'SET_CHAT_OPEN'; payload: boolean }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_AI_RESPONDING'; payload: boolean }
  | { type: 'CLEAR_CHAT_MESSAGES' }

  // Stop detail view
  | { type: 'SET_SELECTED_STOP'; payload: Stop | null }
  | { type: 'SET_STOP_DETAIL_OPEN'; payload: boolean }

  // Maps integration
  | { type: 'SET_MAPS_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_SELECTED_MAP_APP'; payload: string | null }

  // Error handling and loading
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }

  // Reset state
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  selectedStyles: [],
  travelContext: null,
  currentItinerary: null,
  isGeneratingItinerary: false,
  currentScreen: 'welcome',
  isChatOpen: false,
  chatMessages: [],
  isAIResponding: false,
  selectedStop: null,
  isStopDetailOpen: false,
  isMapsModalOpen: false,
  selectedMapApp: null,
  error: null,
  isLoading: false,
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_SELECTED_STYLES':
      return {
        ...state,
        selectedStyles: action.payload,
      };

    case 'SET_TRAVEL_CONTEXT':
      return {
        ...state,
        travelContext: action.payload,
      };

    case 'SET_CURRENT_SCREEN':
      return {
        ...state,
        currentScreen: action.payload,
        error: null, // Clear errors when navigating
      };

    case 'SET_GENERATING_ITINERARY':
      return {
        ...state,
        isGeneratingItinerary: action.payload,
        error: action.payload ? null : state.error, // Clear error when starting generation
      };

    case 'SET_CURRENT_ITINERARY':
      return {
        ...state,
        currentItinerary: action.payload,
        isGeneratingItinerary: false,
      };

    case 'UPDATE_STOP':
      if (!state.currentItinerary) return state;

      return {
        ...state,
        currentItinerary: {
          ...state.currentItinerary,
          stops: state.currentItinerary.stops.map(stop =>
            stop.id === action.payload.stopId
              ? { ...stop, ...action.payload.updates }
              : stop
          ),
        },
      };

    case 'REMOVE_STOP':
      if (!state.currentItinerary) return state;

      return {
        ...state,
        currentItinerary: {
          ...state.currentItinerary,
          stops: state.currentItinerary.stops.filter(stop => stop.id !== action.payload),
        },
        selectedStop: state.selectedStop?.id === action.payload ? null : state.selectedStop,
        isStopDetailOpen: state.selectedStop?.id === action.payload ? false : state.isStopDetailOpen,
      };

    case 'ADD_STOP':
      if (!state.currentItinerary) return state;

      return {
        ...state,
        currentItinerary: {
          ...state.currentItinerary,
          stops: [...state.currentItinerary.stops, action.payload],
        },
      };

    case 'REORDER_STOPS':
      if (!state.currentItinerary) return state;

      const stops = [...state.currentItinerary.stops];
      const [movedStop] = stops.splice(action.payload.fromIndex, 1);
      stops.splice(action.payload.toIndex, 0, movedStop);

      return {
        ...state,
        currentItinerary: {
          ...state.currentItinerary,
          stops,
        },
      };

    case 'SET_CHAT_OPEN':
      return {
        ...state,
        isChatOpen: action.payload,
      };

    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };

    case 'SET_AI_RESPONDING':
      return {
        ...state,
        isAIResponding: action.payload,
      };

    case 'CLEAR_CHAT_MESSAGES':
      return {
        ...state,
        chatMessages: [],
      };

    case 'SET_SELECTED_STOP':
      return {
        ...state,
        selectedStop: action.payload,
      };

    case 'SET_STOP_DETAIL_OPEN':
      return {
        ...state,
        isStopDetailOpen: action.payload,
        selectedStop: action.payload ? state.selectedStop : null,
      };

    case 'SET_MAPS_MODAL_OPEN':
      return {
        ...state,
        isMapsModalOpen: action.payload,
      };

    case 'SET_SELECTED_MAP_APP':
      return {
        ...state,
        selectedMapApp: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: action.payload ? false : state.isLoading, // Stop loading on error
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? null : state.error, // Clear error when starting to load
      };

    case 'RESET_STATE':
      return {
        ...initialState,
        currentScreen: 'welcome', // Start fresh at welcome screen
      };

    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('city-weaver-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Restore selected styles and context, but reset UI state
        if (parsedState.selectedStyles) {
          dispatch({ type: 'SET_SELECTED_STYLES', payload: parsedState.selectedStyles });
        }
        if (parsedState.travelContext) {
          dispatch({ type: 'SET_TRAVEL_CONTEXT', payload: parsedState.travelContext });
        }
        if (parsedState.currentItinerary) {
          dispatch({ type: 'SET_CURRENT_ITINERARY', payload: parsedState.currentItinerary });
        }
      } catch (error) {
        console.warn('Failed to restore app state from localStorage:', error);
      }
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    const stateToSave = {
      selectedStyles: state.selectedStyles,
      travelContext: state.travelContext,
      currentItinerary: state.currentItinerary,
    };

    localStorage.setItem('city-weaver-state', JSON.stringify(stateToSave));
  }, [state.selectedStyles, state.travelContext, state.currentItinerary]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Selector hooks for specific pieces of state
export const useSelectedStyles = () => {
  const { state } = useApp();
  return state.selectedStyles;
};

export const useTravelContext = () => {
  const { state } = useApp();
  return state.travelContext;
};

export const useCurrentItinerary = () => {
  const { state } = useApp();
  return state.currentItinerary;
};

export const useCurrentScreen = () => {
  const { state, dispatch } = useApp();

  const setScreen = (screen: AppState['currentScreen']) => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
  };

  return [state.currentScreen, setScreen] as const;
};

export const useChatState = () => {
  const { state, dispatch } = useApp();

  const openChat = () => dispatch({ type: 'SET_CHAT_OPEN', payload: true });
  const closeChat = () => dispatch({ type: 'SET_CHAT_OPEN', payload: false });
  const toggleChat = () => dispatch({ type: 'SET_CHAT_OPEN', payload: !state.isChatOpen });

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const fullMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: fullMessage });
  };

  const clearMessages = () => dispatch({ type: 'CLEAR_CHAT_MESSAGES' });
  const setAIResponding = (responding: boolean) => dispatch({ type: 'SET_AI_RESPONDING', payload: responding });

  return {
    isChatOpen: state.isChatOpen,
    messages: state.chatMessages,
    isAIResponding: state.isAIResponding,
    openChat,
    closeChat,
    toggleChat,
    addMessage,
    clearMessages,
    setAIResponding,
  };
};

export const useStopDetail = () => {
  const { state, dispatch } = useApp();

  const openStopDetail = (stop: Stop) => {
    dispatch({ type: 'SET_SELECTED_STOP', payload: stop });
    dispatch({ type: 'SET_STOP_DETAIL_OPEN', payload: true });
  };

  const closeStopDetail = () => {
    dispatch({ type: 'SET_STOP_DETAIL_OPEN', payload: false });
  };

  return {
    selectedStop: state.selectedStop,
    isOpen: state.isStopDetailOpen,
    openStopDetail,
    closeStopDetail,
  };
};

export const useMapsModal = () => {
  const { state, dispatch } = useApp();

  const openMapsModal = () => dispatch({ type: 'SET_MAPS_MODAL_OPEN', payload: true });
  const closeMapsModal = () => dispatch({ type: 'SET_MAPS_MODAL_OPEN', payload: false });
  const setSelectedMapApp = (app: string) => dispatch({ type: 'SET_SELECTED_MAP_APP', payload: app });

  return {
    isOpen: state.isMapsModalOpen,
    selectedMapApp: state.selectedMapApp,
    openMapsModal,
    closeMapsModal,
    setSelectedMapApp,
  };
};

// Action creators for complex operations
export const useAppActions = () => {
  const { dispatch } = useApp();

  const setSelectedStyles = (styles: TravelStyle[]) => {
    dispatch({ type: 'SET_SELECTED_STYLES', payload: styles });
  };

  const setTravelContext = (context: AppState['travelContext']) => {
    dispatch({ type: 'SET_TRAVEL_CONTEXT', payload: context });
  };

  const startItineraryGeneration = () => {
    dispatch({ type: 'SET_GENERATING_ITINERARY', payload: true });
  };

  const setGeneratedItinerary = (itinerary: ItineraryData) => {
    dispatch({ type: 'SET_CURRENT_ITINERARY', payload: itinerary });
  };

  const updateStop = (stopId: string, updates: Partial<Stop>) => {
    dispatch({ type: 'UPDATE_STOP', payload: { stopId, updates } });
  };

  const removeStop = (stopId: string) => {
    dispatch({ type: 'REMOVE_STOP', payload: stopId });
  };

  const addStop = (stop: Stop) => {
    dispatch({ type: 'ADD_STOP', payload: stop });
  };

  const reorderStops = (fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_STOPS', payload: { fromIndex, toIndex } });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const resetApp = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  return {
    setSelectedStyles,
    setTravelContext,
    startItineraryGeneration,
    setGeneratedItinerary,
    updateStop,
    removeStop,
    addStop,
    reorderStops,
    setError,
    setLoading,
    resetApp,
  };
};

export default AppContext;