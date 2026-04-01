"""
run_all_v1.py — Suite completa de testes PEG v1.0
Roda todos os TCs manuais em sequência e gera um relatório de resultados.

Uso:
  python testsprite_tests/run_all_v1.py

Pré-requisito: servidor rodando em http://localhost:3000
  npm run dev
"""
import asyncio
import importlib.util
import sys
import time
from pathlib import Path

# ── TCs manuais a rodar (em ordem de fase) ─────────────────────────────────
TEST_FILES = [
    # Fase 4 — Tipografia & GIF
    "TC021_manual.py",
    # Fase 5 — Exportação
    "TC028_Export_modal_opens_and_completes_mock_render.py",
    # Adicionar novos TCs aqui conforme as fases avançarem
]

BASE_DIR = Path(__file__).parent

# ── Cores ANSI ──────────────────────────────────────────────────────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

async def run_test_file(path: Path) -> tuple[str, bool, str]:
    """Importa o módulo e chama run_test() diretamente com await."""
    name = path.name
    try:
        spec = importlib.util.spec_from_file_location("tc_module", path)
        module = importlib.util.module_from_spec(spec)  # type: ignore
        # Executa o módulo sem disparar asyncio.run() — interceptamos via sys
        # Substituímos asyncio.run temporariamente para evitar o conflito
        original_run = asyncio.run
        asyncio.run = lambda coro, **_: None  # bloqueia chamadas do módulo
        try:
            spec.loader.exec_module(module)  # type: ignore
        finally:
            asyncio.run = original_run

        if hasattr(module, "run_test"):
            await module.run_test()
        return name, True, "Passed"
    except AssertionError as e:
        return name, False, str(e)
    except Exception as e:
        return name, False, f"{type(e).__name__}: {e}"

async def main_async():
    print(f"\n{BOLD}{'='*55}{RESET}")
    print(f"{BOLD}  PEG v1.0 — Suite Completa de Testes{RESET}")
    print(f"{'='*55}\n")

    results = []
    total_start = time.time()

    for filename in TEST_FILES:
        path = BASE_DIR / filename
        if not path.exists():
            results.append((filename, False, "Arquivo não encontrado"))
            print(f"  {RED}SKIP{RESET}  {filename} — arquivo não encontrado")
            continue

        print(f"  {YELLOW}RUN {RESET} {filename}")
        start = time.time()
        name, passed, msg = await run_test_file(path)
        elapsed = time.time() - start

        status = f"{GREEN}PASS{RESET}" if passed else f"{RED}FAIL{RESET}"
        print(f"  {status}  {filename} ({elapsed:.1f}s)")
        if not passed:
            print(f"         {RED}{msg}{RESET}")
        results.append((name, passed, msg))

    # ── Sumário ─────────────────────────────────────────────────────────────
    total   = len(results)
    passed  = sum(1 for _, ok, _ in results if ok)
    failed  = total - passed
    elapsed = time.time() - total_start

    print(f"\n{'='*55}")
    print(f"  Resultado: {GREEN}{passed} passou{RESET}  {RED}{failed} falhou{RESET}  ({total} total)  {elapsed:.1f}s")
    print(f"{'='*55}\n")

    if failed > 0:
        print(f"{RED}Falhas:{RESET}")
        for name, ok, msg in results:
            if not ok:
                print(f"  - {name}: {msg}")
        print()
        sys.exit(1)

def main():
    asyncio.run(main_async())

if __name__ == "__main__":
    main()
