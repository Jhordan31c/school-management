import React, { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import aulaservice from "@/services/aulaService"; // Ajusta el path según tu estructura de proyecto

const SearchBar = ({ onStudentSelect }) => {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [students, setStudents] = useState([]);

    const inputRef = useRef(null);

    useEffect(() => {
        // Llamar al método getStudents para obtener los datos
        const fetchStudents = async () => {
            try {
                const response = await aulaservice.getStudents();
                const data = response.data;
                // Mapear los datos al formato necesario
                const formattedStudents = data.map((student) => ({
                    id: student.id,
                    name: `${student.nombre} ${student.apellido}`,
                }));
                setStudents(formattedStudents);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(query.toLowerCase().trim()) &&
            !selected.some((s) => s.id === student.id)
    );

    const isDisable =
        !query.trim() ||
        selected.some(
            (student) =>
                student.name.toLowerCase().trim() === query.toLowerCase().trim()
        );

    const handleSelect = (student) => {
        setSelected((prev) => [...prev, student]);
        onStudentSelect(student);
        setQuery("");
        setMenuOpen(true);
    };

    return (
        <div className="relative w-full max-w-lg mx-auto">
            {selected.length ? (
                <div className="bg-gray-100 w-full relative text-xs flex flex-wrap gap-1 p-2 mb-2">
                    {selected.map((student) => (
                        <div
                            key={student.id}
                            className="rounded-full w-fit py-1.5 px-3 border border-gray-400 bg-gray-50 text-gray-500 flex items-center gap-2"
                        >
                            {student.name}
                            <XMarkIcon 
                                className="w-3 cursor-pointer"
                                onClick={() => setSelected(selected.filter((s) => s.id !== student.id))}
                            />
                        </div>
                    ))}
                    <div className="w-full text-right">
                        <span
                            className="text-gray-400 cursor-pointer"
                            onClick={() => {
                                setSelected([]);
                                inputRef.current?.focus();
                            }}
                        >
                            Limpiar
                        </span>
                    </div>
                </div>
            ) : null}
            <div className="flex items-center p-3 w-full gap-2.5 shadow-md border border-gray-300 rounded">
                <MagnifyingGlassIcon className="w-5 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value.trimStart())}
                    placeholder="Busca a un alumno"
                    className="bg-transparent flex-1 outline-none"
                    onFocus={() => setMenuOpen(true)}
                    onBlur={() => setTimeout(() => setMenuOpen(false), 100)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !isDisable) {
                            const student = filteredStudents.find(
                                (s) => s.name.toLowerCase() === query.toLowerCase().trim()
                            );
                            if (student) handleSelect(student);
                        }
                    }}
                />
            </div>

            {menuOpen && (
                <div className="absolute w-full max-h-44 mt-2 p-1 overflow-y-auto bg-white border border-gray-300 shadow-lg rounded z-20">
                    <ul className="w-full">
                        {filteredStudents.length ? (
                            filteredStudents.map((student) => (
                                <li
                                    key={student.id}
                                    className="p-2 cursor-pointer hover:bg-rose-50 hover:text-rose-500 rounded-md"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelect(student);
                                    }}
                                >
                                    {student.name}
                                </li>
                            ))
                        ) : (
                            <li className="p-2 text-gray-500 text-center">No encontrado...</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;