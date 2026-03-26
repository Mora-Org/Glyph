/**
 * Hook utilitário para invocar comandos Tauri de forma segura.
 * No browser (next dev sem Tauri), retorna fallback sem quebrar.
 */

type InvokeOptions = Record<string, unknown>;

async function invoke<T>(command: string, args?: InvokeOptions): Promise<T> {
  if (typeof window === 'undefined') {
    throw new Error('invoke chamado fora do browser');
  }

  // Quando rodando dentro do Tauri, o objeto __TAURI__ está disponível
  type TauriInvoke = (cmd: string, args?: InvokeOptions) => Promise<T>;
  const tauri = (window as unknown as { __TAURI__?: { core: { invoke: TauriInvoke } } }).__TAURI__;

  if (!tauri) {
    console.warn(`[useTauri] Tauri não disponível. Comando ignorado: ${command}`);
    return `[mock] ${command}` as unknown as T;
  }

  return tauri.core.invoke(command, args);
}

export const tauriInvoke = invoke;
