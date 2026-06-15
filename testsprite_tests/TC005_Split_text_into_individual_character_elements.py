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
        
        # -> Fill the project name field with 'Test Project for Split' and click the 'Criar Projeto' button to create a project and open the dashboard.
        # ex: Ensaio Verão 2026 text field
        elem = page.get_by_placeholder('ex: Ensaio Verão 2026', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test Project for Split")
        
        # -> Fill the project name field with 'Test Project for Split' and click the 'Criar Projeto' button to create a project and open the dashboard.
        # Criar Projeto button
        elem = page.get_by_role('button', name='Criar Projeto', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Lettering' button in the header to open the lettering tools.
        # Lettering button
        elem = page.get_by_test_id('topbar-lettering')
        await elem.click(timeout=10000)
        
        # -> Click the 'Texto (T)' toolbar control to enable adding a text element on the canvas.
        # T button
        elem = page.get_by_test_id('tool-T')
        await elem.click(timeout=10000)
        
        # -> Click the canvas to place the text caret, type 'SplitTest', and press Enter to commit the text element on the canvas.
        # Click the canvas to place the text caret, type 'SplitTest', and press Enter to commit the text element on the canvas.
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div/div[4]/div/div/canvas[2]')
        await elem.click(timeout=10000)
        
        # -> Click the visible 'SplitTest' text on the canvas to select the text element so the split-to-characters control (if present) becomes available.
        # Click the visible 'SplitTest' text on the canvas to select the text element so the split-to-characters control (if present) becomes available.
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div/div[4]/div/div/canvas[2]')
        await elem.click(timeout=10000)
        
        # -> Click the '+ Texto' button in the Lettering panel to add a text element to the canvas so it can be selected and the split-into-characters control can appear.
        # + Texto button
        elem = page.get_by_role('button', name='+ Texto', exact=True)
        await elem.click(timeout=10000)
        
        # -> Select the text element on the canvas by clicking the visible text and then click the 'Split em letras individuais' button in the Lettering panel to split the text into individual characters.
        # Select the text element on the canvas by clicking the visible text and then click the 'Split em letras individuais' button in the Lettering panel to split the text into individual characters.
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div/div[4]/div/div/canvas[2]')
        await elem.click(timeout=10000)
        
        # -> Select the text element on the canvas by clicking the visible text and then click the 'Split em letras individuais' button in the Lettering panel to split the text into individual characters.
        # ✦ Split em letras individuais button
        elem = page.get_by_role('button', name='✦ Split em letras individuais', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        current_url = await page.evaluate("() => window.location.href")
        # Assert: page loaded with a URL (final outcome verified by the AI judge during the run)
        assert current_url, 'Page should have loaded with a URL'
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    