"use client";

import * as React from "react";
import type {
  TestMetadata,
  TestItem,
  ProgressInfo,
  TestResult,
} from "@/types/test-engine";
import {
  createInitialSessionState,
  testSessionReducer,
  getComputedProgress,
  getTestResult,
} from "./session-reducer";

export interface UseTestSessionProps<TResponse = unknown> {
  metadata: TestMetadata;
  items: Array<TestItem<TResponse>>;
  autoStart?: boolean;
}

export function useTestSession<TResponse = unknown>({
  metadata,
  items,
  autoStart = false,
}: UseTestSessionProps<TResponse>) {
  const [state, dispatch] = React.useReducer(
    testSessionReducer<TResponse>,
    undefined,
    () => {
      const initial = createInitialSessionState<TResponse>();
      if (metadata && items.length > 0) {
        return testSessionReducer(initial, {
          type: "INITIALIZE",
          payload: { metadata, items },
        });
      }
      return initial;
    }
  );

  // Auto-start if requested
  React.useEffect(() => {
    if (autoStart && state.status === "instructions") {
      dispatch({ type: "START" });
    }
  }, [autoStart, state.status]);

  const currentItem = state.items[state.currentIndex] as TestItem<TResponse> | undefined;
  const currentResponse = currentItem ? state.responses[currentItem.id]?.value : undefined;
  const progress: ProgressInfo = React.useMemo(() => getComputedProgress(state), [state]);
  const result: TestResult<TResponse> | null = React.useMemo(() => getTestResult(state), [state]);

  const startSession = React.useCallback(() => {
    dispatch({ type: "START" });
  }, []);

  const recordResponse = React.useCallback(
    (value: TResponse) => {
      if (!currentItem) return;
      dispatch({
        type: "RECORD_RESPONSE",
        payload: { itemId: currentItem.id, value },
      });
    },
    [currentItem]
  );

  const nextItem = React.useCallback(() => {
    dispatch({ type: "NEXT_ITEM" });
  }, []);

  const previousItem = React.useCallback(() => {
    dispatch({ type: "PREVIOUS_ITEM" });
  }, []);

  const goToItem = React.useCallback((index: number) => {
    dispatch({ type: "GO_TO_ITEM", payload: { index } });
  }, []);

  const openCancelModal = React.useCallback(() => {
    dispatch({ type: "OPEN_CANCEL_MODAL" });
  }, []);

  const closeCancelModal = React.useCallback(() => {
    dispatch({ type: "CLOSE_CANCEL_MODAL" });
  }, []);

  const confirmCancel = React.useCallback(() => {
    dispatch({ type: "CONFIRM_CANCEL" });
  }, []);

  const completeSession = React.useCallback(() => {
    dispatch({ type: "COMPLETE" });
  }, []);

  const resetSession = React.useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    status: state.status,
    metadata: state.metadata,
    items: state.items,
    currentItem,
    currentResponse,
    progress,
    result,
    isCancelModalOpen: state.isCancelModalOpen,
    // Actions
    startSession,
    recordResponse,
    nextItem,
    previousItem,
    goToItem,
    openCancelModal,
    closeCancelModal,
    confirmCancel,
    completeSession,
    resetSession,
  };
}
