import { format } from "date-fns";
export const dateFormatter = (date: string | Date | undefined | null) => {
  if (!date) return "";
  const newDate = new Date(date);
  const isToday = new Date(date).getDay() === new Date().getDay();
  return isToday
    ? `Today, ${format(newDate, "hh:mm a")}`
    : format(newDate, "EEEE, MMMM d, yyyy hh:mm a");
};

export const isToday = (date: string | Date) =>
  new Date(date).getDay() === new Date().getDay();
