# Design Rationale

## Overview

This design transforms a functional citation verification interface into a polished, accessible experience for legal professionals. The core challenge was balancing information density with clarity, ensuring lawyers can quickly identify problematic citations while maintaining trust through professional aesthetics.

## Key Design Decisions

### Visual Hierarchy & Typography

Used serif fonts for headings and legal content, sans-serif for UI elements. Serif fonts signal professionalism in legal documents, while sans-serif improves UI readability. This creates clear visual separation between content and interface.

**Trade-off:** Could have used a single font family for consistency, but the mixed approach better serves the dual nature of the application.

### Citation Visual Treatment

Implemented two distinct citation tag styles—SCOTUS citations (blue/orange badges) and standard citations (purple pill-shaped tags). SCOTUS cases carry more weight, so they deserve visual prominence. The color coding provides immediate category recognition.

**Trade-off:** More complex implementation, but the visual distinction helps lawyers quickly scan for high-authority cases.

### Side Panel Architecture

Implemented a slide-in side panel that appears on citation selection, rather than an always-visible sidebar or modal overlay. Lawyers need to reference citation details while keeping the brief context visible.

**Trade-off:** Takes horizontal space, but the responsive layout ensures the brief remains readable.

### Keyboard Navigation

Implemented vim-style navigation (j/k keys) alongside arrow keys for citation traversal. Legal professionals often work with keyboard-heavy workflows. Multiple navigation methods accommodate different user preferences.

**Trade-off:** Adds complexity to event handling, but the performance impact is negligible and the UX benefit is significant for power users.

### Markdown Processing Strategy

Used react-markdown with custom component overrides, then post-processed the rendered tree to inject citation tags. This ensures proper nesting within markdown elements and handles citations in headings or blockquotes.

**Trade-off:** More complex than simple string replacement, but preserves markdown semantics.

### Accessibility-First Approach

Implemented comprehensive ARIA labels, live regions for screen reader announcements, focus management, and keyboard navigation. Legal professionals include users with disabilities, and accessibility is a legal requirement.

**Trade-off:** Requires more code and testing, but creates a more inclusive product and reduces legal risk.

## Trade-offs Considered

**Performance vs. Rich Interactions:** Chose smooth transitions and hover states. The interactions are lightweight, and the perceived quality improvement justifies the minimal overhead.

**Information Density vs. Clarity:** Balanced showing citation metadata inline with keeping the brief readable. Solution: compact badges that expand on interaction.

**Flexibility vs. Simplicity:** Implemented a metadata-driven system rather than hardcoding styles. This adds complexity but makes the system extensible for future citation types.

## What I Would Do With More Time

**Enhanced Features:** Citation filtering by status/severity/court, bulk actions for batch review, side-by-side quote comparison with diff highlighting, and a mini-map for quick navigation.

**Technical Improvements:** Virtual scrolling for long briefs, smooth scroll-to-citation animations, local storage for user preferences, and robust error boundaries.

**Polish & Refinement:** Loading and empty states, responsive mobile/tablet design, print stylesheets, and a professional dark mode theme.

The current implementation prioritizes core functionality and polish within the time constraint, with a clear path for enhancement.
