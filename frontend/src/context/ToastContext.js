import React, { createContext, useContext, useCallback, useReducer } from 'react';

const ToastContext = createContext(null);

let nextId = 1;

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter(t => t.id !== action.payload);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = nextId++;
    dispatch({ type: 'ADD', payload: { id, message, type, duration } });
    if (duration > 0) {
      setTimeout(() => dispatch({ type: 'REMOVE', payload: id }), duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE', payload: id });
  }, []);

  // Convenience helpers
  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error:   (msg, duration) => addToast(msg, 'error', duration || 6000),
    info:    (msg, duration) => addToast(msg, 'info', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
};

export default ToastContext;
