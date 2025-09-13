import { appState } from "../core/appState.js";

export function moonToggle() {
  appState.moonActive = !appState.moonActive;
  alert("Moon toggle: " + (appState.moonActive ? "ON" : "OFF"));
}
