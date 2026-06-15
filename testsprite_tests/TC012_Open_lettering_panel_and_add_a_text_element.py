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
        
        # -> Enter a project name into the 'Nome' field and click the 'Criar Projeto' button to create a new project so the editor and header entry points become available.
        # ex: Ensaio Verão 2026 text field
        elem = page.get_by_placeholder('ex: Ensaio Verão 2026', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test Project for Lettering")
        
        # -> Enter a project name into the 'Nome' field and click the 'Criar Projeto' button to create a new project so the editor and header entry points become available.
        # Criar Projeto button
        elem = page.get_by_role('button', name='Criar Projeto', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Lettering' button in the header to open the lettering workflow, then click the 'Texto (T)' tool to add a text element onto the canvas.
        # Lettering button
        elem = page.get_by_test_id('topbar-lettering')
        await elem.click(timeout=10000)
        
        # -> Click the 'Lettering' button in the header to open the lettering workflow, then click the 'Texto (T)' tool to add a text element onto the canvas.
        # T button
        elem = page.get_by_test_id('tool-T')
        await elem.click(timeout=10000)
        
        # -> Click the '+ Texto' button in the Lettering panel to add a new text element to the canvas.
        # + Texto button
        elem = page.get_by_role('button', name='+ Texto', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify a new text element is displayed on the canvas
        await page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div[3]/div/div[2]/div/div[1]").nth(0).scroll_into_view_if_needed()
        # Assert: The text element instance (start handle 'ujxvqe7q') is visible in the timeline, confirming a text element was added.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div[3]/div/div[2]/div/div[1]").nth(0)).to_be_visible(timeout=15000), "The text element instance (start handle 'ujxvqe7q') is visible in the timeline, confirming a text element was added."
        await page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div[3]/div/div[2]/div/div[2]").nth(0).scroll_into_view_if_needed()
        # Assert: The text element instance (end handle 'ujxvqe7q') is visible in the timeline, confirming a text element was added.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[2]/div[3]/div/div[2]/div/div[2]").nth(0)).to_be_visible(timeout=15000), "The text element instance (end handle 'ujxvqe7q') is visible in the timeline, confirming a text element was added."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    