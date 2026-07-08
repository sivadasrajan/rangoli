import { useAppStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CalendarDays, MapPin, Trophy, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    rangoliFileHandle?: any;
  }
}

export function Dashboard({ onNavigate }: { onNavigate?: (tab: any) => void }) {
  const store = useAppStore();
  const { competition, participants, events, venues, schedule, isDirty, setDirty, days } = store;

  const handleExport = async () => {
    const { isDirty, isInitialized, ...exportData } = useAppStore.getState();
    const dataStr = JSON.stringify(exportData, null, 2);

    try {
      if (!window.rangoliFileHandle) {
        window.rangoliFileHandle = await (window as any).showSaveFilePicker({
          suggestedName: `rangoli-backup-${competition.name.replace(/\\s+/g, '-').toLowerCase()}-${competition.year}.json`,
          types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
        });
      }
      
      const writable = await window.rangoliFileHandle.createWritable();
      await writable.write(dataStr);
      await writable.close();
      
      setDirty(false);
      toast.success('Data saved successfully!');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        toast.error('Failed to save file');
        console.error(err);
      }
    }
  };

  const hasRealData = events.length > 0 || venues.length > 0 || days.length > 0 || schedule.length > 0;

  return (
    <div className="space-y-8 pb-8 animate-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-800 to-black p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-sm font-medium mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              System Active
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {competition.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{competition.year}</span>
            </h2>
            <p className="text-indigo-100/80 text-lg md:text-xl max-w-2xl font-light">
              Your intelligent, offline-first command center for cultural event management.
            </p>
          </div>

          <div className="flex-shrink-0 flex flex-col gap-3">
            {isDirty && hasRealData ? (
              <div className="bg-orange-500/10 border border-orange-500/20 backdrop-blur-md rounded-xl p-4 text-orange-100 flex flex-col gap-3 shadow-xl">
                <p className="text-sm font-medium">You have unsaved changes!</p>
                <Button onClick={handleExport} className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md transition-all">
                  <Download className="mr-2 h-4 w-4" /> {window.rangoliFileHandle ? 'Save Changes' : 'Save to File'}
                </Button>
              </div>
            ) : hasRealData ? (
              <div className="bg-green-500/10 border border-green-500/20 backdrop-blur-md rounded-xl p-4 text-green-100 flex items-center gap-3 shadow-xl">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
                <div>
                  <p className="font-bold text-green-300">All changes saved!</p>
                  <p className="text-xs text-green-200/70">Data is secure.</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Participants', value: participants.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'hover:border-blue-200' },
          { title: 'Events Scheduled', value: schedule.length, icon: CalendarDays, color: 'text-green-600', bg: 'bg-green-50', border: 'hover:border-green-200' },
          { title: 'Venues', value: venues.length, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50', border: 'hover:border-purple-200' },
          { title: 'Event Types', value: events.length, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50', border: 'hover:border-amber-200' },
        ].map((stat, i) => (
          <Card key={i} className={cn("transition-all duration-300 border-slate-100 shadow-sm hover:shadow-xl bg-white/60 backdrop-blur-xl group", stat.border)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</CardTitle>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-3 shadow-sm", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Onboarding Guide */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-slate-100 shadow-lg bg-white/80 backdrop-blur-xl">
          <CardHeader className="pb-8 border-b border-slate-50">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">Quick Start Guide</CardTitle>
            <CardDescription className="text-base font-medium">Follow these steps to orchestrate your competition</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            {[
              { num: 1, title: 'Master Data Setup', desc: 'Initialize Event Types, Categories, Days, and Venues.', target: 'masterdata' },
              { num: 2, title: 'Build Schedule', desc: 'Map out your events on the interactive Gantt timeline.', target: 'schedule' },
              { num: 3, title: 'Register Participants', desc: 'Assign students to specific events using bulk tools.', target: 'participants' },
              { num: 4, title: 'Generate Reports', desc: 'Export beautiful PDF schedules and attendance sheets.', target: 'reports' }
            ].map((step, i) => (
              <div 
                key={i} 
                className={cn("flex gap-6 items-start group relative", onNavigate ? 'cursor-pointer' : '')}
                onClick={() => onNavigate && onNavigate(step.target)}
              >
                <div className="absolute left-6 top-14 bottom-[-32px] w-px bg-slate-100 group-last:hidden" />
                <div className="bg-white border-2 border-slate-100 text-slate-400 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shadow-sm relative z-10">
                  {step.num}
                </div>
                <div className="pt-1 transition-transform duration-300 group-hover:translate-x-2">
                  <h4 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">{step.title}</h4>
                  <p className="text-base font-medium text-slate-500 leading-relaxed mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
