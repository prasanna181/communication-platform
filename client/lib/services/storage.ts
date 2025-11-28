export interface StorageInterface {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

const Storage = {
  /**
   * Get item from localStorage
   */
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (typeof window === "undefined") {
        return null;
      }
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  /**
   * Set item in localStorage
   */
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem: async (key: string): Promise<void> => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear: async (): Promise<void> => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};

/**
 * Utility helper functions
 */
export const Utils = {
  /**
   * Get item from storage
   */
  getItem: async (key: string): Promise<string | null> => {
    return Storage.getItem(key);
  },

  /**
   * Set item in storage
   */
  setItem: async (key: string, value: string): Promise<void> => {
    return Storage.setItem(key, value);
  },

  /**
   * Remove item from storage
   */
  removeItem: async (key: string): Promise<void> => {
    return Storage.removeItem(key);
  },

  /**
   * Clear all storage
   */
  clear: async (): Promise<void> => {
    return Storage.clear();
  },

  /**
   * Check if string is valid and not empty
   */
  isValidString: (value: string | null | undefined): boolean => {
    return value !== null && value !== undefined && value.trim().length > 0;
  },

  /**
   * Check if user is online (browser API)
   */
  isOnline: (): boolean => {
    if (typeof window === "undefined") {
      return true;
    }
    return navigator.onLine;
  },
};

export default Storage;
