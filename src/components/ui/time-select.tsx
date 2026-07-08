import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TimeSelect({ value, onChange, placeholder = "Select time" }: TimeSelectProps) {
  const [open, setOpen] = useState(false);
  const [exactMode, setExactMode] = useState(false);
  
  // Parse initial value (HH:MM in 24h format)
  const parseValue = () => {
    if (!value) return { h: 12, m: 0, p: 'AM' };
    const [hhStr, mmStr] = value.split(':');
    let hh = parseInt(hhStr, 10);
    const mm = parseInt(mmStr, 10);
    let p = 'AM';
    if (hh >= 12) {
      p = 'PM';
      if (hh > 12) hh -= 12;
    } else if (hh === 0) {
      hh = 12;
    }
    return { h: hh, m: mm, p };
  };

  const [hour, setHour] = useState(parseValue().h);
  const [minute, setMinute] = useState(parseValue().m);
  const [period, setPeriod] = useState(parseValue().p);

  useEffect(() => {
    if (value) {
      const parsed = parseValue();
      setHour(parsed.h);
      setMinute(parsed.m);
      setPeriod(parsed.p);
      if (![0, 15, 30, 45].includes(parsed.m)) {
        setExactMode(true);
      }
    }
  }, [value]);

  const applyTime = (h: number, m: number, p: string) => {
    setHour(h);
    setMinute(m);
    setPeriod(p);
    
    let hh24 = h;
    if (p === 'PM' && h !== 12) hh24 += 12;
    if (p === 'AM' && h === 12) hh24 = 0;
    
    const val = `${hh24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    onChange(val);
  };

  const displayValue = value 
    ? `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`
    : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-11 justify-start text-left font-normal bg-slate-50 border-slate-200",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? displayValue : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex gap-4">
          <div className="space-y-2">
            <div className="text-xs font-bold text-center text-slate-500 uppercase tracking-wider">Hour</div>
            <div className="grid grid-cols-3 gap-1.5 w-[140px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                <Button
                  key={`h-${h}`}
                  size="sm"
                  variant={hour === h ? "default" : "outline"}
                  className="h-8 w-full p-0 font-medium"
                  onClick={() => applyTime(h, minute, period)}
                >
                  {h}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="w-px bg-slate-100" />
          
          <div className="space-y-2 flex flex-col">
            <div className="text-xs font-bold text-center text-slate-500 uppercase tracking-wider mb-2">Minute</div>
            {exactMode ? (
              <div className="flex flex-col items-center flex-1 justify-start space-y-3">
                <Input 
                  type="number" 
                  min={0} 
                  max={59} 
                  value={minute}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val)) val = 0;
                    if (val < 0) val = 0;
                    if (val > 59) val = 59;
                    applyTime(hour, val, period);
                  }}
                  className="w-[60px] h-10 text-center text-lg font-bold p-1 bg-slate-50"
                />
                <Button size="sm" variant="ghost" className="text-xs text-slate-500 w-full" onClick={() => setExactMode(false)}>
                  Use 15m
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-1.5 w-[60px]">
                  {[0, 15, 30, 45].map(m => (
                    <Button
                      key={`m-${m}`}
                      size="sm"
                      variant={minute === m ? "default" : "outline"}
                      className="h-8 w-full p-0 font-medium"
                      onClick={() => applyTime(hour, m, period)}
                    >
                      {m.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <Button size="sm" variant="ghost" className="text-xs text-slate-500 mt-1 h-6 w-full" onClick={() => setExactMode(true)}>
                  Exact
                </Button>
              </>
            )}
          </div>

          <div className="w-px bg-slate-100" />

          <div className="space-y-2">
            <div className="text-xs font-bold text-center text-slate-500 uppercase tracking-wider">AM/PM</div>
            <div className="grid grid-cols-1 gap-1.5 w-[60px]">
              {['AM', 'PM'].map(p => (
                <Button
                  key={`p-${p}`}
                  size="sm"
                  variant={period === p ? "default" : "outline"}
                  className="h-10 w-full p-0 font-bold"
                  onClick={() => applyTime(hour, minute, p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
