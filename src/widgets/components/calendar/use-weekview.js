import { useState } from "react";
import {
  addDays,
  eachDayOfInterval,
  eachMinuteOfInterval,
  endOfDay,
  startOfDay,
  startOfWeek,
  setHours,
  setMinutes,
  isToday,
  format,
  isSameMonth,
  isSameYear,
} from "date-fns";
import { es } from 'date-fns/locale';


export function useWeekView({
  initialDate,
  minuteStep = 30,
  weekStartsOn = 1,
  locale,
  disabledCell,
  disabledDay,
  disabledWeek,
} = {}) {
  const [startOfTheWeek, setStartOfTheWeek] = useState(
    startOfWeek(startOfDay(initialDate || new Date()), { weekStartsOn })
  );

  const nextWeek = () => {
    const nextWeek = addDays(startOfTheWeek, 7);
    if (disabledWeek && disabledWeek(nextWeek)) return;
    setStartOfTheWeek(nextWeek);
  };

  const previousWeek = () => {
    const previousWeek = addDays(startOfTheWeek, -7);
    if (disabledWeek && disabledWeek(previousWeek)) return;
    setStartOfTheWeek(previousWeek);
  };

  const goToToday = () => {
    setStartOfTheWeek(startOfWeek(startOfDay(new Date()), { weekStartsOn }));
  };

  const days = eachDayOfInterval({
    start: startOfTheWeek,
    end: addDays(startOfTheWeek, 6),
  }).map((day) => ({
    date: day,
    isToday: isToday(day),
    name: capitalizeFirstLetter(format(day, "EEEE", { locale: es })),
    shortName: capitalizeFirstLetter(format(day, "EEE", { locale: es })),
    dayOfMonth: format(day, "d", { locale }),
    dayOfMonthWithZero: format(day, "dd", { locale }),
    dayOfMonthWithSuffix: format(day, "do", { locale }),
    disabled: disabledDay ? disabledDay(day) : false,
    cells: eachMinuteOfInterval(
      {
        start: setHours(setMinutes(startOfDay(day), 0), 8),
        end: setHours(setMinutes(endOfDay(day), 0), 17),
      },
      {
        step: minuteStep,
      }
    ).map((hour) => ({
      date: hour,
      hour: format(hour, "HH", { locale }),
      minute: format(hour, "mm", { locale }),
      hourAndMinute: format(hour, "HH:mm", { locale }),
      disabled: disabledCell ? disabledCell(hour) : false,
    })),
  }));

  const isAllSameYear = isSameYear(days[0].date, days[days.length - 1].date);
  const isAllSameMonth = isSameMonth(days[0].date, days[days.length - 1].date);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  let viewTitle = "";
  if (isAllSameMonth) {
    viewTitle = capitalizeFirstLetter(format(days[0].date, "MMMM yyyy", { locale: es }));
  } else if (isAllSameYear) {
    viewTitle = `${capitalizeFirstLetter(format(days[0].date, "MMM", { locale: es }))} - ${capitalizeFirstLetter(
      format(days[days.length - 1].date, "MMM", { locale: es })
    )} ${format(days[0].date, "yyyy", { locale: es })}`;
  } else {
    viewTitle = `${capitalizeFirstLetter(format(days[0].date, "MMM yyyy", { locale: es }))} - ${capitalizeFirstLetter(
      format(days[days.length - 1].date, "MMM yyyy", { locale: es })
    )}`;
  }


  const weekNumber = format(days[0].date, "w", { locale });

  return {
    nextWeek,
    previousWeek,
    goToToday,
    days,
    weekNumber,
    viewTitle,
  };
}

export default useWeekView;