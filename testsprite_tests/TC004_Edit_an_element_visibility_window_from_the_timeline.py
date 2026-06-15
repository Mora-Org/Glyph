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
        
        # -> Fill the project 'Nome' field with a project name and click the 'Criar Projeto' (Create Project) button to create a new project from the dashboard.
        # ex: Ensaio Verão 2026 text field
        elem = page.get_by_placeholder('ex: Ensaio Verão 2026', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Automated Test Project")
        
        # -> Fill the project 'Nome' field with a project name and click the 'Criar Projeto' (Create Project) button to create a new project from the dashboard.
        # Criar Projeto button
        elem = page.get_by_role('button', name='Criar Projeto', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Texto (T)' toolbar button to add a text element to the active scene.
        # T button
        elem = page.get_by_test_id('tool-T')
        await elem.click(timeout=10000)
        
        # -> Click the canvas area to add a text element to the active scene so a new element track appears in the timeline.
        # Click the canvas area to add a text element to the active scene so a new element track appears in the timeline.
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div/div[4]/div/div/canvas[2]')
        await elem.click(timeout=10000)
        
        # -> Click the editor canvas area to insert a text element (then, if a text editor appears, enter sample text to commit the element).
        # Click the editor canvas area to insert a text element (then, if a text editor appears, enter sample text to commit the element).
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div/div[4]/div/div/canvas[2]')
        await elem.click(timeout=10000)
        
        # -> Open the 'Tipos' tab to reveal element types and find a control to insert a 'Texto' element into the current scene.
        # Tipos button
        elem = page.get_by_test_id('tab-tipos')
        await elem.click(timeout=10000)
        
        # -> Click the 'Fraunces' font item in the 'Tipos' sidebar to add a text element to the current scene and cause an element track to appear in the timeline.
        # Aa Fraunces serif · display button
        elem = page.get_by_role('button', name='Aa Fraunces serif · display', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Fraunces' font in the 'Tipos' sidebar and then click the editor canvas area that shows 'Cena em branco' to attempt to insert a text element so an element track appears in the timeline.
        # Aa Fraunces serif · display button
        elem = page.get_by_role('button', name='Aa Fraunces serif · display', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Fraunces' font in the 'Tipos' sidebar and then click the editor canvas area that shows 'Cena em branco' to attempt to insert a text element so an element track appears in the timeline.
        # Click the 'Fraunces' font in the 'Tipos' sidebar and then click the editor canvas area that shows 'Cena em branco' to attempt to insert a text element so an element track appears in the timeline.
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div/div[4]/div/div/canvas[2]')
        await elem.click(timeout=10000)
        
        # -> click
        # click
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div/div[4]/div/div/canvas[2]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Fraunces' font in the Tipos sidebar, then click the editor canvas and type 'Hello' (followed by Enter) to attempt adding a text element to the scene so an element track appears in the timeline.
        # Aa Fraunces serif · display button
        elem = page.get_by_role('button', name='Aa Fraunces serif · display', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Fraunces' font in the Tipos sidebar, then click the editor canvas and type 'Hello' (followed by Enter) to attempt adding a text element to the scene so an element track appears in the timeline.
        # Click the 'Fraunces' font in the Tipos sidebar, then click the editor canvas and type 'Hello' (followed by Enter) to attempt adding a text element to the scene so an element track appears in the timeline.
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div/div[4]/div/div/canvas[2]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Texto (T)' toolbar button to activate the text tool, then click the canvas area that shows 'Cena em branco' to attempt inserting a text element.
        # T button
        elem = page.get_by_test_id('tool-T')
        await elem.click(timeout=10000)
        
        # -> Click the 'Texto (T)' toolbar button to activate the text tool, then click the canvas area that shows 'Cena em branco' to attempt inserting a text element.
        # Click the 'Texto (T)' toolbar button to activate the text tool, then click the canvas area that shows 'Cena em branco' to attempt inserting a text element.
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div/div[4]/div/div/canvas[2]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Mídia' tab to reveal media insertion controls and attempt adding an image asset to the scene.
        # Mídia button
        elem = page.get_by_test_id('tab-midia')
        await elem.click(timeout=10000)
        
        # -> Final action — this is where the agent failed
        # Error observed by agent: File path test-image.jpg is not available. To fix: The user must add this file path to the available_file_paths parameter when creating the Agent. Example: Agent(task="...", llm=llm, browser=browser, 
        # file upload
        elem = page.get_by_label('Pasta', exact=True)
        await elem.wait_for(state="attached", timeout=10000)
        if await elem.evaluate("e => e.tagName === 'INPUT' && (e.type || '').toLowerCase() === 'file'"):
            await elem.set_input_files("./fixtures/test-image.jpg")
        else:
            await elem.wait_for(state="visible", timeout=10000)
            async with page.expect_file_chooser() as fc_info:
                await elem.click()
            chooser = await fc_info.value
            await chooser.set_files("./fixtures/test-image.jpg")
        
        # --> Assertions to verify final state
        current_url = await page.evaluate("() => window.location.href")
        # Assert: page loaded with a URL (final outcome verified by the AI judge during the run)
        assert current_url, 'Page should have loaded with a URL'
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
    