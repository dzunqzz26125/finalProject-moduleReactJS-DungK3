export const LABEL_COLORS = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
};

export const PRIORITY_COLORS = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  critical: "text-red-400",
};

export const PRIORITIES = ["low", "medium", "high", "critical"];
export const LABELS = ["blue", "green", "red", "yellow", "purple", "pink"];

export const LIST_STATUS_MAP = {
  todo: "todo",
  "to do": "todo",
  "in progress": "in_progress",
  inprogress: "in_progress",
  review: "review",
  done: "done",
};

export const COLUMNS = [
  { status: "todo", label: "To Do", color: "border-blue-400" },
  { status: "in_progress", label: "In Progress", color: "border-yellow-400" },
  { status: "review", label: "Review", color: "border-purple-400" },
  { status: "done", label: "Done", color: "border-green-400" },
];

export const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];


