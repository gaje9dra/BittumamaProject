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


## Header & Primary Navigation

### Philosophy
The production header extends the Phase 2 system through alignment, typography, spacing, hierarchy, accessibility, and restrained state changes. It remains visually quiet and usable while scrolling rather than relying on decorative effects.

### Scroll strategy and states
The header uses **sticky positioning** in normal document flow. This avoids layout jumps while keeping navigation available as content moves. A lightweight client shell observes scroll position only to distinguish the top and scrolled states.

- **Top:** full 4rem mobile / 4.5rem desktop height, neutral background, structural border, normal hierarchy.
- **Scrolled:** same geometry and navigation availability, with a restrained shadow for separation. The header never disappears.
- **Threshold:** 12px of scroll before the state changes, preventing jitter from tiny movements.
- No scroll hiding, scroll hijacking, smooth-scroll engine, continuous interpolation, or large transform is used.

The scroll listener is passive and schedules at most one animation-frame update at a time. React state changes only when the boolean scroll state actually changes.

### Structure
- Brand area: temporary typographic **Bittumama** treatment until a final logo asset exists.
- Primary navigation: Services, Research & AI, Experts, Insights, About.
- Header action: a single restrained **Get in touch** action.
- Mobile: dedicated menu trigger and independently scrollable navigation panel.
- Navigation data lives in data/navigation.ts; route matching is shared through lib/navigation.ts.

### Desktop behavior
Desktop navigation begins at the established 1024px breakpoint. Active routes use foreground emphasis, medium weight, an understated primary indicator, and aria-current="page". Matching normalizes query/hash portions and trailing slashes, and nested paths activate their parent destination. Hover uses color feedback only; focus remains visibly outlined.

The header uses the global wide container and page-gutter tokens. Link spacing is defined at the navigation level rather than through per-item margin exceptions.

### Mobile behavior
Below 1024px the desktop navigation is replaced by a dedicated 44px-class menu trigger. The mobile panel is fixed beneath the 4rem header, fills the remaining viewport, scrolls independently, and keeps the CTA available after navigation content. It is a navigation environment rather than a compressed desktop row.

Mobile links share the same active-route matcher and expose aria-current="page". Each link closes the menu. The menu does not rely on hover behavior.

### Mobile menu state and body scroll
Opening mounts the panel, locks body scrolling, and compensates for an existing scrollbar to avoid a horizontal layout shift. Focus moves to the first navigation control. Escape closes the menu. While open, Tab/Shift+Tab is contained within the menu controls. Closing restores the previous body overflow/padding values and returns focus to the trigger.

The panel has a restrained enter/exit transition. A short closing window keeps the exit animation from being cut off by immediate unmounting. Resize to desktop closes the menu, preventing stale mobile state during breakpoint changes or orientation changes.

### Dropdown behavior
No dropdown or mega-menu is currently required by the established information architecture, so none is fabricated in this phase. The navigation data model remains intentionally small and can support grouped destinations later. Any future expandable navigation must use tap/keyboard interaction, explicit expanded state, Escape, predictable focus, and restrained motion rather than hover-only behavior.

### Anchor navigation
A .scroll-anchor primitive provides a 5rem scroll offset for future hash-linked sections so sticky navigation does not cover their headings. It is opt-in rather than applied to every element with an id.

### Responsive strategy
The header uses the shared page gutter and changes to mobile navigation before desktop links become crowded. It is intended to remain usable across large desktop, standard/small desktop, tablet, large/standard/small/very-narrow mobile, and landscape mobile widths. The layout does not depend on shrinking navigation text to solve crowding.

### Header variants
No transparent, dark-context, or alternate header variant is implemented yet. The default neutral header is the only justified variant until future page compositions demonstrate a real need. If variants are introduced later, they must preserve the same typography, spacing, navigation logic, motion, and accessibility.

### Motion behavior
Header scroll separation, link states, and menu transitions use the Phase 2.6 motion tokens. Scroll state uses only a subtle shadow; menu open/close uses a small opacity/vertical movement. No bounce, glow, blur-heavy glass effect, large transform, animated gradient, or persistent motion is used.

### Reduced motion
The global prefers-reduced-motion: reduce rules minimize transitions and animations and remove transforms. Semantic state communication remains intact: active routes, focus, expanded state, and menu availability do not depend on motion.

### Accessibility
The header uses semantic header and nav landmarks, native links/buttons, accessible menu labels, aria-expanded, aria-controls, and aria-current where applicable. Keyboard navigation is supported without hover-only functionality. Focus is moved into the mobile menu on open, contained while open, and restored to the trigger on close. Touch controls meet the 44px-class target.

### Z-index and layering
The sticky shell uses the existing --layer-navigation token. The mobile menu uses the existing modal-level token so it remains above page content without introducing arbitrary z-index values. No new stacking framework is introduced.

### Performance considerations
The scroll-aware client boundary is limited to the header shell. It uses one passive listener, one animation-frame gate, one boolean state, and no layout measurements or DOM queries during scrolling. Static header composition remains server-rendered; only pathname/menu/scroll interactions require client components.

### Component architecture
- components/layout/header.tsx: server-rendered header composition.
- components/layout/header-scroll-shell.tsx: minimal client boundary for sticky scroll state.
- components/layout/desktop-nav.tsx: pathname-aware desktop active state.
- components/layout/mobile-nav.tsx: mobile menu, focus management, body scroll lock, and active state.
- components/layout/header-actions.tsx: reusable header action area.
- data/navigation.ts: structured navigation data.
- lib/navigation.ts: shared, normalized route matching.
- app/design-system/header/page.tsx: development-only validation playground.

### Navigation dropdown and mega-menu foundation
The current production navigation remains direct-link based because the established information architecture does not yet contain enough real child destinations to justify turning a header category into a dropdown or mega menu. No artificial production menu content is introduced.

The navigation data model now supports four conceptual types: `link`, `dropdown`, `grouped`, and `mega`. Optional descriptions, children, groups, featured destinations, external-link metadata, and lightweight metadata can be added only when future pages establish a real need.

### Dropdown behavior
`NavigationDropdown` provides the reusable simple-dropdown foundation. It uses a button trigger with `aria-expanded`, `aria-haspopup="menu"`, and `aria-controls`. The panel is content-sized rather than given a giant fixed width. Content uses the existing surface, border, typography, spacing, radius, and shadow tokens.

Pointer interaction is click-based rather than hover-only. Outside pointer interaction closes the panel. Keyboard support includes Enter, Space, Arrow Down, Arrow Up, Home, End, and Escape. Escape restores focus to the trigger. Arrow/Home/End behavior is intentionally limited to the open menu links.

### Grouped and mega-menu structure
`NavigationMegaMenu` provides the future multi-column foundation. It consumes the shared 12-column grid, page gutter, wide container, semantic navigation types, active-route matching, and optional featured destination. It does not introduce a separate grid, decorative card system, or promotional visual treatment.

The production header does not currently activate this foundation. A mega menu should be enabled only after real information architecture establishes multiple meaningful groups that cannot be scanned effectively as direct links or a simple dropdown.

### Development navigation playground
The development-only `/design-system/navigation` surface demonstrates the reusable dropdown and multi-group mega-menu structures with clearly marked interaction fixtures. These fixtures are validation content only and are not exposed through production navigation.

### Mobile navigation architecture
Desktop dropdowns and future mega menus do not become oversized mobile overlays. The existing mobile navigation remains a separate, scrollable navigation surface. Its architecture can be extended to a category → destination flow with a local active submenu and explicit Back control when real nested destinations are introduced. The mobile menu's existing focus containment, Escape behavior, body-scroll lock, active states, and resize handling remain the source of truth.

### Stacking and alignment
Navigation panels use the existing `--layer-modal` level rather than arbitrary z-index values. Dropdowns are positioned from their trigger context, while future full-width mega menus should be anchored to the header/container context rather than arbitrary viewport offsets. Menus must remain inside the viewport and use the established container and gutter system.

### Motion and reduced motion
Dropdown and mega-menu panels use the Phase 2.6 motion language: restrained opacity and small positional entry, quick exit, no blur-heavy animation, bounce, spring physics, scaling spectacle, or continuous motion. The global reduced-motion rules minimize the transitions and remove transforms while preserving state communication.

### Performance and client boundaries
Interactive dropdown/mega-menu triggers are isolated client components. Static navigation configuration remains plain data, and the server-rendered Header is not converted into a global client component. No global state library, API, database, custom routing framework, pointer-tracking system, or additional dependency is introduced.

## Motion & Interaction Language

### 1. Motion philosophy
Motion reinforces hierarchy, spatial relationship, state change, interaction feedback, navigation, continuity, progressive disclosure, and content arrival. If movement does not communicate one of these relationships, it should not be added. The default feeling is calm, precise, editorial, responsive, intelligent, and subtle.

### 2. Motion hierarchy
- **Instant — 80ms:** immediate acknowledgement where delay would feel unnecessary.
- **Fast — 140ms:** links, hover states, compact controls, directional cues.
- **Normal — 220ms:** primary component state transitions.
- **Slow — 360ms:** larger state changes or meaningful interface transitions.
- **Reveal — 520ms:** editorial content arrival and slower image response.

These are semantic tokens, not a requirement that every interaction use animation.

### 3. Easing
Standard easing is `cubic-bezier(0.2, 0, 0, 1)` for predictable interface transitions. Emphasis easing is `cubic-bezier(0.16, 1, 0.3, 1)` for restrained editorial arrival. Linear is reserved for genuinely continuous progress indicators. Spring physics are not part of the baseline system.

### 4. Movement scale
Default movement distances are deliberately small: 4px, 10px, and 20px. Hover lift is limited to approximately 4px and optional. Hover scale is capped around 1.015 for exceptional cases rather than used as a standard card behavior.

