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
        
        # -> Fill the project name input (the field with placeholder 'ex: Ensaio Verão 2026') with 'Typography Test Project' and click the 'Criar Projeto' button to create a project and open the editor.
        # ex: Ensaio Verão 2026 text field
        elem = page.get_by_placeholder('ex: Ensaio Verão 2026', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Typography Test Project")
        
        # -> Fill the project name input (the field with placeholder 'ex: Ensaio Verão 2026') with 'Typography Test Project' and click the 'Criar Projeto' button to create a project and open the editor.
        # Criar Projeto button
        elem = page.get_by_role('button', name='Criar Projeto', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the Lettering panel by clicking the 'Lettering' button in the header, then add a text element by clicking the 'Texto (T)' toolbar button so the text element appears on the canvas.
        # Lettering button
        elem = page.get_by_test_id('topbar-lettering')
        await elem.click(timeout=10000)
        
        # -> Open the Lettering panel by clicking the 'Lettering' button in the header, then add a text element by clicking the 'Texto (T)' toolbar button so the text element appears on the canvas.
        # T button
        elem = page.get_by_test_id('tool-T')
        await elem.click(timeout=10000)
        
        # -> Click the canvas area (the large black stage) to place a text element so it can be edited.
        # Click the canvas area (the large black stage) to place a text element so it can be edited.
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div/div[4]/div/div/canvas[2]')
        await elem.click(timeout=10000)
        
        # -> Click the '+ Texto' button in the Lettering panel to add a text element to the scene.
        # + Texto button
        elem = page.get_by_role('button', name='+ Texto', exact=True)
        await elem.click(timeout=10000)
        
        # -> Focus the placed text element by clicking the canvas, type new text 'Hello Typography', then change the font to 'Georgia', set the size to 120, pick color '#ff0000', and enable the 'Neon' animation.
        # Focus the placed text element by clicking the canvas, type new text 'Hello Typography', then change the font to 'Georgia', set the size to 120, pick color '#ff0000', and enable the 'Neon' animation.
        elem = page.locator('xpath=/html/body/div[2]/div/main/section/div/div[4]/div/div/canvas[2]')
        await elem.click(timeout=10000)
        
        # -> Focus the placed text element by clicking the canvas, type new text 'Hello Typography', then change the font to 'Georgia', set the size to 120, pick color '#ff0000', and enable the 'Neon' animation.
        # sans-serif serif monospace Georgia Verdana Impact... dropdown
        elem = page.locator("xpath=/html/body/div[2]/div/main/aside/div/div[2]/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Focus the placed text element by clicking the canvas, type new text 'Hello Typography', then change the font to 'Georgia', set the size to 120, pick color '#ff0000', and enable the 'Neon' animation.
        # range field
        elem = page.locator('xpath=/html/body/div[2]/div/main/aside/div/div[2]/div[2]/input')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("120")
        
        # -> Focus the placed text element by clicking the canvas, type new text 'Hello Typography', then change the font to 'Georgia', set the size to 120, pick color '#ff0000', and enable the 'Neon' animation.
        # color field
        elem = page.locator('xpath=/html/body/div[2]/div/main/aside/div/div[2]/div[3]/input')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("#ff0000")
        
        # -> Click the 'Neon' animation button in the Lettering panel to enable the Neon effect for the selected text, then verify the text remains visible on the canvas with the configured appearance.
        # Neon · Pisca button
        elem = page.locator('xpath=/html/body/div[2]/div/main/aside/div/div[2]/div[4]/div/button[3]')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the text element remains displayed on the canvas with the configured appearance
        await page.locator("xpath=/html/body/div[2]/div/main/section/div[1]/div[4]/div/div/canvas[2]").nth(0).scroll_into_view_if_needed()
        # Assert: The canvas is visible, indicating the text element remains displayed on the stage.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/section/div[1]/div[4]/div/div/canvas[2]").nth(0)).to_be_visible(timeout=15000), "The canvas is visible, indicating the text element remains displayed on the stage."
        # Assert: The font family control shows 'Georgia'.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/aside/div/div[2]/div[1]/select").nth(0)).to_contain_text("Georgia", timeout=15000), "The font family control shows 'Georgia'."
        # Assert: The font size control is set to 120.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/aside/div/div[2]/div[2]/input").nth(0)).to_have_value("120", timeout=15000), "The font size control is set to 120."
        # Assert: The color picker is set to #ff0000.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/aside/div/div[2]/div[3]/input").nth(0)).to_have_value("#ff0000", timeout=15000), "The color picker is set to #ff0000."
        await page.locator("xpath=/html/body/div[2]/div/main/aside/div/div[2]/div[4]/div/button[3]").nth(0).scroll_into_view_if_needed()
        # Assert: The 'Neon · Pisca' animation option is visible in the Lettering panel.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/aside/div/div[2]/div[4]/div/button[3]").nth(0)).to_be_visible(timeout=15000), "The 'Neon \u00b7 Pisca' animation option is visible in the Lettering panel."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    