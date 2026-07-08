import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeSelect } from '@/components/ui/time-select';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import type { ScheduleEntry } from '@/types';
import { Trash2, CalendarDays, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScheduleView() {
  const { schedule, events, categories, days, venues, addScheduleEntry, deleteScheduleEntry } = useAppStore();
  
  const [dayId, setDayId] = useState('');
  const [venueId, setVenueId] = useState('');
  const [eventId, setEventId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [reportingTime, setReportingTime] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isBreak, setIsBreak] = useState(false);
  const [breakTitle, setBreakTitle] = useState('');

  const handleAdd = () => {
    if (!dayId || !venueId || !startTime || !endTime) {
      toast.error('Day, Venue, Start Time, and End Time are required.');
      return;
    }

    if (isBreak) {
      if (!breakTitle.trim()) {
        toast.error('Break title is required.');
        return;
      }
    } else {
      if (!eventId || !categoryId) {
        toast.error('Event and Category are required for non-break entries.');
        return;
      }
      const isDuplicateEvent = schedule.some(s => !s.isBreak && s.eventId === eventId && s.categoryId === categoryId);
      if (isDuplicateEvent) {
        toast.error('This event and category is already scheduled.');
        return;
      }
    }

    const hasVenueConflict = schedule.some(s => {
      if (s.venueId !== venueId || s.dayId !== dayId) return false;
      return (startTime >= s.startTime && startTime < s.endTime) || 
             (endTime > s.startTime && endTime <= s.endTime) ||
             (startTime <= s.startTime && endTime >= s.endTime);
    });
    if (hasVenueConflict) {
      toast.error('The selected venue is already booked for a conflicting time slot.');
      return;
    }

    const entry: ScheduleEntry = {
      id: uuidv4(),
      dayId,
      venueId,
      eventId: isBreak ? undefined : eventId,
      categoryId: isBreak ? undefined : categoryId,
      isBreak,
      breakTitle: isBreak ? breakTitle : undefined,
      reportingTime,
      startTime,
      endTime,
      displayOrder: schedule.length,
    };

    addScheduleEntry(entry);
    toast.success('Schedule entry added');
    
    // Reset inputs
    setStartTime('');
    setEndTime('');
    setReportingTime('');
    setBreakTitle('');
  };

  const getEventName = (id?: string) => events.find(e => e.id === id)?.name || 'Unknown';
  const getCategoryName = (id?: string) => categories.find(c => c.id === id)?.name || 'Unknown';

  if (events.length === 0 || categories.length === 0 || days.length === 0 || venues.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <h3 className="text-lg font-medium">Missing Master Data</h3>
        <p className="text-muted-foreground mt-2">
          Please add Days, Venues, Event Types, and Categories in the Settings tab before creating a schedule.
        </p>
      </div>
    );
  }



  const timeToMinutes = (time: string) => {
    if (!time) return 0;
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  // Compute Gantt Chart Bounds
  let minMin = Math.min(...schedule.map(e => timeToMinutes(e.startTime)));
  let maxMin = Math.max(...schedule.map(e => timeToMinutes(e.endTime)));
  if (schedule.length === 0) {
    minMin = 8 * 60; // 08:00 default
    maxMin = 18 * 60; // 18:00 default
  }
  const startHour = Math.max(0, Math.floor(minMin / 60) - 1); // 1 hour padding
  const endHour = Math.min(24, Math.ceil(maxMin / 60) + 1);
  const totalMinutes = (endHour - startHour) * 60;

  const hoursArray: number[] = [];
  for (let h = startHour; h <= endHour; h++) {
    hoursArray.push(h);
  }

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Schedule Builder</h2>
        <p className="text-slate-500 mt-2 text-lg">Assign events and breaks to specific days, venues, and timings.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-lg bg-white overflow-visible z-10 relative">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Add to Schedule</CardTitle>
            <div className="flex items-center space-x-2 bg-slate-200/50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Checkbox id="isBreak" checked={isBreak} onCheckedChange={(c) => setIsBreak(c as boolean)} />
              <label htmlFor="isBreak" className="text-sm font-bold text-slate-700 cursor-pointer flex items-center gap-1.5">
                <Coffee className="h-4 w-4 text-orange-600" /> Add Break / Interval
              </label>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Day</Label>
                <Select value={dayId} onValueChange={setDayId}>
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map(d => <SelectItem key={d.id} value={d.id}>{d.name} - {d.date}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Venue</Label>
                <Select value={venueId} onValueChange={setVenueId}>
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {isBreak ? (
                <div className="space-y-2 lg:col-span-2">
                  <Label className="text-sm font-bold text-slate-700">Break Title</Label>
                  <Input 
                    placeholder="e.g. Lunch Break" 
                    value={breakTitle} 
                    onChange={e => setBreakTitle(e.target.value)} 
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Event</Label>
                    <Select value={eventId} onValueChange={setEventId}>
                      <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Category</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Start Time</Label>
                <TimeSelect value={startTime} onChange={setStartTime} placeholder="Select start time" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">End Time</Label>
                <TimeSelect value={endTime} onChange={setEndTime} placeholder="Select end time" />
              </div>

              {!isBreak && (
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Reporting Time</Label>
                  <TimeSelect value={reportingTime} onChange={setReportingTime} placeholder="(Optional)" />
                </div>
              )}

              <Button onClick={handleAdd} className={cn("w-full h-11 text-base font-semibold shadow-sm", isBreak ? "lg:col-span-2 bg-orange-600 hover:bg-orange-700 text-white" : "")}>
                {isBreak ? 'Add Break' : 'Add to Schedule'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-white overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <CardTitle className="text-xl">Timeline Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-4 md:px-8">
            {schedule.length === 0 ? (
              <div className="text-center p-12 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-lg">No events scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {days.filter(d => schedule.some(s => s.dayId === d.id)).map((day) => (
                  <div key={day.id} className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{day.name}</h3>
                        <p className="text-sm font-medium text-slate-500">{day.date}</p>
                      </div>
                    </div>
                    
                    <div className="border border-slate-200 rounded-xl overflow-x-auto bg-slate-50/50 shadow-inner">
                      <div className="min-w-[800px]">
                        {/* Time Header */}
                        <div className="flex relative h-10 border-b border-slate-200 bg-white ml-[140px]">
                          {hoursArray.map((h, i) => {
                            if (i === hoursArray.length - 1) return null;
                            const leftPct = (( (h * 60) - (startHour * 60) ) / totalMinutes) * 100;
                            return (
                              <div key={h} className="absolute top-0 bottom-0 border-l border-slate-100" style={{ left: `${leftPct}%` }}>
                                <span className="absolute -left-3 top-2 text-xs font-bold text-slate-400 bg-white px-1">
                                  {h === 12 ? '12 PM' : h === 0 ? '12 AM' : h > 12 ? `${h - 12} PM` : `${h} AM`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Venue Tracks */}
                        {venues.map((venue) => {
                          const entries = schedule.filter(s => s.dayId === day.id && s.venueId === venue.id);
                          if (entries.length === 0) return null;
                          
                          return (
                            <div key={venue.id} className="flex relative min-h-[80px] border-b border-slate-200 last:border-0 bg-white group hover:bg-slate-50/80 transition-colors">
                              {/* Venue Label (Sticky) */}
                              <div className="w-[140px] flex-shrink-0 sticky left-0 z-20 bg-white border-r border-slate-200 flex flex-col justify-center px-4 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.02)] group-hover:bg-slate-50">
                                <span className="font-bold text-slate-700 text-sm">{venue.name}</span>
                              </div>
                              
                              {/* Track Canvas */}
                              <div className="flex-1 relative">
                                {/* Grid lines */}
                                {hoursArray.map((h, i) => {
                                  if (i === hoursArray.length - 1) return null;
                                  const leftPct = (( (h * 60) - (startHour * 60) ) / totalMinutes) * 100;
                                  return (
                                    <div key={`grid-${h}`} className="absolute top-0 bottom-0 border-l border-slate-100 z-0" style={{ left: `${leftPct}%` }} />
                                  );
                                })}

                                {/* Events */}
                                {entries.map(entry => {
                                  const sM = timeToMinutes(entry.startTime);
                                  const eM = timeToMinutes(entry.endTime);
                                  const leftPct = ((sM - (startHour * 60)) / totalMinutes) * 100;
                                  const widthPct = ((eM - sM) / totalMinutes) * 100;

                                  return (
                                    <div 
                                      key={entry.id} 
                                      className={cn(
                                        "absolute top-2 bottom-2 rounded-md shadow-sm border p-2 flex flex-col justify-center overflow-hidden z-10 transition-all hover:z-30 hover:scale-[1.02] hover:shadow-md group/event",
                                        entry.isBreak 
                                          ? "bg-orange-50 border-orange-200 text-orange-900"
                                          : "bg-blue-50 border-blue-200 text-blue-900"
                                      )}
                                      style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 2)}%` }} // min width 2%
                                    >
                                      {entry.isBreak ? (
                                        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                                          <Coffee className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-orange-600" />
                                          {entry.breakTitle}
                                        </div>
                                      ) : (
                                        <>
                                          <div className="font-bold text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                                            {getEventName(entry.eventId)}
                                          </div>
                                          <div className="text-[10px] sm:text-xs opacity-75 font-semibold mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {getCategoryName(entry.categoryId)}
                                          </div>
                                        </>
                                      )}
                                      
                                      <div className="absolute hidden group-hover/event:flex right-1 top-1 bottom-1 items-center bg-white/90 px-1 rounded shadow-sm">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600 hover:bg-red-100" onClick={() => deleteScheduleEntry(entry.id)}>
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