### 5. Interaction feedback
Buttons respond through background, text, and border changes. Links may use underline or a small directional movement. Interactive cards may change border/surface, lift slightly, move an arrow, reveal content, or move an image. Inputs transition into their focus state. Navigation communicates active location through persistent styling rather than animation.

### 6. Content reveal
Editorial content can use a restrained opacity + small vertical movement or clip reveal when content arrival benefits comprehension. Staggering is limited and sequential; it should establish reading order rather than become a spectacle.

### 7. Image motion
Images may respond with a slow, very small scale movement when the image is interactive and the movement clarifies pointer relationship. Image motion is slower than control feedback. Static images should not animate simply because they are visible.

### 8. Progressive disclosure
Accordions and similar controls should communicate open/closed state clearly. Directional icons can rotate subtly to reinforce the relationship. Expansion choreography remains subordinate to content.

### 9. Navigation
Navigation should feel stable. Active state, focus, selected state, and menu availability carry most of the communication. Avoid animated navigation that delays access to content.

### 10. Loading and status
Loading indicators should preserve layout and communicate progress without celebratory or alarming motion. Success and error states should primarily use text, iconography, surface, and status color. Avoid confetti, bouncing, shaking, flashing, or other attention-seeking effects.

### 11. Reduced motion
All motion utilities and choreography must respect `prefers-reduced-motion`. The foundation minimizes transitions and animations, disables transforms, and keeps content immediately understandable. Future component motion must follow the same requirement.

### 12. Motion boundaries
Do not use scroll-jacking, large parallax effects, floating blobs, particle fields, animated gradients, glowing effects, excessive morphing, 3D transforms, bouncing cards, spinning controls, exaggerated spring physics, or constant decorative movement.

### 13. Implementation tokens
Motion tokens live in the global design system: `--motion-instant`, `--motion-fast`, `--motion-normal`, `--motion-slow`, `--motion-reveal`, standard/emphasis/linear easing, 4/10/20px distances, and a restrained 1.015 hover scale. Components should consume these tokens rather than introduce arbitrary durations or curves.

### 14. Motion playground
The development-only motion playground is available at `/design-system/motion`. It demonstrates timing/easing tokens, button/link/card/image responses, content reveal, accordion disclosure, navigation feedback, loading/status philosophy, and reduced-motion boundaries. It is a design-validation surface and not a public website page.

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
- Phase 2.5: component visual language
- Phase 2.6: motion and interaction language

Future phases should build on these tokens rather than creating parallel visual systems.

## Header utility layer — Phase 3.4

### Utility philosophy
The Header separates **where visitors can go** (primary navigation) from **supporting actions** (utility layer). Utility controls remain compact and visually secondary so the primary navigation retains the strongest hierarchy.

### Search strategy
Search is justified by the future content model: research, articles, services, experts, and resources will eventually need discovery. This phase establishes only the frontend interaction foundation. There is no database, CMS, API, indexing, analytics, AI search, or external search service.

### Search trigger and panel
The reusable SearchTrigger uses Lucide Search, a compact 44px-class touch target, visible focus, selected/open treatment, and an accessible name. On desktop it sits beside the existing contact action. The SearchPanel uses the established neutral/surface system rather than a persistent SaaS-style search bar or decorative overlay.

The panel contains a semantic search input, accessible label, Search icon, clear action when text exists, close action, submit action, and a small future-integration note. Empty input does not navigate. Non-empty submission uses the standard /search?q= URL mechanism.

### Search route
/search is a minimal frontend route foundation only. It contains no fabricated results and no search indexing. Future content/search phases can replace the placeholder with real result retrieval without changing the Header interaction contract.

### Search interaction
Opening Search moves focus to the input. Escape and the close action close the panel. Clearing returns focus to the input. Closing restores focus to the Search trigger. Clicking outside the desktop overlay closes it. Desktop search and navigation dropdowns naturally dismiss each other through their existing outside-interaction behavior, preventing competing open surfaces.

### Mobile utility behavior
Mobile keeps a single search interface inside the existing navigation panel. Search does not become a second competing full-screen overlay. Opening Search focuses the input; Escape closes Search while keeping the mobile navigation available; closing restores focus to the Search trigger. The existing mobile menu scroll lock and focus containment remain in place.

### Utility hierarchy
The existing Get in touch action remains the only primary header CTA. Search is a secondary utility action. No language/region selector, accessibility shortcut, newsletter control, login, or other utility was added because the current information architecture does not establish a genuine requirement for them.

### Responsive behavior
Desktop keeps the utility layer compact and aligned with the existing header grid. Mobile prioritizes brand, menu trigger, and search within the navigation surface. The implementation avoids shrinking controls below comfortable touch targets and avoids adding horizontal overflow.

### Accessibility
Search uses semantic buttons, a labeled search input, visible focus treatment, keyboard Escape handling, Enter submission, keyboard-accessible clear/close actions, and logical focus restoration. Search is not hover-dependent. Existing mobile focus containment, Escape behavior, body-scroll restoration, active navigation, and reduced-motion rules remain intact.

### Z-index and scroll behavior
Desktop SearchPanel uses the existing modal layer token and anchors below the known Header heights rather than introducing arbitrary z-index values. It does not lock body scroll because it is a compact header panel rather than a full-screen modal. Mobile search stays inside the already scroll-locked mobile navigation.

### Motion
Search opening uses the Phase 2.6 motion-fade treatment and existing micro/fast timing tokens. Hover/focus feedback uses the existing motion language. No new animation style, spring physics, blur, glow, or decorative movement was introduced.

### Server/client boundaries
The main Header remains server-rendered. SearchTrigger/SearchPanel and HeaderActions are isolated client components because they own local interactive state. Mobile search state remains local to MobileNav. No global state library was introduced.

### Future integration
The current form contract intentionally leaves search retrieval open: future phases can connect /search?q= to the site's content architecture, indexing strategy, filters, ranking, pagination, and analytics. The Header should continue to treat search as a discovery utility rather than turning it into a dominant navigation surface.

## Header & Navigation — Phase 3.5 final integration

### Production integration
The Header is now mounted once in the root App Router layout, making it the global site navigation rather than a development-only composition. Development header/navigation playgrounds rely on this same global instance and do not render duplicate headers.

### Final hierarchy
The global header follows a restrained hierarchy: Bittumama brand first, primary navigation second, compact Search utility third, and the single primary Get in touch action last. Mobile replaces the desktop navigation/actions with one menu trigger and keeps Search inside that navigation surface.

### Responsive behavior
The header uses shared --header-height and --header-height-lg tokens for the sticky shell, mobile panel, search overlay, and future content-offset behavior. Desktop navigation spacing reduces at the base large breakpoint and expands at extra-large widths. Crossing the 1024px breakpoint closes desktop surfaces and mobile navigation surfaces so hidden menus do not persist across viewport changes.

### Surface coordination
Search, simple dropdowns, mega menus, and the mobile menu use a small shared header-surface event contract. Opening one mutually exclusive surface closes another where appropriate. Route changes close open surfaces, and resize transitions prevent stale overlays from surviving a breakpoint change.

### Dropdown and mega-menu strategy
Dropdown and mega-menu structures remain data-driven and are not populated with artificial production destinations. Navigation dropdowns use normal navigation links with disclosure buttons rather than application-menu ARIA semantics. Mega-menu positioning is anchored to the global header context so a future genuine multi-group navigation can span the header width while retaining the established wide container and page gutters.

### Search utility
Search is a named search landmark with a labeled search field, clear/close actions, keyboard Escape handling, controlled aria-expanded/aria-controls, focus restoration, outside-click dismissal on desktop, and client-side navigation to the future /search?q= contract. No search results, indexing, backend, CMS, or analytics are introduced in this phase.

### Mobile behavior
The mobile panel is a dedicated scrollable navigation surface with body-scroll locking, focus containment, active-route states, explicit nested-navigation Back behavior, Search within the panel, and a single primary CTA. Escape closes Search first, then a nested submenu, then the entire mobile menu. Route changes close the menu. The panel uses the same header-height and spacing tokens as the global header.

### Accessibility final rules
Semantic header, nav, links, buttons, and search landmark semantics are preferred over unnecessary ARIA roles. Interactive disclosures expose aria-expanded and aria-controls. Active links expose aria-current. Keyboard focus remains visible, dropdown Escape restores trigger focus, mobile menu focus is contained while open and restored after close, and Search focuses its input on open and restores the trigger on close. Reduced-motion rules continue to remove transforms and minimize transitions.

### Performance and implementation conventions
The root Header remains a Server Component. Client boundaries are limited to pathname-aware navigation, local menu/search state, and the minimal scroll-state shell. Surface coordination uses a lightweight browser event contract rather than global state. Scroll handling remains passive and animation-frame gated; resize/listener effects are cleaned up. No new dependency was introduced and the locked technology versions remain unchanged.

### Final validation surface
The development-only header and navigation playgrounds are the canonical manual verification surfaces for top/scrolled state, active routes, dropdowns, mega-menu geometry, mobile navigation, Search, focus behavior, resize/orientation changes, long labels, and reduced motion. They remain development references and are not part of the production information architecture.

## Homepage Creative Direction — Phase 4.1

### Narrative role
The homepage is structured as an editorial introduction rather than a directory. Its provisional narrative moves from identity and positioning into capabilities, research/intelligence, human expertise, insights, and a natural contact action. Each section has a distinct information job so the page does not become a repeated card grid.

### Section architecture
The production route remains the existing App Router marketing route at `/`. The foundation is split into meaningful visual sections: Hero, Positioning, Capabilities, Research & Intelligence, Human Expertise, Insights, and closing CTA. Detailed service, research, expert, article, event, and CMS content remains outside this phase.

Homepage content is centralized in `data/homepage.ts` so later CMS/API work can replace the content source without duplicating copy across presentation components. Current copy is explicitly provisional and should be replaced when final organizational positioning is established.

