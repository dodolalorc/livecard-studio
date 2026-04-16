/// <reference types="vite/client" />

declare module 'file-saver' {
  export function saveAs(data: Blob | File | string, filename?: string, options?: unknown): void
}

declare global {
  interface Window {
    MonacoEnvironment: {
      getWorker: (_: string, label: string) => Worker
    }
  }
}
