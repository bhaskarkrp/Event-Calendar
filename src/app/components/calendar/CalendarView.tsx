"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/app/lib/store";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./Calendar.module.css";
import '../../global.css'

const CalendarSkeleton = () => (
  <div className="h-[80vh] bg-gray-50 animate-pulse rounded-lg" />
);

const CalendarView = () => {
  const { events, view, categories, isHydrated } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isHydrated) return <CalendarSkeleton />;

  const getCategoryColor = (categoryId?: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "#4a5568";
  };

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        initialView={view}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="80vh"
        nowIndicator={true}
        editable={true}
        events={events.map((event) => ({
          ...event,
          backgroundColor: getCategoryColor(event.categoryId) + "20",
          borderColor: getCategoryColor(event.categoryId),
          extendedProps: {
            categoryId: event.categoryId,
            reminders: event.reminders,
          },
        }))}
        eventDrop={({ event }) =>
          useStore.getState().updateEvent(event.id, {
            start: event.start!,
            end: event.end || event.start!,
          })
        }
        eventClick={({ event }) => {
          const storeEvent = events.find((e) => e.id === event.id);
          if (storeEvent) useStore.getState().setSelectedEvent(storeEvent);
        }}
        eventContent={(eventInfo) => (
          <div className="flex">
            <time className={styles.eventTime}>{eventInfo.timeText}</time>
            <h3 className={styles.eventTitle}>{eventInfo.event.title}</h3>
          </div>
        )}
      />
    </div>
  );
};

export default CalendarView;
