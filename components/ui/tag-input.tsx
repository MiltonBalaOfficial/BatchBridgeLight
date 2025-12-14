'use client';

import { useState, KeyboardEvent, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X as ClearIcon } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export const TagInput = ({
  value = [],
  onChange,
  placeholder,
  suggestions = [],
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const addTag = (tagsToAdd: string) => {
    const newTags = tagsToAdd
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '' && !value.includes(tag));

    if (newTags.length > 0) {
      onChange([...value, ...newTags]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    addTag(pastedText);
  };

  const filteredSuggestions = useMemo(() => {
    if (!inputValue) {
      return [];
    }

    const lowercasedInputValue = inputValue.toLowerCase();
    const inputParts = lowercasedInputValue.split('::');

    return suggestions.filter((suggestion) => {
      const lowercasedSuggestion = suggestion.toLowerCase();
      if (value.includes(lowercasedSuggestion)) {
        return false;
      }

      const suggestionParts = lowercasedSuggestion.split('::');
      if (suggestionParts.length < inputParts.length) {
        return false;
      }

      for (let i = 0; i < inputParts.length; i++) {
        if (i === inputParts.length - 1) {
          if (!suggestionParts[i].startsWith(inputParts[i])) {
            return false;
          }
        } else {
          if (suggestionParts[i] !== inputParts[i]) {
            return false;
          }
        }
      }

      return true;
    });
  }, [inputValue, suggestions, value]);

  return (
    <div>
      <div className='flex flex-wrap items-center gap-2 rounded-md border border-input p-2'>
        {value.map((tag) => (
          <Badge key={tag} variant='secondary'>
            {tag}
            <button
              type='button'
              className='ml-1 rounded-full ring-offset-background outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
              onClick={() => removeTag(tag)}
            >
              <ClearIcon className='h-3 w-3 text-muted-foreground hover:text-foreground' />
            </button>
          </Badge>
        ))}
        <Input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onPaste={handlePaste}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          placeholder={placeholder || 'Add a tag...'}
          className='flex-1 border-0 shadow-none focus:ring-0'
        />
      </div>
      {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
        <div className='relative'>
          <div className='absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg'>
            <ul className='ring-opacity-5 max-h-60 overflow-auto rounded-md py-1 text-base ring-1 ring-black focus:outline-none sm:text-sm'>
              {filteredSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className='relative cursor-default py-2 pr-9 pl-3 text-foreground select-none hover:bg-accent'
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const isPrefix = suggestions.some((s) =>
                      s.startsWith(suggestion + '::')
                    );
                    const newValue = isPrefix ? suggestion + '::' : suggestion;
                    setInputValue(newValue);
                    setShowSuggestions(false);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
