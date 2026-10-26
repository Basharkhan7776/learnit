import React, { useMemo } from 'react';
import { useGolang } from '../context/GolangContext';
import { Tooltip } from './ui/Tooltip';
import { cn } from '../lib/utils';
import { Flame, Calendar, Award, CheckCircle2 } from 'lucide-react';

export const ActivityHeatmap: React.FC = () => {
  const { activityHistory, completedCount } = useGolang();

  const { weeks, stats } = useMemo(() => {
    const today = new Date();
    const days: Array<{
      date: string;
      displayDate: string;
      count: number;
      dayOfWeek: number;
    }> = [];

    const TOTAL_DAYS = 52 * 7;
    for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const displayDate = d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const count = activityHistory[dateStr] || 0;
      days.push({
        date: dateStr,
        displayDate,
        count,
        dayOfWeek: d.getDay(),
      });
    }

    const weekCols: Array<typeof days> = [];
    let currentWeek: typeof days = [];

    days.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weekCols.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length > 0) {
      weekCols.push(currentWeek);
    }

    let totalPractices = 0;
    let activeDays = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const todayStr = today.toISOString().slice(0, 10);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const sortedDates = Object.keys(activityHistory).sort();
    sortedDates.forEach(date => {
      const c = activityHistory[date];
      if (c > 0) {
        totalPractices += c;
        activeDays++;
      }
    });

    let checkDate = new Date(today);
    if ((activityHistory[todayStr] || 0) === 0 && (activityHistory[yesterdayStr] || 0) > 0) {
      checkDate = yesterday;
    }

    while (true) {
      const str = checkDate.toISOString().slice(0, 10);
      if ((activityHistory[str] || 0) > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    days.forEach(day => {
      if (day.count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    return {
      weeks: weekCols,
      stats: {
        totalPractices,
        activeDays,
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
      },
    };
  }, [activityHistory]);

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-[#18181b] border-zinc-800/60';
    if (count === 1) return 'bg-blue-950 text-blue-300 border-blue-900/60';
    if (count <= 3) return 'bg-blue-800 text-blue-200 border-blue-700';
    if (count <= 5) return 'bg-blue-600 text-white border-blue-500';
    return 'bg-sky-400 text-black border-sky-300 shadow-xs shadow-sky-400/20';
  };

  return (
    <div className="border border-zinc-800 rounded-xl bg-[#121215] p-3.5 space-y-3.5 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-semibold text-zinc-100">Learning Activity & Streak</h4>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            <strong className="text-zinc-200">{stats.currentStreak}</strong> day streak
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            <strong className="text-zinc-200">{stats.longestStreak}</strong> best
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <strong className="text-zinc-200">{completedCount}</strong> solved
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-1">
        <div className="flex gap-[3px] min-w-max">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-[3px]">
              {week.map(day => (
                <Tooltip
                  key={day.date}
                  content={
                    <span>
                      <strong>{day.count}</strong> {day.count === 1 ? 'exercise' : 'exercises'} on {day.displayDate}
                    </span>
                  }
                  side="top"
                >
                  <div
                    className={cn(
                      'w-2.5 h-2.5 rounded-[2px] border transition-all hover:scale-125 cursor-pointer',
                      getColorClass(day.count)
                    )}
                  />
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/40">
        <span>365-day practice heatmap</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <div className="w-2 h-2 rounded-[2px] bg-[#18181b] border border-zinc-800/60" />
          <div className="w-2 h-2 rounded-[2px] bg-blue-950 border border-blue-800/60" />
          <div className="w-2 h-2 rounded-[2px] bg-blue-800 border border-blue-700" />
          <div className="w-2 h-2 rounded-[2px] bg-blue-600 border border-blue-500" />
          <div className="w-2 h-2 rounded-[2px] bg-sky-400 border border-sky-300" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
