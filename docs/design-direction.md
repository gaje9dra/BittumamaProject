# Design Direction

## Design concept

**Research, interpreted.**

The visual language sits at the intersection of rigorous research, intelligent technology, human expertise, and editorial communication. It should feel like a serious knowledge organization with the craft and clarity of a premium digital product.

## Brand personality
- Intelligent without being cold
- Authoritative without being institutional
- Technical without becoming developer-centric
- Academic without resembling a coaching institute
- Human without becoming informal
- Editorial without feeling like a magazine template
- Premium through restraint, precision, and whitespace
- Distinctive through composition rather than decoration

## Core design principles
1. Clarity before decoration.
2. Editorial hierarchy over repetitive grids.
3. Evidence earns visual emphasis.
4. Typography is structural.
5. Whitespace is a system.
6. Technology stays purposeful.
7. Human expertise remains visible.
8. Responsive composition is intentional.
9. Consistency without monotony.
10. Accessibility is part of the aesthetic.

## Layout philosophy

Use a structured editorial grid with controlled asymmetry. Maintain consistent gutters while allowing varied column spans, narrow reading measures, wide research/data compositions, and occasional full-width sections. Use overlap sparingly. Vary content density according to information rather than forcing every page into the same section pattern.

## Typography direction

Final typefaces are deferred to Phase 2.3. The desired character is contemporary, editorial, highly readable, and technically precise. Use strong headline hierarchy without relying on oversized generic hero text. Keep long-form reading comfortable and metadata compact.

## Color direction

Exact values are deferred to Phase 2.2. Use a restrained neutral foundation, a trustworthy primary tone, a selective secondary tone, and a scarce accent for meaningful actions, states, data emphasis, or navigation. Prefer tonal surfaces over gradients. Avoid purple/blue AI gradients, neon accents, glow, and arbitrary color variation.

## Typography System

### 1. Selected fonts
**Display / editorial:** Literata  
**Body / interface:** IBM Plex Sans

Literata supplies the editorial, human, research-oriented voice for major headings and statements. IBM Plex Sans provides a precise, neutral interface layer for body copy, navigation, controls, metadata, tables, and research context. The pairing creates contrast without becoming decorative or resembling a generic SaaS stack.

Both are loaded through `next/font/google` with `display: "swap"`.

### 2. Font weights
Only the weights used by the system are loaded:
- Literata: 400, 500, 600, 700
- IBM Plex Sans: 400, 500, 600

No unnecessary font families, weights, or italic variants are loaded.

### 3. Display hierarchy
Display type is reserved for major editorial statements, hero headlines, important research statements, and meaningful statistics. Literata uses tighter tracking and compact leading to create visual identity through typography itself.

- Display: 3.25rem–6.5rem, fluid, 700, 1.02 leading, -0.035em tracking
- H1: 2.5rem–4.75rem, fluid, 600, 1.12 leading, -0.022em tracking
- H2: 2rem–3.25rem, fluid, 600, 1.12 leading, -0.022em tracking
- H3: 1.5rem–2.25rem, fluid, 600, 1.12 leading, -0.022em tracking
- H4: 1.25rem–1.5rem, fluid, 600, 1.12 leading
- H5: 1.125rem, 600, 1.12 leading

### 4. Body scale
IBM Plex Sans carries reading and interface content:
- Body Large: 1.125rem, 400, 1.65 leading
- Body: 1rem, 400, 1.6 leading
- Body Small: 0.875rem, 400, 1.5 leading
- Caption: 0.75rem, 400, 1.4 leading
- Label: 0.8125rem, 600, 1.35 leading, 0.075em tracking

### 5. UI typography
Navigation uses 0.9375rem / 1.4 with subtle 0.005em tracking. Buttons use 0.9375rem / 1.25 with medium weight. Labels are compact, semantically clear, and slightly tracked. Metadata, breadcrumbs, pagination, and form labels should use the small/label styles rather than bespoke sizes.

### 6. Responsive behavior
The major display and heading levels use fluid `clamp()` sizing. Mobile retains hierarchy rather than simply applying a smaller desktop scale. Desktop can use larger editorial compositions; mobile reduces size while preserving Literata's typographic contrast. Body sizes remain stable enough for comfortable reading.

### 7. Text-width rules
- Display / major headline: target maximum around 22ch
- Section heading: target maximum around 32ch
- Standard reading text: target maximum around 68ch
- Long-form article content: target maximum around 66ch

