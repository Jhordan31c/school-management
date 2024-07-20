import { useState, useEffect, Fragment } from "react";
import { Dialog, Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, Transition, TransitionChild } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

export default function CommandPalette({ payments, onSelect, isOpen, setIsOpen }) {
    const [query, setQuery] = useState('');

    const filteredPayments = query ? payments.filter((payment) => payment.nombre.toLowerCase().includes(query.toLowerCase()) || payment.apellido.toLowerCase().includes(query.toLowerCase())) : [];

    useEffect(() => {
        function onKeydown(event) {
            if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
                setIsOpen(!isOpen);
            }
        }

        window.addEventListener('keydown', onKeydown);

        return () => {
            window.removeEventListener('keydown', onKeydown);
        }
    }, [isOpen, setIsOpen]);

    return (
        <Transition show={isOpen} as={Fragment}>
            <div className="relative mt-6">
                <TransitionChild
                    enter="duration-300 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-200 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95">
                    <Combobox as="div" className="relative bg-white max-w-xl mx-auto rounded-xl shadow-2xl ring-1 ring-black/5 divide-y divide-gray-100"
                        onChange={(payment) => {
                            onSelect(payment);
                            setIsOpen(false);
                        }}>
                        <div className="flex items-center px-4">
                            <MagnifyingGlassIcon className="w-6 h-6 text-gray-500" />
                            <ComboboxInput className="w-full bg-transparent text-gray-800 placeholder-gray-400 border-0 focus:ring-0 focus:border-transparent text-sm h-12 pl-4 focus:outline-none" placeholder="Busca a un alumno..."
                                onChange={(event) => setQuery(event.target.value)} />
                        </div>
                        {filteredPayments.length > 0 && (
                            <ComboboxOptions static className="py-4 text-sm max-h-60 overflow-y-auto">
                                {filteredPayments.map((payment) => (
                                    <ComboboxOption key={payment.id} value={payment}>
                                        {({ active }) => (
                                            <div className={`px-4 py-3 ${active ? 'bg-indigo-500 shadow-lg text-white bg-opacity-50' : 'bg-white text-black'}`}>
                                                {payment.nombre} {payment.apellido}
                                            </div>
                                        )}
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        )}
                        {query && filteredPayments.length === 0 && (
                            <p className="p-4 text-sm text-gray-500">No se encontró ningún resultado.</p>
                        )}
                    </Combobox>
                </TransitionChild>
            </div>
        </Transition>
    );
}