"use client";

export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      
      console.log("Service Worker registered:", registration);

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              console.log("New service worker available");
            }
          });
        }
      });
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}
