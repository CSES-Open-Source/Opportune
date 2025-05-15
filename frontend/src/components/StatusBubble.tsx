import { statusColors } from "../constants/statusColors";
import { getApplicationStatusLabel } from "../utils/valuesToLabels";

interface StatusBubbleProps {
  status: string;
}

const StatusBubble = ({ status }: StatusBubbleProps) => {
  // Default to gray if status is unknown
  const colorClass =
    statusColors[status.toUpperCase()] || "bg-gray-200 text-gray-800";

  return (
    <span
      className={`m-[8px] px-2 py-1 rounded-full text-sm font-semibold bg-opacity-60 ${colorClass}`}
    >
      {getApplicationStatusLabel(status)}
    </span>
  );
};

export default StatusBubble;
