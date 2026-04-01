"""
TC028 — Export modal: abre, executa mock de render e completa
Verifica que o modal de exportação abre, exibe progresso e chega ao estado 'done'.
Fase 5 — Pipeline de Exportação (UI)
"""
import asyncio
from playwright.async_api import async_playwright, expect

async def run_test():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 720})

        print("1. Criando projeto...")
        await page.goto("http://localhost:3000", wait_until="networkidle")
        await page.locator('input[placeholder]').first.fill("Export Test Project")
        await page.get_by_role("button", name="Criar Projeto").click()
        await page.wait_for_timeout(1500)

        print("2. Abrindo modal de exportação...")
        await page.get_by_role("button", name="Exportar").click()
        await page.wait_for_timeout(500)

        print("3. Verificando estado idle (configurações visíveis)...")
        await expect(page.get_by_text("Exportar Projeto")).to_be_visible()
        await expect(page.get_by_text("MP4 (H.264)")).to_be_visible()
        await expect(page.get_by_text("1280 × 720")).to_be_visible()
        await expect(page.get_by_text("30 fps")).to_be_visible()
        await expect(page.get_by_role("button", name="Iniciar Exportação")).to_be_visible()

        print("4. Iniciando exportação...")
        await page.get_by_role("button", name="Iniciar Exportação").click()
        await page.wait_for_timeout(500)

        print("5. Verificando estado rendering (barra de progresso visível)...")
        await expect(page.get_by_text("Renderizando...")).to_be_visible()

        print("6. Aguardando conclusão do mock (~6s)...")
        await expect(page.get_by_text("Exportação concluída!")).to_be_visible(timeout=10000)

        print("7. Verificando estado done (botão Abrir Pasta visível)...")
        await expect(page.get_by_role("button", name="Abrir Pasta")).to_be_visible()

        print("8. Fechando modal...")
        await page.get_by_role("button", name="Fechar").click()
        await page.wait_for_timeout(300)
        modal = page.get_by_text("Exportar Projeto")
        assert not await modal.is_visible(), "FALHOU: modal deveria ter fechado"

        print("PASSOU: modal de exportação funciona corretamente")
        await browser.close()

asyncio.run(run_test())
