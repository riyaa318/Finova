import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";

export const BUDGET_STATUS = {
  healthy: {
    label: "Healthy",
    tone: "success",
    bar: "accent",
    icon: CircleCheck,
  },
  warning: {
    label: "Warning",
    tone: "warning",
    bar: "warning",
    icon: TriangleAlert,
  },
  exceeded: {
    label: "Exceeded",
    tone: "danger",
    bar: "danger",
    icon: CircleAlert,
  },
};
