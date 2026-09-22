"use client";

import { useEffect, useId, useRef } from "react";

export function ConfirmDialog({ open, title, children, confirmLabel, busy = false, onConfirm, onCancel }: {
  open: boolean; title: string; children: React.ReactNode; confirmLabel: string;
  busy?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    return () => { dialog.close(); previous?.focus(); };
  }, [open]);
  return (
    <dialog ref={ref} aria-labelledby={id} aria-describedby={`${id}-body`} onCancel={(e) => { e.preventDefault(); if (!busy) onCancel(); }}
      className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl border border-line bg-surface p-6 text-ink shadow-xl backdrop:bg-black/75">
      <h2 id={id} className="font-display text-2xl">{title}</h2>
      <div id={`${id}-body`} className="mt-3 text-sm text-muted">{children}</div>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" autoFocus disabled={busy} onClick={onCancel} className="rounded-full border border-line px-5 py-3 hover:border-gold disabled:opacity-50">Cancelar</button>
        <button type="button" disabled={busy} onClick={onConfirm} className="rounded-full bg-gold px-5 py-3 text-bg hover:bg-gold-soft disabled:opacity-50">{confirmLabel}</button>
      </div>
    </dialog>
  );
}
