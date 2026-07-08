import { v4 as uuidv4 } from 'uuid';
import { useAppStore } from '@/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EntityManager } from '@/components/shared/EntityManager';

export function MasterDataView() {
  const { 
    events, addEvent, updateEvent, deleteEvent, 
    categories, addCategory, updateCategory, deleteCategory, 
    days, addDay, updateDay, deleteDay, 
    venues, addVenue, updateVenue, deleteVenue
  } = useAppStore();

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Master Data</h2>
        <p className="text-slate-500 mt-2 text-lg">Manage reference data including events, categories, venues, and days.</p>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-6">
          <TabsTrigger value="events" className="h-11 px-6 rounded-full border border-slate-200 bg-white data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:border-slate-900 font-semibold shadow-sm transition-all">Event Types</TabsTrigger>
          <TabsTrigger value="categories" className="h-11 px-6 rounded-full border border-slate-200 bg-white data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:border-slate-900 font-semibold shadow-sm transition-all">Categories</TabsTrigger>
          <TabsTrigger value="days" className="h-11 px-6 rounded-full border border-slate-200 bg-white data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:border-slate-900 font-semibold shadow-sm transition-all">Days</TabsTrigger>
          <TabsTrigger value="venues" className="h-11 px-6 rounded-full border border-slate-200 bg-white data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:border-slate-900 font-semibold shadow-sm transition-all">Venues</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <EntityManager 
            items={events} 
            onAdd={(item: any) => addEvent({ id: uuidv4(), name: item.name })} 
            onUpdate={updateEvent} 
            onDelete={deleteEvent} 
            title="Event Types" 
            description="Manage cultural events (e.g., Solo Song, Group Dance)." 
            bulkExample={`Solo Song
Group Dance
Debate
Quiz`}
          />
        </TabsContent>

        <TabsContent value="categories">
          <EntityManager 
            items={categories} 
            onAdd={(item: any) => addCategory({ id: uuidv4(), name: item.name })} 
            onUpdate={updateCategory} 
            onDelete={deleteCategory} 
            title="Categories" 
            description="Manage age/grade categories (e.g., Sub-Junior, Senior)." 
            bulkExample={`Sub-Junior
Junior
Senior`}
          />
        </TabsContent>

        <TabsContent value="days">
          <EntityManager 
            items={days} 
            onAdd={(item: any) => addDay({ id: uuidv4(), name: item.name, date: item.date || new Date().toISOString().split('T')[0] })} 
            onUpdate={updateDay} 
            onDelete={deleteDay} 
            title="Days" 
            description="Manage competition days." 
            extraFields={[{ key: 'date', label: 'Date', type: 'date' }]}
            bulkExample={`Day 1, 2026-07-01
Day 2, 2026-07-02`}
          />
        </TabsContent>

        <TabsContent value="venues">
          <EntityManager 
            items={venues} 
            onAdd={(item: any) => addVenue({ id: uuidv4(), name: item.name })} 
            onUpdate={updateVenue} 
            onDelete={deleteVenue} 
            title="Venues" 
            description="Manage locations (e.g., Main Stage, Room 101)." 
            bulkExample={`Main Stage
Room 101
Auditorium`}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
