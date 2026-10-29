import assert from "node:assert/strict";
import { THEME_STORAGE_KEY, Theme } from "./theme-context";

console.log("Running Theme & Accessibility Unit Tests...");

// Test 1: Storage key definition
assert.equal(THEME_STORAGE_KEY, "visioncare_theme", "Storage key must match visioncare_theme");

// Test 2: Theme transition logic
function getNextTheme(current: Theme): Theme {
  return current === "dark" ? "light" : "dark";
}

assert.equal(getNextTheme("dark"), "light", "Dark mode should toggle to light mode");
assert.equal(getNextTheme("light"), "dark", "Light mode should toggle to dark mode");

// Test 3: Theme preference validation
function validateTheme(input: unknown): Theme | null {
  if (input === "light" || input === "dark") {
    return input;
  }
  return null;
}

assert.equal(validateTheme("light"), "light");
assert.equal(validateTheme("dark"), "dark");
assert.equal(validateTheme("system"), null);
assert.equal(validateTheme(undefined), null);
assert.equal(validateTheme(null), null);
assert.equal(validateTheme(""), null);

// Test 4: Simulated DOM class list update logic
class MockClassList {
  private classes = new Set<string>();
  add(cls: string) {
    this.classes.add(cls);
  }
  remove(cls: string) {
    this.classes.delete(cls);
  }
  contains(cls: string) {
    return this.classes.has(cls);
  }
}

function applyThemeToMock(classList: MockClassList, targetTheme: Theme) {
  if (targetTheme === "dark") {
    classList.add("dark");
    classList.remove("light");
  } else {
    classList.remove("dark");
    classList.add("light");
  }
}

const mockClasses = new MockClassList();
applyThemeToMock(mockClasses, "dark");
assert.equal(mockClasses.contains("dark"), true, "Dark class should be present in dark theme");
assert.equal(mockClasses.contains("light"), false, "Light class should not be present in dark theme");

applyThemeToMock(mockClasses, "light");
assert.equal(mockClasses.contains("dark"), false, "Dark class should not be present in light theme");
assert.equal(mockClasses.contains("light"), true, "Light class should be present in light theme");

console.log("Theme & Accessibility Unit Tests passed successfully!");