### Composition and grid
The hero uses a two-zone editorial composition: a wide typographic message and a deliberately framed visual placeholder. Subsequent sections alternate between editorial split layouts, numbered horizontal rows, full-width tonal fields, image-led composition, and restrained article rows. The page intentionally avoids a repeated section → three cards rhythm.

Existing container, page-gutter, section-spacing, grid, border, radius, typography, and color tokens are reused. No parallel homepage design system or arbitrary color palette was introduced.

### Typography
Typography carries the primary visual hierarchy. The hero uses the established display scale with a constrained reading measure; section headings use the existing Literata-based heading hierarchy; labels and metadata use the established IBM Plex Sans interface scale. Numeric markers and compact metadata create structure without decorative treatment.

### Imagery
No fabricated organizational photography or external stock assets were introduced. The hero and expertise areas establish stable aspect-ratio/crop zones using restrained visual placeholders. These slots are designed to accept authentic research, fieldwork, people, educational, or explanatory imagery later without changing the surrounding composition.

### Responsive strategy
Desktop uses controlled asymmetry and wider editorial relationships. Tablet rebalances columns at the existing breakpoints. Mobile intentionally stacks and simplifies the compositions, preserves heading-to-supporting-copy order, keeps links comfortably tappable, and removes unnecessary horizontal density rather than mechanically shrinking desktop layouts.

### Motion philosophy
Phase 4.1 establishes motion locations rather than heavily animating the homepage. Future implementation may use the existing motion system for hero/content arrival, image reveal, subtle interactive image response, and research/data storytelling. No scroll-jacking, perpetual motion, decorative parallax, cursor tracking, glow, or animated gradients were introduced.

### Accessibility
Homepage sections use semantic `section` elements with labelled headings, logical heading levels, meaningful destination links, visible focus states, readable measures, and non-essential visual placeholders that do not carry required information. The structure remains compatible with the existing reduced-motion rules and keyboard conventions.

### Phase boundary
Phase 4.1 establishes the homepage creative and structural foundation only. Backend, database, Prisma, authentication, CMS, payments, AI services, search indexing, service detail pages, article management, events, dashboards, and other content systems remain deferred to later phases.

## Homepage Hero — Phase 4.2

### Final direction
The hero is an art-directed editorial composition rather than a centered SaaS-style landing pattern. A seven-column typographic field carries the primary message while a four-column research-signal visual creates a deliberately offset counterweight. The composition uses whitespace, alignment, rules, and scale as the main visual devices.

### Content
Hero content remains centralized in `data/homepage.ts`. The production-facing provisional message now explicitly describes research, intelligent technology, education, and applied expertise rather than relying on abstract future-facing language. The content is still replaceable without changing the hero component structure.

### Visual treatment
The hero visual is an explicitly illustrative research-signal placeholder built as a lightweight inline SVG. It is labelled as illustrative and does not imply real organizational data or photography. This avoids fabricated imagery while establishing the intended relationship between evidence, technology, and editorial composition. No gradients, glassmorphism, stock photography, 3D objects, glow, or decorative blobs were introduced.

### CTA hierarchy
One filled primary action leads into the research experience. A secondary text action leads to experts. Both use the existing Phase 2.5 interaction language and remain compact enough to belong to the editorial composition rather than behaving like oversized SaaS controls.

### Responsive behavior
Desktop preserves the asymmetric seven/four-column relationship. Tablet and mobile collapse the composition into a readable sequence: message and actions first, then the research visual. The visual uses a bounded aspect ratio and minimum height so it remains substantial without creating excessive mobile hero height. The bottom metadata/scroll cue remains a compact horizontal rule and is allowed to wrap naturally on narrow screens.

### Motion and accessibility
The hero uses existing transition tokens only for CTA feedback; no decorative entrance choreography was added. The inline SVG has an accessible title and description explaining that the visualization is illustrative. The primary H1 is semantic, links have descriptive labels, focus states remain visible, and the scroll cue targets the existing homepage positioning section. Reduced-motion behavior therefore remains inherited from the existing foundation without introducing an alternative animation path.

### Performance
The hero uses no client component, no new dependency, no remote asset, no video, and no large image payload. The visual is inline SVG and the composition is server-rendered. This keeps the above-the-fold surface lightweight and avoids layout shifts associated with unknown image dimensions.


## Homepage Intro / Positioning — Phase 4.3

### Purpose
The Intro/Positioning section bridges the hero into the deeper organization story. It answers who the organization is, what connects its disciplines, and why the work is useful without repeating the hero headline or becoming a generic About block.

### Composition
The section uses a 12-column editorial arrangement: a compact section index, a six-column positioning statement, and a separate supporting-copy/action column. A ruled navigation index follows below, creating a second rhythm without relying on cards or a centered marketing block.

### Typography and hierarchy
The positioning statement receives the strongest emphasis through the existing Literata heading hierarchy and a constrained measure. Supporting copy uses the established IBM Plex Sans body scale. The section label, numbered destinations, and rules provide structure without decorative UI.

### Content hierarchy
The content moves from section context to the core positioning statement, then explanation and a secondary About link, followed by four clear areas visitors can explore. Copy remains centralized in `data/homepage.ts` and can be replaced later without changing layout code.

### Responsive behavior
Desktop preserves the editorial column relationship. Smaller screens move from label to statement to explanation/action and then the destination index in a clear reading order. The index retains comfortable touch targets and avoids horizontal overflow.

### Relationship to hero
The hero remains the visually dominant first statement; this section deliberately becomes calmer and more text-focused. It uses whitespace, rules, and an editorial index instead of another large visual or hero-like treatment, creating a natural transition into the remaining homepage story.


## Homepage Core Capabilities — Phase 4.4

### Purpose
The Core Capabilities section answers “what does this organization actually do?” at overview level. It connects the positioning section to future research, services, and expertise experiences without attempting to replace those detailed architectures.

### Capability architecture
The section uses the four capability areas already established in the homepage content model: Research, Intelligence, Education, and Applied expertise. Each item supports an index, title, concise description, and future-facing route without introducing an invented taxonomy or arbitrary ranking.

### Layout strategy
A 12-column editorial layout places the section context on the left and a large indexed capability list on the right. The list uses horizontal rules, typography, spacing, and a restrained directional control rather than cards or repeated icon blocks. All capabilities retain equal structural weight.

### Interaction strategy
Capability rows are semantic links. Hover/focus feedback changes the surface, text emphasis, and directional marker using existing motion tokens. No essential information is hover-only and no client component is required.

### Responsive behavior
The desktop two-zone composition becomes a clear stacked introduction followed by the full capability list on smaller screens. Descriptions remain visible, controls retain comfortable touch targets, and the layout does not depend on horizontal scrolling or hover interaction.

### Visual relationship to previous sections
The hero remains the strongest visual statement, while the Intro/Positioning section is quieter and text-led. Core Capabilities introduces a more structured, tonal field and a larger typographic list, creating rhythm without repeating the hero or positioning composition.


## Homepage Research & Intelligence — Phase 4.5

### Purpose
The Research & Intelligence section demonstrates a research mindset without claiming unpublished findings, credentials, statistics, clients, awards, or other evidence that has not been established. It moves the homepage from capability (“what we do”) toward method and knowledge production (“how we investigate and understand”).

### Editorial composition
A deep primary surface creates contrast with the lighter Core Capabilities section. The composition uses a five-column research statement beside a seven-column featured research frame, followed by a four-part indexed research-methodology strip and a restrained illustrative geometry panel. It avoids a three-card article grid and dashboard treatment.

### Research content hierarchy
The section leads with the research/intelligence proposition, then a clearly labelled development foundation that can later be replaced by an authentic featured study. The supporting frame is organized around Questions, Methods, Signals, and Application rather than invented research topics or metrics. The data model is centralized in `data/homepage.ts`.

### Visual/data strategy
The lower visual is abstract information geometry, explicitly labelled as non-organizational data. It establishes the intended visual vocabulary for future evidence-led content without presenting fake statistics, charts, findings, or numerical claims.

### Responsive behavior
Desktop uses the asymmetric statement/featured-frame relationship. Tablet and mobile move into a sequential reading flow: proposition, featured research frame, research themes, then visual geometry. Metadata stays concise and the illustrative visual remains bounded so it does not overwhelm mobile content.

### Interaction behavior
The featured research frame and research CTA are semantic links. Existing motion tokens provide only subtle directional feedback. No essential information depends on hover, no client-side state is required, and reduced-motion behavior remains inherited from the global system.

### Relationship to previous sections
Core Capabilities is list-led and neutral-toned; Research & Intelligence deliberately shifts into a deep primary surface and a more information-dense editorial composition. The change in density and tone signals a move from “what we do” to “how we think” without introducing a new design language.


## Homepage Services / Solutions — Phase 4.6

### Purpose
The Services / Solutions section translates the preceding research and intelligence story into practical ways an audience can engage the organization. It distinguishes services (“what someone can engage us to do”) from capabilities (“what we are capable of”) and remains a homepage overview rather than individual service-page architecture.

### Service taxonomy
The initial replaceable taxonomy contains Research & advisory, Strategy & intelligence, Education & training, and Technology solutions. Each service carries practical metadata useful to the overview: audience and engagement format. No clients, outcomes, statistics, awards, or other unsupported credibility claims are presented.

### Composition
The section deliberately avoids a repeated card grid. A four-column editorial introduction sits beside a large ruled service index. Each service is a semantic link with a numbered index, large title, concise practical description, audience, format, and directional marker. Equal structural treatment avoids implying an arbitrary business priority; the index is navigational, not a ranking.

### Relationship to capabilities and research
Core Capabilities establishes the organization’s areas of competence, while Research & Intelligence establishes its inquiry and evidence-oriented approach. Services follows as the practical application layer: research and knowledge can become advisory work, strategy/intelligence engagements, education, or purposeful technology work.

