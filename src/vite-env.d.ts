/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEETCODE_USERNAME?: string
  readonly VITE_BASE_PATH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
