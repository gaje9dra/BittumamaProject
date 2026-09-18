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