### Interaction
Service rows use existing motion tokens for restrained background, typography, and arrow feedback. The entire row is a semantic link, so keyboard and touch users receive the same destination and essential content without hover dependence. Focus remains visible through the established focus treatment.

### Responsive behavior
Desktop uses the editorial introduction plus service directory relationship. Tablet preserves the directory structure while allowing metadata to compress. Mobile becomes a deliberate vertical index: service descriptions remain visible, metadata simplifies into a compact two-column block, and touch targets remain comfortably sized. No service is hidden to shorten the section.

### Future compatibility
Service links use the scalable `/services/[slug]` pattern, while `/services` remains the directory destination. The static content model is centralized in `data/homepage.ts` so future CMS or database-backed content can replace the source without changing the presentation contract. No service pages, CMS, database, filtering, admin, or backend are implemented in this phase.


## Global Content & Copy Rule

This is a permanent website-wide content requirement. Every heading, navigation label, CTA, description, service name, metadata label, placeholder, accessibility label, and other UI copy must be relevant to the actual organization, the actual service being described, and the visitor’s task.

### Content standards
- Prefer precise industry terminology over invented marketing language.
- Write from user intent: explain what is provided, who it is for, what it includes, what problem it addresses, or what the visitor receives.
- Navigation and CTAs must describe their destination or action.
- Use consistent terminology across navigation, pages, services, forms, metadata, and SEO.
- Do not add services or categories merely to make the site appear comprehensive.
- Do not fabricate clients, universities, partnerships, awards, certifications, credentials, outcomes, statistics, testimonials, research findings, publication relationships, or other claims.
- Research content must not invent datasets, findings, conclusions, citations, or publication credentials.
- When verified organizational content is unavailable, use concise, clearly replaceable placeholders rather than generic marketing copy.
- Empty space is preferable to irrelevant copy.

### Existing-content handling
Before changing established copy, inspect its intended role and preserve accurate terminology. Replace generic or unsupported wording selectively rather than rewriting unrelated content. Newly added copy must pass a relevance, specificity, factual-support, terminology, user-intent, and consistency check.

### Homepage application
The homepage content model remains centralized in `data/homepage.ts`, while the reusable service directory is centralized in `data/services.ts`. Provisional content explicitly identifies areas where verified organizational information is still required. Service and research structures are designed to accept verified content later without changing the presentation architecture.

## Homepage Service Discovery — Phase 4.7

### Purpose
The Service Discovery layer follows Services as a compact navigation step from service awareness to a specific destination. It keeps the homepage action-oriented without adding another card grid or long explanation.

### Information hierarchy
The section uses a small section label, a short task-focused heading, a numbered service index, one-line service descriptions, and a single View All Services action. Service names and descriptions reuse the centralized `data/services.ts` source rather than duplicating the taxonomy.

### Service terminology
Discovery uses the same service names and destinations as the homepage Services section. No additional service categories are introduced solely to fill the section.

### CTA strategy
Individual service rows link directly to their existing service destinations. One section-level CTA points to /services using the existing View All Services action. There are no competing primary buttons.

### Responsive behavior
Desktop uses a compact two-zone editorial layout with the discovery list occupying the wider column. Tablet preserves the indexed list while allowing the text columns to compress. Mobile converts each row into a clear vertical reading unit with the service name, description, and destination remaining accessible without horizontal scrolling.

### Interaction and accessibility
Service rows are semantic links with visible focus states and restrained arrow/surface feedback using the existing motion tokens. Essential information is visible without hover. The section is a Server Component, adds no state or dependencies, and inherits the global reduced-motion behavior.

## Homepage Audience / Use Cases — Phase 4.8

### Purpose
The Audience / Use Cases section follows Service Discovery by helping visitors identify whether the existing services match their work. It uses the supported audience wording “students and researchers” and frames the content around two concrete requirements already represented in the service model.

### Content hierarchy
The section uses a compact label, short heading, one supporting line, then an indexed use-case list. Each use case has one short relevance line followed by direct links to the applicable services.

### Service relationship
The relationships reuse existing service destinations for Thesis Support, Dissertation Support, Research Paper, and Data Analysis. No additional service categories or unsupported audience claims are introduced.

### Visual composition
The section uses a tonal editorial field with a four-column introductory zone and an eight-column ruled index. It is intentionally different from the previous service directory: the left column establishes relevance while each use-case row groups its related service links on the right.

### Responsive behavior
Desktop preserves the asymmetric introduction/use-case relationship. Tablet compresses the index while retaining the service grouping. Mobile stacks each use case and keeps all related service links visible with comfortable touch targets.

### Interaction behavior
Service names are semantic links with visible focus states and restrained arrow movement using existing motion tokens. No essential content depends on hover, no client state is required, and reduced-motion behavior remains inherited from the global system.

## Homepage Process / How It Works — Phase 4.9

### Purpose
The Process section follows Audience / Use Cases and explains the customer-facing path from choosing a research service to proceeding with the agreed support. It reduces friction without exposing internal operations.

### Process structure
The section uses four concise indexed steps: Choose a Service, Share Requirements, Confirm Details, and Receive Support. Each step has one short supporting line. The process is presented as a sequence, not as four repeated cards.

### Content density
Copy is intentionally compact. The section communicates the next action and required information without adding operational claims, delivery guarantees, revision policies, payment stages, or internal workflow details.

### Visual composition
Desktop uses a large editorial introduction beside a four-step indexed sequence with restrained rules. The connector treatment is static and structural; it does not represent live progress. Mobile changes to a vertical numbered sequence rather than squeezing desktop columns into the viewport.

### CTA strategy
A single section-level Request Support link points to the existing /contact destination. The process itself contains no competing actions.

### Responsive behavior
Desktop presents the four steps in sequence. Tablet uses a two-column arrangement. Mobile presents one step at a time with readable titles, compact descriptions, clear numbering, and comfortable spacing.

### Interaction and motion
The section is a Server Component with no state, effects, listeners, or new dependencies. The CTA uses existing motion tokens. The numbered sequence remains fully understandable without animation and inherits the global reduced-motion behavior.

## Homepage Trust, Proof & Credibility — Phase 4.10

### Purpose
The Trust section follows Process and presents the factual service scope already established in the homepage content. It reduces hesitation through specificity rather than unsupported social proof.

### Evidence strategy
No client logos, testimonials, ratings, statistics, credentials, awards, affiliations, publication counts, or other evidence not established in the project was added. Proof is limited to the documented service areas already represented by the homepage: Thesis & Dissertation, Research Papers, Research Methodology, and Data Analysis.

### Content density
The section uses a short label, concise heading, one supporting line, and a compact evidence index. Each proof point contains a specific service area and one short factual description.

### Visual composition
A deep primary surface creates a calm transition from the Process section. A four-row editorial evidence list uses restrained numbering and rules instead of trust cards, badges, checkmarks, ratings, or large unsupported statistics.

### CTA strategy
A single View Research Services link points to the existing /services destination. It provides a factual next step without artificial urgency or pressure.

### Responsive behavior
Desktop uses an asymmetric introduction and evidence list. Tablet compresses the evidence columns while preserving the hierarchy. Mobile stacks each proof point with all factual information visible and avoids oversized metric blocks.

### Accessibility considerations
The section uses semantic section, heading, definition-list, and link elements. Contrast is maintained on the primary surface, focus remains visible, and decorative styling is not required to understand the evidence.

### Interaction and motion
The section is a Server Component with no state or effects. The CTA uses existing motion tokens only. Proof content does not depend on animation and inherits the global reduced-motion behavior.

## Homepage Experts / Human Expertise — Phase 4.11

### Purpose
The Experts section introduces the human expertise behind the organization without inventing people or credentials. It follows Trust / Proof and provides a clear path to the future Experts destination.

### Profile information hierarchy
Expert data is centralized under `homepageContent.expertise.experts` and is intentionally empty until verified names, roles, specializations, credentials, and profile destinations are available. No fabricated expert identity is rendered.

### Visual and content strategy
The section uses an editorial profile index rather than a repeated portrait-card grid. When verified profiles are added, each row can present the expert name, specialization, and profile link without requiring a homepage biography.

### Image strategy
No photographs or stock portraits are loaded while verified expert photography is unavailable. This avoids presenting generated or unrelated people as organizational experts and keeps the replacement path straightforward.

### Responsive behavior
Desktop uses an asymmetric introduction and profile index. Tablet compresses the profile information. Mobile stacks profiles into a compact readable sequence while preserving profile links and focus states.

### Interaction behavior
Profile rows use semantic links and restrained arrow movement with existing motion tokens. No client state or interaction is required. The section remains understandable without hover or animation and respects the global reduced-motion behavior.

## Homepage Workshops / Events — Phase 4.12

### Visual direction
Workshops and events use an editorial event-index treatment rather than a generic card grid. The section follows the human-expertise section and uses the existing neutral surfaces, typography, dividers, spacing, and restrained interaction language.

### Event hierarchy
Verified events can be presented as one featured event followed by compact supporting rows. Metadata is ordered around date, category, format/location, status, and a contextual event action. Only populated approved fields are rendered.

### Data architecture
Event data is kept separate from presentation in `homepageEvents`, with support for title, slug, date, optional end date/time, category, location, format, short description, registration label, destination, status, and featured state. The current collection is intentionally empty because verified event information is not available.

### CTA and responsive behavior
Event actions use contextual labels such as View Event or an approved registration label. Desktop uses the editorial index; smaller screens stack event information while preserving date, hierarchy, and tap-friendly actions.

### Motion and content rules
Interactions are limited to existing restrained link/arrow transitions and inherit reduced-motion behavior. No event, speaker, venue, date, attendance figure, partnership, credential, or outcome is invented or exposed as public information.

## Homepage Articles / Insights — Phase 4.13

### Visual direction
Articles use an editorial publication index rather than a repetitive blog-card grid. The section uses the established typography, spacing, neutral surfaces, dividers, and restrained link motion.

