'use client'

import { useRef, useCallback, useMemo } from 'react'
import type { Event, EventTask } from '@/lib/types'

const LEFT_WIDTH = 200
const DAY_WIDTH = 24
const ROW_HEIGHT = 38
const HEADER_H1 = 24 // month row
const HEADER_H2 = 24 // week row
const HEADER_HEIGHT = HEADER_H1 + HEADER_H2

const STATUS_BAR: Record<EventTask['status'], string> = {
  todo: '#e2e8f0',
  in_progress: '#93c5fd',
  done: '#86efac',
}
const STATUS_TEXT: Record<EventTask['status'], string> = {
  todo: '#64748b',
  in_progress: '#1d4ed8',
  done: '#15803d',
}

function parseLocalDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export default function GanttChart({ event, tasks }: { event: Event; tasks: EventTask[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const eventDate = event.event_date ? parseLocalDate(event.event_date) : null

  const { rangeStart, totalDays } = useMemo(() => {
    const allDates = tasks
      .flatMap(t => [t.start_date, t.due_date])
      .filter(Boolean)
      .map(s => parseLocalDate(s!))

    let start: Date
    let end: Date

    if (allDates.length === 0) {
      start = eventDate ? addDays(eventDate, -60) : addDays(today, -30)
      end   = eventDate ? addDays(eventDate,  14) : addDays(today,  30)
    } else {
      start = new Date(Math.min(...allDates.map(d => d.getTime())))
      end   = new Date(Math.max(...allDates.map(d => d.getTime())))
      start = addDays(start, -7)
      end   = addDays(end,    7)
    }

    // ensure today and event date are visible
    if (today < start) start = addDays(today, -3)
    if (today > end)   end   = addDays(today,  3)
    if (eventDate) {
      if (eventDate < start) start = addDays(eventDate, -3)
      if (eventDate > end)   end   = addDays(eventDate,  3)
    }

    const days = Math.round((end.getTime() - start.getTime()) / 864e5) + 1
    return { rangeStart: start, totalDays: days }
  }, [tasks, eventDate, today])

  const totalWidth = totalDays * DAY_WIDTH

  const dateToX = useCallback((str: string) => {
    const d = parseLocalDate(str)
    return Math.round((d.getTime() - rangeStart.getTime()) / 864e5) * DAY_WIDTH
  }, [rangeStart])

  const dateObjToX = useCallback((d: Date) => {
    return Math.round((d.getTime() - rangeStart.getTime()) / 864e5) * DAY_WIDTH
  }, [rangeStart])

  const todayX    = dateObjToX(today)
  const eventDateX = eventDate ? dateObjToX(eventDate) : null

  // Month markers
  const monthMarkers = useMemo(() => {
    const markers: { x: number; width: number; label: string }[] = []
    let curMonth = -1
    let monthStartDay = 0

    for (let i = 0; i <= totalDays; i++) {
      const d = addDays(rangeStart, i)
      if (d.getMonth() !== curMonth) {
        if (curMonth !== -1) {
          markers.push({
            x: monthStartDay * DAY_WIDTH,
            width: (i - monthStartDay) * DAY_WIDTH,
            label: addDays(rangeStart, monthStartDay).toLocaleDateString('ja-JP', { month: 'short' }),
          })
        }
        curMonth = d.getMonth()
        monthStartDay = i
      }
    }
    return markers
  }, [rangeStart, totalDays])

  // Week markers (every 7 days)
  const weekMarkers = useMemo(() => {
    const markers: { x: number; label: string }[] = []
    for (let i = 0; i < totalDays; i += 7) {
      const d = addDays(rangeStart, i)
      markers.push({
        x: i * DAY_WIDTH,
        label: d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }),
      })
    }
    return markers
  }, [rangeStart, totalDays])

  const scrollToToday = useCallback(() => {
    scrollRef.current?.scrollTo({ left: Math.max(0, todayX - 80), behavior: 'smooth' })
  }, [todayX])

  const scrollToEventDate = useCallback(() => {
    if (eventDateX !== null) {
      scrollRef.current?.scrollTo({ left: Math.max(0, eventDateX - 80), behavior: 'smooth' })
    }
  }, [eventDateX])

  const tasksWithDates    = tasks.filter(t => t.start_date && t.due_date)
  const tasksWithoutDates = tasks.filter(t => !t.start_date || !t.due_date)

  const stickyLeft: React.CSSProperties = {
    width: LEFT_WIDTH,
    minWidth: LEFT_WIDTH,
    position: 'sticky',
    left: 0,
    background: 'white',
    zIndex: 2,
    flexShrink: 0,
  }

  const renderMarkers = () => (
    <>
      {todayX >= 0 && todayX <= totalWidth && (
        <div style={{ position: 'absolute', left: todayX, top: 0, bottom: 0, width: 2, borderLeft: '2px dashed #60a5fa', pointerEvents: 'none' }} />
      )}
      {eventDateX !== null && eventDateX >= 0 && eventDateX <= totalWidth && (
        <div style={{ position: 'absolute', left: eventDateX, top: 0, bottom: 0, width: 2, background: '#fb923c', pointerEvents: 'none' }} />
      )}
    </>
  )

  return (
    <div>
      {/* Scroll buttons */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={scrollToToday} className="text-xs px-3 py-1.5 border border-orange-100 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors">
          今日を表示
        </button>
        {eventDate && (
          <button onClick={scrollToEventDate} className="text-xs px-3 py-1.5 border border-orange-200 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors">
            開催日を表示
          </button>
        )}
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {/* Gantt scroll area */}
        <div ref={scrollRef} style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: LEFT_WIDTH + totalWidth }}>

            {/* Header */}
            <div style={{ display: 'flex', height: HEADER_HEIGHT, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ ...stickyLeft, zIndex: 10, background: '#f8fafc', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-end', padding: '0 12px 6px' }}>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>タスク</span>
              </div>
              <div style={{ width: totalWidth, position: 'relative', flexShrink: 0 }}>
                {/* Month row */}
                {monthMarkers.map((m, i) => (
                  <div key={i} style={{ position: 'absolute', top: 0, left: m.x, width: m.width, height: HEADER_H1, borderLeft: '1px solid #e2e8f0', padding: '4px 6px', fontSize: 11, color: '#475569', fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {m.label}
                  </div>
                ))}
                {/* Week row */}
                {weekMarkers.map((w, i) => (
                  <div key={i} style={{ position: 'absolute', top: HEADER_H1, left: w.x, height: HEADER_H2, borderLeft: '1px solid #f1f5f9', padding: '4px 3px', fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {w.label}
                  </div>
                ))}
                {renderMarkers()}
              </div>
            </div>

            {/* Task rows with dates */}
            {tasksWithDates.map((task, i) => {
              const startX = dateToX(task.start_date!)
              const endX   = dateToX(task.due_date!) + DAY_WIDTH
              const barW   = Math.max(endX - startX, DAY_WIDTH)
              const bgColor = i % 2 === 0 ? 'white' : '#fafafa'

              return (
                <div key={task.id} style={{ display: 'flex', height: ROW_HEIGHT, borderBottom: '1px solid #f1f5f9', background: bgColor }}>
                  <div style={{ ...stickyLeft, background: bgColor, borderRight: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_BAR[task.status], flexShrink: 0 }} />
                    {task.priority === 'high' && (
                      <span style={{ fontSize: 10, color: '#ef4444', flexShrink: 0, fontWeight: 700 }}>!</span>
                    )}
                    <span style={{ fontSize: 12, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {task.title}
                    </span>
                  </div>
                  <div style={{ width: totalWidth, position: 'relative', flexShrink: 0, height: ROW_HEIGHT }}>
                    {renderMarkers()}
                    {/* Bar */}
                    <div
                      style={{
                        position: 'absolute',
                        left: startX,
                        width: barW,
                        top: 9,
                        height: ROW_HEIGHT - 18,
                        background: STATUS_BAR[task.status],
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                      title={`${task.title}: ${task.start_date} 〜 ${task.due_date}`}
                    >
                      {barW > 50 && (
                        <span style={{ position: 'absolute', left: 5, top: 3, fontSize: 10, color: STATUS_TEXT[task.status], whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: barW - 10 }}>
                          {task.title}
                        </span>
                      )}
                    </div>
                    {/* Assignee label */}
                    {task.assignee && barW > 80 && (
                      <span style={{ position: 'absolute', left: startX + 4, top: ROW_HEIGHT - 14, fontSize: 9, color: '#94a3b8' }}>
                        {task.assignee}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Tasks without dates */}
            {tasksWithoutDates.length > 0 && (
              <>
                <div style={{ display: 'flex', height: 28, background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ ...stickyLeft, background: '#f8fafc', zIndex: 10, display: 'flex', alignItems: 'center', padding: '0 12px', borderRight: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>日程未設定</span>
                  </div>
                  <div style={{ width: totalWidth, position: 'relative', flexShrink: 0 }}>
                    {renderMarkers()}
                  </div>
                </div>
                {tasksWithoutDates.map((task) => (
                  <div key={task.id} style={{ display: 'flex', height: ROW_HEIGHT, borderBottom: '1px solid #f1f5f9', background: 'white' }}>
                    <div style={{ ...stickyLeft, borderRight: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e2e8f0', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.title}
                      </span>
                    </div>
                    <div style={{ width: totalWidth, position: 'relative', flexShrink: 0, height: ROW_HEIGHT }}>
                      {renderMarkers()}
                    </div>
                  </div>
                ))}
              </>
            )}

            {tasks.length === 0 && (
              <div style={{ display: 'flex', height: 80 }}>
                <div style={{ ...stickyLeft, borderRight: '1px solid #f1f5f9' }} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
                  タスクがありません
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-3 rounded" style={{ background: STATUS_BAR.todo }} />
            未着手
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-3 rounded" style={{ background: STATUS_BAR.in_progress }} />
            進行中
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-3 rounded" style={{ background: STATUS_BAR.done }} />
            完了
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <div className="w-4 h-3" style={{ borderLeft: '2px dashed #60a5fa' }} />
            今日
          </div>
          {eventDate && (
            <div className="flex items-center gap-1.5">
              <div className="w-0.5 h-3 bg-orange-400" />
              開催日
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