Widths are semantic constraints, not universal layout widths. Data tables and wide research visualizations may intentionally exceed reading measure when their structure requires it.

### 8. Letter-spacing strategy
Display and headings use restrained negative tracking. Body text stays neutral. Uppercase labels use wider tracking for scanability. Navigation uses only subtle tracking. Wide tracking is not used as a global decorative treatment.

### 9. Typographic rhythm
Spacing should be composed according to content hierarchy rather than a fixed heading/paragraph/button recipe. Eyebrows sit close enough to headings to form one unit; supporting text gets more breathing room; actions follow the informational message naturally. Article headings, paragraphs, subheadings, lists, figures, and captions use distinct rhythm appropriate to reading flow.

### 10. Numbers and data
Important metrics use the display family with strong but restrained scale. A number should always be paired with a meaningful label and, where appropriate, context/source. Charts and tables use IBM Plex Sans for labels and supporting data text so dense information remains legible.

### 11. Accessibility
Body text is never intentionally thin or dependent on low-contrast color. Heading hierarchy is communicated through size, family, weight, leading, spacing, and measure rather than color alone. Text should remain usable when zoomed, and existing visible focus treatment remains mandatory.

### 12. Performance
Fonts are self-contained through Next.js font optimization. Only two families and seven total weights are loaded. `font-display: swap` is configured, and no local unauthorized font assets or third-party runtime font loading is introduced.

## Color System

### 1. Color philosophy
A quiet mineral foundation with a deep botanical primary, warm stone secondary, and restrained terracotta accent. The palette feels knowledgeable and human rather than futuristic for its own sake. Most interfaces remain neutral-first; brand color earns emphasis through hierarchy and context. It deliberately avoids blue/purple AI gradients, neon colors, glow effects, and high-saturation surfaces.

### 2. Primary color
**Deep Pine — #173F3A**
- Purpose: primary actions, key navigation, selected states, important rules, and high-confidence emphasis.
- Scale: 50 #EDF5F2, 100 #DBEAE5, 200 #B8D5CE, 300 #8EB9AE, 400 #5F9589, 500 #39766B, 600 #2F665C, 700 #28544D, 800 #21453F, 900 #1B3935, 950 #0F2522.
- Do not use the scale as decorative fills across every section.

### 3. Secondary color
**Warm Stone — #6B6255**
- Purpose: secondary actions, supporting controls, metadata emphasis, editorial rules, and restrained supporting accents.
- Scale: 50 #F6F3ED, 100 #EBE5DA, 200 #D9CDBB, 300 #C5B49B, 400 #AD9678, 500 #927B5F, 600 #806B53, 700 #695846, 800 #574A3D, 900 #483E34, 950 #29241E.
- Use sparingly beside primary so it remains a supporting voice.

### 4. Accent
**Terracotta — #A34F3F**
- Purpose: a small number of meaningful calls to action, editorial highlights, selected data emphasis, and visual punctuation.
- The accent is scarce and must not become the dominant page color.

### 5. Neutral palette
- Page background: #F7F6F2
- Foreground / primary text: #17211F
- Surface: #FFFFFF
- Muted surface: #EFEEE9
- Interactive surface: #E8E9E3
- Highlighted surface: #E9F0EB
- Border: #D7D7CF
- Input border: #C6C9C1
- Muted text: #5C6561

Neutrals should carry most of the visual area.

### 6. Surface hierarchy
1. Page background #F7F6F2 — default canvas.
2. Section/background surface #EFEEE9 — gentle major-zone separation.
3. Elevated surface #FFFFFF — genuinely raised modules.
4. Interactive surface #E8E9E3 — neutral hover/pressed treatment.
5. Highlighted surface #E9F0EB — research callouts and contextual emphasis.

Reserved dark editorial/research surfaces:
- Dark background #17211F
- Dark foreground #F5F3EC
- Dark surface #22302C
- Dark muted surface #2A3733
- Dark border #43514C
- Dark muted text #B9C1BC

Dark sections require a content reason and should not alternate randomly.

### 7. Text hierarchy
- Foreground #17211F: primary body and heading text.
- Muted foreground #5C6561: secondary text and metadata.
- Primary foreground #FFFFFF: text/icons on primary fills.
- Secondary foreground #FFFFFF: text/icons on secondary fills.
- Accent foreground #FFFFFF: text/icons on accent fills.
- Dark foreground #F5F3EC: primary text on dark surfaces.
- Dark muted text #B9C1BC: supporting text on dark surfaces.

