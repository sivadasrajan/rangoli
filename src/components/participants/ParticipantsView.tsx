import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Search, UserPlus, Trash2 } from 'lucide-react';

export function ParticipantsView() {
  const { 
    schedule, events, categories, 
    participants, participantEntries, 
    addParticipant, addParticipantEntry, deleteParticipantEntry
  } = useAppStore();

  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [singleName, setSingleName] = useState('');
  const [singleClass, setSingleClass] = useState('');
  
  const [bulkText, setBulkText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const getEventName = (id?: string) => events.find(e => e.id === id)?.name || 'Unknown';
  const getCategoryName = (id?: string) => categories.find(c => c.id === id)?.name || 'Unknown';

  const formatScheduleName = (scheduleId: string) => {
    const s = schedule.find(s => s.id === scheduleId);
    if (!s) return 'Unknown';
    if (s.isBreak) return s.breakTitle || 'Break';
    return `${getEventName(s.eventId)} - ${getCategoryName(s.categoryId)}`;
  };

  const currentParticipants = useMemo(() => {
    if (!selectedScheduleId) return [];
    const entryIds = participantEntries
      .filter(pe => pe.scheduleEntryId === selectedScheduleId)
      .map(pe => pe.participantId);
    return participants.filter(p => entryIds.includes(p.id));
  }, [selectedScheduleId, participantEntries, participants]);

  const allFilteredParticipants = useMemo(() => {
    if (!searchQuery) return [];
    const lowerQ = searchQuery.toLowerCase();
    return participants.filter(p => 
      p.name.toLowerCase().includes(lowerQ) || 
      (p.className && p.className.toLowerCase().includes(lowerQ))
    ).map(p => {
      const pEntries = participantEntries.filter(pe => pe.participantId === p.id);
      const sEntries = pEntries.map(pe => schedule.find(s => s.id === pe.scheduleEntryId)).filter(Boolean);
      return {
        ...p,
        events: sEntries.map(s => `${getEventName(s!.eventId)} (${getCategoryName(s!.categoryId)})`)
      };
    });
  }, [searchQuery, participants, participantEntries, schedule, events, categories]);

  const handleAddSingle = () => {
    if (!selectedScheduleId || !singleName.trim()) {
      toast.error('Event and Participant Name are required');
      return;
    }

    const pId = uuidv4();
    addParticipant({ id: pId, name: singleName.trim(), className: singleClass.trim() });
    addParticipantEntry({ id: uuidv4(), participantId: pId, scheduleEntryId: selectedScheduleId });
    
    toast.success('Participant added');
    setSingleName('');
    setSingleClass('');
  };

  const handleAddBulk = () => {
    if (!selectedScheduleId || !bulkText.trim()) {
      toast.error('Event and Bulk Data are required');
      return;
    }

    const lines = bulkText.split('\n').filter(l => l.trim().length > 0);
    let addedCount = 0;

    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      const name = parts[0];
      const className = parts.length > 1 ? parts[1] : '';

      if (name) {
        const pId = uuidv4();
        addParticipant({ id: pId, name, className });
        addParticipantEntry({ id: uuidv4(), participantId: pId, scheduleEntryId: selectedScheduleId });
        addedCount++;
      }
    });

    toast.success(`${addedCount} participants added`);
    setBulkText('');
  };

  const removeParticipantFromEvent = (participantId: string) => {
    const entry = participantEntries.find(pe => pe.participantId === participantId && pe.scheduleEntryId === selectedScheduleId);
    if (entry) {
      deleteParticipantEntry(entry.id);
      toast.success('Participant removed from event');
    }
  };

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Participants</h2>
        <p className="text-slate-500 mt-2 text-lg">Manage registrations and assign participants to events.</p>
      </div>

      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="mb-6 h-12 bg-slate-100 p-1 rounded-xl w-full max-w-md grid grid-cols-2">
          <TabsTrigger value="manage" className="rounded-lg font-semibold data-[state=active]:shadow-sm">Manage by Event</TabsTrigger>
          <TabsTrigger value="search" className="rounded-lg font-semibold data-[state=active]:shadow-sm">Search Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-xl">Select Event</CardTitle>
              <CardDescription className="text-slate-500">Choose an event schedule to add or view participants.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {schedule.length === 0 ? (
                <div className="text-slate-500 bg-slate-50 p-6 rounded-xl text-center border border-dashed border-slate-200">
                  Please create a schedule entry first.
                </div>
              ) : (
                <Select value={selectedScheduleId} onValueChange={setSelectedScheduleId}>
                  <SelectTrigger className="w-full md:w-[400px] h-11 bg-slate-50 border-slate-200 text-base">
                    <SelectValue placeholder="Select event category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {schedule.filter(s => !s.isBreak).map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {formatScheduleName(s.id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {selectedScheduleId && (
            <div className="space-y-6 mt-6">
              <Card className="border-none shadow-lg bg-white overflow-visible z-10 relative">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                  <CardTitle className="text-xl">Add Participants</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="single">
                    <TabsList className="w-full max-w-sm mb-6 h-11 bg-slate-100 p-1 rounded-lg">
                      <TabsTrigger value="single" className="flex-1 rounded-md font-semibold">Single</TabsTrigger>
                      <TabsTrigger value="bulk" className="flex-1 rounded-md font-semibold">Bulk Paste</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="single">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-slate-700">Student Name</Label>
                          <Input className="h-11 bg-slate-50 border-slate-200" value={singleName} onChange={e => setSingleName(e.target.value)} placeholder="e.g. Akhil" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-slate-700">Class (Optional)</Label>
                          <Input className="h-11 bg-slate-50 border-slate-200" value={singleClass} onChange={e => setSingleClass(e.target.value)} placeholder="e.g. VII A" />
                        </div>
                        <Button className="w-full h-11 font-semibold shadow-sm" onClick={handleAddSingle}><UserPlus className="h-4 w-4 mr-2"/> Add Participant</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="bulk" className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700">Paste List</Label>
                        <p className="text-xs text-slate-500">Format: Name,Class (one per line)</p>
                        <Textarea 
                          value={bulkText}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBulkText(e.target.value)}
                          placeholder="Akhil Kumar,VII A&#10;Aswathy ,V C"
                          className="min-h-[150px] bg-slate-50 border-slate-200 font-mono text-sm leading-relaxed"
                        />
                      </div>
                      <Button className="w-full sm:w-auto px-8 h-11 font-semibold shadow-sm" onClick={handleAddBulk}>Import List</Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-slate-50 border-b border-slate-100 pb-4">
                  <div>
                    <CardTitle className="text-xl">Registered Participants</CardTitle>
                    <CardDescription className="text-slate-500 mt-1 font-medium">
                      {currentParticipants.length} participant(s) registered
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {currentParticipants.length === 0 ? (
                    <div className="text-center p-12 text-slate-400">
                      No participants registered yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                      {currentParticipants.map((p, index) => (
                        <div key={p.id} className="group flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{p.name}</p>
                              {p.className && <p className="text-sm font-medium text-slate-500">Class: {p.className}</p>}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeParticipantFromEvent(p.id)}>
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="search">
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-xl">Search All Participants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Search by name or class..." 
                  className="pl-12 h-12 bg-slate-50 border-slate-200 text-base shadow-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {searchQuery && (
                <div className="space-y-4">
                  {allFilteredParticipants.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl font-medium">No matches found.</div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {allFilteredParticipants.map(p => (
                        <div key={p.id} className="p-5 border border-slate-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="font-bold text-lg text-slate-900">{p.name}</div>
                          {p.className && <div className="text-sm font-medium text-slate-500 mt-1">Class: {p.className}</div>}
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registered Events</div>
                            <div className="flex flex-wrap gap-2">
                              {p.events.map((eName, i) => (
                                <span key={i} className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-semibold">
                                  {eName}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
