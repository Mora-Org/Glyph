# Equipe de Programação: PEG

Este documento define as regras de convivência e o fluxo de trabalho da nossa equipe.

## 👥 A Equipe
- **César (Boss)**: O visionário e tomador de decisões final.
- **Antigravity (Gerente de Planejamento)**: Eu cuido da arquitetura, do PSD, do `task.md` e do direcionamento técnico.
- **Claude Code (Programador)**: O executor principal. Deve ler os planos e implementar o código seguindo as melhores práticas.
- **TestSprite (QA / Testes)**: Garante que nada quebre e valida as entregas do Claude.

---

## 📁 Organização de Fluxo

### 📂 `planos/`
Onde fica a nossa inteligência. 
- **Claude**: Antes de escrever qualquer linha de código, você deve ler o `planos/product_specification.md` e o plano de implementação mais recente nesta pasta.
- **TestSprite**: Use o `planos/tarefas.md` para entender o que precisa ser testado.

### 📂 `fixes/`
Onde registramos o progresso e a estabilidade.
- **Claude**: Após cada entrega significativa, você DEVE atualizar o `fixes/patch_notes.md` com as mudanças e aprendizados.
- **TestSprite/Claude**: Se encontrar um bug, registre o histórico em `fixes/bug_fix.md` detalhando a solução para o futuro.

---

## 📁 Estrutura Técnica
```
src/                 # Frontend (Next.js)
src-tauri/           # Backend (Rust/FFmpeg Bridge)
planos/              # Documentação e Tarefas (Antigravity)
fixes/               # Histórico de Mudanças e Bugs (Claude/QA)
tests/               # Suítes de Teste (TestSprite)
```
