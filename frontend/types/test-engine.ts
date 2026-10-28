/**
 * Shared vision test engine type definitions.
 * Provides generic data contracts for test metadata, test items,
 * session lifecycle, user responses, progress, and future result aggregation.
 */

export type SessionStatus =
  | "idle"
  | "instructions"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface TestMetadata {
  /** Stable identifier for the test (e.g. 'color-vision', 'distance-vision') */
  id: string;
  title: string;
  category: string;
  description: string;
  instructions: string[];
  estimatedDurationMinutes?: number;
  /** Whether the user is allowed to navigate to previous questions */
  allowPrevious?: boolean;
  /** Whether answering the current question is required to advance */
  requireAnswerToAdvance?: boolean;
}

export interface TestItemOption<TResponse = unknown> {
  value: TResponse;
  label: string;
  description?: string;
  shortcut?: string;
}

export interface TestItem<TResponse = unknown> {
  /** Stable identifier for the stimulus or question (e.g. 'plate-01', 'acuity-row-04') */
  id: string;
  title?: string;
  prompt: string;
  hint?: string;
  /** Generic payload for stimulus specifics (e.g. image URLs, optotype strings) */
  stimulusData?: Record<string, unknown>;
  /** Optional predefined options for multiple-choice or button selection */
  options?: Array<TestItemOption<TResponse>>;
}

export interface UserResponse<TResponse = unknown> {
  itemId: string;
  value: TResponse;
  answeredAt: number; // Unix timestamp in milliseconds
}

export interface ProgressInfo {
  currentIndex: number;
  totalItems: number;
  currentStepDisplay: number; // 1-indexed (e.g. question 1 of 5)
  percentage: number; // 0 to 100
  isFirst: boolean;
  isLast: boolean;
  hasAnsweredCurrent: boolean;
  answeredCount: number;
}

export interface TestResult<TResponse = unknown> {
  testId: string;
  status: "completed" | "cancelled";
  startedAt: number;
  finishedAt: number;
  totalItems: number;
  answeredCount: number;
  responses: Record<string, UserResponse<TResponse>>;
}

export interface TestSessionState<TResponse = unknown> {
  status: SessionStatus;
  metadata: TestMetadata | null;
  items: Array<TestItem<TResponse>>;
  currentIndex: number;
  responses: Record<string, UserResponse<TResponse>>;
  startedAt: number | null;
  finishedAt: number | null;
  isCancelModalOpen: boolean;
}

export type TestSessionAction<TResponse = unknown> =
  | { type: "INITIALIZE"; payload: { metadata: TestMetadata; items: Array<TestItem<TResponse>> } }
  | { type: "START" }
  | { type: "RECORD_RESPONSE"; payload: { itemId: string; value: TResponse } }
  | { type: "NEXT_ITEM" }
  | { type: "PREVIOUS_ITEM" }
  | { type: "GO_TO_ITEM"; payload: { index: number } }
  | { type: "OPEN_CANCEL_MODAL" }
  | { type: "CLOSE_CANCEL_MODAL" }
  | { type: "CONFIRM_CANCEL" }
  | { type: "COMPLETE" }
  | { type: "RESET" };
