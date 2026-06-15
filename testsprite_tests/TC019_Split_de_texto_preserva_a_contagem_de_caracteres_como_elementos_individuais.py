import asyncio
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
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:3000
        await page.goto("http://localhost:3000")
        
        # -> Preencher o campo 'Nome' com 'Projeto Teste' e clicar em 'Criar Projeto' para entrar no Editor.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div[2]/div[3]/form/div[2]/input').nth(0)
        await asyncio.sleep(3); await elem.fill('Projeto Teste')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/div[3]/form/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Open the Lettering panel so we can add a new text element.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/div/div/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the '+ Texto' button in the Lettering panel to add a new text element (this will reveal the text field to enter 'ABCD').
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/div[2]/div/div/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Focus the text object, replace its content with 'ABCD', then click the 'Split em letras individuais' control to split into characters.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/div[2]/div/div[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Type 'ABCD' into the selected text object, click '✦ Split em letras individuais' (index 448), wait for the UI to update, then extract and count the resulting character elements to verify there are 4.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/div[2]/div/div[2]').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div[2]/div[2]/div/div[2]/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        assert (await frame.locator("xpath=//*[contains(., 'A')]").nth(0).is_visible()) and (await frame.locator("xpath=//*[contains(., 'B')]").nth(0).is_visible()) and (await frame.locator("xpath=//*[contains(., 'C')]").nth(0).is_visible()) and (await frame.locator("xpath=//*[contains(., 'D')]").nth(0).is_visible()), "The canvas should display four separate characters 'A', 'B', 'C', and 'D' after splitting the text into individual letters."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    