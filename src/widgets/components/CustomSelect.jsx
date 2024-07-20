import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const CustomSelect = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectRef]);

    const handleOptionClick = (option) => {
        setSelectedValue(option.value);
        onChange(option.value);
        setIsOpen(false);
    };

    const selectedLabel = options.find(option => option.value === selectedValue)?.label || label;

    return (
        <div className="relative inline-block w-full" ref={selectRef}>
            <div 
                className="flex items-center justify-between bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer p-2 hover:border-gray-500 focus:border-gray-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`${selectedValue ? 'text-black' : 'text-gray-500'}`}>
                    {selectedLabel}
                </span>
                {isOpen ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
            </div>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto animate-fade-in-up">
                    {options.map(option => (
                        <div
                            key={option.value}
                            className={`p-2 cursor-pointer rounded hover:bg-gray-100 border-transparent ${selectedValue === option.value ? 'bg-gray-100' : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
