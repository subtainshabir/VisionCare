import type {
  TestSessionState,
  TestSessionAction,
  ProgressInfo,
  TestResult,
} from "@/types/test-engine";

export function createInitialSessionState<TResponse = unknown>(): TestSessionState<TResponse> {
  return {
    status: "idle",
    metadata: null,
    items: [],
    currentIndex: 0,
    responses: {},
    startedAt: null,
    finishedAt: null,
    isCancelModalOpen: false,
  };
}

export function testSessionReducer<TResponse = unknown>(
  state: TestSessionState<TResponse>,
  action: TestSessionAction<TResponse>
): TestSessionState<TResponse> {
  switch (action.type) {
    case "INITIALIZE": {
      const { metadata, items } = action.payload;
      return {
        status: "instructions",
        metadata,
        items,
        currentIndex: 0,
        responses: {},
        startedAt: null,
        finishedAt: null,
        isCancelModalOpen: false,
      };
    }

    case "START": {
      // Only allow transition from instructions when items are present
      if (state.status !== "instructions" || state.items.length === 0) {
        return state;
      }
      return {
        ...state,
        status: "in_progress",
        startedAt: Date.now(),
        currentIndex: 0,
        isCancelModalOpen: false,
      };
    }

    case "RECORD_RESPONSE": {
      // Disallow recording answers if session is not actively in progress
      if (state.status !== "in_progress") {
        return state;
      }

      const { itemId, value } = action.payload;
      // Guard against invalid or missing itemId
      const itemExists = state.items.some((item) => item.id === itemId);
      if (!itemExists) {
        return state;
      }

      return {
        ...state,
        responses: {
          ...state.responses,
          [itemId]: {
            itemId,
            value,
            answeredAt: Date.now(),
          },
        },
      };
    }

    case "NEXT_ITEM": {
      if (state.status !== "in_progress") {
        return state;
      }

      // Check if answering current is required
      if (state.metadata?.requireAnswerToAdvance) {
        const currentItem = state.items[state.currentIndex];
        if (currentItem && !state.responses[currentItem.id]) {
          return state;
        }
      }

      // Guard: never advance past the last item
      if (state.currentIndex >= state.items.length - 1) {
        return state;
      }

      return {
        ...state,
        currentIndex: state.currentIndex + 1,
      };
    }

    case "PREVIOUS_ITEM": {
      if (state.status !== "in_progress") {
        return state;
      }

      // Disallow moving backward if test config forbids it
      if (state.metadata?.allowPrevious === false) {
        return state;
      }

      // Guard: never move before 0
      if (state.currentIndex <= 0) {
        return state;
      }

      return {
        ...state,
        currentIndex: state.currentIndex - 1,
      };
    }

    case "GO_TO_ITEM": {
      if (state.status !== "in_progress") {
        return state;
      }

      const target = action.payload.index;
      if (target < 0 || target >= state.items.length) {
        return state;
      }

      return {
        ...state,
        currentIndex: target,
      };
    }

    case "OPEN_CANCEL_MODAL": {
      if (state.status !== "in_progress") {
        return state;
      }
      return {
        ...state,
        isCancelModalOpen: true,
      };
    }

    case "CLOSE_CANCEL_MODAL": {
      return {
        ...state,
        isCancelModalOpen: false,
      };
    }

    case "CONFIRM_CANCEL": {
      if (state.status !== "in_progress") {
        return state;
      }
      return {
        ...state,
        status: "cancelled",
        finishedAt: Date.now(),
        isCancelModalOpen: false,
      };
    }

    case "COMPLETE": {
      // Explicit completion only when in_progress
      if (state.status !== "in_progress") {
        return state;
      }
      return {
        ...state,
        status: "completed",
        finishedAt: Date.now(),
        isCancelModalOpen: false,
      };
    }

    case "RESET": {
      if (!state.metadata || state.items.length === 0) {
        return createInitialSessionState();
      }
      return {
        ...state,
        status: "instructions",
        currentIndex: 0,
        responses: {},
        startedAt: null,
        finishedAt: null,
        isCancelModalOpen: false,
      };
    }

    default:
      return state;
  }
}

/**
 * Computes live progress information from the session state.
 */
export function getComputedProgress<TResponse = unknown>(
  state: TestSessionState<TResponse>
): ProgressInfo {
  const total = state.items.length;
  if (total === 0) {
    return {
      currentIndex: 0,
      totalItems: 0,
      currentStepDisplay: 0,
      percentage: 0,
      isFirst: true,
      isLast: true,
      hasAnsweredCurrent: false,
      answeredCount: 0,
    };
  }

  const currentItem = state.items[state.currentIndex];
  const hasAnsweredCurrent = Boolean(currentItem && state.responses[currentItem.id]);
  const answeredCount = Object.keys(state.responses).length;

  // Percentage is based on total items configured (0% to 100%)
  const percentage = Math.min(100, Math.round((answeredCount / total) * 100));

  return {
    currentIndex: state.currentIndex,
    totalItems: total,
    currentStepDisplay: state.currentIndex + 1,
    percentage,
    isFirst: state.currentIndex === 0,
    isLast: state.currentIndex === total - 1,
    hasAnsweredCurrent,
    answeredCount,
  };
}

/**
 * Aggregates a generic test result data contract when completed or cancelled.
 */
export function getTestResult<TResponse = unknown>(
  state: TestSessionState<TResponse>
): TestResult<TResponse> | null {
  if (state.status !== "completed" && state.status !== "cancelled") {
    return null;
  }

  return {
    testId: state.metadata?.id ?? "unknown",
    status: state.status,
    startedAt: state.startedAt ?? Date.now(),
    finishedAt: state.finishedAt ?? Date.now(),
    totalItems: state.items.length,
    answeredCount: Object.keys(state.responses).length,
    responses: state.responses,
  };
}
