type Props = {
  name: string;
  subtitle?: string;
};

const GRADIENTS = [
  "from-brand-400 to-brand-600",
  "from-sky-400 to-indigo-600",
  "from-amber-400 to-orange-600",
  "from-violet-400 to-purple-600",
  "from-rose-400 to-pink-600",
];

function pick(name: string) {
  const sum = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
}

export function NameCell({ name, subtitle }: Props) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${pick(name)}`}>
        {initials}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900 dark:text-white">{name}</p>
        {subtitle ? <p className="truncate text-xs text-slate-400">{subtitle}</p> : null}
      </div>
    </div>
  );
}
