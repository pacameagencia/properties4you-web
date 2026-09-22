---
version: alpha
name: Properties4You
description: Costa Blanca property catalogue and agency management panel
colors:
  background: "#0a0d10"
  surface: "#151b21"
  primary: "#c9a464"
  foreground: "#efe9df"
  muted: "#9aa4ad"
  faint: "#8b949d"
typography:
  sans:
    fontFamily: "Inter, system-ui, sans-serif"
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
rounded:
  control: "0.5rem"
  panel: "1rem"
  pill: "9999px"
spacing:
  page-padding: "1.25rem"
  section-gap: "2rem"
components:
  button: {}
  input: {}
  dialog: {}
---

# Properties4You design system

## Overview

Preserve the client-approved visual identity: a Mediterranean property brochure with warm gold on charcoal and large serif titles. The public catalogue is a brand surface; `/admin` is a practical tool for entering and maintaining listings. The client's stated primary audience is foreign real-estate agencies, including the Netherlands; individual buyers remain a secondary audience.

Public content supports ES, EN, DE, NL and FR. The management panel is Spanish. The client owns final commercial copy and translation approval. `app/globals.css` is the canonical token source: `--p4y-*` maps through Tailwind `@theme`. This document records the existing system and does not generate CSS.

## Colors

Gold marks primary actions and selected items; warm white is primary text. Muted and faint text must remain readable on the dark surfaces. Errors have red text plus a written explanation. No alternative theme is introduced.

## Typography

Cormorant Garamond is for page and section headings; Inter is for forms, body copy and tables. Supported languages use Latin-script fallbacks. Let translated labels wrap instead of truncating actions. Keep property numbers and prices fully readable.

## Layout

Public pages use the existing `max-w-7xl` container. Forms use one column on phones and two where space allows. Keep the catalogue's generous image rhythm; use compact labelled controls in admin. Mobile image actions remain visible without hover. The existing admin table hides secondary columns and permits horizontal scrolling.

## Elevation & Depth

Tonal surfaces and fine borders carry hierarchy. The existing public hero keeps its photographic overlays. Shadows and a dark backdrop identify dialogs; routine admin sections use borders.

## Shapes

Public primary actions and form submit buttons are pills. Inputs and compact icon actions have smaller rounded corners. Image panels and dialogs retain the existing larger radius.

## Components

Controls provide hover and focus feedback, explicit disabled/busy states and written errors. Uploads display progress and retain successful files when another fails. Dialogs use the shared app-styled `ConfirmDialog` with cancel focus and Escape handling. Public forms share labels, consent and status messages through `enquiry-fields.tsx`.

Lucide icons accompany or have accessible action names. Spinner motion denotes pending work; existing public motion respects reduced-motion CSS. Do not add animation to routine editing. Dates use the platform calendar with a persistent visible label. File selection uses the platform picker inside an app-owned upload flow.

## Do's and Don'ts

- Preserve the current brand while improving operational clarity.
- Describe the result of an action and retain entered data on failure.
- Do not show a successful save or upload before it succeeds.
- Do not replace client photographs, company details or translations with invented material.