Do not use low-contrast muted text for essential content.

### 8. Interactive states
- Default: semantic base token.
- Hover: a meaningful step within the same family or the interactive surface.
- Active/pressed: deeper brand tone or stronger surface contrast.
- Focus: ring #2F6B60 with a visible 2px outline and offset.
- Disabled: muted surface/text with additional non-color cues; never opacity alone.
- Selected: highlighted surface plus a primary indicator.
- Visited: may use a darker secondary tone; do not introduce a new color family.

### 9. Status colors
- Success: #2F6B4F — positive completion and confirmed states.
- Warning: #9A6A20 — caution, attention, pending review.
- Error: #A33F3F — validation, destructive, or failed states.
- Info: #386779 — neutral informational guidance.

Status colors are muted rather than fluorescent and must be paired with labels, icons, or text.

### 10. Data visualization colors
Categorical set:
1. #173F3A
2. #386779
3. #7B5B8A
4. #A34F3F
5. #9A6A20
6. #58724F

Never rely on color alone. Use direct labels, legends, patterns, markers, position, or line styles as appropriate.

### 11. Gradient rules
Gradients are optional and exceptional. If introduced later, they need a defined purpose such as a single hero artwork, large visual composition, or special research highlight. Keep them low-saturation and subordinate to content.

Never use gradients for every heading, button, card, section background, or decorative blob. Purple/blue AI gradients, neon glow, and gradient text are excluded.

### 12. Accessibility and contrast
The system prioritizes dark text on light neutral surfaces and light text on deep brand fills. Foreground/background pairs must be checked in their actual UI context, especially for small text, buttons, links, form controls, borders, and dark sections.

Borders are structural. If a subtle border is insufficient, increase contrast or add another cue. Focus uses the dedicated ring token and must remain visible on light and dark contexts.

Accessibility also requires semantic HTML, visible focus, readable type, comfortable touch targets, logical reading order, reduced motion, and no color-only communication.

### 13. Usage rules
**Use primary for:** primary actions, selected navigation, strong brand moments, important rules, high-confidence emphasis.

**Use secondary for:** supporting actions, editorial metadata, secondary controls, quiet structural emphasis.

**Use accent for:** a small number of meaningful calls to action, important highlights, and selected research/data emphasis.

**Use neutrals for:** most page area, reading surfaces, section separation, modules, and structural layout.

**Do not:** flood pages with brand color, use accent as generic decoration, make every module a colored card, or introduce raw hex values inside components.

### 14. Semantic implementation
Production UI should consume semantic utilities such as:
- bg-background
- text-foreground
- bg-surface
- bg-surface-muted
- bg-primary
- text-primary-foreground
- bg-secondary
- bg-accent
- text-muted-foreground
- border-border
- ring-ring

Raw color values belong in the token layer, not components.


## Layout & Grid System

### 1. Container system
The production layout uses semantic container widths rather than one universal maximum:
- **Full:** viewport-width composition when content or imagery requires it.
- **Wide:** 80rem maximum for research showcases, visual compositions, and broad multi-column structures.
- **Standard:** 65rem maximum for general page content.
- **Narrow:** 45rem maximum for focused content groups.
- **Reading:** 68ch maximum for long-form reading; article body targets the existing 66ch typographic measure.

Containers always use the shared responsive page gutter. Sections should choose the narrowest container that fits the information rather than stretching content to fill available space.

### 2. Page gutters
Horizontal padding is centralized in `--page-gutter`: 1rem on mobile, 1.5rem from 640px, 2rem from 1024px, and 2.5rem from 1280px. Components should consume this token rather than inventing section-specific viewport padding.

### 3. Grid system
The foundation provides 1-column mobile layouts and semantic 2-, 3-, 4-, 6-, and 12-column structures as space allows. The 12-column grid is reserved for compositions that benefit from finer spans; simpler content should use fewer columns. Grid gaps are tokenized rather than arbitrary.

### 4. Editorial grid
The editorial pattern uses a small supporting rail beside a larger content field on wider screens. It supports an eyebrow, statement, supporting copy, metadata, visual, and CTA without imposing a universal section template. Production sections may alter spans and order according to content priority.

### 5. Asymmetry rules
Controlled 40/60 and 60/40 relationships are available, alongside offset and variable-span compositions. Asymmetry is a rhythm device, not a default. It must preserve hierarchy, reading order, alignment, and content priority. Overlap should be introduced only when it clarifies composition.