### Editorial hierarchy
A verified featured article can receive primary hierarchy, followed by compact supporting article rows. Metadata is limited to category, date, and optional author/role or reading time. Titles remain the strongest content element.

### Data model and content rules
`HomepageArticle` centralizes article identity, category, date, optional author details, excerpt, image, reading time, destination, featured state, and tags. `homepageArticles` is currently empty because no verified article publications are available. No authors, dates, findings, citations, or publication claims are fabricated.

### Responsive and interaction behavior
Desktop uses an asymmetric introduction and editorial article index. Featured and supporting content stack naturally on smaller screens while preserving metadata and tap targets. Simple arrow/underline transitions use existing motion tokens and inherit reduced-motion behavior.

## Homepage About / Organization Snapshot — Phase 4.14

### Visual direction
The About snapshot uses an asymmetric editorial composition: concise organization statement on one side and a numbered focus index on the other. It avoids a centered corporate block, stock imagery, and repetitive cards.

### Content hierarchy
The section follows label → headline → one supporting statement → four specific focus areas → About Us CTA. Focus areas are kept to short titles and one-line descriptions so the section remains scannable.

### Content rules
Organization facts are limited to the project's established research, methodology, analysis, and technology-focused service positioning. No founding date, client count, expert count, partnership, award, certification, geographic reach, or performance claim is introduced.

### Responsive and motion behavior
The editorial columns rebalance into a deliberate stacked composition on smaller screens. Focus items remain separated by dividers and the CTA retains a comfortable touch target. The CTA arrow uses existing motion tokens; no client-side animation is required and reduced-motion behavior is inherited globally.

## Homepage Final Narrative / Primary Conversion CTA — Phase 4.15

### Visual direction
The final CTA closes the homepage with a dark primary editorial field, asymmetric headline/action alignment, generous whitespace, and one clear conversion path. It is intentionally distinct from a generic centered CTA banner.

### CTA hierarchy and content
The section uses one primary action: `Request Research Support` → `/contact`. Copy is limited to the research requirements already established across the homepage and makes no guarantees or unsupported conversion claims.

### Button and interaction treatment
The existing `Button` primitive now supports `asChild` so the CTA can retain button styling while using a semantic Next.js link. The arrow uses the existing restrained hover transition and inherits the project's reduced-motion behavior.

### Responsive behavior
Desktop uses a 12-column editorial split between headline and action. Tablet preserves the hierarchy without crowding, while mobile stacks the content naturally and keeps the CTA comfortably tappable.

## Homepage Final Integration, Flow & Conversion Audit — Phase 4.16

### Page-level narrative
The homepage now follows a deliberate progression from research positioning and capabilities, through research/analysis and services, into service discovery, audience relevance, process, factual scope, human expertise, events, articles, organization context, and the final contact action. Existing section roles are preserved; no new homepage section was added.

### Consistency rules
All homepage sections use the established container/gutter, typography, spacing, color, border, radius, focus, and motion tokens. Editorial composition varies by section—lists, asymmetric splits, indexed sequences, featured content, and dark evidence-led surfaces—rather than repeating a card-grid pattern.

### CTA hierarchy
Section CTAs remain contextual navigation actions, while the final homepage CTA is the clearest conversion point: Request Research Support → /contact. CTA wording stays specific to the destination and established research-service terminology.

### Responsive and accessibility rules
Desktop uses controlled asymmetry and wide editorial composition; tablet compresses columns without collapsing hierarchy; mobile uses intentional stacking, readable type, and touch-friendly links. Semantic headings/sections, keyboard-visible focus, non-hover-dependent content, and global reduced-motion behavior remain the baseline.

### Content and visual rules
Homepage copy stays short and specific. Unsupported claims, fabricated people/events/research, generic marketing language, and customer-visible development language are excluded. Abstract visuals are treated as supporting composition rather than organizational evidence.


## Services Directory — Phase 5.1

### Purpose
The `/services` route is the directory and discovery layer for the service ecosystem. It helps visitors identify the available service, understand its scope and audience, and move toward the future service-detail route without presenting full service pages in this phase.

### Service taxonomy and data
The current verified service scope is grouped under **Research & Academic Support** and contains Thesis Support, Dissertation Support, Research Paper, and Data Analysis. Service records are centralized in `data/services.ts`; the homepage service section reuses this source rather than duplicating service names, descriptions, or destinations.

### Directory composition
The page uses a compact editorial introduction, a numbered service directory, concise audience guidance, and a single research-support CTA. A single current category does not receive a separate tab/filter control because that would add interaction without improving discovery.

### Service-item hierarchy
Each directory row presents the service index, service name, short description, optional audience, and a direct link to `/services/[slug]`. No service is artificially featured or ranked.

### Responsive and interaction behavior
Desktop uses an asymmetric editorial layout with a wide numbered index. Tablet compresses metadata while preserving the hierarchy. Mobile becomes a vertical service index with comfortable touch targets and no horizontal overflow. Row hover, focus, and arrow movement use existing motion tokens and remain understandable without animation; reduced-motion behavior is inherited globally.

### Content rules
Service copy is specific and concise. No pricing, delivery guarantees, credentials, outcomes, testimonials, client counts, or unsupported service categories are introduced. Future detail pages are represented only by meaningful `/services/[slug]` destinations.

### Future compatibility
The directory is a Server Component with no client-side filtering, database, CMS, authentication, payments, or backend. `data/services.ts` is the reusable source for the directory, homepage service references, navigation, future detail pages, and future search/filtering.

## Services Discovery & UX Refinement — Phase 5.2

### Discovery model
The current directory contains four services under one canonical category, **Research & Academic Support**. Interactive filtering is intentionally not used because the current service volume and single-category taxonomy do not justify client-side filter controls. The directory instead uses semantic category grouping and remains ready to expose a category index when additional approved categories exist.

### Category behavior
Categories are derived from `data/services.ts`; no category names are duplicated in filter or presentation data. When more than one category exists, `ServicesCategoryIndex` renders lightweight anchor links to canonical category sections. The index uses real links, sticky-header-aware `scroll-anchor` targets, keyboard focus, and a horizontally scrollable mobile treatment without page-level overflow.

### Service ordering and hierarchy
Services preserve the approved Phase 5.1 order. Each row uses a numbered index, service name, concise description, optional audience metadata, and a direct `/services/[slug]` destination. No service is artificially featured, ranked, or assigned unsupported metadata.

### Interaction and accessibility
Service rows retain restrained hover, focus, and arrow feedback. Category navigation uses semantic links rather than JavaScript filters. Essential content does not depend on hover or animation, focus remains visible, and reduced-motion behavior is inherited from the global motion system.

### Data architecture
`data/services.ts` remains the single source for service records and now derives canonical category values and category anchors. Homepage service references continue to consume the same records. The Services page and future service-detail routes can reuse this source without duplicating service content.

### Responsive behavior
The current small service set remains compact on desktop, tablet, and mobile. If additional categories are approved later, the category index will remain lightweight on desktop and become a practical horizontal index on mobile. No filter-heavy or dashboard-style UI is introduced.

## Service Detail Page Foundation — Phase 5.3

### Architecture
The dynamic `/services/[slug]` route is driven entirely by the centralized service records in `data/services.ts`. Static params are generated from the current service dataset, while unknown slugs use the standard Next.js not-found flow.

### Page hierarchy
Each service detail page uses the same editorial structure: semantic breadcrumb, asymmetric service hero, concise overview, optional verified highlights, related services from the same category, and a final service-specific contact prompt. The structure is intentionally shallow so later service-detail phases can add depth without rebuilding the route architecture.

### Hero and overview
The service category provides context, the service title is the dominant element, and the existing short description supplies the concise service statement. Audience metadata is shown only when present. No fabricated imagery, statistics, claims, pricing, or guarantees are introduced.

### Highlights
Highlights are optional service data. The highlights section renders only when verified highlight records exist, so services without approved highlights do not receive empty or invented content.

### Related services
Related services are derived from the centralized service data using the current service's category and exclude the current service. They use the existing editorial numbered-row treatment rather than a generic card grid.

### CTA
The primary service action routes to the existing `/contact` destination and uses `Discuss Your Requirement`. Service-specific wording is limited to the requirement context already supported by the service record; no consultation, response-time, result, or pricing claims are added.

### Metadata
Page title and meta description are generated from the service record. The metadata remains concise and service-specific without keyword stuffing or a separate SEO content layer.

### Responsive, accessibility, and motion
The page reuses the existing container, typography, spacing, border, color, button, focus, and motion tokens. Desktop uses controlled asymmetry; mobile stacks the hierarchy and preserves readable titles and comfortable tap targets. Semantic breadcrumb navigation, heading hierarchy, visible focus, and reduced-motion behavior are maintained without client-side interaction.

### Data architecture
Service records remain the single source of truth for the directory and detail routes. Optional `highlights` are supported without requiring every service to populate them. No database, CMS, authentication, payment system, API, or service-specific backend logic is introduced.

## Service Detail Content Depth & Information Architecture — Phase 5.4

### Information architecture
Service detail pages now progress from breadcrumb/context and hero into a concise overview, optional verified highlights, audience context, related services, and the final contact action. Optional sections render only when their corresponding service data exists.

### Scope and included areas
The existing optional `highlights` structure is retained as the available verified-detail mechanism. Dedicated scope, deliverable, and process sections are not rendered until approved service data exists; no unsupported service claims are fabricated.

### Audience treatment
The existing `audience` field is presented as a compact editorial metadata section. Services without an audience omit the section rather than showing empty content.

### Related services
Related services continue to derive from centralized service data, use the current service category relationship, and exclude the current service. The presentation remains a numbered editorial list rather than a card grid.

### On-page navigation
A dedicated "On this page" navigation is not introduced at the current content depth. The service pages do not yet contain enough verified sections to justify an additional navigation layer.

### CTA hierarchy
The service page has one clear conversion destination: `/contact`, using `Discuss Your Requirement`. No unsupported offers, timelines, guarantees, pricing, or outcomes are presented.

