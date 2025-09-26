// Export all contexts and their hooks
export * from './app-context';
export * from './theme-context';

// Combined provider for easier setup
export { default as AppProvider } from './app-context';
export { ThemeProvider } from './theme-context';