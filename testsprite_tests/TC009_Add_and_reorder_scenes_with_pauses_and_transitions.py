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
        
        # -> Fill the 'Nome' field with a project name and click the 'Criar Projeto' button to create a project.
        # ex: Ensaio Verão 2026 text field
        elem = page.get_by_placeholder('ex: Ensaio Verão 2026', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Ensaio Teste - MultiScene")
        
        # -> Fill the 'Nome' field with a project name and click the 'Criar Projeto' button to create a project.
        # Criar Projeto button
        elem = page.get_by_role('button', name='Criar Projeto', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Adicionar cena' (Add scene) button to add a new scene to the timeline and scene list.
        # Adicionar cena button
        elem = page.get_by_test_id('add-scene')
        await elem.click(timeout=10000)
        
        # -> Click the 'Pausa' (Add pause) button in the editor to insert an active pause into the timeline.
        # Pausa button
        elem = page.get_by_test_id('add-pause')
        await elem.click(timeout=10000)
        
        # -> Select the 'Tela Preta' pause option from the pause menu to insert an active pause into the timeline.
        # Tela Preta button
        elem = page.get_by_role('button', name='Tela Preta', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Cena' (Add scene) button to add another scene to the timeline and verify a third scene appears in the scene list.
        # Adicionar cena button
        elem = page.get_by_test_id('add-scene')
        await elem.click(timeout=10000)
        
        # -> Drag the 'Cena 3' scene to become the second scene (place it between 'Cena 1' and 'Cena 2') by using the scene's 'Arrastar cena' handle.
        # Arrastar cena button
        elem = page.get_by_test_id('drag-handle-589tz516')
        await elem.click(timeout=10000)
        
        # -> Try to start reordering by clicking the 'Arrastar cena' handle for the third scene (the handle labeled 'Arrastar cena' for Cena 3) to place it between 'Cena 1' and 'Cena 2'.
        # Arrastar cena button
        elem = page.get_by_test_id('drag-handle-589tz516')
        await elem.click(timeout=10000)
        
        # -> Attempt to reorder by starting drag on the 'Arrastar cena' handle for Cena 3, then drop it into the slot between 'Cena 1' and 'Cena 2' by clicking the transition area labeled 'CUT' (the visible transition control).
        # Arrastar cena button
        elem = page.get_by_test_id('drag-handle-589tz516')
        await elem.click(timeout=10000)
        
        # -> Attempt to reorder by starting drag on the 'Arrastar cena' handle for Cena 3, then drop it into the slot between 'Cena 1' and 'Cena 2' by clicking the transition area labeled 'CUT' (the visible transition control).
        # CUT button
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/span/span/div/button')
        await elem.click(timeout=10000)
        
        # -> Start reordering by clicking the 'Arrastar cena' handle for Cena 3, then drop it onto the 'FADE' transition between Cena 1 and Cena 2 to move Cena 3 into second position.
        # Arrastar cena button
        elem = page.get_by_test_id('drag-handle-589tz516')
        await elem.click(timeout=10000)
        
        # -> Start reordering by clicking the 'Arrastar cena' handle for Cena 3, then drop it onto the 'FADE' transition between Cena 1 and Cena 2 to move Cena 3 into second position.
        # FADE button
        elem = page.get_by_role('button', name='FADE', exact=True)
        await elem.click(timeout=10000)
        
        # -> Focus the 'Arrastar cena' handle for Cena 3, send left-arrow keys to attempt moving it left in the timeline, then click the transition badge labeled 'CUT' between Cena 1 and Cena 2 to toggle to 'FADE' (verify the transition change).
        # Arrastar cena button
        elem = page.get_by_test_id('drag-handle-589tz516')
        await elem.click(timeout=10000)
        
        # -> Focus the 'Arrastar cena' handle for Cena 3, send left-arrow keys to attempt moving it left in the timeline, then click the transition badge labeled 'CUT' between Cena 1 and Cena 2 to toggle to 'FADE' (verify the transition change).
        # CUT button
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/span/span/div/button')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the scene list reflects the new ordering
        # Assert: Expected the second scene slot to show 'Cena 3' after reordering.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/div[2]/div[1]/button").nth(0)).to_have_text("03\nCena 3\n5\ns", timeout=15000), "Expected the second scene slot to show 'Cena 3' after reordering."
        # Assert: Expected the fourth scene slot to show 'Cena 2' after reordering.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/div[4]/div[1]/button").nth(0)).to_have_text("02\nCena 2\n5\ns", timeout=15000), "Expected the fourth scene slot to show 'Cena 2' after reordering."
        
        # --> Verify the pause and transition controls are present
        await page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/span[1]/span/div/button").nth(0).scroll_into_view_if_needed()
        # Assert: Expected the FADE transition control to be visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/span[1]/span/div/button").nth(0)).to_be_visible(timeout=15000), "Expected the FADE transition control to be visible."
        await page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/span[2]/span/div/button").nth(0).scroll_into_view_if_needed()
        # Assert: Expected the CUT transition control to be visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/span[2]/span/div/button").nth(0)).to_be_visible(timeout=15000), "Expected the CUT transition control to be visible."
        await page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/div[3]/div/div[1]").nth(0).scroll_into_view_if_needed()
        # Assert: Expected the pause control (pause badge/drag handle) to be visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div/div[2]/div/div[2]/div[3]/div/div[1]").nth(0)).to_be_visible(timeout=15000), "Expected the pause control (pause badge/drag handle) to be visible."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    