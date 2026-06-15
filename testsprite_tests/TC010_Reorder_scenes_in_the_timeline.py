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
        
        # -> Fill the project name field with 'Scene Reorder Test' and click the 'Criar Projeto' button to create the project from the dashboard.
        # ex: Ensaio Verão 2026 text field
        elem = page.get_by_placeholder('ex: Ensaio Verão 2026', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Scene Reorder Test")
        
        # -> Fill the project name field with 'Scene Reorder Test' and click the 'Criar Projeto' button to create the project from the dashboard.
        # Criar Projeto button
        elem = page.get_by_role('button', name='Criar Projeto', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Adicionar cena' (Add scene) button twice to add two new scenes, then wait and check for additional 'Arrastar cena' handles and the label 'Cena 3' in the editor UI.
        # Adicionar cena button
        elem = page.get_by_test_id('add-scene')
        await elem.click(timeout=10000)
        
        # -> Click the 'Adicionar cena' (Add scene) button twice to add two new scenes, then wait and check for additional 'Arrastar cena' handles and the label 'Cena 3' in the editor UI.
        # Adicionar cena button
        elem = page.get_by_test_id('add-scene')
        await elem.click(timeout=10000)
        
        # -> Move the scene labeled 'Cena 3' to the first position by using the scene's drag handle (click the 'Arrastar cena' handle for Cena 3, then click the target position before the first scene).
        # Arrastar cena button
        elem = page.get_by_test_id('drag-handle-wxh7rczq')
        await elem.click(timeout=10000)
        
        # -> Move the scene labeled 'Cena 3' to the first position by using the scene's drag handle (click the 'Arrastar cena' handle for Cena 3, then click the target position before the first scene).
        # Arrastar cena button
        elem = page.get_by_test_id('drag-handle-601msttu')
        await elem.click(timeout=10000)
        
        # -> Move the scene labeled 'Cena 3' to be the first scene by clicking its 'Arrastar cena' handle and then clicking the scene position before 'Cena 1' to drop it there.
        # Arrastar cena button
        elem = page.get_by_test_id('drag-handle-wxh7rczq')
        await elem.click(timeout=10000)
        
        # -> Move the scene labeled 'Cena 3' to be the first scene by clicking its 'Arrastar cena' handle and then clicking the scene position before 'Cena 1' to drop it there.
        # Arrastar cena button
        elem = page.get_by_test_id('drag-handle-601msttu')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the scene order is updated
        # Assert: Expected the first scene slot to show '03 Cena 3' after reordering.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/div[1]/div[1]/button").nth(0)).to_have_text("03\nCena 3\n5\ns", timeout=15000), "Expected the first scene slot to show '03 Cena 3' after reordering."
        # Assert: Expected the second scene slot to show '01 Cena 1' after reordering.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/div[2]/div[1]/button").nth(0)).to_have_text("01\nCena 1\n5\ns", timeout=15000), "Expected the second scene slot to show '01 Cena 1' after reordering."
        # Assert: Expected the third scene slot to show '02 Cena 2' after reordering.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/div[3]/div[1]/button").nth(0)).to_have_text("02\nCena 2\n5\ns", timeout=15000), "Expected the third scene slot to show '02 Cena 2' after reordering."
        
        # --> Verify the active scene remains available
        # Assert: Expected the active scene in the scene list to display '03\nCena 3\n5\ns'.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/div[1]/div[1]/button").nth(0)).to_have_text("03\nCena 3\n5\ns", timeout=15000), "Expected the active scene in the scene list to display '03\\nCena 3\\n5\\ns'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    