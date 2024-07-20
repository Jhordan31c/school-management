import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'


export default function Example({ people, onSelect }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(people[0]);

  const filteredPeople = query === ''
    ? people
    : people.filter((person) => person.grado.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (value) => {
    setSelected(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <Combobox
      as="div"
      value={selected}
      onChange={handleSelect}
      className="relative w-64 z-50"
    >
      <div className="relative">
        <ComboboxInput
          as="input"
          displayValue={(person) => person?.grado}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:outline-none shadow-sm transition ease-in-out duration-150"
          placeholder="Select a grade..."
        />
        <ComboboxButton as="button" className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </ComboboxButton>
      </div>
      <ComboboxOptions
        as="ul"
        className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 py-1 text-base leading-6 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      >
        {filteredPeople.map((person, index) => (
          <ComboboxOption
            key={index}
            value={person}
            as="li"
            className={({ active }) =>
              `cursor-default select-none relative py-2 pl-10 pr-4 transition ease-in-out duration-150 ${active ? 'bg-gray-50 text-gray-900' : 'text-gray-900'}`
            }
          >
            {({ selected, active }) => (
              <>
                <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                  {person.grado}
                </span>
                {selected ? (
                  <span
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-blue-900' : 'text-blue-600'}`}
                  >
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
              </>
            )}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}
