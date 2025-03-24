
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from './button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const countries = [
  { value: 'us', label: 'United States', flag: '🇺🇸' },
  { value: 'ca', label: 'Canada', flag: '🇨🇦' },
  { value: 'mx', label: 'Mexico', flag: '🇲🇽' },
  { value: 'gb', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'de', label: 'Germany', flag: '🇩🇪' },
  { value: 'fr', label: 'France', flag: '🇫🇷' },
  { value: 'jp', label: 'Japan', flag: '🇯🇵' },
  { value: 'cn', label: 'China', flag: '🇨🇳' },
  { value: 'in', label: 'India', flag: '🇮🇳' },
  { value: 'br', label: 'Brazil', flag: '🇧🇷' },
  { value: 'ru', label: 'Russia', flag: '🇷🇺' },
  { value: 'ua', label: 'Ukraine', flag: '🇺🇦' },
  { value: 'ge', label: 'Georgia', flag: '🇬🇪' },
  { value: 'ro', label: 'Romania', flag: '🇷🇴' },
];

interface CountrySelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  placeholder = "Select a country",
  className
}) => {
  const [open, setOpen] = React.useState(false);
  const selectedCountry = countries.find(country => country.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${className}`}
        >
          {value && selectedCountry ? (
            <div className="flex items-center">
              <span className="mr-2">{selectedCountry.flag}</span>
              <span>{selectedCountry.label}</span>
            </div>
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            {countries.map((country) => (
              <CommandItem
                key={country.value}
                onSelect={() => {
                  onChange?.(country.value);
                  setOpen(false);
                }}
              >
                <div className="flex items-center">
                  <span className="mr-2">{country.flag}</span>
                  <span>{country.label}</span>
                </div>
                {value === country.value && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySelector;
