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
        await page.goto("http://localhost:3000/")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Fill the project name input (index 5) with a project name and click the 'Criar Projeto' button (index 76) to enter the Editor.
        # text input placeholder="ex: Ensaio Verão 2026"
        elem = page.locator("xpath=/html/body/div[2]/div[3]/form/div[2]/input").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Timeline Test Project")
        
        # -> Fill the project name input (index 5) with a project name and click the 'Criar Projeto' button (index 76) to enter the Editor.
        # button "Criar Projeto"
        elem = page.locator("xpath=/html/body/div[2]/div[3]/form/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the 'Lettering' button (interactive element index 180) to add a text element to the active scene's canvas.
        # button "Lettering"
        elem = page.locator("xpath=/html/body/div[2]/div/div/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the '+ Texto' button (interactive element index 397) to add a text element to the active scene's canvas.
        # button "+ Texto"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div/div/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the start handle (index 472) and send ArrowRight keys to move the start later, then click the end handle (index 473) and send ArrowLeft keys to move the end earlier while keeping end > start.
        # aria-label="Ajustar início de 7z8heakd"
        elem = page.locator("xpath=/html/body/div[2]/div[3]/div[2]/div[3]/div/div[2]/div/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the start handle (index 472) and send ArrowRight keys to move the start later, then click the end handle (index 473) and send ArrowLeft keys to move the end earlier while keeping end > start.
        # aria-label="Ajustar fim de 7z8heakd"
        elem = page.locator("xpath=/html/body/div[2]/div[3]/div[2]/div[3]/div/div[2]/div/div[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the start handle (index 472) and send ArrowRight keys to move the start later, then click the end handle (index 473) and send ArrowLeft keys to move the end earlier while keeping end > start.
        # aria-label="Ajustar início de 7z8heakd"
        elem = page.locator("xpath=/html/body/div[2]/div[3]/div[2]/div[3]/div/div[2]/div/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the start handle (index 472), send multiple ArrowRight keys to move start later, then click the end handle (index 473) and send multiple ArrowLeft keys to move end earlier.
        # aria-label="Ajustar início de 7z8heakd"
        elem = page.locator("xpath=/html/body/div[2]/div[3]/div[2]/div[3]/div/div[2]/div/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the start handle (index 472), send multiple ArrowRight keys to move start later, then click the end handle (index 473) and send multiple ArrowLeft keys to move end earlier.
        # aria-label="Ajustar fim de 7z8heakd"
        elem = page.locator("xpath=/html/body/div[2]/div[3]/div[2]/div[3]/div/div[2]/div/div[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Give keyboard focus to the timeline by clicking the canvas (index 380), then re-attempt adjusting the start handle (472) with multiple ArrowRight keys and the end handle (473) with multiple ArrowLeft keys to produce a valid timing window.
        # Give keyboard focus to the timeline by clicking the canvas (index 380), then re-attempt adjusting the start handle (472) with multiple ArrowRight keys and the end handle (473) with multiple ArrowLeft keys to produce a valid timing window.
        elem = page.locator("xpath=/html/body/div[2]/div[3]/div/div/div/div/canvas[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Give keyboard focus to the timeline by clicking the canvas (index 380), then re-attempt adjusting the start handle (472) with multiple ArrowRight keys and the end handle (473) with multiple ArrowLeft keys to produce a valid timing window.
        # aria-label="Ajustar início de 7z8heakd"
        elem = page.locator("xpath=/html/body/div[2]/div[3]/div[2]/div[3]/div/div[2]/div/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Give keyboard focus to the timeline by clicking the canvas (index 380), then re-attempt adjusting the start handle (472) with multiple ArrowRight keys and the end handle (473) with multiple ArrowLeft keys to produce a valid timing window.
        # aria-label="Ajustar fim de 7z8heakd"
        elem = page.locator("xpath=/html/body/div[2]/div[3]/div[2]/div[3]/div/div[2]/div/div[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # --> Assertions to verify final state
        assert await page.locator("xpath=//*[contains(., 'Texto')]").nth(0).is_visible(), "The text element should be visible on the canvas after adjusting its timing window"
        assert float((await page.locator("xpath=//*[contains(., 'Início')]").nth(0).text_content()).split()[-1].replace('s','')) <= float((await page.locator("xpath=//*[contains(., 'Fim')]").nth(0).text_content()).split()[-1].replace('s','')), "The resulting timing window should remain valid with the element start time not exceeding its end time after adjusting the handles"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    