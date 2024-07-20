import {
    format,
    getDay,
    getHours,
    getMinutes,
    isSameWeek,
  } from "date-fns";
  
  export default function EventGrid({
    days,
    events,
    weekStartsOn,
    locale,
    minuteStep,
    rowHeight,
    onEventClick,
  }) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${days[0].cells.length}, minmax(${rowHeight}px, 1fr))`,
        }}
      >
        {(events || [])
          .filter((event) => isSameWeek(days[0].date, event.startDate))
          .map((event) => {
            const eventStartHour = getHours(event.startDate);
            const eventStartMinute = getMinutes(event.startDate);
            const eventEndHour = getHours(event.endDate);
            const eventEndMinute = getMinutes(event.endDate);
  
            // Adjust start and end times to fit within 08:00 - 17:00
            const adjustedStart = Math.max(eventStartHour, 8);
            const adjustedEnd = Math.min(eventEndHour, 17);
  
            const start =
              (adjustedStart - 8) * (60 / minuteStep) +
              Math.floor(eventStartMinute / minuteStep) +
              1;
            const end =
              (adjustedEnd - 8) * (60 / minuteStep) +
              Math.ceil(eventEndMinute / minuteStep) +
              1;
  
            const paddingTop =
              ((eventStartMinute % minuteStep) / minuteStep) * rowHeight;
  
            const paddingBottom =
              (rowHeight -
                ((eventEndMinute % minuteStep) / minuteStep) * rowHeight) %
              rowHeight;
  
            return (
              <div
                key={event.id}
                className="relative flex mt-[1px] transition-all"
                style={{
                  gridRowStart: start,
                  gridRowEnd: end,
                  gridColumnStart: getDay(event.startDate) - weekStartsOn + 1,
                  gridColumnEnd: "span 1",
                }}
              >
                <span
                  className="absolute inset-1 flex flex-col overflow-y-auto rounded-md p-2 text-xs leading-5 bg-blue-50 border border-transparent border-dashed hover:bg-blue-100 transition cursor-pointer"
                  style={{
                    top: paddingTop + 4,
                    bottom: paddingBottom + 4
                  }}
                  onClick={() => onEventClick?.(event)}
                >
                  <p className="text-blue-500 leading-4">
                    {format(new Date(event.startDate), "H:mm", {
                      weekStartsOn,
                      locale,
                    })}
                    -
                    {format(new Date(event.endDate), "H:mm", {
                      weekStartsOn,
                      locale,
                    })}
                  </p>
                  <p className="font-semibold text-blue-700">{event.title}</p>
                  <p className="text-blue-400">{event.subtitle}</p>
                </span>
              </div>
            );
          })}
      </div>
    );
  }
  