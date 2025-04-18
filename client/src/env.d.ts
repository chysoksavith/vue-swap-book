interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ADMIN_LOGIN_PATH: string;
  readonly VITE_USER_HOME_PATH: string;
  readonly VITE_TOKEN_NAME: string;
  readonly VITE_ENABLE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
