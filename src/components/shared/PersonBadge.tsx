interface PersonBadgeProps {
  name: string;
  color: string;
}

export default function PersonBadge({ name, color }: PersonBadgeProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <span className="text-sm font-medium text-gray-700">{name}</span>
    </div>
  );
}
