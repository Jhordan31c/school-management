import React, { useState, useEffect } from "react";
import { PlusIcon, ExclamationCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Header } from "@/widgets/components/Sections/Header";
import { useNavigate } from 'react-router-dom';
import { Button, Select, Option } from "@material-tailwind/react";
import TimePicker from "react-time-picker";
import 'react-time-picker/dist/TimePicker.css';
import "@/style/Style.css";
import aulaservice from "@/services/aulaService";
import { useToast } from "@/widgets/components/toast/ToastService";
import { useForm } from "@/context/FormContext";

export const Ads = ({ handleNext, handlePrev, isFirstStep, isLastStep }) => {
    const { addInfo, data } = useForm();

    const [time1, setTime1] = useState('10:00');
    const [time2, setTime2] = useState('10:00');
    const [docente, setDocente] = useState('');
    const [materia, setMateria] = useState('');
    const [dia, setDia] = useState('');
    const [scheduleCollection, setScheduleCollection] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [materias, setMaterias] = useState([]);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docentesResponse = await aulaservice.getEducators();
                setDocentes(docentesResponse.data);

                const materiasResponse = await aulaservice.getTopics();
                setMaterias(materiasResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const checkForCollision = (newEntry) => {
        return scheduleCollection.some(entry =>
            entry.dia === newEntry.dia && (
                (newEntry.time1 >= entry.time1 && newEntry.time1 < entry.time2) ||
                (newEntry.time2 > entry.time1 && newEntry.time2 <= entry.time2) ||
                (newEntry.time1 <= entry.time1 && newEntry.time2 >= entry.time2)
            )
        );
    };

    const isMateriaAssigned = (materiaId) => {
        return scheduleCollection.some(entry => entry.materia === materiaId);
    };

    const handleAddToCollection = () => {
        const newEntry = {
            docente,
            materia,
            dia,
            time1,
            time2
        };

        if (isMateriaAssigned(materia)) {
            handleFail("La materia ya está asignada a otro docente.");
            return;
        }

        if (checkForCollision(newEntry)) {
            handleFail("Existe un choque de horarios");
        } else {
            setScheduleCollection([...scheduleCollection, newEntry]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newData = {
            ...data,
            horarios: scheduleCollection.map(item => ({
                id_docente: item.docente,
                id_materia: item.materia,
                dia: item.dia,
                h_inicio: item.time1,
                h_fin: item.time2
            })),
        };
        console.log(newData); // Mostrar los datos en la consola
        addInfo(newData);

        try {
            await aulaservice.addAula(newData);
            navigate("/admin/home");
            handleActivate("Aula guardada");
        } catch (error) {
            handleFail("Error al añadir aula");
            console.error("Error al añadir aula:", error);
        }
    };

    const handleFail = (message) => {
        toast.open(
            <div className='flex gap-2 bg-red-300 text-red-800 p-4 rounded-lg shadow-lg'>
                <ExclamationCircleIcon className="w-10" />
                <div>
                    <h3 className='font-bold'>Accion Erronea</h3>
                    <p className='text-sm'>{message}</p>
                </div>
            </div>
        )
    };

    const handleActivate = (message) => {
        toast.open(
            <div className='flex gap-2 bg-green-300 text-green-800 p-4 rounded-lg shadow-lg'>
                <ShieldCheckIcon className="w-10" />
                <div>
                    <h3 className='font-bold'>Accion Verificada</h3>
                    <p className='text-sm'>{message}</p>
                </div>
            </div>,
            3000
        )
    };

    const validateTime = (time) => {
        const minTime = "08:00";
        const maxTime = "17:00";
        if (time < minTime) return minTime;
        if (time > maxTime) return maxTime;
        return time;
    };

    return (
        <div>
            <Header head="Crear Horario" para="" />
            <main>
                {/* Div para mostrar la colección de horarios */}
                <div className="mb-8 p-4 border border-gray-300 rounded-lg shadow-md max-h-44 mt-2 overflow-y-auto scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200">
                    {scheduleCollection.map((item, index) => (
                        <div key={index} className="mb-2 p-2 border-b border-gray-200">
                            <p>Docente: {item.docente}</p>
                            <p>Materia: {item.materia}</p>
                            <p>Día: {item.dia}</p>
                            <p>Hora Inicio: {item.time1}</p>
                            <p>Hora Fin: {item.time2}</p>
                        </div>
                    ))}
                    {console.log(scheduleCollection)}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col mt-8" autoComplete="off">
                    <div>
                        <Select label="Seleccione un Docente" onChange={(e) => setDocente(e)}>
                            {docentes.map((docente) => (
                                <Option key={docente.id} value={docente.id.toString()}>{docente.nombre}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className="mt-5">
                        <Select label="Seleccione las Materias" onChange={(e) => setMateria(e)}>
                            {materias.map((materia) => (
                                <Option key={materia.id} value={materia.id.toString()}>{materia.nombre}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className="mt-5">
                        <Select label="Seleccione el día" onChange={(e) => setDia(e)}>
                            <Option value="1">Lunes</Option>
                            <Option value="2">Martes</Option>
                            <Option value="3">Miércoles</Option>
                            <Option value="4">Jueves</Option>
                            <Option value="5">Viernes</Option>
                            <Option value="6">Sábado</Option>
                        </Select>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between mt-5">
                        <div className="w-full md:w-1/2 md:pr-2">
                            <TimePicker
                                onChange={(time) => setTime1(validateTime(time))}
                                value={time1}
                                disableClock={true}
                                className="w-full custom-time-picker"
                                clearIcon={null}
                                format="h:mm a"
                                hourPlaceholder="hh"
                                minutePlaceholder="mm"
                            />
                        </div>
                        <div className="w-full md:w-1/2 md:pl-2 mt-4 md:mt-0">
                            <TimePicker
                                onChange={(time) => setTime2(validateTime(time))}
                                value={time2}
                                disableClock={true}
                                className="w-full custom-time-picker"
                                clearIcon={null}
                                format="h:mm a"
                                hourPlaceholder="hh"
                                minutePlaceholder="mm"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end md:justify-end md:mt-0">
                        <Button
                            type="button"
                            variant="text"
                            className="rounded-full text-gray mt-5"
                            onClick={handleAddToCollection}
                        >
                            <PlusIcon className="w-5" />
                        </Button>
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

export default Ads;