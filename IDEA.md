# Software Requirements Specification (SRS)

**Project:** Rangoli Event Management System (REMS)
**Version:** 1.0
**Document Version:** 1.0
**Platform:** Web (Frontend Only)

---

# 1. Introduction

## 1.1 Purpose

The Rangoli Event Management System (REMS) is a lightweight, offline-first web application designed to help schools organize cultural competitions.

It replaces manual editing of Word documents and spreadsheets by maintaining a single source of truth for:

* Competition schedule
* Events
* Participants
* Venues

The application generates all required printable reports directly from the stored data.

---

## 1.2 Goals

The system shall:

* Eliminate duplicate data entry.
* Reduce manual formatting work.
* Minimize participant omissions.
* Generate printable documents identical to existing school formats.
* Operate completely offline.
* Require no installation or server.

---

## 1.3 Scope

The application manages:

* Competition setup
* Schedule creation
* Participant registration
* PDF generation
* Data import/export

The application does **not** manage:

* Online registrations
* Payments
* Authentication
* Networking
* Cloud synchronization

---

# 2. Overall Description

## 2.1 Architecture

```
Browser

React Application

↓
Application State

↓

JSON File
```

No backend exists.

No database exists.

All data is stored inside a JSON document.

---

## 2.2 Users

Single user.

Usually:

* Teacher
* Event coordinator
* School office staff

---

## 2.3 Operating Environment

Modern browsers.

Supported:

* Chrome
* Edge
* Firefox
* Safari

Responsive design for:

* Desktop
* Tablet
* Mobile

---

# 3. Functional Requirements

---

# FR-1 Competition Management

The system shall allow creation of a competition.

Fields:

* Competition Name
* Year
* Optional Logo

Example

```
RANGOLI

2026
```

---

# FR-2 Day Management

Users shall create one or more days.

Fields:

* Name
* Date

Example

```
Day I

10 Jul 2026

Day II

11 Jul 2026
```

---

# FR-3 Venue Management

Users shall create venues.

Fields

* Venue Name

Example

```
Indoor Stadium

Galaxy VB

Library

Galaxy VIIIA
```

Users may edit or delete venues.

---

# FR-4 Event Types

Users shall define event names.

Examples

```
Dance

Recitation English

Recitation Malayalam

Elocution English

Light Music English

Story Telling
```

Duplicate event names shall not be allowed.

---

# FR-5 Categories

Users shall define categories.

Examples

```
Category II

Category III

Category IV

Category V
```

---

# FR-6 Schedule Builder

Users shall assign events to:

* Day
* Venue
* Category

Fields

```
Event

Category

Venue

Reporting Time

Start Time

End Time
```

Example

```
Dance

Category III

9:00

10:15
```

Events shall be sortable.

Drag and drop should be supported.

The application shall detect overlapping schedules.

---

# FR-7 Participant Management

Users shall add participants to an event.

Fields

```
Name

Class (optional)
```

Example

```
John Doe
V A
```

Unlimited participants shall be supported.

---

# FR-8 Bulk Entry

Users shall paste participant lists.

Example

```
John Doe,V A
Jane Doe,VII C
```

The application shall automatically create participants.

---

# FR-9 Search

Users shall search participants.

Search results shall include

* Participant
* Events
* Category
* Venue

---

# FR-10 Validation

The application shall detect:

Missing participants

```
Dance III

0 Participants
```

Duplicate participants

Overlapping schedules

Missing reporting times

Empty venues

Duplicate events

---

# FR-11 Reports

The application shall generate:

## Day Schedule

Equivalent to existing LOP.

---

## Venue Schedule

Grouped by venue.

---

## Event-wise List

Example

```
Dance

Category III

1.

2.

3.
```

---

## Category-wise Report

Grouped by category.

---

## Participant Report

Grouped by participant.

Useful for certificates.

---

# FR-12 PDF Generation

Users shall generate

* Day-wise PDF
* Venue-wise PDF
* Event-wise PDF
* Category-wise PDF

Generated PDFs shall preserve:

* Header
* Numbering
* Event ordering
* Formatting

---

# FR-13 JSON Export

Users shall save all data into a JSON file.

Example

```
rangoli-2026.json
```

---

# FR-14 JSON Import

Users shall open an existing JSON file.

Application state shall be restored completely.

---

# FR-15 Autosave

Application shall automatically save working state into browser storage.

If browser closes unexpectedly, users shall be offered recovery.

---

# FR-16 Unsaved Changes Detection

Application shall indicate unsaved changes.

Example

```
● Unsaved Changes
```

Closing the browser shall display a warning.

---

# FR-17 Export Bundle

Users shall generate all PDFs simultaneously.

Example output

```
Day1.pdf

Day2.pdf

Stage1.pdf

Stage2.pdf

Dance III.pdf

...

competition.json
```

ZIP archive generation is optional.

---

# 4. Data Model

## Competition

```
Competition

Name

Year

Logo
```

---

## Day

```
Day

Id

Name

Date
```

---

## Venue

```
Venue

Id

Name
```

---

## Event

```
Event

Id

Name
```

---

## Category

```
Category

Id

Name
```

---

## Schedule Entry

```
Day

Venue

Event

Category

Reporting Time

Start Time

End Time

Display Order
```

---

## Participant

```
Name

Class
```

---

## Participant Entry

```
Participant

Schedule Entry
```

---

# 5. JSON Format

```json
{
  "competition": {},
  "days": [],
  "venues": [],
  "events": [],
  "categories": [],
  "schedule": [],
  "participants": []
}
```

---

# 6. User Interface

Navigation

```
Home

Schedule

Participants

Reports

Settings
```

---

Home

```
Open Competition

New Competition

Recover Unsaved Work
```

---

Schedule

Timeline view.

Grouped by venue.

---

Participants

Grouped by event.

Supports search.

Supports bulk paste.

---

Reports

Buttons

```
Generate LOP

Generate Venue PDF

Generate Event PDF

Generate Category PDF

Generate Everything
```

---

# 7. Non-Functional Requirements

## Performance

* Support 5,000+ participants.
* PDF generation under 10 seconds.
* Search under 100 ms.

---

## Reliability

No internet required.

All operations must function offline.

---

## Portability

Runs directly in browser.

No installation.

---

## Maintainability

Entire application shall be written in TypeScript.

Strict typing required.

---

## Accessibility

Large touch targets.

Responsive layout.

Keyboard shortcuts where applicable.

---

# 8. Technology Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Zustand
* React Hook Form
* Zod
* dnd-kit
* html2pdf.js or react-to-print
* File System Access API (where supported)
* IndexedDB (autosave)

---

# 9. Future Enhancements

* Certificate generation
* Judge score entry
* Automatic result calculation
* House-wise reports
* QR codes for participants
* Attendance marking
* Multi-language interface
* CSV/Excel import and export
* Theme editor for school branding
* Duplicate previous year's competition
* Printable participant badges
* Certificate numbering
* Result publication page
* Cloud synchronization (optional)

---

# 10. Design Principles

* Offline-first
* Single source of truth
* Mobile-friendly
* Print-first document generation
* Minimal user interaction
* Zero manual document editing
* JSON as the canonical storage format
* No backend dependency
* No authentication required
* Deterministic PDF generation

This design keeps the application simple, maintainable, and suitable for annual school events while ensuring that all reports are generated from one consistent dataset, eliminating manual duplication and reducing the risk of scheduling or participant errors.
