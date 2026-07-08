import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';
import type { ReactNode } from 'react';

export function GuideDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden !z-[200]">
        <DialogHeader className="px-8 py-5 border-b bg-slate-50 sticky top-0 z-10">
          <DialogTitle className="text-3xl font-bold flex items-center gap-2 text-slate-800">
            <BookOpen className="h-7 w-7 text-primary" />
            How to use Rangoli
          </DialogTitle>
          <DialogDescription className="text-slate-600 font-medium text-base mt-1">
            എങ്ങനെയാണ് ഈ സോഫ്റ്റ്‌വെയർ ഉപയോഗിക്കേണ്ടത് എന്നതിനെക്കുറിച്ചുള്ള ലഘുവിവരണം.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="p-8 h-[75vh]">
          <div className="space-y-10 pr-6 pb-6">
            
            <section className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">1</div>
                Setup Master Data (മാസ്റ്റർ ഡാറ്റ)
              </h3>
              <p className="text-slate-600 leading-relaxed pl-13 text-base">
                Go to the <b>Master Data</b> tab first. Here you should add all your <b>Events</b> (e.g. Mohiniyattam, Light Music) and <b>Venues/Stages</b> (e.g. Main Stage, Room 101). Set the durations for each event and add any breaks (like Lunch Break) specific to each stage. 
                <br/><br/>
                <span className="text-slate-500 font-medium text-base">
                  ആദ്യം <b>Master Data</b> ടാബിൽ പോയി പരിപാടികളും (ഉദാഹരണത്തിന്: മോഹിനിയാട്ടം, ലളിതഗാനം) വേദികളും (ഉദാഹരണത്തിന്: സ്റ്റേജ് 1, റൂം 101) ചേർക്കുക. ഓരോ പരിപാടിക്കും ആവശ്യമുള്ള സമയവും ഇടവേളകളും (ഉച്ചഭക്ഷണം തുടങ്ങിയവ) ഇവിടെ നൽകാം.
                </span>
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">2</div>
                Build the Schedule (ടൈംടേബിൾ നിർമാണം)
              </h3>
              <p className="text-slate-600 leading-relaxed pl-13 text-base">
                Go to the <b>Schedule</b> tab. Select a Stage and a Day. You will see a timeline. Click "Add Event" to place an event onto the timeline at a specific time. The app will prevent you from scheduling two events at the same time on the same stage.
                <br/><br/>
                <span className="text-slate-500 font-medium text-base">
                  <b>Schedule</b> ടാബിൽ ചെന്ന് വേദിയും ദിവസവും തിരഞ്ഞെടുക്കുക. ടൈംലൈനിൽ "Add Event" ക്ലിക്ക് ചെയ്ത് പരിപാടികൾ സമയം തിരിച്ച് ക്രമീകരിക്കാം. ഒരേ സമയം ഒരു വേദിയിൽ രണ്ട് പരിപാടികൾ നൽകാൻ കഴിയില്ല.
                </span>
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0 shadow-sm">3</div>
                Manage Participants (മത്സരാർത്ഥികൾ)
              </h3>
              <p className="text-slate-600 leading-relaxed pl-13 text-base">
                In the <b>Participants</b> tab, you can add students and assign them to the events they are participating in. You can also track their Chest Numbers and contact details here.
                <br/><br/>
                <span className="text-slate-500 font-medium text-base">
                  <b>Participants</b> ടാബിൽ കുട്ടികളുടെ പേരുകൾ ചേർക്കാം. അവർ പങ്കെടുക്കുന്ന പരിപാടികളും അവരുടെ ചെസ്റ്റ് നമ്പറുകളും ഇവിടെ രേഖപ്പെടുത്താം.
                </span>
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-sm">4</div>
                Print Reports (റിപ്പോർട്ടുകൾ)
              </h3>
              <p className="text-slate-600 leading-relaxed pl-13 text-base">
                Once everything is set up, head over to <b>Reports</b>. You can instantly view and print beautifully formatted schedules grouped by Day or by Venue. You can also print complete lists of participants for each event to hand over to the judges.
                <br/><br/>
                <span className="text-slate-500 font-medium text-base">
                  വിവരങ്ങളെല്ലാം ചേർത്ത ശേഷം <b>Reports</b> ടാബിൽ പോയാൽ ദിവസങ്ങൾ തിരിച്ചും വേദികൾ തിരിച്ചുമുള്ള കൃത്യമായ ടൈംടേബിളുകൾ കാണാനും പ്രിന്റ് ചെയ്യാനും സാധിക്കും. വിധികർത്താക്കൾക്ക് നൽകാനുള്ള മത്സരാർത്ഥികളുടെ ലിസ്റ്റും ഇതിൽ നിന്ന് പ്രിന്റ് എടുക്കാം.
                </span>
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-sm">5</div>
                Save Your Work (സേവ് ചെയ്യാൻ മറക്കരുത്)
              </h3>
              <p className="text-slate-600 leading-relaxed pl-13 text-base">
                Rangoli works <b>100% offline</b>. Your data stays on this browser. However, to keep it safe or move it to another computer, always remember to go to the <b>Dashboard</b> (Home) and click <b>Save to File</b>. This will download a `.json` backup file to your computer.
                <br/><br/>
                <span className="text-slate-500 font-medium text-base">
                  ഈ സോഫ്റ്റ്‌വെയർ പൂർണ്ണമായും ഇൻ്റർനെറ്റ് ഇല്ലാതെ പ്രവർത്തിക്കുന്നതാണ്. നിങ്ങളുടെ വിവരങ്ങൾ ഈ ബ്രൗസറിൽ തന്നെയുണ്ടാകും. എന്നാൽ അവ സുരക്ഷിതമായി സൂക്ഷിക്കാനോ മറ്റൊരു കമ്പ്യൂട്ടറിലേക്ക് മാറ്റാനോ <b>Dashboard (Home)</b> ൽ പോയി <b>Save to File</b> എന്ന ബട്ടൺ ക്ലിക്ക് ചെയ്യുക.
                </span>
              </p>
            </section>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
