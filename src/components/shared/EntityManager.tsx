import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Trash2, Edit2, Plus, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

interface Entity {
  id: string;
  name: string;
  [key: string]: any;
}

interface EntityManagerProps<T extends Entity> {
  title: string;
  description: string;
  items: T[];
  onAdd: (item: Partial<T>) => void;
  onUpdate: (id: string, item: Partial<T>) => void;
  onDelete: (id: string) => void;
  extraFields?: { key: keyof T; label: string; type?: string }[];
  bulkExample?: string;
}

export function EntityManager<T extends Entity>({
  title,
  description,
  items,
  onAdd,
  onUpdate,
  onDelete,
  extraFields = [],
  bulkExample = "Item 1\nItem 2"
}: EntityManagerProps<T>) {
  const [name, setName] = useState('');
  const [extraValues, setExtraValues] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState('manage');
  const [bulkText, setBulkText] = useState('');
  const [initialBulkText, setInitialBulkText] = useState('');

  const generateBulkText = () => {
    return items.map(item => {
      let line = item.name;
      extraFields.forEach(f => {
        line += `, ${item[f.key as string] || ''}`;
      });
      return line;
    }).join('\n');
  };

  useEffect(() => {
    // If we're in bulk mode and items update (e.g. from elsewhere or just loading), update initial state
    if (activeTab === 'bulk') {
      const text = generateBulkText();
      setInitialBulkText(text);
      setBulkText(text);
    }
  }, [items.length]); 

  const handleTabChange = (newTab: string) => {
    if (activeTab === 'bulk' && newTab !== 'bulk') {
      const isDirty = bulkText !== initialBulkText;
      if (isDirty) {
        if (window.confirm("You have unsaved changes in Bulk Edit. Do you want to save them before exiting?")) {
          handleBulkSave();
        }
      }
    }

    if (newTab === 'bulk') {
      const text = generateBulkText();
      setInitialBulkText(text);
      setBulkText(text);
    }
    
    setActiveTab(newTab);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (editingId) {
      onUpdate(editingId, { name, ...extraValues } as unknown as Partial<T>);
      toast.success(`${title} updated`);
      setEditingId(null);
    } else {
      const newItem = {
        id: uuidv4(),
        name,
        ...extraValues,
      } as unknown as Partial<T>;
      onAdd(newItem);
      toast.success(`${title} added`);
    }

    setName('');
    setExtraValues({});
  };

  const handleEdit = (item: T) => {
    setEditingId(item.id);
    setName(item.name);
    const newExtras: Record<string, string> = {};
    extraFields.forEach((f) => {
      newExtras[f.key as string] = (item[f.key] as string) || '';
    });
    setExtraValues(newExtras);
  };

  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setExtraValues({});
  };

  const handleBulkSave = () => {
    const lines = bulkText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const newNames = new Set<string>();

    let added = 0;
    let updated = 0;

    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      const itemName = parts[0];
      if (!itemName) return;
      newNames.add(itemName.toLowerCase());

      const itemExtraValues: Record<string, string> = {};
      extraFields.forEach((f, idx) => {
        itemExtraValues[f.key as string] = parts[idx + 1] || '';
      });

      const existingItem = items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
      if (existingItem) {
        // Update
        onUpdate(existingItem.id, { name: itemName, ...itemExtraValues } as unknown as Partial<T>);
        updated++;
      } else {
        // Add
        onAdd({ name: itemName, ...itemExtraValues } as unknown as Partial<T>);
        added++;
      }
    });

    // Delete items that were removed from the text area
    let deleted = 0;
    items.forEach(item => {
      if (!newNames.has(item.name.toLowerCase())) {
        onDelete(item.id);
        deleted++;
      }
    });

    const newText = generateBulkText();
    setInitialBulkText(newText);
    setBulkText(newText);
    toast.success(`Bulk sync complete: ${added} added, ${updated} updated, ${deleted} deleted.`);
  };

  return (
    <Card className="border-none shadow-lg bg-white overflow-hidden max-w-4xl">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-slate-500 font-medium">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6 h-12 bg-slate-100 p-1 rounded-xl w-full max-w-[300px] grid grid-cols-2">
            <TabsTrigger value="manage" className="rounded-lg font-semibold data-[state=active]:shadow-sm">Manage</TabsTrigger>
            <TabsTrigger value="bulk" className="rounded-lg font-semibold data-[state=active]:shadow-sm">Bulk Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="space-y-2 flex-1 w-full">
                <label className="text-sm font-bold text-slate-700">Name</label>
                <Input
                  placeholder={`Enter ${title.toLowerCase()} name...`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="h-11 bg-white border-slate-200"
                />
              </div>
              {extraFields.map((field) => (
                <div key={field.key as string} className="space-y-2 flex-1 w-full">
                  <label className="text-sm font-bold text-slate-700">{field.label}</label>
                  {field.type === 'date' ? (
                    <DatePicker 
                      value={extraValues[field.key as string] || ''} 
                      onChange={(d) => setExtraValues((prev) => ({ ...prev, [field.key as string]: d }))} 
                    />
                  ) : (
                    <Input
                      type={field.type || 'text'}
                      value={extraValues[field.key as string] || ''}
                      onChange={(e) =>
                        setExtraValues((prev) => ({ ...prev, [field.key as string]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                      className="h-11 bg-white border-slate-200"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={handleSave} className="h-11 w-full sm:w-28 font-semibold shadow-sm">
                  {editingId ? 'Update' : (
                    <>
                      <Plus className="h-5 w-5 mr-1" /> Add
                    </>
                  )}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={handleCancel} className="h-11 font-semibold border-slate-200">
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {items.length > 0 ? (
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="font-bold text-slate-700 h-12 w-[35%]">Name</TableHead>
                      {extraFields.map((field) => (
                        <TableHead key={field.key as string} className="font-bold text-slate-700 h-12">{field.label}</TableHead>
                      ))}
                      <TableHead className="w-[120px] text-right font-bold text-slate-700 h-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                        {editingId === item.id ? (
                          <>
                            <TableCell className="p-2">
                              <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                className="h-9 bg-white border-slate-200"
                                autoFocus
                              />
                            </TableCell>
                            {extraFields.map((field) => (
                              <TableCell key={field.key as string} className="p-2 min-w-[200px]">
                                {field.type === 'date' ? (
                                  <DatePicker 
                                    value={extraValues[field.key as string] || ''} 
                                    onChange={(d) => setExtraValues((prev) => ({ ...prev, [field.key as string]: d }))} 
                                  />
                                ) : (
                                  <Input
                                    type={field.type || 'text'}
                                    value={extraValues[field.key as string] || ''}
                                    onChange={(e) =>
                                      setExtraValues((prev) => ({ ...prev, [field.key as string]: e.target.value }))
                                    }
                                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                    className="h-9 bg-white border-slate-200"
                                  />
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="text-right p-2 space-x-1">
                              <Button size="sm" onClick={handleSave} className="h-9 px-3 font-semibold shadow-sm">Save</Button>
                              <Button size="sm" variant="ghost" onClick={handleCancel} className="h-9 px-3 text-slate-500 hover:text-slate-900">Cancel</Button>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="font-bold text-slate-900 py-4">{item.name}</TableCell>
                            {extraFields.map((field) => (
                              <TableCell key={field.key as string} className="text-slate-600 font-medium py-4">{item[field.key] as string}</TableCell>
                            ))}
                            <TableCell className="text-right space-x-1 py-4">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-12 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <p className="text-lg">No {title.toLowerCase()} added yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl mb-6">
              <h4 className="font-bold text-blue-900 mb-1">Bulk Import & Edit</h4>
              <p className="text-sm text-blue-800/80 mb-2">
                Paste your data below. One item per line. Format: <code className="bg-blue-100 px-1 py-0.5 rounded">Name{extraFields.map(f => `, ${f.label}`).join('')}</code>
              </p>
              <div className="text-xs text-blue-800/60 font-mono whitespace-pre-wrap">{bulkExample}</div>
              <p className="text-xs font-bold text-red-600 mt-3 flex items-center gap-1">
                <span className="text-red-600">⚠</span> Warning: Items missing from this list will be deleted!
              </p>
            </div>
            
            <Textarea
              className="min-h-[300px] bg-slate-50 border-slate-200 font-mono text-sm leading-relaxed p-4"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={`Example:\n${bulkExample}`}
            />
            
            <Button onClick={handleBulkSave} className="h-11 font-semibold w-full sm:w-auto shadow-sm gap-2">
              <UploadCloud className="h-5 w-5" /> Sync Bulk Data
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