### 6. Section widths
Use full-bleed for genuinely immersive visuals or major transitions; wide for research/data compositions; standard for general content; narrow for focused explanatory groups; and reading width for long-form prose. Different sections on the same page may use different widths.

### 7. Vertical rhythm
The spacing foundation uses semantic values: small section 2rem, standard section 3rem, large section 5rem, page-scale section 6–9rem, with component spacing at 1–1.5rem and micro/small spacing at 0.25–0.5rem. These relationships should be adjusted centrally, not replaced with scattered pixel values.

### 8. Content density
Four density modes guide composition:
- **Compact:** metadata, controls, lists, utility content.
- **Standard:** balanced service and general information.
- **Editorial:** more breathing room around important statements and evidence.
- **Immersive:** large visual emphasis with minimal competing information.

Density is selected by information needs, not by page type alone.

### 9. Card strategy
Cards are optional. Use them for grouping, comparison, selection, interaction, or previews. Prefer editorial lists, open typography, numbered findings, tables, horizontal structures, and image-led compositions where a card would only add a wrapper.

### 10. Image composition
The system supports full-bleed, contained, portrait, landscape, square, cropped, offset, and overlapping imagery. Image treatment should be chosen as part of the composition and information hierarchy; imagery must not be inserted merely to fill space.

### 11. Responsive behavior
Mobile prioritizes reading, touch interaction, hierarchy, and simplified composition. Tablet can preserve multi-column relationships where useful. Desktop enables controlled asymmetry and broader research/data structures. Large desktop adds breathing room through max-width constraints rather than endlessly stretching content.

### 12. Mobile collapse rules
Complex desktop relationships collapse according to content priority. A text/visual pair normally becomes text then visual, but visual-first is valid when the visual is the primary information source. Mobile order is deliberate rather than a mechanical stacking rule.

### 13. Article reading width
Long-form content uses a dedicated reading measure: approximately 66–68ch. Titles, metadata, intro, body, subheads, lists, figures, quotations, and references can participate in this measure while data tables or figures may intentionally exceed it when their structure requires additional width.

### 14. Whitespace philosophy
Whitespace is an active structural tool. It separates ideas, establishes hierarchy, gives editorial typography room, and creates focus. Empty space should be intentional; density should increase only when information demands it.

### 15. Section transition philosophy
Sections may transition through whitespace, a tonal surface change, a full-width visual, a fine divider, a typographic shift, an intentional overlap, or another restrained compositional change. Dividers are not required between every section.

### 16. Overflow and layering
Layout primitives use `min-width: 0` where grid children need safe shrinking and reserve horizontal overflow handling for actual compositions. Global `overflow-hidden` is not used as a layout fix. Layering is tokenized from base through content, sticky, navigation, modal, and toast levels (0/10/20/30/40/50).

### 17. Layout primitives
The production CSS exposes semantic primitives including `.layout-section`, `.layout-section-sm`, `.layout-section-lg`, `.layout-section-xl`, `.layout-grid-2/3/4/6/12`, `.layout-editorial`, `.layout-asym-40-60`, `.layout-asym-60-40`, and `.layout-reading`. The existing `Container` component now supports narrow, reading, default, wide, and full sizes.

### 18. Layout playground
A development-only playground is available at `/design-system/layout`. It demonstrates the container, grid, editorial, asymmetry, spacing/rhythm, density, card strategy, image composition, reading width, full-width transitions, and responsive stacking. It is not intended as a public website page.


## Component Visual Language

### 1. Component design philosophy
Reusable components are precise, premium, editorial, modern, human, intelligent, and purposeful. Components establish a common vocabulary without forcing identical shapes or treatments. Visual hierarchy, whitespace, surface contrast, and typography take precedence over decorative effects.

### 2. Button philosophy
Buttons use compact editorial geometry, medium-weight IBM Plex Sans, shared radius tokens, and a minimum 44px-class touch target at standard sizes. Variants are semantic: primary, secondary, outline, ghost, and text. Primary and secondary provide filled emphasis; outline and ghost remain quieter; text actions are used when a full button would overstate the action. Hover/active states change color or surface rather than scale, glow, or rotate. Disabled controls use muted surface/text and explicit non-interactive cues.

### 3. Link philosophy
Inline links use recognizable underline/decoration treatment. Navigation links remain quiet until active or hovered. Editorial/action links may combine restrained underline with directional movement or an arrow. Links never depend on color alone for meaning.