### Responsive and accessibility behavior
The page preserves the established editorial grid and intentionally stacks content on smaller screens. Semantic sections, headings, lists, breadcrumb links, visible focus states, comfortable tap targets, and reduced-motion behavior remain part of the shared design system.

### Content rules
Service data remains centralized in `data/services.ts`. Optional content is omitted when unavailable. No placeholder, temporary, development, fabricated, or unsupported customer-facing content is introduced.
\n

## Service Detail Conversion, FAQ & Related Content — Phase 5.5

### FAQ behavior
Service records support an optional `faq` collection containing concise question/answer pairs. The customer-facing FAQ section renders only when verified FAQ data exists; current approved services have no FAQ records, so no empty FAQ section is shown. The interactive item uses a native button, `aria-expanded`, `aria-controls`, visible focus, independent open state, restrained disclosure motion, and global reduced-motion behavior.

### Related-content hierarchy
Related services remain the only active related-content type because they are supported by the current centralized service data. They remain same-category editorial rows and exclude the current service. Homepage article data is currently empty and no service-to-article relationship is invented. Workshops/events are also unavailable as related detail content, so no related-content section is added for them.

### Final conversion
The final service CTA remains the single conversion destination after informational content and points to `/contact`. Its wording is service-specific: `Discuss This Service`. The supporting line remains concise and describes the existing enquiry workflow without promising outcomes, response times, pricing, or availability.

### Conversion hierarchy
Service pages retain the primary CTA near the hero, contextual service/related links through the page, and one final primary CTA after the information architecture. No repeated CTA buttons or generic card-grid conversion layer is introduced.

### Responsive and accessibility
FAQ questions use full-width comfortable tap targets and remain readable on mobile. Expanded answers are contained within the editorial column and do not rely on hover. Native buttons provide keyboard Enter/Space behavior, visible focus, and screen-reader state. The service page remains server-rendered except for the small FAQ disclosure component.

### Content rules
No FAQ content is fabricated when verified answers are unavailable. No pricing, delivery times, guarantees, refund policies, availability, success rates, testimonials, credentials, partnerships, or outcomes are introduced. Related content is omitted when real source data does not exist.

## Services System Final Integration & Production Readiness — Phase 5.6

### Final information hierarchy
The service-detail hero now carries the concise service statement and primary CTA. The redundant standalone overview section was removed because it repeated the same `shortDescription`. Optional highlights, audience, FAQ, related services, and the final CTA remain conditional/content-driven.

### Discovery and navigation
The current four-service dataset remains a single **Research & Academic Support** category, so no unnecessary filter UI is rendered. The directory remains the canonical discovery route, while each service links directly to its dynamic `/services/[slug]` page. Breadcrumbs provide Home → Services → Current Service context on detail pages.

### Data architecture
`data/services.ts` remains the single source of truth for service identity, taxonomy, descriptions, audience, optional highlights, optional FAQ data, and routes. Related services are derived by category and exclude the current slug. Current service records contain unique IDs and slugs; no duplicate service definitions were introduced.

### FAQ and related content
FAQ remains optional and renders only when service data contains verified question/answer records. The interactive item is the only client component in the FAQ layer. Related services use canonical service data; articles and events are omitted because no verified service-related relationship currently exists.

### CTA hierarchy
The hero provides the primary service action. Related-service rows provide secondary discovery. The page closes with one contextual `Discuss This Service` CTA routed to `/contact`. No repeated conversion buttons or unsupported offers are used.

### Copy and duplication
Service copy was audited for paragraph-heavy or generic marketing language. Customer-facing development terms and generic marketing phrases are absent. Repeated audience metadata was removed from the hero because the dedicated audience section already communicates that information.

### Responsive, accessibility, and motion
The existing editorial grid, typography, dividers, focus styles, tap targets, and reduced-motion tokens remain the foundation. The FAQ uses a native button with `aria-expanded` and `aria-controls`, while service and breadcrumb navigation remain semantic links. No hover-only information or new animation system was introduced.

### Production cleanup
The unused standalone service overview component was removed after its content was consolidated into the hero. The development service-detail playground now reflects the final page composition and continues to cover optional content and long-content states without being exposed in production.

## Research & Intelligence Directory — Phase 6.1

### Purpose
The `/research` route is the dedicated Research & Intelligence directory. It provides a distinct editorial knowledge experience while remaining within the existing design system and connecting naturally with Services.

### Information hierarchy
The current page uses:
1. restrained Research & Intelligence hero;
2. optional category index;
3. centralized research directory;
4. contextual research-support CTA.

Optional category navigation disappears when there is zero or one category, avoiding unnecessary filtering UI.

### Data architecture
`data/research.ts` is the canonical research source. The `ResearchEntry` model is intentionally limited to fields useful for the directory and future detail routing: identity, title, slug, category, concise description, optional metadata, route, featured state and tags. No database or CMS is introduced.

The current `researchEntries` collection is empty because no verified research records are available. The production directory therefore displays a concise empty state rather than fabricated publications, findings or statistics.

### Future compatibility
The data model and `href` convention are compatible with a future `/research/[slug]` route, search, filtering, related research, related articles and SEO metadata. None of those systems are implemented in Phase 6.1.

### Relationship to Services
Services describe available research and academic support. Research is the separate knowledge/discovery layer. The Research page CTA points to `/contact` for an existing research-support workflow; no new enquiry or submission system is introduced.

### Editorial and responsive direction
Research uses numbered/indexed rows, typography, dividers, controlled asymmetry and whitespace rather than repetitive cards. The directory remains server-rendered. Category links are simple anchors when multiple real categories exist. Mobile layouts retain metadata hierarchy and avoid horizontal overflow.

### Motion and accessibility
The page uses existing transition and focus tokens only. No new client-side interaction is required in the empty state. Semantic sections, headings, navigation landmarks and accessible links are used throughout. Existing reduced-motion rules remain authoritative.

### Content rule
Only verified research content may populate the directory. No authors, findings, datasets, publications, dates, institutions, awards, counts or authority claims are invented.


## Research Directory Discovery & UX Refinement — Phase 6.2

### Discovery model
The current canonical research dataset is empty, so client-side filtering is not justified yet. The production directory therefore remains server-rendered and uses the simplest useful discovery architecture: a canonical research directory with a lightweight category index that appears only when more than one real category exists.

No artificial categories, counts, filter states, query-string state, sorting, date ranges, or faceted controls are introduced.

### Category behavior
Research categories are derived directly from `data/research.ts`. When multiple real categories exist, the category index provides semantic anchor links plus an **All research** link back to the directory start. With zero or one category, the index remains hidden because it would not materially improve discovery.

### Research item hierarchy
Research entries remain typography-led numbered rows rather than large cards. The row hierarchy is title → concise description → type/category → optional topic/date → direct route. Optional metadata is rendered only when the canonical record supplies it.

### Empty-state behavior
The empty production directory uses a concise state with no fabricated research records, publications, counts, or filler. It explains what the directory contains and keeps the page visually stable until real research content is available.

### Responsive behavior
Desktop preserves the editorial split between the directory introduction and research list. Tablet compresses metadata without introducing a filter dashboard. Mobile keeps category navigation horizontally usable when multiple categories exist, preserves title hierarchy, and avoids page-level horizontal overflow.

### Interaction and accessibility
Category navigation uses semantic links rather than client-side state because the current content does not justify filtering. Links retain visible focus states and comfortable touch targets. Research rows remain semantic links, with optional metadata that does not compete with titles.

### Client/server boundary
No new client component is required in Phase 6.2. The canonical research dataset remains server-side, and the directory does not duplicate data into a client filtering layer. A future client discovery control can be isolated if the approved dataset grows enough to justify it.

### Motion
Discovery uses the existing hover/focus transitions and small directional arrow movement already established by the design system. No filter animation or layout choreography is added while there is no real filtered state to communicate. Reduced-motion behavior continues to come from the global motion system.

### SEO and routing
`/research` remains the only production research directory route. Filter or category states do not receive query-string URLs or separate metadata. Research detail routes remain out of scope for this phase.

### Integration
The existing global Header and homepage Research links remain unchanged. Their existing `/research` destinations continue to resolve to the refined directory. No unrelated navigation or homepage redesign was introduced.


## Research Detail Page Architecture — Phase 6.3

### Route and canonical data
Individual research pages use `/research/[slug]` and resolve entries exclusively through `data/research.ts`. Static params are derived from the canonical dataset, valid slugs render the shared detail-page composition, and unknown slugs use the standard Next.js not-found flow. No route-specific research records are hardcoded.

### Detail data model
The existing `ResearchEntry` model was extended only with an optional structured `sections` collection and a canonical slug lookup. Each section contains an ID, title, and concise content string; no rich-text editor or separate content source was introduced. Related research is derived from canonical entries using category plus shared tags, excluding the current item.

### Page hierarchy
The detail composition follows:
1. breadcrumb back to Research;
2. editorial research hero;
3. verified metadata;
4. concise research summary;
5. optional structured content sections;
6. optional related research;
7. contextual return to the Research directory.

Sections render only when their data exists. There are no empty visual blocks.

### Hero and metadata
The hero uses the existing editorial grid with the research title as the dominant element, concise supporting copy, and compact metadata for category, topic, date, and status when supplied. An optional research image is rendered only when the canonical entry contains one and uses Next.js Image handling. No visual is inserted to fill missing content.

### Related research
Related research is intentionally narrow: entries must exclude the current item, share the current category, and share at least one canonical tag. This prevents generic same-category filler from appearing as a relationship. If no meaningful relationship exists, the section is omitted.

### CTA and internal linking
The detail CTA returns visitors to `/research`, which is the established research discovery route. Breadcrumbs provide the reverse connection from detail to directory. No service relationship is created unless future canonical research data establishes one.

