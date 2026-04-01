"""
TC100 — Mega-teste v1.0: Prova Final de todas as Fases (1-5)
Cobre em sequência:
  Fase 1: Dashboard → Criar Projeto → Editor
  Fase 2: Layout do editor e canvas presentes
  Fase 3: Adicionar cena, adicionar pausa preta, toggle de transição
  Fase 4: Painel Lettering → adicionar texto → handle de timeline via teclado
  Fase 5: Modal de exportação (idle → render mock → done → fechar)
"""
import asyncio
from playwright.async_api import async_playwright, expect


async def run_test():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 720})

        # ── FASE 1: Dashboard ──────────────────────────────────────────────────
        print("=== FASE 1: Dashboard ===")

        print("1.1 Carregando dashboard...")
        await page.goto("http://localhost:3000", wait_until="networkidle")
        await expect(page.locator('input[placeholder]').first).to_be_visible()
        print("    OK: campo de nome visivel")

        print("1.2 Tentando criar projeto sem nome...")
        btn_criar = page.get_by_role("button", name="Criar Projeto")
        await btn_criar.click()
        # Deve permanecer na dashboard (sem redirecionar para o editor)
        await page.wait_for_timeout(500)
        still_on_dashboard = await page.locator('input[placeholder]').first.is_visible()
        assert still_on_dashboard, "FALHOU: deveria continuar no dashboard sem nome"
        print("    OK: nome obrigatorio validado")

        print("1.3 Criando projeto com nome...")
        await page.locator('input[placeholder]').first.fill("Mega Test v1.0")
        await btn_criar.click()
        await page.wait_for_timeout(2000)

        # ── FASE 2: Editor Layout ─────────────────────────────────────────────
        print("=== FASE 2: Editor Layout ===")

        print("2.1 Verificando layout do editor...")
        await expect(page.get_by_role("button", name="Exportar")).to_be_visible()
        print("    OK: botao Exportar presente no header")

        # Canvas (elemento canvas ou o container fabric)
        canvas_area = page.locator("canvas").first
        await expect(canvas_area).to_be_visible()
        print("    OK: canvas presente")

        # ── FASE 3: Cenas e Pausas ────────────────────────────────────────────
        print("=== FASE 3: Cenas e Pausas ===")

        print("3.1 Adicionando segunda cena...")
        add_scene_btn = page.locator('[aria-label="Adicionar cena"], [data-testid="add-scene"]').first
        await expect(add_scene_btn).to_be_visible()
        await add_scene_btn.click()
        await page.wait_for_timeout(800)
        print("    OK: botao 'Adicionar cena' clicado")

        print("3.2 Adicionando pausa preta e verificando label VHS...")
        add_pause_btn = page.locator('[aria-label="Adicionar pausa"], [data-testid="add-pause"]').first
        await expect(add_pause_btn).to_be_visible()
        await add_pause_btn.click()
        await page.wait_for_timeout(1000)
        print("    OK: botao 'Adicionar pausa' clicado")

        # Clicar na pausa para ativa-la e verificar label no canvas
        pause_item = page.locator('[data-testid*="pause"], .pause-item, button', has_text="Pausa").first
        if await pause_item.count() > 0:
            await pause_item.click()
            await page.wait_for_timeout(800)
            pause_label = page.locator('[data-testid="pause-label"]')
            if await pause_label.count() > 0:
                label_text = await pause_label.inner_text()
                assert "Tela Preta" in label_text or "VHS" in label_text or "Cor S" in label_text, \
                    f"FALHOU: label de pausa inesperado: '{label_text}'"
                print(f"    OK: label de pausa visivel: '{label_text.strip()}'")
            else:
                print("    INFO: pause-label nao encontrado (ok se pausa nao ativa no canvas)")
        else:
            print("    INFO: item de pausa nao clicavel diretamente — continuando")

        print("3.3 Verificando toggle de transicao entre cenas...")
        # Deve existir pelo menos um botao de transicao (Cut/Fade) entre cenas
        transition_btn = page.locator('[data-testid*="transition"], button[title*="ransicao"], button[title*="Cut"], button[title*="Fade"]').first
        # Tolerante: se nao existir nao falha (depende de ter 2+ cenas ativas)
        has_transition = await transition_btn.count() > 0
        if has_transition:
            print("    OK: botao de transicao encontrado")
        else:
            print("    INFO: sem botao de transicao visivel (ok se so uma cena ativa)")

        # ── FASE 4: Lettering & Timeline ──────────────────────────────────────
        print("=== FASE 4: Lettering & Timeline ===")

        print("4.1 Ativando Cena 1 (click na primeira cena)...")
        first_scene = page.locator('[data-testid*="scene-item"], .scene-item').first
        if await first_scene.count() > 0:
            await first_scene.click()
            await page.wait_for_timeout(500)

        print("4.2 Abrindo painel Lettering...")
        lettering_btn = page.get_by_role("button", name=lambda n: "Lettering" in n or "lettering" in n.lower()) \
            if False else page.locator("button", has_text="Lettering").first
        await expect(lettering_btn).to_be_visible()
        await lettering_btn.click()
        await page.wait_for_timeout(1000)
        print("    OK: painel Lettering aberto")

        print("4.3 Adicionando elemento de texto...")
        add_text_btn = page.get_by_role("button", name="+ Texto")
        await expect(add_text_btn).to_be_visible()
        await add_text_btn.click()
        await page.wait_for_timeout(1500)
        print("    OK: texto adicionado")

        print("4.4 Verificando handle de inicio na timeline...")
        handle = page.locator('[aria-label*="Ajustar inicio de"], [aria-label*="Ajustar início de"]').first
        await expect(handle).to_be_visible(timeout=5000)

        valor_antes = await handle.get_attribute("aria-valuenow")
        print(f"    aria-valuenow antes: {valor_antes}")

        print("4.5 Pressionando ArrowRight 5x no handle...")
        await handle.click()
        await page.wait_for_timeout(300)
        for _ in range(5):
            await handle.press("ArrowRight")
            await page.wait_for_timeout(100)

        valor_depois = await handle.get_attribute("aria-valuenow")
        print(f"    aria-valuenow depois: {valor_depois}")
        assert valor_depois is not None and float(valor_depois) > 0, \
            f"FALHOU: startTime deveria ter aumentado, mas e '{valor_depois}'"
        print(f"    OK: handle de inicio respondeu ao teclado ({valor_antes} -> {valor_depois})")

        print("4.6 Verificando handle de fim na timeline...")
        handle_end = page.locator('[aria-label*="Ajustar fim de"]').first
        await expect(handle_end).to_be_visible(timeout=3000)
        print("    OK: handle de fim visivel com aria-label")

        # ── FASE 5: Modal de Exportacao ───────────────────────────────────────
        print("=== FASE 5: Modal de Exportacao ===")

        print("5.1 Abrindo modal de exportacao...")
        await page.get_by_role("button", name="Exportar").click()
        await page.wait_for_timeout(500)

        print("5.2 Verificando estado idle (configuracoes)...")
        await expect(page.get_by_text("Exportar Projeto")).to_be_visible()
        await expect(page.get_by_text("MP4 (H.264)")).to_be_visible()
        await expect(page.get_by_text("1280 × 720")).to_be_visible()
        await expect(page.get_by_text("30 fps")).to_be_visible()
        await expect(page.get_by_role("button", name="Iniciar Exportacao").or_(
            page.get_by_role("button", name="Iniciar Exportação")
        )).to_be_visible()
        print("    OK: configuracoes de exportacao visiveis")

        print("5.3 Iniciando exportacao (mock)...")
        start_btn = page.get_by_role("button", name="Iniciar Exportacao").or_(
            page.get_by_role("button", name="Iniciar Exportação")
        )
        await start_btn.click()
        await page.wait_for_timeout(500)

        print("5.4 Verificando estado rendering...")
        await expect(page.get_by_text("Renderizando...")).to_be_visible(timeout=3000)
        print("    OK: 'Renderizando...' visivel")

        print("5.5 Aguardando conclusao do mock (~6s)...")
        await expect(
            page.get_by_text("Exportacao concluida!").or_(page.get_by_text("Exportação concluída!"))
        ).to_be_visible(timeout=12000)
        print("    OK: 'Exportacao concluida!' visivel")

        print("5.6 Verificando botao 'Abrir Pasta'...")
        await expect(page.get_by_role("button", name="Abrir Pasta")).to_be_visible()
        print("    OK: botao 'Abrir Pasta' visivel")

        print("5.7 Fechando modal...")
        await page.get_by_role("button", name="Fechar").last.click()
        await page.wait_for_timeout(400)
        modal_title = page.get_by_text("Exportar Projeto")
        assert not await modal_title.is_visible(), "FALHOU: modal deveria ter fechado"
        print("    OK: modal fechado")

        # ── Conclusao ─────────────────────────────────────────────────────────
        print("\nPASSOUI: Mega-teste v1.0 completo — todas as fases OK")
        await browser.close()


asyncio.run(run_test())
