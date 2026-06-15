import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Fill the project name field with a descriptive name and click the 'Criar Projeto' button to create a new project and open the editor.
        # ex: Ensaio Verão 2026 text field
        elem = page.get_by_placeholder('ex: Ensaio Verão 2026', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test Project for Transition")
        
        # -> Fill the project name field with a descriptive name and click the 'Criar Projeto' button to create a new project and open the editor.
        # Criar Projeto button
        elem = page.get_by_role('button', name='Criar Projeto', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Adicionar cena' (Add scene) button to add a second scene to the timeline so the transition between scenes can be tested.
        # Adicionar cena button
        elem = page.get_by_test_id('add-scene')
        await elem.click(timeout=10000)
        
        # -> Click the 'Transição: CUT — clique para mudar' button between the two scene cards to switch the transition from CUT to FADE, then verify the transition badge and the TRANSIÇÃO control update.
        # CUT button
        elem = page.get_by_role('button', name='CUT', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the transition type is updated
        # Assert: The transition control shows the label 'FADE', confirming the transition type was updated.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/span/span/div/button").nth(0)).to_have_text("FADE", timeout=15000), "The transition control shows the label 'FADE', confirming the transition type was updated."
        # Assert: The transition control's title indicates 'Transição: FADE — clique para mudar', confirming the transition type is FADE.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/span/span/div/button").nth(0)).to_have_attribute("title", "Transi\u00e7\u00e3o: FADE \u2014 clique para mudar", timeout=15000), "The transition control's title indicates 'Transi\u00e7\u00e3o: FADE \u2014 clique para mudar', confirming the transition type is FADE."
        
        # --> Verify the scene boundary reflects the new transition
        # Assert: Scene boundary shows the updated transition label 'FADE'.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/span/span/div/button").nth(0)).to_have_text("FADE", timeout=15000), "Scene boundary shows the updated transition label 'FADE'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    