### 4. Card strategy
Cards are selective: bordered, subtle-surface, image-led, interactive, and open/list treatments are available. Rounded corners remain restrained and shadows are not default. Interactive cards may respond through border, surface, underline, arrow, or image changes; no scale, rotation, glow, or 3D treatment is part of the baseline language.

### 5. Badge strategy
Badges and labels are compact information markers for category, status, research type, event type, metadata, or tags. Small radii and tonal surfaces are preferred over excessive pills. Labels remain open text when a badge container adds no informational value.

### 6. Form language
Inputs, textareas, selects, search, and related controls use quiet surfaces, subtle borders, compact radii, readable IBM Plex Sans, and visible focus rings. Labels are uppercase/compact only where useful; helper, error, and success messages remain textual and contextual. Fields are not decorated with unnecessary icons or shadows. Checkbox/radio controls retain native semantics and keyboard behavior.

### 7. Accordion language
FAQ/accordion content uses open horizontal structures and restrained dividers. The question is the interactive heading; expansion is indicated with a simple directional icon. Open content receives vertical breathing room without becoming a floating card. Expansion animation is intentionally left to the motion phase.

### 8. Tabs
Tabs use an open baseline with an active underline/indicator rather than filled colored panels. Default and inactive tabs use muted text, active uses foreground plus primary indicator, and focus remains visibly outlined. Horizontal overflow is permitted on narrow screens where preserving tab labels is preferable to wrapping.

### 9. Navigation language
Navigation controls use the same typography, spacing, border, radius, and focus vocabulary as the rest of the system. Dropdown triggers use simple text plus a directional icon; menu buttons meet touch-target requirements; breadcrumbs use compact text and clear current-location treatment. This phase defines the component language only—the final site header/navigation is not implemented.

### 10. Iconography
Lucide React remains the baseline. Default icon size is 20px, small 16px, large 24px, with approximately 1.75px baseline stroke for emphasized icons. Icons align optically with adjacent text and use roughly 0.5rem spacing in action controls. Decorative icon repetition is avoided; meaningful icons receive accessible names when they are not purely decorative.

### 11. Image treatment
Image treatment follows composition rather than a universal radius: editorial crops may use restrained rounding, framed images use structural borders, contained images preserve breathing room, and full-bleed imagery can remain sharp-edged. Aspect ratio and crop should serve the content. Placeholder visuals in the playground are structural only.

### 12. Borders and dividers
The border token is structural, not decorative. Use horizontal dividers for lists, tables, and intentional section boundaries; vertical dividers for genuinely related columns; input borders for field affordance; card borders only when grouping needs them. Whitespace or surface contrast should often perform separation instead.

### 13. Data/table treatment
Research tables prioritize readable column alignment, semantic table markup, restrained borders, compact labels, and IBM Plex Sans for dense data. Numeric values may use monospace or strong display treatment when useful. Metrics should include a meaningful label and context/source. Mobile tables may scroll horizontally when necessary rather than compressing into unreadable columns.

### 14. CTA hierarchy
Primary CTAs use the primary button treatment and are reserved for the most important next action. Secondary CTAs use outline/secondary treatment. Inline and section CTAs use links when a button would overstate the action. High-emphasis CTAs are created through composition and surrounding whitespace as much as through color. Not every action should be visually dominant.

### 15. Radius strategy
The existing radius scale remains the source of truth. Small controls and fields use the small radius; buttons and cards generally use medium; larger visual containers may use larger radius only when the composition supports it. Pills are reserved for truly categorical/compact markers. Images choose radius based on their composition.

### 16. Shadow strategy
Depth should come first from whitespace, surface contrast, borders, and layering. Shadows are optional and restrained: small shadow for subtle elevation, medium for genuinely raised modules, large only for major overlays. Buttons and ordinary cards do not receive shadows by default.

### 17. Component states
Reusable interactive components use the relevant subset of: default, hover, focus, active, selected, disabled, loading, error, and success. State changes should be understandable through multiple cues where appropriate—not color alone. Loading and async states should preserve layout rather than cause avoidable shifts.

### 18. Responsive behavior
Components adapt to the layout system: buttons may become full-width in selected mobile contexts, navigation controls can transform for mobile, cards can change composition rather than merely shrink, tables can horizontally scroll, and tabs can scroll horizontally. Components should not automatically stack when an intermediate relationship remains useful.

### 19. Accessibility rules
All interactive components require semantic HTML, keyboard access, visible focus, adequate contrast, comfortable touch targets, clear disabled states, and no color-only state communication. Icons that convey meaning have accessible names; decorative icons are hidden from assistive technology. Form errors and success states are textual and associated with their controls where implemented.

