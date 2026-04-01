"""
TC021 — Teste manual: handle de início da timeline responde a teclado
Verifica que ArrowRight incrementa aria-valuenow do handle de startTime.
"""
import asyncio
from playwright.async_api import async_playwright, expect

async def run_test():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=False)  # headless=False pra ver o que acontece
        page = await browser.new_page(viewport={"width": 1280, "height": 720})

        print("1. Navegando para localhost:3000...")
        await page.goto("http://localhost:3000", wait_until="networkidle")

        print("2. Criando projeto...")
        await page.locator('input[placeholder]').first.fill("TC021 Manual Test")
        await page.get_by_role("button", name="Criar Projeto").click()
        await page.wait_for_timeout(2000)

        print("3. Abrindo painel Lettering...")
        await page.get_by_role("button", name="✦ Lettering").click()
        await page.wait_for_timeout(1000)

        print("4. Adicionando texto...")
        await page.get_by_role("button", name="+ Texto").click()
        await page.wait_for_timeout(1500)

        print("5. Localizando handle de início...")
        handle = page.locator('[aria-label*="Ajustar início de"]').first
        await expect(handle).to_be_visible()

        valor_antes = await handle.get_attribute("aria-valuenow")
        print(f"   aria-valuenow antes: {valor_antes}")

        print("6. Clicando no handle para focar...")
        await handle.click()
        await page.wait_for_timeout(300)

        print("7. Pressionando ArrowRight 5x...")
        for i in range(5):
            await handle.press("ArrowRight")
            await page.wait_for_timeout(200)

        valor_depois = await handle.get_attribute("aria-valuenow")
        print(f"   aria-valuenow depois: {valor_depois}")

        print("8. Verificando resultado...")
        assert valor_depois != "0" and valor_depois is not None, \
            f"FALHOU: aria-valuenow deveria ser > 0, mas é '{valor_depois}'"
        assert float(valor_depois) > 0, \
            f"FALHOU: startTime deveria ter aumentado, mas é {valor_depois}"

        print(f"✅ PASSOU! startTime mudou de {valor_antes} para {valor_depois}")

        await browser.close()

asyncio.run(run_test())
