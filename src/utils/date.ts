import { format, isToday as isTodayFn } from 'date-fns';

export function dayKey(ts: number): string {
  return format(new Date(ts), 'yyyy-MM-dd');
}

export function isToday(ts: number): boolean {
  return isTodayFn(new Date(ts));
}

export function formatDividerText(ts: number): string {
  const date = new Date(ts);

  const time = format(date, 'hh:mm a');

  if (isTodayFn(date)) {
    return `Today ${time}`;
  }

  return format(date, 'dd MMM hh:mm a');
}
