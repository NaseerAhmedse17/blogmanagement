import { useState, useCallback } from 'react';

/**
 * useConfirm — manages ConfirmDialog open/close state and the async callback.
 *
 * Usage:
 *   const { confirmProps, requestConfirm } = useConfirm();
 *
 *   // To trigger:
 *   await requestConfirm({
 *     title:   'Delete post?',
 *     message: 'This cannot be undone.',
 *     onConfirm: async () => { await deletePost(id); },
 *   });
 *
 *   // Spread into the dialog:
 *   <ConfirmDialog {...confirmProps} />
 */
const useConfirm = () => {
  const [state, setState] = useState({
    isOpen:      false,
    title:       '',
    message:     '',
    confirmText: 'Delete',
    cancelText:  'Cancel',
    variant:     'danger',
    loading:     false,
    callback:    null,
  });

  const requestConfirm = useCallback(({
    title       = 'Are you sure?',
    message     = 'This action cannot be undone.',
    confirmText = 'Delete',
    cancelText  = 'Cancel',
    variant     = 'danger',
    onConfirm,
  }) => {
    setState(s => ({
      ...s, isOpen: true,
      title, message, confirmText, cancelText, variant,
      callback: onConfirm,
      loading: false,
    }));
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!state.callback) return;
    setState(s => ({ ...s, loading: true }));
    try {
      await state.callback();
    } finally {
      setState(s => ({ ...s, isOpen: false, loading: false, callback: null }));
    }
  }, [state.callback]);

  const handleCancel = useCallback(() => {
    if (state.loading) return;
    setState(s => ({ ...s, isOpen: false, loading: false, callback: null }));
  }, [state.loading]);

  return {
    requestConfirm,
    confirmProps: {
      isOpen:      state.isOpen,
      title:       state.title,
      message:     state.message,
      confirmText: state.confirmText,
      cancelText:  state.cancelText,
      variant:     state.variant,
      loading:     state.loading,
      onConfirm:   handleConfirm,
      onCancel:    handleCancel,
    },
  };
};

export default useConfirm;
