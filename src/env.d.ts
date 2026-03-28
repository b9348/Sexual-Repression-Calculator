/// <reference types="@rsbuild/core/types" />

interface ImportMetaEnv {
  readonly VITE_EXTERNAL_BUTTON_TEXT: string;
  readonly VITE_EXTERNAL_BUTTON_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
