# UX Contract

## Product context and sources

This change implements the client's September 2026 review and manual property management. See `docs/revision-cliente-2026-09-21.md` for evidence, open questions and release limits. Public languages: ES/EN/DE/NL/FR; panel: ES. Accessibility target: WCAG 2.2 AA, not a certification. Dates are calendar dates without a time zone. Commercial and legal content require the owner's approval.

Source ownership: `app/admin/actions.ts` and Supabase `app_admins`/RLS govern edits; `lib/property-validation.ts` defines accepted property input; `lib/enquiry-validation.ts` matches lead limits; `lib/legal.ts` records legal copy with unresolved identification; `lib/partners.ts` contains provisional referral copy. Runtime CSS is canonical; `DESIGN.md` preserves the existing visual identity.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Platform select inside labelled app field | property-form.tsx and existing catalogue filters | Native select retained for finite choices | Keyboard review; full device matrix pending |
| Date | Platform date picker with app label and server validation | visit-form.tsx | Native date; optional visit date | Schema tests; physical iPhone pending |
| Form | App-owned validation and error summary | property-validation.ts; enquiry-validation.ts | Create/edit/contact | Unit, typecheck and browser validation |
| Scrollbar | Existing browser scrollbar | app/globals.css | Page and table overflow | Browser overflow inspection |
| Toast | Persistent inline status | enquiry-fields.tsx; admin page | Success/error/warning live regions | Browser status review |
| CRUD | Authenticated server action with Supabase RLS | app/admin/actions.ts | Create draft/edit/publish/hide/delete | Authenticated full-flow blocked on login |

## Flow ledger

| Operation | Pending | Success | Failure/recovery |
|---|---|---|---|
| Create/edit | Lock duplicate submission and fields during save/uploads | Return to `/admin` with status banner | Preserve form; report error; optimistic version check prevents overwrites |
| Publish/hide | Confirm in app dialog; disable repeated action | Refresh list and public routes in five languages | Dialog remains open with error |
| Delete | App dialog explains permanent removal | Refresh list | Error visible; no false success |
| Upload | Validate type/10 MB; report file progress; block save | Add successful uploads to editable gallery | List failures; retain successful files; retry picker |
| Change content | Automatic translation or explicit manual languages | Preserve existing languages for price/photo-only edits | Never label Spanish as a successful foreign-language translation |
| Leave unsaved form | App dialog for links and Cancel | Discard only on explicit choice | Browser `beforeunload` for reload/close; history-back recovery is not implemented |
| Send enquiry | Validate and lock repeated submission | Success only after lead insert and SMTP complete | Retain fields; expose agency email; SMTP failure leaves lead in panel |

## Navigation, data and permission

Unauthenticated admin visitors go to login. Authenticated non-admins receive an access-restricted view. Every mutation checks administrator membership and uses RLS. Errors loading the property list must not look like an empty database. The current catalogue fits on one admin page (15 published records at audit); pagination remains a future scaling task, not silently implied support.

Catalogue URL changes remount the filter state. Existing interactive filter edits remain transient local state. No bulk selection, autosave or offline write queue is introduced. Do not persist form data or credentials into local storage. Manual upload only accepts supported image formats; PDF floor plans require conversion for new uploads. Legacy PDF plans remain linked.

## Validation, overlays and resilience

Property and enquiry schemas run on server and client. App forms use `noValidate`, field error association and first-invalid focus. `ConfirmDialog` owns confirm/cancel, focus restoration and Escape. The only browser confirmation is the platform unload guard. Stale property versions are rejected rather than overwritten. Translation/network errors retain the form. Existing drafts with incomplete languages can be completed using manual translations.

Cookie settings remain available in the footer. Resetting permission unloads external map/video frames; accepting enables those embeds. Consent to enquiries is independent and starts unchecked, including the gallery. This is a technical behavior contract, not a legal-compliance claim.

## Migration and verification

This is a bounded repair of property management and the client's public contact/privacy flows. Legacy blog, settings and lead management screens are recorded separately by the static audit; they have not received a whole-product redesign. Remaining acceptance gaps are in the dated review.

Required commands: `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, DESIGN.md lint, and the premium UI static audit. Runtime acceptance requires real admin login, a draft property with image upload, edit, publish/hide and cleanup; it cannot be inferred from a successful build. SMTP receipt and real-device date-picker verification are separate checks.
