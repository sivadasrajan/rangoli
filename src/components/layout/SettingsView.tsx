
import { useAppStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function SettingsView() {
  const { 
    competition, updateCompetition, 
    resetState 
  } = useAppStore();

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-2 text-lg">Manage application configuration and data operations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-lg bg-white overflow-hidden max-w-2xl">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <CardTitle className="text-xl">Competition Details</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Basic information for reports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700">Competition Name</Label>
              <Input 
                className="h-11 bg-slate-50 border-slate-200"
                value={competition.name} 
                onChange={(e) => updateCompetition({ name: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700">Year / Edition</Label>
              <Input 
                className="h-11 bg-slate-50 border-slate-200"
                value={competition.year} 
                onChange={(e) => updateCompetition({ year: e.target.value })} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-white overflow-hidden border border-red-100 max-w-2xl">
          <CardHeader className="bg-red-50 border-b border-red-100 pb-4">
            <CardTitle className="text-xl text-red-700">Danger Zone</CardTitle>
            <CardDescription className="text-red-600/80 font-medium">Irreversible destructive actions.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 border border-red-100 rounded-xl bg-white p-5 shadow-sm">
              <div>
                <h4 className="font-bold text-lg text-slate-900">Clear All Data</h4>
                <p className="text-sm text-slate-500 mt-1 max-w-md">This will permanently delete all events, schedule entries, and participants. This action cannot be undone.</p>
              </div>
              <Button variant="destructive" className="h-11 px-6 font-bold shadow-sm shadow-red-200 w-fit" onClick={() => {
                if (confirm('Are you absolutely sure you want to delete all data?')) {
                  resetState();
                  toast.success('All data has been cleared.');
                }
              }}>
                Delete Everything
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
