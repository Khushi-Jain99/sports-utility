import { ChevronDown } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const classes = [
  "",
  "B.A. F",
  "B.A.",
  "B.Com",
  "BCA",
  "B.Sc",
  "M.A. Pub.",
  "M.Com",
  "MCA",
];

export default function ClassFilter({ value, onChange }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-9 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition min-w-[140px]"
      >
        <option value="">All Classes</option>
        {classes
          .filter((c) => c !== "")
          .map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}