import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { Event, Category } from "./types";
import { EventCategries } from "./constants";

type CalendarState = {
  isHydrated: boolean;
  hydrate: () => void;
  events: Event[];
  categories: Category[];
  view: "dayGridMonth" | "timeGridWeek" | "timeGridDay";
  selectedEvent: Event | null;
  setView: (view: CalendarState["view"]) => void;
  setSelectedEvent: (event: Event | null) => void;
  addEvent: (event: Omit<Event, "id">) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addCategory: (category: Omit<Category, "id"> | Category) => void;
  deleteCategory: (id: string) => void;
  initialized: boolean;
};

const getLocalStorage = (key: string, fallback: any) => {
  if (typeof window === "undefined") return fallback;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : fallback;
};

export const useStore = create<CalendarState>((set) => ({
  isHydrated: false,
  events: [],
  categories: [],
  view: "dayGridMonth",
  selectedEvent: null,
  initialized: false,

  hydrate: () => {
    if (typeof window === "undefined") return;

    const savedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    const savedCategories = getLocalStorage("categories", EventCategries);

    set({
      events: savedEvents,
      categories: savedCategories,
      isHydrated: true,
    });
  },

  // Initialize only on client side
  initialize: () => {
    if (typeof window !== "undefined") {
      set({
        events: getLocalStorage("events", []).map((e: Event) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        })),
        categories: getLocalStorage("categories", EventCategries),
        initialized: true,
      });
    }
  },
  setView: (view) => set({ view }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, { ...event, id: uuid() }],
    })),
  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id
          ? {
              ...event,
              ...updates,
              // Maintain existing ID if not provided
              id: event.id,
            }
          : event
      ),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
  addCategory: (category) =>
    set((state) => {
      const existing = state.categories.find(
        (c) => c.id === ("id" in category ? category.id : undefined)
      );
      if (existing) {
        // Update existing category
        return {
          categories: state.categories.map((c) =>
            c.id === existing.id ? { ...c, ...category } : c
          ),
        };
      }
      // Add new category
      return {
        categories: [...state.categories, { ...category, id: uuid() }],
      };
    }),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      // Remove category reference from events
      events: state.events.map((event) =>
        event.categoryId === id ? { ...event, categoryId: undefined } : event
      ),
    })),
}));

// Persistence
if (typeof window !== "undefined") {
  useStore.subscribe((state) => {
    localStorage.setItem("events", JSON.stringify(state.events));
    localStorage.setItem("categories", JSON.stringify(state.categories));
  });
}