### 20. Anti-patterns to avoid
Avoid gradient buttons, glowing controls, hover scaling, excessive pills, universal rounded cards, heavy shadows, decorative icon repetition, arbitrary raw colors/radii/shadows, spreadsheet-like research styling by default, and components whose visual treatment has no information or interaction purpose.

### 21. Component playground
The development-only component playground is available at `/design-system/components`. It demonstrates buttons, links, cards, badges, forms, accordion, tabs, navigation elements, icons, images, dividers, tables, metrics, CTA hierarchy, and representative states. It is a validation surface only and is not part of the public website.

## Image and visual direction

Prioritize research visuals, diagrams, authentic editorial photography, data visualization, original explanatory illustrations, relevant interface screenshots, and typography-led compositions. Photography should favor real people, research activity, workshops, collaboration, and context over generic corporate stock. No Anushram assets will be used.

## Iconography direction

Lucide React is the baseline for functional icons. Keep a consistent stroke language and restrained size hierarchy. Icons should support actions, navigation, status, or comprehension. Do not decorate every heading or label with an icon, and do not mix unrelated icon families.

## Shape language

Use a precise, restrained editorial shape language. Subtle radii can improve usability, but not every surface should be rounded. Use fine borders and dividers selectively for grouping and rhythm. Cards are for genuinely modular content, not a default container for every idea. Use spacing, contrast, and composition before shadows to create depth.

## Motion philosophy

Motion should communicate relationships, state changes, navigation feedback, progressive disclosure, or research/data storytelling. Avoid constant movement, decorative parallax, excessive entrance animation, and interactions that delay information. Respect reduced-motion preferences.

## Responsive philosophy

**Mobile:** deliberately reorder and simplify complex compositions, preserve hierarchy, keep touch targets comfortable, and reduce asymmetry when it harms scanning.

**Tablet:** rebalance columns rather than mechanically stacking everything, preserving editorial relationships where space allows.

**Desktop:** use the full grid for controlled asymmetry, wider research/data compositions, and distinct content zones.

**Large desktop:** increase breathing room rather than stretching reading columns or endlessly enlarging text; use extra space for composition.

## Information hierarchy

Across homepage, services, research, experts, articles, workshops, and contact experiences, the intended sequence is:

1. Primary message
2. Supporting statement
3. Evidence or credibility
4. Detailed information
5. Natural next action

Trust should be built through expertise, authorship, methodology, relevant work, and contextualized outcomes.

## Accessibility principles

- Maintain strong text/background contrast.
- Preserve visible focus states.
- Use semantic HTML and logical heading hierarchy.
- Maintain readable type sizes and line heights.
- Provide comfortable touch targets.
- Never communicate meaning through color alone.
- Respect reduced-motion preferences.
- Give functional icons accessible names when needed.
- Preserve logical reading order in asymmetric layouts.
- Keep decorative imagery non-essential to understanding.

## First-visit experience

**First 5 seconds:** visitors should understand what the organization does, what expertise it represents, and why the information is credible.

**First scroll:** visitors should encounter evidence of substance such as expertise, research signals, people, methodology, or outcomes.

**Service exploration:** services should communicate scope, process, relevance, and expected outcomes before conversion.

**Trust-building:** use evidence rather than exaggerated claims.

**Conversion:** calls-to-action should feel like natural next steps rather than aggressive sales prompts.

## Explicitly prohibited patterns

- Purple/blue AI gradients
- Gradient-heavy typography
- Floating blobs
- Random 3D decorations
- Excessive glassmorphism
- Uniform rounded-card grids
- Repetitive three-column layouts
- Stock-photo-heavy storytelling
- Excessive shadows or borders
- Generic oversized hero statements
- Decorative icons beside every label
- Motion without communicative purpose

## Distinctiveness test

The website should remain recognizable without its logo through its grid, composition, typographic hierarchy, whitespace, evidence-led content emphasis, restrained color relationships, shape discipline, and purposeful interaction.

Before adding a visual treatment, ask: **Does it make the content clearer, more credible, or more memorable?** If not, remove it.

## Phase boundaries

This document is the evolving design contract for the project.

- Phase 2.1: creative direction
- Phase 2.2: production color system
- Phase 2.3: production typography system
- Phase 2.4: production layout, grid, and spacing system

Future phases should build on these tokens rather than creating parallel visual systems.