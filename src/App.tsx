import { useEffect, useState } from 'react';
import { Home, CalendarDays, Users, FileText, Settings, Menu, Database } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { GuideDialog } from '@/components/layout/GuideDialog';
import { BookOpen } from 'lucide-react';

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
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-24 animate-in fade-in zoom-in-95 duration-500 py-6 lg:py-12">
        
        {/* Left Column: Practical Features (Hidden on mobile for space) */}
        <div className="hidden lg:flex flex-col justify-center flex-1 space-y-12">
          <div>
            <div className="w-16 h-16 bg-primary shadow-xl rounded-3xl flex items-center justify-center text-primary-foreground text-4xl mb-6" style={{ fontFamily: "'Pacifico', cursive" }}>R</div>
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4 leading-tight">
              Say goodbye to paper schedules.<br/>
              <span className="text-2xl text-slate-600 mt-2 block font-medium">പേപ്പർ ടൈംടേബിളുകളോട് വിട പറയാം.</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-md">
              A free, simple tool built to help teachers manage School Youth Festivals, Kalolsavams, and College Arts Fests without the headache of Excel sheets.
              <br/><br/>
              <span className="text-base text-slate-500 font-normal">സ്കൂൾ കലോത്സവങ്ങളും മറ്റ് മത്സരങ്ങളും എളുപ്പത്തിൽ നടത്താൻ അധ്യാപകർക്കായുള്ള ഒരു സൗജന്യ സോഫ്റ്റ്‌വെയർ.</span>
            </p>
          </div>

          <div className="space-y-10">
            {/* Feature 1: Scheduling */}
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-200">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-2 flex-1 pt-1">
                <h3 className="font-bold text-slate-800 text-lg">Visual Time-Tables</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[280px]">Stop struggling with overlapping events. Add your stages, select times, and see your entire schedule on a clear, easy-to-read timeline.</p>
              </div>
            </div>

            {/* Feature 2: Participants */}
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0 border border-green-200">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-2 flex-1 pt-1">
                <h3 className="font-bold text-slate-800 text-lg">Manage Student Lists</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[280px]">No more lost paper checklists. Quickly assign students to their events and see exactly how many are participating in each competition.</p>
              </div>
            </div>

            {/* Feature 3: Reports */}
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-200">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="space-y-2 flex-1 pt-1">
                <h3 className="font-bold text-slate-800 text-lg">Ready to Print</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[280px]">Instantly generate neat, perfectly formatted PDF schedules and participant lists. Just click print and hand them out to the judges and stage managers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Setup Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden w-14 h-14 bg-primary shadow-xl rounded-2xl flex items-center justify-center text-primary-foreground text-3xl mb-4 mx-auto" style={{ fontFamily: "'Pacifico', cursive" }}>R</div>
          
          <div className="lg:hidden text-center mb-6 px-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-xl font-extrabold text-slate-800 mb-2 tracking-tight">പേപ്പർ ടൈംടേബിളുകളോട് വിട പറയാം.</h2>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              സ്കൂൾ കലോത്സവങ്ങളും മറ്റ് മത്സരങ്ങളും എളുപ്പത്തിൽ നടത്താൻ അധ്യാപകർക്കായുള്ള ഒരു സൗജന്യ സോഫ്റ്റ്‌വെയർ.
            </p>
          </div>
          
          <Card className="w-full border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
            <CardHeader className="text-center pb-2 bg-gradient-to-b from-slate-50 to-white pt-6">
              <CardTitle className="text-2xl font-extrabold text-slate-900 flex flex-col gap-1 items-center">
                <span className="text-sm font-bold text-slate-500 tracking-wider">നമസ്കാരം! Welcome to</span>
                <span className="text-3xl text-primary mt-1" style={{ fontFamily: "'Pacifico', cursive" }}>Rangoli</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 px-6 pb-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Event / Competition Name</Label>
                  <Input 
                    autoFocus
                    placeholder="e.g. Sargam, Spring Fest..." 
                    className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 text-base font-medium"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Year / Edition</Label>
                  <Input 
                    placeholder="e.g. 2026" 
                    className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 text-base font-medium"
                    value={year} 
                    onChange={(e) => setYear(e.target.value)} 
                  />
                </div>
                <Button onClick={handleCreate} className="w-full h-11 text-base font-bold shadow-md hover:shadow-lg transition-all mt-1">
                  Create New Event
                </Button>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">Or</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button variant="outline" onClick={triggerFileSelect} className="w-full h-11 border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm">
                  <Upload className="h-4 w-4 mr-2" /> Import Backup
                </Button>
                <GuideDialog>
                  <Button variant="secondary" className="w-full text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-bold h-11 shadow-sm border border-indigo-100 text-sm">
                    <BookOpen className="h-4 w-4 mr-2 text-indigo-600" /> How to use / ഉപയോഗിക്കേണ്ട വിധം
                  </Button>
                </GuideDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
