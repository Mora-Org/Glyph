
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** PEG
- **Date:** 2026-03-26
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC002 Project name is required when creating a project
- **Test Code:** [TC002_Project_name_is_required_when_creating_a_project.py](./TC002_Project_name_is_required_when_creating_a_project.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e00e51ec-42a5-429e-ae65-5f8bd6494642/bfe2e62e-89f5-4885-a538-7ff5096a17ac
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Reorder scenes via drag-and-drop in the scene list
- **Test Code:** [TC011_Reorder_scenes_via_drag_and_drop_in_the_scene_list.py](./TC011_Reorder_scenes_via_drag_and_drop_in_the_scene_list.py)
- **Test Error:** Scene reordering could not be fully verified because it was not possible to create a second scene or perform a drag-and-drop reorder using the visible interactive controls.

Observations:
- The project 'Projeto Reorder Test' was successfully created and the scene list area is visible.
- Only one scene is visible on the horizontal scene list: 'Cena 1'.
- No interactive '+ Cena' button was found in the page's interactive elements (only a '+ Pausa' button is indexed).
- There is an element with role=button and aria-label 'Arrastar cena' (index 124), indicating a drag handle exists, but no means to perform or confirm a drag-and-drop reorder was available via the visible controls.
- Because a second scene could not be added from the available indexed controls, a reorder could not be attempted or verified visually.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e00e51ec-42a5-429e-ae65-5f8bd6494642/334ea39a-793a-4b02-a554-0de69949d231
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020 Open the Lettering panel from the editor header
- **Test Code:** [TC020_Open_the_Lettering_panel_from_the_editor_header.py](./TC020_Open_the_Lettering_panel_from_the_editor_header.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e00e51ec-42a5-429e-ae65-5f8bd6494642/0d527a79-b210-4cf8-8f7f-b57224e0f38f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021 Add text, style it, animate it, and split into individual characters
- **Test Code:** [TC021_Add_text_style_it_animate_it_and_split_into_individual_characters.py](./TC021_Add_text_style_it_animate_it_and_split_into_individual_characters.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e00e51ec-42a5-429e-ae65-5f8bd6494642/b44036b2-146e-4e54-bf24-311de7377151
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022 Prevent adding text when no active scene is selected
- **Test Code:** [TC022_Prevent_adding_text_when_no_active_scene_is_selected.py](./TC022_Prevent_adding_text_when_no_active_scene_is_selected.py)
- **Test Error:** The app did not prompt the user to select or create an active scene before adding text. A text element was added directly to the canvas instead.

Observations:
- The '+ Texto' control in the Lettering panel was clicked.
- A large "Texto" element appears on the canvas immediately after clicking.
- The timeline shows an active scene named "Cena 1".
- No modal, validation message, or prompt appeared asking to select or create an active scene.
- Lettering controls are visible and editable.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/e00e51ec-42a5-429e-ae65-5f8bd6494642/b5020820-5d8b-4b23-9b2e-717011fe30e1
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **60.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---