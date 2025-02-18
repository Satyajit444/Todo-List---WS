// Helper function to get the theme from localStorage
export const getStoredTheme = (): boolean => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('darkMode');
      return storedTheme ? JSON.parse(storedTheme) : false; // Default to light mode if no theme is set
    }
    return false; // Default to light mode if running on the server
  };
  
  // Helper function to set the theme in localStorage
  export const setStoredTheme = (theme: boolean): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(theme));
    }
  };
  