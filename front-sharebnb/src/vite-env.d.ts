
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOCAL: boolean;  // Add your custom variables here, e.g. from your code
  // Add other VITE_ vars as needed, e.g.:
  // readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}