import { format, isBefore, setHours, setMinutes, startOfWeek } from "date-fns";
import {WeekView} from "./calendar";

export function CalendarSection({events}) {
  return (
    <div>
        <WeekView
          initialDate={new Date()}
          weekStartsOn={1}
          disabledCell={(date) => {
            return isBefore(date, new Date());
          }}
          disabledWeek={(startDayOfWeek) => {
            return isBefore(startDayOfWeek, startOfWeek(new Date()));
          }}
          events={events}
          onCellClick={(cell) => alert(`Clicked ${format(cell.date, "Pp")}`)}
          onEventClick={(event) =>
            alert(
              `${event.title} ${format(event.startDate, "Pp")} - ${format(
                event.endDate,
                "Pp"
              )}`
            )
          }
        />
    </div>
  );
}

export default CalendarSection;
