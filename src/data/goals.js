import { addDays, toISODate } from "../utils/dates";

export const generateGoals = (today = new Date()) => [
  {
    id: "goal_emergency",
    title: "Emergency Fund",
    icon: "Shield",
    targetAmount: 100000,
    currentAmount: 62500,
    deadline: toISODate(addDays(today, 150)),
    createdAt: toISODate(addDays(today, -210)),
  },
  {
    id: "goal_laptop",
    title: "New Laptop",
    icon: "Laptop",
    targetAmount: 150000,
    currentAmount: 48000,
    deadline: toISODate(addDays(today, 240)),
    createdAt: toISODate(addDays(today, -120)),
  },
  {
    id: "goal_travel",
    title: "Travel Fund",
    icon: "Plane",
    targetAmount: 75000,
    currentAmount: 31250,
    deadline: toISODate(addDays(today, 120)),
    createdAt: toISODate(addDays(today, -90)),
  },
  {
    id: "goal_skills",
    title: "Skill Upgrade Fund",
    icon: "GraduationCap",
    targetAmount: 20000,
    currentAmount: 20000,
    deadline: toISODate(addDays(today, -14)),
    createdAt: toISODate(addDays(today, -300)),
  },
];
