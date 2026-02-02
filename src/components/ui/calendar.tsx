"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  startMonth,
  endMonth,
  ...props
}: CalendarProps) {
  const now = new Date();
  const defaultStartMonth = startMonth ?? new Date(now.getFullYear() - 100, 0);
  const defaultEndMonth = endMonth ?? new Date(now.getFullYear() + 10, 11);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      startMonth={defaultStartMonth}
      endMonth={defaultEndMonth}
      className={cn(
        "rounded-lg border border-grey-200 bg-white p-4",
        className
      )}
      classNames={{
        root: "rdp-root",
        months: "flex flex-col gap-4 sm:flex-row",
        month: "flex flex-col gap-3",
        month_caption:
          "flex justify-center items-center relative min-h-8 px-12 gap-4",
        nav: "absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none",
        button_previous:
          "pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md bg-transparent p-0 opacity-60 hover:opacity-100 hover:bg-grey-100 flex items-center justify-center [&_svg]:w-3.5 [&_svg]:h-3.5",
        button_next:
          "pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md bg-transparent p-0 opacity-60 hover:opacity-100 hover:bg-grey-100 flex items-center justify-center [&_svg]:w-3.5 [&_svg]:h-3.5",
        month_grid: "w-full min-w-0",
        weekdays: "grid grid-cols-7 gap-0 mb-1",
        weekday:
          "flex items-center justify-center h-7 text-grey-500 text-[0.7rem] font-medium",
        weeks: "flex flex-col gap-0.5",
        week: "grid grid-cols-7 gap-0",
        day: "flex items-center justify-center",
        day_button:
          "h-7 w-7 rounded-md p-0 text-xs font-normal flex items-center justify-center hover:bg-grey-100 focus:bg-grey-100 focus:outline-none aria-selected:opacity-100",
        selected:
          "bg-brand text-white hover:bg-brand hover:text-white focus:bg-brand focus:text-white",
        today: "bg-grey-100 text-grey-900",
        outside: "text-grey-400 opacity-50",
        disabled: "text-grey-400 opacity-50",
        dropdowns: "flex gap-1.5 justify-center",
        dropdown_root: "relative inline-flex items-center",
        dropdown:
          "absolute inset-0 w-full cursor-pointer opacity-0 [appearance:none] [border:none]",
        months_dropdown: "mr-0.5",
        years_dropdown: "ml-0.5",
        caption_label:
          "flex items-center gap-1 rounded border border-grey-200 bg-white px-1.5 py-1 text-xs font-medium text-grey-800",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
