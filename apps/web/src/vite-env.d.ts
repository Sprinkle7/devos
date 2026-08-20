/// <reference types="vite/client" />

interface DevaiosShellBridge {
  revealInFinder?: (path: string) => boolean | Promise<boolean>;
}

interface Window {
  devaios?: DevaiosShellBridge;
}
