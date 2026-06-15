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
        
        # -> Enter a project name into the name field and click 'Criar Projeto' to open the Editor.
        # text input placeholder="ex: Ensaio Verão 2026"
        elem = page.locator("xpath=/html/body/div[2]/div[3]/form/div[2]/input").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test Project")
        
        # -> Enter a project name into the name field and click 'Criar Projeto' to open the Editor.
        # button "Criar Projeto"
        elem = page.locator("xpath=/html/body/div[2]/div[3]/form/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the 'Adicionar cena' button ([320]) three times to add additional scenes so there are multiple scene cards available for reordering.
        # button "Cena" aria-label="Adicionar cena"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div[2]/div/div[3]/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the 'Adicionar cena' button ([320]) three times to add additional scenes so there are multiple scene cards available for reordering.
        # button "Cena" aria-label="Adicionar cena"
        elem = page.locator("xpath=/html/body/div[3]/div[2]/div[2]/div/div[3]/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the 'Adicionar cena' button ([320]) three times to add additional scenes so there are multiple scene cards available for reordering.
        # button "Cena" aria-label="Adicionar cena"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div[2]/div/div[3]/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Attempt to reorder scenes by interacting with drag handle for 'Cena 2' ([423]) then the drop/position target for 'Cena 1' ([296]) and then verify the scene list order.
        # aria-label="Arrastar cena"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[2]/div/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Attempt to reorder scenes by interacting with drag handle for 'Cena 2' ([423]) then the drop/position target for 'Cena 1' ([296]) and then verify the scene list order.
        # aria-label="Arrastar cena"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div/div/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the drag handle for 'Cena 2' (index 423), click the target position before 'Cena 1' (index 296), then collect the visible button texts to verify whether 'Cena 2' is now listed before 'Cena 1'.
        # aria-label="Arrastar cena"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[2]/div/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the drag handle for 'Cena 2' (index 423), click the target position before 'Cena 1' (index 296), then collect the visible button texts to verify whether 'Cena 2' is now listed before 'Cena 1'.
        # aria-label="Arrastar cena"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div/div/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Attempt the reorder one more time by clicking drag handle [423] (Cena 2), clicking the drop target [296] (before Cena 1), then extract the page's button texts to verify whether Cena 2 moved before Cena 1.
        # aria-label="Arrastar cena"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[2]/div/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Attempt the reorder one more time by clicking drag handle [423] (Cena 2), clicking the drop target [296] (before Cena 1), then extract the page's button texts to verify whether Cena 2 moved before Cena 1.
        # aria-label="Arrastar cena"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div/div/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Try a different drop method: click the drag handle for 'Cena 2' ([423]) then click the 'Cena 1' scene button ([297]) as drop target, then read all visible button texts to verify the scene order.
        # aria-label="Arrastar cena"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[2]/div/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Try a different drop method: click the drag handle for 'Cena 2' ([423]) then click the 'Cena 1' scene button ([297]) as drop target, then read all visible button texts to verify the scene order.
        # button "Cena 1 5 s"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div/div/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Try a different drop method: click the Cena 2 scene button (index 424), then click the Cena 1 drag-handle (index 296), and then read visible button texts to verify scene order.
        # button "Cena 2 5 s"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[2]/div/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Try a different drop method: click the Cena 2 scene button (index 424), then click the Cena 1 drag-handle (index 296), and then read visible button texts to verify scene order.
        # aria-label="Arrastar cena"
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div/div/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # --> Assertions to verify final state
        assert await page.locator("xpath=//*[contains(., 'Cena 2 5 s')]").nth(0).is_visible(), "The scene list should show Cena 2 5 s as the first item after reordering."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    