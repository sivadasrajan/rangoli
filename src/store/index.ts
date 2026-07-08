import { create } from 'zustand';
import type { StateStorage } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import type { AppState, Competition, Day, Venue, EventType, Category, ScheduleEntry, Participant, ParticipantEntry } from '../types';

const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

const initialState: AppState = {
  competition: { name: 'Rangoli', year: new Date().getFullYear().toString() },
  days: [],
  venues: [],
  events: [],
  categories: [],
  schedule: [],
  participants: [],
  participantEntries: [],
  isDirty: false,
  isInitialized: false,
};

interface AppActions {
  // App-level
  importData: (data: AppState) => void;
  resetState: () => void;
  setDirty: (dirty: boolean) => void;
  setInitialized: (initialized: boolean) => void;

  // Competition
  updateCompetition: (comp: Partial<Competition>) => void;

  // Days
  addDay: (day: Day) => void;
  updateDay: (id: string, day: Partial<Day>) => void;
  deleteDay: (id: string) => void;

  // Venues
  addVenue: (venue: Venue) => void;
  updateVenue: (id: string, venue: Partial<Venue>) => void;
  deleteVenue: (id: string) => void;

  // Events
  addEvent: (event: EventType) => void;
  updateEvent: (id: string, event: Partial<EventType>) => void;
  deleteEvent: (id: string) => void;

  // Categories
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Schedule
  addScheduleEntry: (entry: ScheduleEntry) => void;
  updateScheduleEntry: (id: string, entry: Partial<ScheduleEntry>) => void;
  deleteScheduleEntry: (id: string) => void;

  // Participants
  addParticipant: (participant: Participant) => void;
  updateParticipant: (id: string, participant: Partial<Participant>) => void;
  deleteParticipant: (id: string) => void;

  // Participant Entries
  addParticipantEntry: (entry: ParticipantEntry) => void;
  deleteParticipantEntry: (id: string) => void;
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      ...initialState,

      importData: (data) => set({ ...data, isInitialized: true }),
      resetState: () => set(initialState),

      updateCompetition: (comp) =>
        set((state) => ({ competition: { ...state.competition, ...comp }, isDirty: true })),

      addDay: (day) => set((state) => ({ days: [...state.days, day], isDirty: true })),
      updateDay: (id, day) =>
        set((state) => ({
          days: state.days.map((d) => (d.id === id ? { ...d, ...day } : d)),
          isDirty: true,
        })),
      deleteDay: (id) =>
        set((state) => ({
          days: state.days.filter((d) => d.id !== id),
          isDirty: true,
        })),

      addVenue: (venue) => set((state) => ({ venues: [...state.venues, venue], isDirty: true })),
      updateVenue: (id, venue) =>
        set((state) => ({
          venues: state.venues.map((v) => (v.id === id ? { ...v, ...venue } : v)),
          isDirty: true,
        })),
      deleteVenue: (id) =>
        set((state) => ({
          venues: state.venues.filter((v) => v.id !== id),
          isDirty: true,
        })),

      addEvent: (event) => set((state) => ({ events: [...state.events, event], isDirty: true })),
      updateEvent: (id, event) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
          isDirty: true,
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
          isDirty: true,
        })),

      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category], isDirty: true })),
      updateCategory: (id, category) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...category } : c
          ),
          isDirty: true,
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          isDirty: true,
        })),

      addScheduleEntry: (entry) =>
        set((state) => ({ schedule: [...state.schedule, entry], isDirty: true })),
      updateScheduleEntry: (id, entry) =>
        set((state) => ({
          schedule: state.schedule.map((s) =>
            s.id === id ? { ...s, ...entry } : s
          ),
          isDirty: true,
        })),
      deleteScheduleEntry: (id) =>
        set((state) => ({
          schedule: state.schedule.filter((s) => s.id !== id),
          isDirty: true,
        })),

      addParticipant: (participant) =>
        set((state) => ({ participants: [...state.participants, participant], isDirty: true })),
      updateParticipant: (id, participant) =>
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id ? { ...p, ...participant } : p
          ),
          isDirty: true,
        })),
      deleteParticipant: (id) =>
        set((state) => ({
          participants: state.participants.filter((p) => p.id !== id),
          isDirty: true,
        })),

      addParticipantEntry: (entry) =>
        set((state) => ({
          participantEntries: [...state.participantEntries, entry],
          isDirty: true,
        })),
      deleteParticipantEntry: (id) =>
        set((state) => ({
          participantEntries: state.participantEntries.filter((e) => e.id !== id),
          isDirty: true,
        })),
      setDirty: (dirty) => set({ isDirty: dirty }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
    }),
    {
      name: 'rangoli-storage',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => {
        const { isDirty, ...rest } = state;
        return rest as AppState & AppActions;
      },
    }
  )
);
