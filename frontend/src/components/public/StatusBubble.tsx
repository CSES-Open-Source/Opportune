import { statusColors } from "../../constants/statusColors";
import { getApplicationStatusLabel } from "../../utils/valuesToLabels";

interface StatusBubbleProps {
  status: string;
}

// Dark theme status color mapping
const DARK_STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  APPLIED: { bg: "rgba(91,142,244,0.12)", text: "#5b8ef4", border: "rgba(91,142,244,0.3)" },
  OA: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b", border: "rgba(245,158,11,0.3)" },
  PHONE: { bg: "rgba(167,139,250,0.12)", text: "#a78bfa", border: "rgba(167,139,250,0.3)" },
  FINAL: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b", border: "rgba(245,158,11,0.3)" },
  OFFER: { bg: "rgba(16,185,129,0.12)", text: "#10b981", border: "rgba(16,185,129,0.3)" },
  REJECTED: { bg: "rgba(239,68,68,0.12)", text: "#f87171", border: "rgba(239,68,68,0.3)" },
  GHOSTED: { bg: "rgba(239,68,68,0.12)", text: "#f87171", border: "rgba(239,68,68,0.3)" },
  NONE: { bg: "rgba(107,114,128,0.12)", text: "#6b7280", border: "rgba(107,114,128,0.3)" },
};

const StatusBubble = ({ status }: StatusBubbleProps) => {
  const statusKey = status.toUpperCase();
  const colors = DARK_STATUS_COLORS[statusKey] || DARK_STATUS_COLORS.NONE;

  return (
    <span
      className="inline-flex items-center m-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:scale-105"
      style={{
        background: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {getApplicationStatusLabel(status)}
    </span>
  );
};

export default StatusBubble;