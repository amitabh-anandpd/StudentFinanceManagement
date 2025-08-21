import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        analytics: resolve(__dirname, 'analytics.html'),
        addExpense: resolve(__dirname, 'add-expense.html'),
        recurring: resolve(__dirname, 'recurring.html'),
        settings: resolve(__dirname, 'settings.html'),
        login: resolve(__dirname, 'login.html'),
        profile: resolve(__dirname, 'profile.html'),
        billSplit: resolve(__dirname, 'bill-split.html'),
      },
    },
    outDir: 'dist',
  },
});