### Responsive behavior
Desktop uses a wide editorial split between research context and metadata/visuals. Tablet compresses the relationship while retaining hierarchy. Mobile stacks breadcrumb, title, summary, metadata, content, related research, and CTA with comfortable reading width and no page-level horizontal overflow.

### Accessibility and motion
Breadcrumbs use semantic navigation/list structure. Research content uses semantic sections and heading hierarchy. Indexed related research uses an ordered list and semantic links with visible focus. Image alt text uses the research title. Existing hover/focus transitions consume the global motion tokens and reduced-motion rules; no client-side interaction is required.

### Server/client boundary
The detail route and all production detail components remain Server Components. No client-side data fetching or interactive state is introduced in Phase 6.3.

### Development preview
`/design-system/research-detail` is development-only and uses isolated preview data so the production research dataset remains empty and free of fabricated customer-facing research. The preview covers hero, metadata, summary, structured sections, related-item presentation, CTA, and responsive composition.

### SEO and integration
Detail metadata is generated from the canonical research title and short description. The global Header remains unchanged and its existing route matcher keeps Research active for `/research/[slug]`. Homepage and Services systems are not redesigned.


## Research Detail Content Depth & Information Architecture — Phase 6.4

### Content model
data/research.ts remains the single source of truth. Phase 6.4 adds only content structures that support a meaningful research detail page: optional overview/summary, scope items, research themes, structured sections, methodology, audience/relevance, highlights, and explicit service relationships. The existing category/tag relationship remains the basis for related research.

All deeper fields are optional. A research item can therefore remain concise without receiving empty sections or placeholder content.

### Conditional section rules
Every deeper section checks its canonical data before rendering. Missing scope, themes, methodology, audience, highlights, related research, or related services are omitted completely. No empty cards, filler copy, invented findings, statistics, dates, authors, methodologies, institutions, or credentials are introduced.

### Detail hierarchy
The production detail page now progresses through:
1. breadcrumb/context;
2. research hero and verified metadata;
3. optional on-page contents navigation when the content is long enough;
4. quick overview;
5. optional scope;
6. optional research themes;
7. structured research sections;
8. optional methodology/approach;
9. optional audience/relevance;
10. optional highlights;
11. optional related research;
12. optional explicitly related services;
13. one final Research directory CTA.

The page remains editorial rather than adopting a generic article or card-grid template.

### Structured research sections
Research sections support a title, optional introductory statement, body content, and optional key points. This is deliberately smaller than a rich-text system: there is no CMS, editor, database, arbitrary block renderer, or client-side content fetching.

### On-page navigation
A lightweight "On this page" navigation appears only when there are enough real sections or enough structured section content to justify it. It links to semantic section anchors, uses the existing header scroll offset, remains horizontally usable on mobile, and is not sticky. Short research pages omit it.

### Visual storytelling
The page uses controlled typography, numbered sections, dividers, asymmetrical editorial columns, tonal section changes, and whitespace to create rhythm. Real research imagery remains optional and is rendered only when supplied by canonical data. No decorative charts, fake percentages, fabricated trend lines, or visual filler are introduced.

### Related research and services
Related research continues to require a real canonical relationship: the current item is excluded, category must match, and at least one meaningful canonical tag must overlap. Explicit service relationships use canonical data/services.ts records and render only when the research item declares the relationship. No random service or research recommendations are generated to fill space.

### Responsive reading behavior
Desktop uses the existing 12-column editorial grid for scope, themes, methodology, relevance, related content, and supporting metadata while keeping prose within controlled reading measures. Tablet collapses complex relationships without cramped columns. Mobile stacks content in reading order, preserves section numbering, keeps metadata scannable, and allows contents links to scroll horizontally without page overflow.

### Accessibility and motion
Research content remains server-rendered. Sections use semantic landmarks and heading hierarchy; contents navigation uses semantic nav and anchor links; indexed research/service lists use ordered lists and meaningful links. Existing visible focus, scroll-margin-top, contrast, image alt text, and reduced-motion behavior remain authoritative. No client component was introduced for the research detail page.

### Development preview
The development-only Research detail preview now exercises overview, scope, themes, long content, methodology, relevance, highlights, related research, related services, contents navigation, and the final CTA. Its fixture data is isolated from researchEntries, so no development content is publicly routable.

### SEO and integration
Dynamic metadata remains derived from canonical research data, with a canonical route for each valid research slug. /research remains the directory source, the global Header remains unchanged, and existing homepage and Services links are not redesigned.

### Content accuracy
The production research dataset remains empty because no verified research records have been supplied. The architecture is ready for approved content without manufacturing research substance. No database, CMS, authentication, backend API, AI research functionality, advanced search, analytics, or future-phase systems were introduced.


## Dedicated Page Identity & Information Architecture Rebuild — Phase 6.5

Phase 6.5 corrects page-level composition rather than extending the homepage pattern. The homepage remains the broad organization introduction; internal destinations now use purpose-specific hierarchy and rhythm.

### Services
The Services route is customer-need driven. Its hierarchy is:
1. practical service introduction;
2. service category index;
3. need-based service discovery;
4. editorial service directory;
5. requirement-focused contact action.

The canonical service data now represents the established service areas supplied for this phase, including Research & Thesis, Analysis, Publication, Mentoring and Research Technology. Existing detailed services remain available, while newly established areas without implemented detail content are explicitly marked Coming Soon rather than being presented as fully available.

### Research & Intelligence
The Research route is a knowledge hub rather than a service directory. Its hierarchy is:
1. concise research/knowledge introduction;
2. research theme index;
3. knowledge archive;
4. research enquiry action.

The production research dataset remains empty. The page therefore uses an explicit archive state and does not invent studies, reports, findings, researchers, dates or statistics.

### Composition rule
Services and Research share the global design system but do not share the same page composition. Services emphasizes practical needs, categories and actions; Research emphasizes themes, publication-style indexing and knowledge discovery.

### Existing destinations
This phase does not manufacture expert, article, workshop or organization records where dedicated production routes/data are not yet present. Existing global navigation is preserved. Future dedicated destinations should follow the same rule: distinct purpose and information architecture, canonical content models, verified content only, and no homepage-template reuse.

### Responsive behavior
Service discovery and service lists remain scan-oriented on mobile. Research themes and archive metadata remain horizontally usable or stacked according to content. Desktop editorial columns collapse intentionally rather than simply mirroring the desktop grid.

### Architecture constraints
Server Components remain the default. The phase adds no backend, CMS, authentication, payment, admin, analytics, AI implementation or unnecessary dependencies. Locked project versions remain unchanged.


## Services Dedicated Experience — Phase 6.6

### Page purpose
The Services route is a dedicated service product directory. Its job is to answer what a visitor can engage Bittumama for, what requirement each service addresses, what is known about its scope/relevance, and where to go next. It does not reuse the homepage or Research page composition.

### Canonical service data
The canonical service dataset remains the single service source of truth. Phase 6.6 adds only service-discovery fields needed by the directory: `need` and `focus`. Established services are represented by their canonical names. Services without implemented offering detail are explicitly marked `Coming Soon`; no price, timeline, guarantee, success metric or client claim is introduced.

### Service discovery
The page begins with a compact service introduction followed by a client-side need finder. The finder uses selectable requirement rows rather than generic cards. Selecting a need reveals the mapped canonical service and links directly to `/services/[slug]`.

### Category architecture
Services are grouped into practical categories: Research, Thesis & Academic Work, Mentoring, Analysis, Publication and Research Technology. Category navigation anchors into the main catalogue. Categories are based on the established service dataset rather than visual balancing.

### Main catalogue
The central service catalogue uses indexed rows. Each row exposes the service name, concise description, need addressed, relevant audience, category context and a direct service route. `Coming Soon` status is visible without inventing availability claims.

### Detail relationship
`/services` is discovery and selection. `/services/[slug]` is service-specific understanding, relevance, related services and enquiry. The detail route continues to use canonical service data and Next.js `notFound()` for invalid slugs.

### Service detail refinement
Service detail pages now surface the requirement addressed, focus and audience when those fields are known. The hero uses service-specific actions and distinguishes Coming Soon services. Related-service language is service-oriented rather than research-directory language.

### Conversion hierarchy
The primary conversion path is:
Need → relevant service → service detail → enquiry.
The final Services CTA asks visitors who are unsure which service they need to discuss their requirement rather than using a generic startup CTA.

### Responsive and accessibility
The finder uses native buttons with `aria-pressed`, an `aria-live` result region, visible focus states and keyboard-operable controls. The catalogue becomes stacked indexed rows on smaller screens and avoids horizontal overflow. Existing motion tokens and reduced-motion rules remain in use.

### Development preview
`/design-system/services` is development-only and renders the same Services composition used by production, allowing inspection of selection states, category anchors, service statuses and responsive behavior. It is unavailable in production.

### Scope constraints
No backend, database, CMS, authentication, payments, admin, advanced search, AI assistant, booking flow or analytics were introduced. Locked project versions remain unchanged.


## Research Support Dedicated Experience Rebuild — Phase 6.7

### Page purpose
The Research route is the dedicated research and knowledge hub. It answers what research, analysis, studies and research resources exist at Bittumama rather than what a visitor can engage as a service. The homepage remains a concise preview and Services remains the separate engagement catalogue.

### Research-specific information architecture
The production page uses a compact research positioning block, a conditional thematic index, conditional featured research, the central indexed research directory, and a research-specific enquiry action. Sections with no verified content are omitted instead of being filled with artificial categories or records.

### Thematic navigation
Research themes are derived from canonical research entries. When real categories exist, the theme index uses numbered editorial links and semantic anchors into the research index. With no categories, the theme navigation is omitted. No artificial taxonomy is introduced.

### Featured research
Featured research is rendered only from canonical entries with featured status. The treatment presents one editorial lead with summary and verified metadata; no item is promoted merely to fill the layout. The production collection currently contains no featured records, so the section is omitted.

