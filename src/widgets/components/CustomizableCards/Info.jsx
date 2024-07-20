import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "@/widgets/components/Sections/Header";
import { useForm } from "@/context/FormContext";
import { Button, Select, Option, Input } from "@material-tailwind/react";

// Importar los servicios de aula
import aulaService from "@/services/aulaService";

export const PersonalInfo = ({ handleNext, handlePrev, isFirstStep, isLastStep }) => {
    const { addInfo, data } = useForm();
    const [docente, setDocente] = useState('');
    const [grade, setGrade] = useState('');
    const [id_docente, setIdDocente] = useState(data.id_docente || '');
    const [id_grado, setIdGrado] = useState(data.id_grado || '');
    const [sub_grado, setSubGrado] = useState(data.sub_grado || '');

    const [docentes, setDocentes] = useState([]);
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        // Obtener docentes y grados desde la API
        const fetchData = async () => {
            try {
                const [docentesRes, gradesRes] = await Promise.all([
                    aulaService.getEducators(),
                    aulaService.getGrades()
                ]);
                setDocentes(docentesRes.data);
                setGrades(gradesRes.data);
            } catch (error) {
                console.error("Error al obtener datos de la API", error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newData = {
            ...data,
            id_docente: docente,
            id_grado: grade,
            sub_grado
        };
        console.log(newData); // Mostrar los datos en la consola
        addInfo(newData);
        handleNext(); // Mover al siguiente paso
    };

    const handleInputChange = (e) => {
        setSubGrado(e.target.value);
    };

    return (
        <div>
            <Header head="Registre aula" para="Rellene los campos" />
            <main>
                <form onSubmit={handleSubmit} className="flex flex-col mt-8" autoComplete="off">
                    <Select label="Seleccione el grado" value={grade} onChange={(e) => setGrade(e)}>
                        {grades.map((grade) => (
                            <Option key={grade.id} value={grade.id.toString()}>
                                {grade.subNivel} - {grade.nivel}
                            </Option>
                        ))}
                    </Select>
                    <div className="mt-5">
                        <Select label="Seleccione un Tutor" value={docente} onChange={(e) => setDocente(e)}>
                            {docentes.map((docente) => (
                                <Option key={docente.id} value={docente.id.toString()}>
                                    {docente.nombre}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="mt-5">
                        <Input label="Ingrese el sub grado" value={sub_grado} onChange={handleInputChange} />
                    </div>
                    <div className="mt-16 flex justify-between">
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
