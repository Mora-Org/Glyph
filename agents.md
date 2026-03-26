# agents.md — Guia de Agentes: PEG

Este documento define as responsabilidades, fronteiras e protocolos de comunicação entre os agentes que constroem o PEG.

---

## Visão Geral da Equipe

```
César (Boss)
  └── Antigravity (Planejamento)
        ├── Claude Code (Programador)
        └── TestSprite (QA)
```

---

## César — Boss

**Papel:** Visionário e autoridade final.

- Define o que deve ser construído e por quê
- Aprova ou rejeita decisões arquiteturais e de produto
- Palavra final em qualquer conflito de direcionamento

---

## Antigravity — Gerente de Planejamento

**Papel:** Cérebro técnico estratégico. Converte a visão do César em planos executáveis.

**Responsabilidades:**
- Mantém `planos/product_specification.md` atualizado
- Cria planos de implementação em `planos/plano_implementacao_YYYY-MM-DD.md`
- Atualiza o backlog em `planos/tarefas.md`
- Define arquitetura, estrutura de pastas e contratos entre módulos
- Não escreve código de produção — apenas especifica

**Artefatos produzidos:**
- `planos/product_specification.md`
- `planos/plano_implementacao_*.md`
- `planos/tarefas.md`

---

## Claude Code — Programador

**Papel:** Executor principal. Transforma planos em código funcional.

**Responsabilidades:**
- Ler os planos antes de qualquer implementação
- Implementar seguindo as boas práticas da stack (TypeScript, Next.js, Tauri, Rust)
- Atualizar `fixes/patch_notes.md` após entregas significativas
- Registrar soluções de bugs em `fixes/bug_fix.md`
- Não tomar decisões arquiteturais sem alinhamento com Antigravity ou César

**Protocolo de trabalho:**
1. Ler `planos/product_specification.md`
2. Ler o plano mais recente em `planos/`
3. Verificar `planos/tarefas.md` para o backlog atual
4. Implementar
5. Atualizar `fixes/patch_notes.md`

**Não fazer:**
- Mudar arquitetura por conta própria
- Adicionar features não especificadas
- Pular etapas de documentação pós-entrega

---

## TestSprite — QA / Testes

**Papel:** Guardião da qualidade. Nada vai para produção sem validação.

**Responsabilidades:**
- Ler `planos/tarefas.md` para entender o escopo de cada entrega
- Escrever e executar testes em `tests/unit/` e `tests/integration/`
- Reportar bugs com contexto suficiente para reprodução
- Validar que a entrega do Claude Code cobre os critérios do plano

**Comandos de teste:**
```bash
npm run test:unit          # Testes de lógica isolada (parsers, cálculos de cena)
npm run test:integration   # Fluxo de exportação com FFmpeg real
```

**Critérios de aceite mínimos por entrega:**
- Cálculo de duração de cenas passa nos testes unitários
- Geração de strings FFmpeg é verificada no teste de integração
- Tauri dev server sobe sem erros

---

## Protocolo de Comunicação entre Agentes

| Situação | Ação |
|---|---|
| Claude tem dúvida arquitetural | Consultar Antigravity (via `planos/`) |
| TestSprite encontra bug | Registrar em `fixes/bug_fix.md`, notificar Claude |
| Claude entrega uma feature | Atualizar `fixes/patch_notes.md`, TestSprite valida |
| Requisito novo ou mudança de escopo | César decide, Antigravity atualiza os planos |
| Conflito entre plano e código existente | Parar, reportar a Antigravity antes de continuar |

---

## Artefatos e Donos

| Arquivo | Dono | Propósito |
|---|---|---|
| `planos/product_specification.md` | Antigravity | Especificação do produto |
| `planos/tarefas.md` | Antigravity | Backlog de tarefas |
| `planos/plano_implementacao_*.md` | Antigravity | Planos de sprint/entrega |
| `fixes/patch_notes.md` | Claude Code | Histórico de mudanças |
| `fixes/bug_fix.md` | Claude + TestSprite | Registro de bugs e soluções |
| `tests/` | TestSprite | Suítes de teste |
| `src/` | Claude Code | Código de produção frontend |
| `src-tauri/` | Claude Code | Código de produção backend |
