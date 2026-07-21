import { useState, useEffect } from 'react';

export function useSavedItems(storageKey: string) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error(`Error reading ${storageKey} from localStorage`, e);
    }
  }, [storageKey]);

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e) {
        console.error(`Error writing ${storageKey} to localStorage`, e);
      }
      return next;
    });
  };

  const isSaved = (id: string) => savedIds.includes(id);

  return { savedIds, toggleSave, isSaved };
}
