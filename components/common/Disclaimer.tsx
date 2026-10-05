export function Disclaimer({ strong = false }: { strong?: boolean }) {
  return (
    <div
      className="rounded-xl border px-4 py-3 text-xs"
      style={{ borderColor: strong ? 'var(--danger)' : 'var(--border)', color: strong ? 'var(--danger)' : 'var(--ink-soft)' }}
    >
      {strong && <strong>Important: </strong>}
      This is general guidance, not a substitute for a qualified professional. For medical, legal, financial
      or emergency situations, please consult a licensed professional or local emergency services.
    </div>
  );
}
