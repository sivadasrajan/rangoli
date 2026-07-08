export interface Competition {
  name: string;
  year: string;
  logo?: string;
}

export interface Day {
  id: string;
  name: string;
  date: string;
}

export interface Venue {
  id: string;
  name: string;
}

export interface EventType {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ScheduleEntry {
  id: string;
  dayId: string;
  venueId: string;
  eventId?: string;
  categoryId?: string;
  isBreak?: boolean;
  breakTitle?: string;
  reportingTime: string; // e.g., "09:00"
  startTime: string; // e.g., "10:15"
  endTime: string; // e.g., "11:00"
  displayOrder: number;
}

export interface Participant {
  id: string;
  name: string;
  className?: string; // Class is optional in SRS
}

export interface ParticipantEntry {
  id: string;
  participantId: string;
  scheduleEntryId: string;
}

export interface AppState {
  competition: Competition;
  days: Day[];
  venues: Venue[];
  events: EventType[];
  categories: Category[];
  schedule: ScheduleEntry[];
  participants: Participant[];
  participantEntries: ParticipantEntry[];
  isDirty: boolean;
  isInitialized: boolean;
}