### Research discovery
The research index is an editorial list grouped by canonical category. Each item exposes only canonical title, type, category, short description and optional date, with a direct research route. The current production dataset is empty, so the page shows a concise verified-content archive state. Existing lightweight category discovery remains in place; no advanced search, sorting or query-string filters are introduced.

### Research/service relationship
Research remains separate from Services. Individual research detail pages may expose services only when relatedServiceIds explicitly connects the canonical research record to canonical service data. The directory does not append service sales content to every research item.

### Visual language
The page uses a compact editorial positioning block, indexed thematic navigation, optional featured research, numbered research rows, subtle rules, controlled reading measures and restrained metadata. It avoids the Services need-finder structure, generic blog cards, dashboard styling, large empty hero space, decorative gradients and unsupported research claims.

### Mobile behavior
The positioning block remains compact; theme navigation becomes a readable indexed list when real themes exist; research rows collapse to readable title, summary and metadata stacks; focus states remain visible and page-level horizontal overflow is avoided. Existing motion and reduced-motion tokens remain authoritative.

### Development preview
The development-only Research preview uses isolated fixture entries passed into the same production components to inspect themes, featured research, indexed discovery and production empty-state behavior without changing the canonical production dataset.

### Content accuracy and scope
Production research content remains empty because no verified research records have been supplied. No authors, findings, statistics, publication counts, affiliations, dates, awards, partnerships or credentials are invented. Phase 6.7 adds no backend, database, CMS, authentication, payments, admin panel, AI assistant, advanced search, analytics or research submission system.


## Experts / People Dedicated Experience Rebuild — Phase 6.8

### Page purpose
The Experts route is the dedicated people-and-expertise experience. It answers who has relevant expertise, what each verified expert specializes in, and where meaningful service or research relationships exist. Services remains the engagement catalogue and Research remains the knowledge hub.

### Canonical expert data
The canonical expert dataset is the single source of truth for expert identity, role, discipline, concise biography, expertise, qualifications, research interests, and explicit service/research/article relationships. The production expert collection is currently empty because no verified expert information is available in the project. No names, credentials, universities, publications, awards, experience claims or professional relationships are fabricated.

### People discovery
The production page uses a compact people-focused introduction, a conditional discipline index, an indexed expert directory, and a research-enquiry CTA. The discipline index appears only when verified expert disciplines exist. The directory groups real experts by canonical discipline and keeps names and expertise metadata visually dominant.

### Expert profiles
The /experts/[slug] route resolves only from the canonical expert dataset and uses Next.js not-found handling for unknown slugs. Profile sections render only when corresponding verified data exists. Images are optional and are never generated as placeholders. Related services and research are resolved through canonical service/research data from explicit IDs; article relationships are reserved for future verified article data.

### Visual identity
Experts uses a human, professional, editorial people directory rather than corporate team cards. Indexed rows, name-led typography, discipline metadata, subtle rules and restrained image treatment establish hierarchy. No circular avatar grids, stock portraits, fake headshots, gradients, glassmorphism, decorative 3D or excessive shadows are used.

### Homepage relationship
The homepage Experts section remains a concise preview. It continues to show a verified-profile empty state while the canonical expert dataset is empty and links to /experts. The dedicated Experts route owns full people discovery and profile architecture.

### Responsive and accessibility
Names, disciplines and profile links remain immediately scannable on mobile. Directory rows collapse without horizontal page overflow. Semantic lists, headings, accessible links, visible focus states, meaningful image alt text and the existing reduced-motion system are used. No client-side filtering is added because the verified catalogue is currently empty.

### Development preview
The development-only Experts preview uses isolated fixture profiles to inspect the introduction, discipline index, grouped directory, profile hierarchy, related service treatment, focus states and responsive composition. Preview people never enter the production expert dataset.

### Scope constraints
Phase 6.8 adds no backend, database, CMS, authentication, payments, booking, admin, AI assistant, advanced search, analytics or future-phase systems. Locked project versions remain unchanged.

## Articles / Insights Dedicated Editorial Experience — Phase 6.9

### Page purpose
The Articles route is the dedicated publication and reading experience. It answers what useful knowledge, analysis and insights can be read. Services remains the engagement catalogue, Research remains the research/knowledge hub, and Experts remains the people-and-expertise directory.

### Canonical article data
data/articles.ts is the single source of truth for article identity, title, slug, category, verified metadata, content, editorial relationships and SEO metadata. Production articles are currently empty because no verified article content is available in the project. No authors, dates, reading times, findings, citations, institutions, publication counts or relationships are fabricated.

### Publication architecture
The production /articles route uses a compact publication introduction, conditional topic navigation, conditional featured reading, a central typography-led archive and a contextual editorial CTA. Empty optional sections are omitted. The archive remains intentionally minimal while the verified catalogue is empty.

### Topic discovery
Article categories are derived exclusively from canonical article records. Topic navigation is typographic and compact, with intentional horizontal overflow on narrow screens only when real categories exist. No artificial categories, dashboard filters, query-string state, date sliders or advanced search are introduced.

### Featured reading
Featured status comes only from canonical article data. A publication-style featured article is rendered when a real record has featured: true; otherwise the section is omitted.

### Article archive
The archive is the central publication index. Articles are grouped by their real categories and presented as numbered editorial rows. Titles are visually dominant, while category, date and author metadata remain secondary. The layout avoids three-column cards, oversized rounded containers and repetitive thumbnail treatments.

### Article detail reading experience
/articles/[slug] resolves only canonical articles and uses Next.js not-found handling for invalid slugs. The detail route supports title, category, verified author/date metadata, excerpt, structured sections or body content, optional real imagery, tags, related articles, contextual related research, contextual related services and a final article action.

### Author relationships
Author identity is shown only when canonical article data provides it. authorSlug may link to /experts/[slug] only when the article explicitly establishes that relationship. No author profiles are created solely to populate the publication.

### Research and service relationships
Research and services remain secondary to the article. Related research uses canonical research records and explicit article relationships. Related services use canonical service records and explicit article relationships. No generic service CTA is appended to every article.

### Homepage relationship
The homepage remains a small Articles/Insights preview. Its existing article links now route to /articles; the dedicated Articles route owns the complete publication archive and reading experience. No homepage redesign is included in Phase 6.9.

### Visual language
Articles uses publication rhythm rather than homepage or service-directory composition: compact editorial introduction, topic index, featured reading when available, numbered archive rows, readable detail typography, subtle dividers, restrained metadata and controlled whitespace. No gradients, glassmorphism, glowing effects, fake publication logos, generic AI visuals, stock-photo-heavy presentation or three-column blog grid are used.

### Mobile and accessibility
Article titles remain prominent on mobile; metadata remains readable; category navigation is intentional when horizontally scrollable; archive rows collapse without page-level horizontal overflow; reading width remains comfortable. Semantic article/heading/list structures, visible focus states, meaningful image alt text, contrast and reduced-motion behavior use the existing design system.

### Development preview
/design-system/articles is development-only and uses isolated fixture articles to inspect topic navigation, featured reading, archive grouping, article detail, related content and mobile-oriented composition. Preview content never enters the production article dataset.

### Scope constraints
Phase 6.9 adds no backend, database, CMS, authentication, payments, admin panel, article editor, AI writing system, advanced search, analytics or newsletter backend. Locked project versions remain unchanged.

## About / Organization Dedicated Experience — Phase 6.10

### Purpose
The About route is the organization and identity experience. It explains who Bittumama is, what areas it brings together, its factual purpose, how the work is approached, and how the public-facing Services, Research, Experts and Articles experiences relate to the organization.

### Canonical organization data
`data/about.ts` is the centralized factual source for the About experience and metadata. The content is deliberately limited to information already established elsewhere in the project. No founding date, staff count, clients, countries, partnerships, awards, certifications, affiliations, milestones, testimonials or performance claims are introduced.

### Information architecture
The production page uses:
1. Organization introduction
2. Organizational focus
3. Purpose
4. How the organization works
5. Organization structure / relationship map
6. People connection only when verified experts exist
7. Final next-step actions

Sections without legitimate source data are omitted rather than filled with generic corporate copy.

### Organizational focus
Focus areas describe Bittumama at an organizational level rather than reproducing the Services catalogue. Current factual areas are Research, Academic Support, Analysis, Publication and Research Technology.

### Purpose and approach
The page uses a concise purpose statement derived from the established project scope. The approach section describes specific working principles already reflected in the product architecture: beginning with the research requirement, keeping methodology and analysis structured, and using research-oriented technology where relevant. Generic corporate values are intentionally avoided.

### Organization relationships
The relationship map explains the distinct roles of Services, Research, Experts and Articles. It does not duplicate those directories. Each item links to its dedicated experience.

### People
The people section is data-dependent. Because the canonical experts dataset is currently empty, production About does not invent or display people. When verified experts exist, the page can provide a concise organizational connection to the Experts directory.

### Timeline and credibility
No timeline or generic trust section is rendered because the project does not contain verified dated milestones or quantified credibility evidence. The organization is represented through its actual scope and information architecture rather than unsupported claims.

### Visual language
About uses an institutional/editorial composition: concise organization statement, numbered focus index, reading-width purpose statement, structured approach list, relationship map and restrained action area. It deliberately avoids the homepage hero pattern, generic corporate cards, huge centered typography, stock corporate imagery, gradients, glassmorphism and decorative 3D.

### Responsive and accessibility
The page uses semantic headings and lists, visible focus states, accessible internal links, sufficient contrast, compact mobile sections and existing reduced-motion behavior. Desktop relationship rows collapse into readable mobile blocks without page-level horizontal overflow.

### Development preview
`/design-system/about` is development-only and renders the same production components. It is unavailable in production and contains no production-only organizational claims.

### Scope
Phase 6.10 changes only the About experience. No backend, database, CMS, authentication, payments, analytics, organization-management system or other future-phase work is included.
