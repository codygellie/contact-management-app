import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fafaf9',
            color: '#1a1a1a',
            border: '2px solid #1a1a1a',
            borderRadius: '0px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: '500',
            boxShadow: '4px 4px 0px #1a1a1a',
          },
          success: {
            iconTheme: {
              primary: '#a3b18a',
              secondary: '#1a1a1a',
            },
            style: {
              background: '#f5f5f4',
              border: '2px solid #a3b18a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1a1a1a',
            },
            style: {
              background: '#fef2f2',
              border: '2px solid #ef4444',
            },
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
)