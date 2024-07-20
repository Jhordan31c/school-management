import React, { useState, useEffect } from "react";
import { Header } from "@/widgets/components/Sections/Header";
import SearchBar from "@/widgets/components/SearchBar";
import { Button } from "@material-tailwind/react";
import { useForm } from "@/context/FormContext";

export const SelectPlan = ({ handleNext, handlePrev, isFirstStep, isLastStep }) => {
    const { addInfo, data } = useForm();
    const [selectedStudents, setSelectedStudents] = useState(data.alumnos || []);

    useEffect(() => {
        if (data.alumnos) {
            setSelectedStudents(data.alumnos);
        }
    }, [data.alumnos]);

    const handleStudentSelect = (student) => {
        setSelectedStudents((prev) => [...prev, student.id]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newData = {
            ...data,
            alumnos: selectedStudents
        };
        console.log(newData); // Mostrar los datos en la consola
        addInfo(newData);
        handleNext();
    };

    return (
        <div>
            <Header head="Asigne alumnos" para="" />
            <main>
                <form onSubmit={handleSubmit} className="flex flex-col mt-8">
                    <div className="flex relative mb-10">
                        <SearchBar onStudentSelect={handleStudentSelect} />
                    </div>
                    <div className="mt-8 flex justify-between">
                        <Button onClick={handlePrev} disabled={isFirstStep}>
                            Prev
                        </Button>
                        <Button type="submit">
                            Next
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default SelectPlan;
