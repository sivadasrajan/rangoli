import { useEffect, useState } from 'react';
import { Home, CalendarDays, Users, FileText, Settings, Menu, Database } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

// Placeholder components for routing
import { Dashboard } from '@/components/layout/Dashboard';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { ParticipantsView } from '@/components/participants/ParticipantsView';
import { ReportsView } from '@/components/reports/ReportsView';
import { SettingsView } from '@/components/layout/SettingsView';
import { MasterDataView } from '@/components/master-data/MasterDataView';

type Tab = 'home' | 'schedule' | 'participants' | 'masterdata' | 'reports' | 'settings';

function InitDialog() {
  const { setInitialized, updateCompetition, importData } = useAppStore();
  const [name, setName] = useState('');
  const [year, setYear] = useState('');

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
            importData(imported);
            setInitialized(true);
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

  const handleCreate = () => {
    if (name.trim()) {
      updateCompetition({ name, year: year || new Date().getFullYear().toString() });
      setInitialized(true);
    } else {
      toast.error('Please enter a competition name');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-[100] p-4">
      <div className="w-16 h-16 bg-primary shadow-2xl rounded-3xl flex items-center justify-center text-primary-foreground text-3xl font-black mb-8 animate-bounce">R</div>
      
      <Card className="max-w-md w-full border-none shadow-2xl bg-white overflow-hidden animate-in zoom-in-95 duration-500">
        <CardHeader className="text-center pb-2 bg-gradient-to-b from-slate-50 to-white">
          <CardTitle className="text-2xl font-extrabold text-slate-900">Welcome to Rangoli</CardTitle>
          <CardDescription className="text-slate-500 font-medium">Let's get your cultural event setup.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 px-8 pb-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700">Event / Competition Name</Label>
              <Input 
                autoFocus
                placeholder="e.g. Sargam, Spring Fest..." 
                className="h-12 bg-slate-50 border-slate-200 text-lg font-medium"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700">Year</Label>
              <Input 
                placeholder="e.g. 2026" 
                className="h-12 bg-slate-50 border-slate-200 text-lg font-medium"
                value={year} 
                onChange={(e) => setYear(e.target.value)} 
              />
            </div>
            <Button onClick={handleCreate} className="w-full h-12 text-base font-bold shadow-md">
              Create New Event
            </Button>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-500 font-bold tracking-wider">Or</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-slate-500 mb-3">Already have a backup?</p>
            <Button variant="outline" onClick={triggerFileSelect} className="w-full h-12 border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
              <Upload className="h-4 w-4 mr-2" /> Import from Backup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'masterdata', label: 'Master Data', icon: Database },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const isInitialized = useAppStore(s => s.isInitialized);
  const events = useAppStore(s => s.events);
  const days = useAppStore(s => s.days);
  const venues = useAppStore(s => s.venues);
  
  const showInitDialog = !isInitialized && 
                         (!events || events.length === 0) && 
                         (!days || days.length === 0) && 
                         (!venues || venues.length === 0);

  useEffect(() => {
    const state = useAppStore.getState();
    if (state.schedule && state.schedule.length > 0) {
      toast.success('Progress loaded from previous session', {
        description: `Found ${state.schedule.length} scheduled events.`,
      });
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const state = useAppStore.getState();
      const hasRealData = state.events.length > 0 || state.venues.length > 0 || state.days.length > 0 || state.schedule.length > 0;
      if (state.isDirty && hasRealData) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Want to save to file before leaving?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-foreground flex w-full flex-col lg:flex-row font-sans selection:bg-primary/20">
      {/* Mobile Header */}
      <header className="lg:hidden border-b flex items-center justify-between p-4 bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-md">R</div>
          <h1 className="font-bold text-xl tracking-tight text-slate-800">REMS</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        ${isMobileMenuOpen ? 'flex' : 'hidden'} 
        lg:flex flex-col w-full lg:w-[280px] border-r border-slate-200 bg-white p-6 transition-all z-40 
        absolute lg:static top-[69px] left-0 h-[calc(100vh-69px)] lg:h-screen shadow-lg lg:shadow-none
      `}>
        <div className="hidden lg:flex items-center gap-4 px-2 mb-10 mt-4">
          <div className="w-12 h-12 bg-primary shadow-xl rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-bold">R</div>
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight leading-none text-slate-800">Rangoli</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Management</p>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-4 text-[15px] h-12 transition-all duration-200 ${
                  isActive 
                    ? 'bg-slate-100 text-slate-900 font-semibold shadow-sm' 
                    : 'text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-900'
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                {tab.label}
              </Button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-69px)] lg:h-screen overflow-hidden bg-slate-50/50 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-slate-100 to-transparent -z-10 pointer-events-none" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-10">
          <div className="mx-auto max-w-[1200px] animate-in fade-in duration-500">
            {showInitDialog ? (
              <InitDialog />
            ) : (
              <>
                {activeTab === 'home' && <Dashboard onNavigate={setActiveTab} />}
                {activeTab === 'masterdata' && <MasterDataView />}
                {activeTab === 'schedule' && <ScheduleView />}
                {activeTab === 'participants' && <ParticipantsView />}
                {activeTab === 'reports' && <ReportsView />}
                {activeTab === 'settings' && <SettingsView />}
              </>
            )}
          </div>
        </div>
      </main>

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
