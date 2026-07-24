import { useState, useEffect } from 'react';

export function useSavedItems(storageKey: string) {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue !== null) {
        try {
          setSavedIds(JSON.parse(e.newValue));
        } catch {
          // Fallback if parsing fails
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey]);

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
        // Dispatch custom event for same-tab reactive updates across components
        window.dispatchEvent(new CustomEvent('massar_storage_update', { detail: { key: storageKey, value: next } }));
      } catch (e) {
        console.error(`Error writing ${storageKey} to localStorage`, e);
      }
      return next;
    });
  };

  useEffect(() => {
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.key === storageKey) {
        setSavedIds(customEvent.detail.value);
      }
    };

    window.addEventListener('massar_storage_update', handleCustomEvent);
    return () => window.removeEventListener('massar_storage_update', handleCustomEvent);
  }, [storageKey]);

  const isSaved = (id: string) => savedIds.includes(id);

  return { savedIds, toggleSave, isSaved };
}
