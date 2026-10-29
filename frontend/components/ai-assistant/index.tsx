"use client";

import * as React from "react";
import { AIAssistantProvider } from "./ai-assistant-context";
import { AIAssistantButton } from "./ai-assistant-button";
import { AIAssistantPopup } from "./ai-assistant-popup";

export function AIAssistant() {
  return (
    <AIAssistantProvider>
      <AIAssistantButton />
      <AIAssistantPopup />
    </AIAssistantProvider>
  );
}

export { useAIAssistant } from "./ai-assistant-context";
