import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useAppStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, FileArchive, Upload } from 'lucide-react';
import { toast } from 'sonner';

export function ReportsView() {
  const state = useAppStore();
  const printRef = useRef<HTMLDivElement>(null);
  const [activeReport, setActiveReport] = useState<'all' | 'day' | 'venue' | 'participant' | 'category'>('all');

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Rangoli_Report_${activeReport}`,
  });

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `rangoli-${state.competition.year}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success('Data exported successfully');
  };

  const triggerFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (imported.competition && imported.schedule) {
            state.importData(imported);
            toast.success('Data imported successfully');
          } else {
            toast.error('Invalid backup file format');
          }
        } catch (err) {
          toast.error('Error parsing JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Reports & Export</h2>
          <p className="text-slate-500 mt-2 text-lg">Generate printable PDFs and manage your data.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 bg-white shadow-sm border-slate-200 text-slate-700 font-semibold hover:bg-slate-50" onClick={exportJSON}>
            <Download className="h-4 w-4 mr-2" /> Export Data
          </Button>
          <Button variant="outline" className="h-11 bg-white shadow-sm border-slate-200 text-slate-700 font-semibold hover:bg-slate-50" onClick={triggerFileSelect}>
            <Upload className="h-4 w-4 mr-2" /> Import Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-lg bg-white overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <CardTitle className="text-xl">Printable Reports</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Select a report type to view and print.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Button 
              className={`w-full justify-start gap-3 h-12 shadow-sm font-semibold border-2 ${activeReport === 'day' ? 'border-primary bg-primary/5 text-primary' : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'}`} 
              variant="outline" 
              onClick={() => setActiveReport('day')}
            >
              <FileArchive className={`h-5 w-5 ${activeReport === 'day' ? 'text-primary' : 'text-slate-400'}`} /> Day Schedule (LOP)
            </Button>
            <Button 
              className={`w-full justify-start gap-3 h-12 shadow-sm font-semibold border-2 ${activeReport === 'venue' ? 'border-primary bg-primary/5 text-primary' : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'}`} 
              variant="outline" 
              onClick={() => setActiveReport('venue')}
            >
              <FileArchive className={`h-5 w-5 ${activeReport === 'venue' ? 'text-primary' : 'text-slate-400'}`} /> Venue-wise Schedule
            </Button>
            <Button 
              className={`w-full justify-start gap-3 h-12 shadow-sm font-semibold border-2 ${activeReport === 'participant' ? 'border-primary bg-primary/5 text-primary' : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'}`} 
              variant="outline" 
              onClick={() => setActiveReport('participant')}
            >
              <FileArchive className={`h-5 w-5 ${activeReport === 'participant' ? 'text-primary' : 'text-slate-400'}`} /> Event-wise Participant List
            </Button>
            <Button 
              className={`w-full justify-start gap-3 h-12 shadow-sm font-semibold border-2 ${activeReport === 'category' ? 'border-primary bg-primary/5 text-primary' : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'}`} 
              variant="outline" 
              onClick={() => setActiveReport('category')}
            >
              <FileArchive className={`h-5 w-5 ${activeReport === 'category' ? 'text-primary' : 'text-slate-400'}`} /> Category-wise Report
            </Button>
            
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Button 
                className={`w-full justify-start gap-3 h-12 shadow-sm font-semibold border-2 ${activeReport === 'all' ? 'border-primary bg-primary/5 text-primary' : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'}`} 
                variant="outline" 
                onClick={() => setActiveReport('all')}
              >
                <FileArchive className={`h-5 w-5 ${activeReport === 'all' ? 'text-primary' : 'text-slate-400'}`} /> Show All (Master Print)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-white overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <CardTitle className="text-xl">Data Backup</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Export and import competition data as JSON.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Button className="w-full justify-start gap-3 h-12 font-semibold" variant="secondary" onClick={exportJSON}>
              <Download className="h-5 w-5" /> Export Data (JSON)
            </Button>
            <Button className="w-full justify-start gap-3 h-12 font-semibold" variant="secondary" onClick={triggerFileSelect}>
              <Upload className="h-5 w-5" /> Import Data
            </Button>
            <p className="text-sm text-slate-500 mt-6 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              Your work is automatically saved in this browser. Use Export Data to create a portable backup or move to another device.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">Report Preview</h3>
          <Button onClick={() => handlePrint()} className="h-11 px-8 font-bold shadow-md gap-2 text-base">
            <Printer className="h-5 w-5" /> Print Current View
          </Button>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
          <div ref={printRef} className="p-6 md:p-8 font-sans text-slate-900 bg-white w-full min-w-[800px]">
            
            {(activeReport === 'all' || activeReport === 'day') && (
              <>
                <div className="mb-8 pb-4 border-b-2 border-slate-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black uppercase text-slate-900">{state.competition.name} {state.competition.year}</h1>
                    <h2 className="text-lg font-bold text-slate-500 mt-1">Day-wise Schedule (LOP)</h2>
                  </div>
                  <div className="text-right text-sm font-semibold text-slate-400">Generated by Rangoli</div>
                </div>
                
                {state.days.map(day => (
                  <div key={day.id} className="mb-10 break-inside-avoid">
                    <h3 className="text-xl font-bold bg-slate-100/80 text-slate-800 p-3 rounded-t-lg border border-slate-200 border-b-0 uppercase">{day.name} - {day.date}</h3>
                    <table className="w-full border-collapse border border-slate-200 text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600">
                          <th className="border border-slate-200 p-3 text-left font-bold">Time</th>
                          <th className="border border-slate-200 p-3 text-left font-bold">Event & Category</th>
                          <th className="border border-slate-200 p-3 text-left font-bold">Venue</th>
                          <th className="border border-slate-200 p-3 text-center font-bold">Participants</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.schedule
                          .filter(s => s.dayId === day.id)
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map(entry => {
                            if (entry.isBreak) {
                              return (
                                <tr key={entry.id} className="bg-amber-50/50">
                                  <td className="border border-slate-200 p-3 whitespace-nowrap text-amber-900 font-medium">
                                    {entry.startTime} - {entry.endTime}
                                  </td>
                                  <td colSpan={3} className="border border-slate-200 p-3 text-center text-amber-800 font-bold uppercase tracking-wider">
                                    ☕ {entry.breakTitle || 'Break'}
                                  </td>
                                </tr>
                              );
                            }

                            const evt = state.events.find(e => e.id === entry.eventId)?.name;
                            const cat = state.categories.find(c => c.id === entry.categoryId)?.name;
                            const ven = state.venues.find(v => v.id === entry.venueId)?.name;
                            const pCount = state.participantEntries.filter(pe => pe.scheduleEntryId === entry.id).length;
                            return (
                              <tr key={entry.id} className="hover:bg-slate-50/50">
                                <td className="border border-slate-200 p-3 whitespace-nowrap text-slate-800 font-medium">
                                  {entry.startTime} - {entry.endTime}
                                  {entry.reportingTime && <div className="text-xs text-slate-500 font-semibold mt-0.5">Rep: {entry.reportingTime}</div>}
                                </td>
                                <td className="border border-slate-200 p-3 text-slate-900 font-bold">{evt || 'Unknown'} <span className="font-medium text-slate-500 ml-1">({cat || 'Unknown'})</span></td>
                                <td className="border border-slate-200 p-3 text-slate-700 font-medium">{ven || 'Unknown'}</td>
                                <td className="border border-slate-200 p-3 text-center text-slate-700 font-bold">{pCount}</td>
                              </tr>
                            );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </>
            )}

            {(activeReport === 'all' || activeReport === 'venue') && (
              <>
                {(activeReport === 'all') && <div className="break-before-page mt-12 pt-12 border-t border-dashed border-slate-300"></div>}
                
                <div className="mb-8 pb-4 border-b-2 border-slate-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black uppercase text-slate-900">{state.competition.name} {state.competition.year}</h1>
                    <h2 className="text-lg font-bold text-slate-500 mt-1">Venue-wise Schedule</h2>
                  </div>
                </div>
                
                {state.venues.map(venue => (
                  <div key={venue.id} className="mb-10 break-inside-avoid">
                    <h3 className="text-xl font-bold bg-slate-100/80 text-slate-800 p-3 rounded-t-lg border border-slate-200 border-b-0 uppercase">{venue.name}</h3>
                    <table className="w-full border-collapse border border-slate-200 text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600">
                          <th className="border border-slate-200 p-3 text-left font-bold">Day</th>
                          <th className="border border-slate-200 p-3 text-left font-bold">Time</th>
                          <th className="border border-slate-200 p-3 text-left font-bold">Event & Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.schedule
                          .filter(s => s.venueId === venue.id)
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map(entry => {
                            const day = state.days.find(d => d.id === entry.dayId)?.name || 'Unknown';
                            
                            if (entry.isBreak) {
                              return (
                                <tr key={entry.id} className="bg-amber-50/50">
                                  <td className="border border-slate-200 p-3 text-slate-700 font-medium">{day}</td>
                                  <td className="border border-slate-200 p-3 whitespace-nowrap text-amber-900 font-medium">{entry.startTime} - {entry.endTime}</td>
                                  <td className="border border-slate-200 p-3 text-amber-800 font-bold uppercase tracking-wider">☕ {entry.breakTitle || 'Break'}</td>
                                </tr>
                              );
                            }

                            const evt = state.events.find(e => e.id === entry.eventId)?.name;
                            const cat = state.categories.find(c => c.id === entry.categoryId)?.name;
                            return (
                              <tr key={entry.id} className="hover:bg-slate-50/50">
                                <td className="border border-slate-200 p-3 text-slate-700 font-medium">{day}</td>
                                <td className="border border-slate-200 p-3 whitespace-nowrap text-slate-800 font-medium">{entry.startTime} - {entry.endTime}</td>
                                <td className="border border-slate-200 p-3 text-slate-900 font-bold">{evt || 'Unknown'} <span className="font-medium text-slate-500 ml-1">({cat || 'Unknown'})</span></td>
                              </tr>
                            );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </>
            )}

            {(activeReport === 'all' || activeReport === 'category') && (
              <>
                {(activeReport === 'all') && <div className="break-before-page mt-12 pt-12 border-t border-dashed border-slate-300"></div>}
                
                <div className="mb-8 pb-4 border-b-2 border-slate-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black uppercase text-slate-900">{state.competition.name} {state.competition.year}</h1>
                    <h2 className="text-lg font-bold text-slate-500 mt-1">Category-wise Events</h2>
                  </div>
                </div>
                
                {state.categories.map(category => (
                  <div key={category.id} className="mb-10 break-inside-avoid">
                    <h3 className="text-xl font-bold bg-slate-100/80 text-slate-800 p-3 rounded-t-lg border border-slate-200 border-b-0 uppercase">{category.name}</h3>
                    <table className="w-full border-collapse border border-slate-200 text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600">
                          <th className="border border-slate-200 p-3 text-left font-bold">Event</th>
                          <th className="border border-slate-200 p-3 text-left font-bold">Day & Time</th>
                          <th className="border border-slate-200 p-3 text-left font-bold">Venue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.schedule
                          .filter(s => s.categoryId === category.id)
                          .map(entry => {
                            const evt = state.events.find(e => e.id === entry.eventId)?.name;
                            const ven = state.venues.find(v => v.id === entry.venueId)?.name;
                            const day = state.days.find(d => d.id === entry.dayId)?.name;
                            return (
                              <tr key={entry.id} className="hover:bg-slate-50/50">
                                <td className="border border-slate-200 p-3 text-slate-900 font-bold">{evt}</td>
                                <td className="border border-slate-200 p-3 text-slate-700 font-medium">{day} ({entry.startTime})</td>
                                <td className="border border-slate-200 p-3 text-slate-700 font-medium">{ven}</td>
                              </tr>
                            );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </>
            )}

            {(activeReport === 'all' || activeReport === 'participant') && (
              <>
                {(activeReport === 'all') && <div className="break-before-page mt-12 pt-12 border-t border-dashed border-slate-300"></div>}
                
                <div className="mb-8 pb-4 border-b-2 border-slate-200 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black uppercase text-slate-900">{state.competition.name} {state.competition.year}</h1>
                    <h2 className="text-lg font-bold text-slate-500 mt-1">Participant Lists</h2>
                  </div>
                </div>

                {state.schedule.map(entry => {
                  const evt = state.events.find(e => e.id === entry.eventId)?.name;
                  const cat = state.categories.find(c => c.id === entry.categoryId)?.name;
                  const ven = state.venues.find(v => v.id === entry.venueId)?.name;
                  const day = state.days.find(d => d.id === entry.dayId);
                  
                  const pEntries = state.participantEntries.filter(pe => pe.scheduleEntryId === entry.id);
                  const entryParticipants = pEntries
                    .map(pe => state.participants.find(p => p.id === pe.participantId))
                    .filter(Boolean);

                  if (entryParticipants.length === 0) return null;

                  return (
                    <div key={`p-${entry.id}`} className="mb-10 break-inside-avoid">
                      <div className="flex justify-between items-center bg-slate-100/80 p-3 border border-slate-200 border-b-0 rounded-t-lg">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 uppercase">{evt} <span className="text-primary mx-1">•</span> {cat}</h3>
                          <div className="text-sm font-medium text-slate-600 mt-1">Venue: {ven}</div>
                        </div>
                        <div className="text-right text-sm font-medium text-slate-600">
                          <div>{day?.name} ({day?.date})</div>
                          <div className="text-slate-900 font-bold mt-1">Time: {entry.startTime}</div>
                        </div>
                      </div>
                      <table className="w-full border-collapse border border-slate-200 text-sm">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600">
                            <th className="border border-slate-200 p-3 w-16 text-center font-bold">Sl No</th>
                            <th className="border border-slate-200 p-3 text-left font-bold">Participant Name</th>
                            <th className="border border-slate-200 p-3 text-left w-32 font-bold">Class</th>
                            <th className="border border-slate-200 p-3 w-40 font-bold">Signature / Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entryParticipants.map((p, idx) => (
                            <tr key={p!.id} className="hover:bg-slate-50/50">
                              <td className="border border-slate-200 p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                              <td className="border border-slate-200 p-3 text-slate-900 font-bold">{p!.name}</td>
                              <td className="border border-slate-200 p-3 text-slate-700 font-medium">{p!.className || '-'}</td>
                              <td className="border border-slate-200 p-3"></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
