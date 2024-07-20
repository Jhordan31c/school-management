import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon, EllipsisVerticalIcon, ChevronLeftIcon, TrashIcon, XMarkIcon, UserIcon, NoSymbolIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import { datas, studentInfo } from "@/data";
import { FormContextProvider } from "@/context/FormContext";
import { Example, MultiSteps, CalendarSection } from "@/widgets/components";
import React, { useState, useEffect, Fragment } from "react";
import { Transition, TransitionChild, Dialog, DialogTitle } from "@headlessui/react";
import Calendar from "react-calendar";
import { format, setHours, setMinutes, startOfWeek, addDays } from 'date-fns';
import { Switch } from "@material-tailwind/react";
import { ApexChart } from "@/widgets/charts";
import aulaService from "@/services/aulaService";
import "react-calendar/dist/Calendar.css";
import { useUser } from '@/context/UserContext';
import alumnoServicio from '@/services/alumnoServicio';
import  GetDataAcademic  from "@/widgets/components/requests/GetDataAcademic";


export function MembersTable() {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser();


    const handleChange = () => {
        setIsChecked(!isChecked);

    }

    const handleChange1 = (event) => {
        const isChecked = event.target.checked;
        setIsChecked(isChecked);
        const nuevoEstado = isChecked ? 1 : 0;
        setNuevoAlumno((prevState) => ({
            ...prevState,
            estado: nuevoEstado,
        }));

        console.log("Nuevo estado de alumno:", nuevoEstado);
    };

    const handleSelectRow = (row) => {
        setSelectedRow(row);
        let fecha = new Date(row.fecha_nacimiento); let fechaFormateada = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        setSelectedRow({ ...row, fechaFormateada });
    };

    const handleBackToTable = () => {
        setSelectedRow(null);
    };

    const handleModified = () => {
        setIsEditing(false);
        setSelectedAlumno(
            {
                dni: '',
                nombre: '',
                apellido: '',
                genero: '',
                estado: '',
                fecha_nacimiento: '',
                apoderado: {
                    dni: '',
                    nombre: '',
                    apellido: '',
                    parentesco: '',
                    telefono: '',
                    correo: '',
                    direccion: ''
                },
                user: {
                    username: "",
                    password: ""
                }
            });
        setNuevoAlumno({
            dni: '',
            nombre: '',
            apellido: '',
            genero: '',
            estado: '',
            fecha_nacimiento: '',
            apoderado: {
                dni: '',
                nombre: '',
                apellido: '',
                parentesco: '',
                telefono: '',
                correo: '',
                direccion: ''
            },
            user: {
                username: "",
                password: ""
            }
        });
        setIsOpen(true);
    };

    const closeModal = () => {
        setConfirmPassword('');
        setIsOpen(false);
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
        if (isEditing) {
            setSelectedAlumno((prevState) => ({
                ...prevState,
                fecha_nacimiento: newDate
            }));
        } else {
            setNuevoAlumno((prevState) => ({
                ...prevState,
                fecha_nacimiento: newDate
            }));
        }
        setIsCalendarOpen(false);
        console.log(newDate);
    };

    const { TABLE_HEAD, TABLE_ROWS, TABS } = datas;
    const { alumno, apoderado, notas, aula, docenteAsignado, áreas } = studentInfo;

    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredRows, setFilteredRows] = useState(alumno);
    const [activeTab, setActiveTab] = useState("Online");

    const rowsPerPage = 3;

    useEffect(() => {
        setCurrentPage(1); // Reiniciar la página actual a 1 después de filtrar
    }, [search, activeTab]);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredRows.length / rowsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const [alumnos, setAlumnos] = useState([]);
    const [nuevoAlumno, setNuevoAlumno] = useState(
        {
            dni: '',
            nombre: '',
            apellido: '',
            genero: '',
            estado: '',
            fecha_nacimiento: '',
            apoderado: {
                dni: '',
                nombre: '',
                apellido: '',
                parentesco: '',
                telefono: '',
                correo: '',
                direccion: ''
            },
            user: {
                username: "",
                password: ""
            }
        });
    const [selectedAlumno, setSelectedAlumno] = useState(
        {
            dni: '',
            nombre: '',
            apellido: '',
            genero: '',
            estado: '',
            fecha_nacimiento: '',
            apoderado: {
                dni: '',
                nombre: '',
                apellido: '',
                parentesco: '',
                telefono: '',
                correo: '',
                direccion: ''
            },
            user: {
                username: "",
                password: ""
            }
        }
    );

    const [cantidadAlumnos, setCantidadAlumnos] = useState(0);
    const [filtro, setFiltro] = useState('');

    //PARA CARGAR DESDE UN INICIO LA TABLA CON LOS ALUMNOS EN LA BD
    useEffect(() => {
        console.log('Nuevo valor de activeTab:', activeTab)
        fetchAlumnos();
        setCantidadAlumnos(alumnos.length);
    }, [activeTab]);

    const verificarEstado = (estado) => {
        if (estado === 'Online') {
            setActiveTab('Online');
        } else if (estado === 'Offline') {
            setActiveTab('Offline');
        }
    };

    //METODO PARA TRAER LOS ALUMNOS
    const fetchAlumnos = async () => {
        try {
            const response =
                activeTab === "Online"
                    ? await alumnoServicio.getAlumnosActivate()
                    : await alumnoServicio.getAlumnosDesactivate();

            if (response.data) {
                setAlumnos(response.data);
                setCantidadAlumnos(response.data.length);
            } else {
                console.error('No se encontraron alumnos');
            }
        } catch (error) {
            console.error('Error al acceder a encontrar alumnos red', error);
        }
    };

    const alumnosFiltrados = alumnos.filter(alumno =>
        alumno.dni.toString().startsWith(filtro) ||
        alumno.nombre.toLowerCase().startsWith(filtro.toLowerCase()) ||
        alumno.apellido.toLowerCase().startsWith(filtro.toLowerCase())
    );


    const handleSave = async () => {
        if (isEditing) {
            if (selectedAlumno.user.password !== confirmPassword) {
                setPasswordError('Las contraseñas no coinciden');
                return;
            }
            await handleUpdateAlumno();
        } else {
            if (nuevoAlumno.user.password !== confirmPassword) {
                setPasswordError('Las contraseñas no coinciden');
                return;
            }
            await handleAddAlumno();
        }

        setPasswordError('');
        setIsOpen(false);
    };

    //MÉTODO PARA AÑADIR DOCETNES
    const handleAddAlumno = async () => {
        // Verifica si los campos necesarios están vacíos
        if (
            !nuevoAlumno.nombre ||
            !nuevoAlumno.apellido ||
            !nuevoAlumno.genero ||
            !nuevoAlumno.dni ||
            !nuevoAlumno.user.username ||
            !nuevoAlumno.user.password ||
            !nuevoAlumno.fecha_nacimiento ||
            !nuevoAlumno.apoderado.dni ||
            !nuevoAlumno.apoderado.nombre ||
            !nuevoAlumno.apoderado.apellido ||
            !nuevoAlumno.apoderado.parentesco ||
            !nuevoAlumno.apoderado.telefono ||
            !nuevoAlumno.apoderado.correo ||
            !nuevoAlumno.apoderado.direccion
        ) {
            console.error('Por favor, completa todos los campos.');
            return;
        }

        try {
            // OBJETO DEL DOCENTE
            const nuevoAlumnoObj = {

                dni: nuevoAlumno.dni,
                nombre: nuevoAlumno.nombre,
                apellido: nuevoAlumno.apellido,
                genero: nuevoAlumno.genero,
                estado: nuevoAlumno.estado,
                fecha_nacimiento: nuevoAlumno.fecha_nacimiento,
                apoderado: {
                    dni: nuevoAlumno.apoderado.dni,
                    nombre: nuevoAlumno.apoderado.nombre,
                    apellido: nuevoAlumno.apoderado.apellido,
                    parentesco: nuevoAlumno.apoderado.parentesco,
                    telefono: nuevoAlumno.apoderado.telefono,
                    correo: nuevoAlumno.apoderado.correo,
                    direccion: nuevoAlumno.apoderado.direccion
                },
                user: {
                    username: nuevoAlumno.user.username,
                    password: nuevoAlumno.user.password
                }
            };

            //ENVÍO DE LA SOLICITUD MEDIANTE EL SERVICIO PAL BACKEND
            const response = await alumnoServicio.addAlumnos(nuevoAlumnoObj);

            if (response.data) {
                // ACTUALZIAR EL ESTADO DEL NUEVO DOCENTE
                setAlumnos([...alumnos, response.data]);
                //REESTABLECER VALORES
                setNuevoAlumno({
                    nombre: '',
                    apellido: '',
                    dni: '',
                    genero: '',
                    estado: '',
                    fecha_nacimiento: '',
                    apoderado: {
                        dni: '',
                        nombre: '',
                        apellido: '',
                        parentesco: '',
                        telefono: '',
                        correo: '',
                        direccion: ''
                    },
                    user:
                    {
                        username: "",
                        password: ""
                    }
                });
                setIsOpen(false);
            } else {
                console.error('No se pudo agregar al alumno');
            }
        } catch (error) {
            console.error('Error al agregar al alumno:', error);
        }
    };

    //MÉTODO PARA TRAER LOS DATOS AL MODAL DE EDITAR
    const handleEditClickAlumno = async (id) => {
        try {
            const response = await alumnoServicio.getAlumnoId(id);
            const alumno = response.data;
            setIsChecked(alumno.estado);
            setSelectedAlumno(alumno);
            setIsEditing(true);
            setIsOpen(true);
            setConfirmPassword(alumno.user.password);
            setDate(new Date(alumno.fecha_nacimiento));
        } catch (error) {
            console.error('Error al obtener los datos del alumno:', error);
        }
    };

    const DesactivarAlumno = async (alumno) => {
        try {
            const response = await alumnoServicio.actualizarEstado(alumno.id, 0); // Llama a actualizarEstado con el ID del alumno y el nuevo estado (0 para desactivar)
            if (response.data) {
                fetchAlumnos(); // Refresca la lista de alumnos
            } else {
                console.error('No se recibieron datos al actualizar el alumno');
            }
        } catch (error) {
            console.error('Error al desactivar el alumno:', error);
        }
    };

    const ActivarAlumno = async (alumno) => {
        try {
            const response = await alumnoServicio.actualizarEstado(alumno.id, 1); // Llama a actualizarEstado con el ID del alumno y el nuevo estado (0 para desactivar)
            if (response.data) {
                fetchAlumnos(); // Refresca la lista de alumnos
            } else {
                console.error('No se recibieron datos al actualizar el alumno');
            }
        } catch (error) {
            console.error('Error al desactivar el alumno:', error);
        }
    };

    //MÉTODO PARA ACTUALIZAR MATERIA
    const handleUpdateAlumno = async () => {
        try {
            console.log('Intentando actualizar alumno:', selectedAlumno);
            console.log(selectedAlumno.id)

            const response = await alumnoServicio.updateAlumnos(selectedAlumno.id, selectedAlumno);
            if (response.data) {
                setIsOpen(false);
                // VOLVER A CARGAR LOS DOCENTES
                fetchAlumnos();
            } else {
                console.error('No se recibieron datos al actualizar el alumno');
            }
        } catch (error) {
            console.error('Error al actualizar el alumno:', error);
        }
    };


    return (
        <div>
            {!selectedRow ? (
                <Card className="h-full w-full">
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-full z-10">
                            <CardHeader variant="gradient" color="gray" className="mb-8 p-6 text-center">
                                <Typography variant="h6" color="white">
                                    Alumnos
                                </Typography>
                            </CardHeader>
                        </div>
                        <div className="relative mt-16">
                            <CardHeader floated={false} shadow={false} className="rounded-none">
                                <div className="mb-8 flex justify-end gap-2 sm:gap-5">
                                    <Button className="flex items-center gap-3" size="sm" onClick={handleModified}>
                                        <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Agregar
                                    </Button>
                                </div>
                                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                    <Tabs value={activeTab} className="w-full md:w-max">
                                        <TabsHeader>
                                            {TABS.map(({ label, value }) => (
                                                <Tab key={value} value={value} onClick={() => verificarEstado(value)}>
                                                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                                </Tab>
                                            ))}
                                        </TabsHeader>
                                    </Tabs>
                                    <div className="w-full md:w-72">
                                        <Input
                                            label="Search"
                                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                            value={filtro}
                                            onChange={(e) => setFiltro(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                        </div>
                    </div>
                    <CardBody className="overflow-scroll px-0">
                        <table className="mt-4 w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {["Nombre", "Apellido", "DNI", "Género", "Estado", "", "", ""].map((el, index) => (
                                        <th
                                            key={el + index} // Añadir índice para garantizar unicidad
                                            className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                {el}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {alumnosFiltrados.map((alumno, index) => {
                                    const classes = index === alumnosFiltrados.length - 1 ? "p-4" : "p-4 border-b border-blue-gray-50";
                                    return (
                                        <tr key={alumno.id || index}>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {alumno.nombre}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {alumno.apellido}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {alumno.dni}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {alumno.genero}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="w-max">
                                                    <Chip
                                                        variant="ghost"
                                                        size="sm"
                                                        value={alumno.estado === 1 ? "online" : "offline"}
                                                        color={alumno.estado === 1 ? "green" : "blue-gray"}
                                                    />
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Tooltip content="Editar Docente">
                                                    <IconButton variant="text">
                                                        <PencilIcon className="h-4 w-4" onClick={() => handleEditClickAlumno(alumno.id)} />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                            <td className={classes}>
                                                {alumno.estado === 1 ? (
                                                    <Tooltip content="Desactivar Alumno">
                                                        <IconButton variant="text" onClick={() => DesactivarAlumno(alumno)}>
                                                            <TrashIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip content="Activar Alumno">
                                                        <IconButton variant="text" onClick={() => ActivarAlumno(alumno)}>
                                                            <UserPlusIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </td>
                                            <td className={classes}>
                                                <Tooltip content="Ver Perfil">
                                                    <IconButton variant="text" onClick={() => handleSelectRow(alumno)}>
                                                        <EllipsisVerticalIcon className="h-5 w-5" />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </CardBody>
                    <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                            Page {currentPage} of {Math.ceil(filteredRows.length / rowsPerPage)}
                        </Typography>
                        <div className="flex gap-2">
                            <Button variant="outlined" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                Previous
                            </Button>
                            <Button variant="outlined" size="sm" onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredRows.length / rowsPerPage)}>
                                Next
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ) : (
                <GetDataAcademic selectedRow={selectedRow} handleBackToTable={handleBackToTable}/>
            )}
            <div>
                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
                        <div className="min-h-screen px-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="case-out duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in durante-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black opacity-30" />
                            </TransitionChild>
                            <span className="inline-block h-screen align-middle" aria-hidden="true">
                                &#8203;
                            </span>
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-200"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-100"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95">
                                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 text-center">
                                        {isEditing ? "Editar Alumno" : "Agregar Alumno"}
                                    </DialogTitle>
                                    <div className="w-full grid-cols-2 gap-4">
                                        <div className="mt-2">
                                            <div className="relative mt-5">
                                                <span className="absolute inset-0 flex items-center" aria-hidden="true">
                                                    <span className="w-full border-t border-gray-300" />
                                                </span>
                                                <span className="relative flex justify-center text-sm">
                                                    <span className="px-2 bg-white text-gray-500">Información personal</span>
                                                </span>
                                            </div>
                                            <div className="mt-5">
                                                <Input className="w-full" color="gray" label="Nombre"
                                                    value={isEditing ? selectedAlumno?.nombre : nuevoAlumno.nombre}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, nombre: e.target.value })
                                                        : setNuevoAlumno({ ...nuevoAlumno, nombre: e.target.value })
                                                    } />
                                            </div>
                                            <div className="mt-5">
                                                <Input className="w-full" color="gray" label="Apellido"
                                                    value={isEditing ? selectedAlumno?.apellido : nuevoAlumno.apellido}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, apellido: e.target.value })
                                                        : setNuevoAlumno({ ...nuevoAlumno, apellido: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="mt-5">
                                                <Input className="w-full" color="gray" label="Genero"
                                                    value={isEditing ? selectedAlumno?.genero : nuevoAlumno.genero}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, genero: e.target.value })
                                                        : setNuevoAlumno({ ...nuevoAlumno, genero: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="mt-5 w-full">
                                                <Input className="w-full" color="gray" label="DNI"
                                                    value={isEditing ? selectedAlumno?.dni : nuevoAlumno.dni}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, dni: e.target.value })
                                                        : setNuevoAlumno({ ...nuevoAlumno, dni: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="mt-5 relative">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={format(date, 'yyyy-MM-dd')}
                                                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                                    className="w-full p-2 border border-gray-400 rounded-md"
                                                    placeholder="Seleccionar fecha"
                                                />
                                                {isCalendarOpen && (
                                                    <div className="absolute top-full left-0 mt-2 bg-white shadow-lg z-10">
                                                        <Calendar
                                                            onChange={handleDateChange}
                                                            value={date}
                                                            className="rounded-lg"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-5 flex items-center">
                                                <Switch
                                                    id="custom-switch-component"
                                                    ripple={false}
                                                    checked={isChecked}
                                                    onChange={handleChange1}
                                                    className={`h-full w-full ${isChecked ? 'bg-[#2ec946]' : 'bg-gray-300'}`}
                                                    containerProps={{
                                                        className: "w-11 h-6",
                                                    }}
                                                    circleProps={{
                                                        className: "before:hidden left-0.5 border-none",
                                                    }}
                                                />
                                                <span className="ml-2 text-sm font-medium">
                                                    {isChecked ? 'Activo' : 'Desactivo'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-span-2 mt-2">
                                            <div className="relative mt-5 w-full">
                                                <span className="absolute inset-0 flex items-center" aria-hidden="true">
                                                    <span className="w-full border-t border-gray-300" />
                                                </span>
                                                <span className="relative flex justify-center text-sm">
                                                    <span className="px-2 bg-white text-gray-500">Parentesco</span>
                                                </span>
                                            </div>
                                            <div className="mt-5">
                                                <Input color="gray" label="DNI"
                                                    value={isEditing ? selectedAlumno?.apoderado?.dni : nuevoAlumno.apoderado.dni}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, apoderado: { ...selectedAlumno.apoderado, dni: e.target.value } })
                                                        : setNuevoAlumno({ ...nuevoAlumno, apoderado: { ...nuevoAlumno.apoderado, dni: e.target.value } })
                                                    } />
                                            </div>
                                            <div className="mt-5">
                                                <Input color="gray" label="Nombre"
                                                    value={isEditing ? selectedAlumno?.apoderado?.nombre : nuevoAlumno.apoderado.nombre}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, apoderado: { ...selectedAlumno.apoderado, nombre: e.target.value } })
                                                        : setNuevoAlumno({ ...nuevoAlumno, apoderado: { ...nuevoAlumno.apoderado, nombre: e.target.value } })
                                                    } />
                                            </div>
                                            <div className="mt-5">
                                                <Input color="gray" label="Apellido"
                                                    value={isEditing ? selectedAlumno?.apoderado?.apellido : nuevoAlumno.apoderado.apellido}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, apoderado: { ...selectedAlumno.apoderado, apellido: e.target.value } })
                                                        : setNuevoAlumno({ ...nuevoAlumno, apoderado: { ...nuevoAlumno.apoderado, apellido: e.target.value } })
                                                    } />
                                            </div>
                                            <div className="mt-5">
                                                <Input color="gray" label="Correo"
                                                    value={isEditing ? selectedAlumno?.apoderado?.correo : nuevoAlumno.apoderado.correo}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, apoderado: { ...selectedAlumno.apoderado, correo: e.target.value } })
                                                        : setNuevoAlumno({ ...nuevoAlumno, apoderado: { ...nuevoAlumno.apoderado, correo: e.target.value } })
                                                    } />
                                            </div>
                                            <div className="mt-5">
                                                <Input color="gray" label="Direccion"
                                                    value={isEditing ? selectedAlumno?.apoderado?.direccion : nuevoAlumno.apoderado.direccion}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, apoderado: { ...selectedAlumno.apoderado, direccion: e.target.value } })
                                                        : setNuevoAlumno({ ...nuevoAlumno, apoderado: { ...nuevoAlumno.apoderado, direccion: e.target.value } })
                                                    } />
                                            </div>
                                            <div className="mt-5">
                                                <Input color="gray" label="Parentesco"
                                                    value={isEditing ? selectedAlumno?.apoderado?.parentesco : nuevoAlumno.apoderado.parentesco}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, apoderado: { ...selectedAlumno.apoderado, parentesco: e.target.value } })
                                                        : setNuevoAlumno({ ...nuevoAlumno, apoderado: { ...nuevoAlumno.apoderado, parentesco: e.target.value } })
                                                    } />
                                            </div>
                                            <div className="mt-5">
                                                <Input color="gray" label="Telefono"
                                                    value={isEditing ? selectedAlumno?.apoderado?.telefono : nuevoAlumno.apoderado.telefono}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, apoderado: { ...selectedAlumno.apoderado, telefono: e.target.value } })
                                                        : setNuevoAlumno({ ...nuevoAlumno, apoderado: { ...nuevoAlumno.apoderado, telefono: e.target.value } })
                                                    } />
                                            </div>
                                        </div>
                                        <div className="col-span-2 mt-2">
                                            <div className="relative mt-10">
                                                <span className="absolute inset-0 flex items-center" aria-hidden="true">
                                                    <span className="w-full border-t border-gray-300" />
                                                </span>
                                                <span className="relative flex justify-center text-sm">
                                                    <span className="px-2 bg-white text-gray-500">Crear cuenta</span>
                                                </span>
                                            </div>
                                            <div className="mt-5">
                                                <Input
                                                    color="gray"
                                                    label="Usuario"
                                                    value={isEditing ? selectedAlumno?.user?.username : nuevoAlumno.user.username}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, user: { ...selectedAlumno.user, username: e.target.value } })
                                                        : setNuevoAlumno({ ...nuevoAlumno, user: { ...nuevoAlumno.user, username: e.target.value } })}
                                                />
                                            </div>
                                            <div className="mt-5">
                                                <Input color="gray" label="Contraseña" type="password"
                                                    value={isEditing ? selectedAlumno?.user?.password : nuevoAlumno.user.password}
                                                    onChange={(e) => isEditing
                                                        ? setSelectedAlumno({ ...selectedAlumno, user: { ...selectedAlumno.user, password: e.target.value } })
                                                        : setNuevoAlumno({ ...nuevoAlumno, user: { ...nuevoAlumno.user, password: e.target.value } })
                                                    }
                                                />
                                            </div>
                                            <div className="mt-5">
                                                <Input
                                                    color="gray"
                                                    label="Confirmar contraseña"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                                {passwordError && (
                                                    <Typography color="red" variant="small" className="mt-2">
                                                        {passwordError}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center mt-10 gap-5">
                                        <Button color="red" onClick={closeModal}>Cancelar</Button>
                                        <Button color="green" onClick={handleSave}>{isEditing ? "Actualizar" : "Agregar"}</Button>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="absolute top-2 right-2 p-1 rounded-lg text-gray-500
                    bg-white hover:bg-gray-50 hover:text-gray-600 w-7 fill-current">
                                        <XMarkIcon />
                                    </button>
                                </div>
                            </TransitionChild>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
}

export function SectionsTable() {

    const TABLE_HEAD = ["Docente - Tutor", "Nivel", "Grado - Seccion", "Estado", "", "", ""];
    const { TABS } = datas;
    const rowsPerPage = 3;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [activeTab, setActiveTab] = useState("Online");
    const [showForm, setShowForm] = useState(false);

    const [filtro, setFiltro] = useState('');

    const verificarEstado = (estado) => {
        if (estado === 'Online') {
            setActiveTab('Online');
        } else if (estado === 'Offline') {
            setActiveTab('Offline');
        }
    };


    const handleSelectRow = async (row) => {
        try {
            const response = await aulaService.getAulaById(row.id);
            setSelectedRow(response.data);
        } catch (error) {
            console.error("Error fetching aula details: " + error)
        }
    };

    const handleBackToTable = () => {
        setSelectedRow(false);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredRows.length / rowsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const [aulas, setAulas] = useState([]);
    const [nuevoAula, setNuevoAula] = useState(
        {
            grado: {
                nivel: "",
                subNivel: ""
            },
            sub_grado: "",
            estado: "",
            fecha_registro: "",
            tutor: {
                dni: "",
                nombre: "",
                apellido: "",
                correo: "",
                fecha_registro: "",
                estado: 1,
                user: {
                    username: "",
                    password: "",
                }
            },
            alumnos: [],
            horarios: []
        }
    );

    const [selectedAula, setSelectedAula] = useState(
        {
            grado: {
                nivel: "",
                subNivel: ""
            },
            sub_grado: "",
            estado: "",
            fecha_registro: "",
            tutor: {
                dni: "",
                nombre: "",
                apellido: "",
                correo: "",
                fecha_registro: "",
                estado: 1,
                user: {
                    username: "",
                    password: "",
                }
            },
            alumnos: [],
            horarios: []
        }
    );


    //PARA CARGAR DESDE UN INICIO LA TABLA CON LOS AULAS EN LA BD
    useEffect(() => {
        fetchAulas();
        setCurrentPage(1);
    }, [activeTab]);

    //PARA FILTRAR DOCENTES Y HACER MAPEO TBM DE LA TABLA
    const aulasFiltrados = aulas.filter(aula =>
        aula.tutor.nombre.toString().startsWith(filtro) ||
        aula.grado.nivel.toLowerCase().startsWith(filtro.toLowerCase())
    );

    const [filteredRows, setFilteredRows] = useState(aulasFiltrados);


    const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    //METODO PARA TRAER LOS DOCENTES
    const fetchAulas = async () => {
        try {
            const response =
                activeTab === "Online"
                    ? await aulaService.getAulas()
                    : await aulaService.getAulaDes();
            if (response.data) {
                setAulas(response.data);
            } else {
                console.error('No se encontraron aulas');
            }
        } catch (error) {
            console.error('Error al acceder a encontrar aula', error);
        }
    };

    //MÉTODO PARA ELIMINAR DOCENTE
    const EliminarAula = async (aula) => {

        try {
            const response = await aulaService.deleteAula(aula.id, 0);
            if (response.data) {
                fetchAulas();
            } else {
                console.error('No se recibieron datos al eliminar el aula');
            }
        } catch (error) {
            console.error('Error al desactivar el aula:', error);
        }
    };

    const DesactivarAula = async (aula) => {

        try {
            const response = await aulaService.deleteAula(aula.id, 2);
            if (response.data) {
                fetchAulas();
            } else {
                console.error('No se recibieron datos al actualizar el aula');
            }
        } catch (error) {
            console.error('Error al desactivar el aula:', error);
        }
    };

    const ActivarAula = async (aula) => {
        try {
            const response = await aulaService.deleteAula(aula.id, 1);
            if (response.data) {
                fetchAulas();
            } else {
                console.error('No se recibieron datos al actualizar el aula');
            }
        } catch (error) {
            console.error('Error al desactivar el aula:', error);
        }
    };

    console.log(aulasFiltrados);

    const renderTable = () => (
        <Card className="h-full w-full">
            <div className="relative">
                <div className="absolute top-0 left-0 w-full z-10">
                    <CardHeader variant="gradient" color="gray" className="mb-8 p-6 text-center">
                        <Typography variant="h6" color="white">
                            Aulas
                        </Typography>
                    </CardHeader>
                </div>
                <div className="relative mt-16">
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-8 flex justify-end gap-2 sm:gap-5">
                            <Button className="flex items-center gap-3" size="sm" onClick={() => setShowForm(true)}>
                                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Agregar
                            </Button>
                        </div>
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <Tabs value={activeTab} className="w-full md:w-max">
                                <TabsHeader>
                                    {TABS.map(({ label, value }) => (
                                        <Tab key={value} value={value} onClick={() => verificarEstado(value)}>
                                            &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                        </Tab>
                                    ))}
                                </TabsHeader>
                            </Tabs>
                            <div className="w-full md:w-72">
                                <Input
                                    label="Search"
                                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                    value={filtro}
                                    onChange={(e) => setFiltro(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                </div>
            </div>
            <CardBody className="overflow-scroll px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head, index) => (
                                <th key={index} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {aulasFiltrados.map((aula, index) => {
                            const isLast = index === paginatedRows.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={aula.id || index}>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {aula.tutor.nombre} {aula.tutor.apellido}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {aula.grado.nivel}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {aula.grado.subNivel} - {aula.sub_grado}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <div className="w-max">
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value={aula.estado === 1 ? "online" : "offline"}
                                                color={aula.estado === 1 ? "green" : "blue-gray"}
                                            />
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        {aula.estado === 1 ? (
                                            <>
                                                <Tooltip content="Desactivar Aula">
                                                    <IconButton variant="text" onClick={() => DesactivarAula(aula)}>
                                                        <NoSymbolIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip content="Eliminar Aula">
                                                    <IconButton variant="text" onClick={() => EliminarAula(aula)}>
                                                        <TrashIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <Tooltip content="Activar Aula">
                                                <IconButton variant="text" onClick={() => ActivarAula(aula)}>
                                                    <UserPlusIcon className="h-4 w-4" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </td>
                                    <td className={classes}>
                                        <Tooltip content="Ver Perfil">
                                            <IconButton variant="text" >
                                                <EllipsisVerticalIcon className="h-5 w-5" onClick={() => handleSelectRow(aula)} />
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Page {currentPage} of {Math.ceil(filteredRows.length / rowsPerPage)}
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <Button variant="outlined" size="sm" onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredRows.length / rowsPerPage)}>
                        Next
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );

    const renderSelectedRow = () => {

        const formatHorarios = (horarios) => {
            const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

            return horarios.map((horario, index) => {
                const [inicioHora, inicioMinutos] = horario.inicio.split(":");
                const [finHora, finMinutos] = horario.fin.split(":");

                const startDay = addDays(currentWeekStart, horario.dia - 1);
                const endDay = addDays(currentWeekStart, horario.dia - 1);

                const startDate = setMinutes(setHours(startDay, parseInt(inicioHora)), parseInt(inicioMinutos));
                const endDate = setMinutes(setHours(endDay, parseInt(finHora)), parseInt(finMinutos));

                return {
                    id: index.toString(),
                    title: horario.materia.nombre,
                    subtitle: horario.docente.nombre,
                    startDate,
                    endDate,
                };
            });
        };

        return (
            <div className="p-4">
                <button
                    className="-mt-10 px-4 py-2 bg-transparent text-black rounded-full flex items-center justify-center"
                    onClick={handleBackToTable}
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="col-span-1 md:col-span-2 flex flex-col">
                        <div className="bg-white p-4 rounded-lg border border-blue-gray-100 flex-grow">
                            <h2 className="text-xl font-semibold mb-2 text-center">Información del aula</h2>
                            <p><strong>Aula:</strong> {selectedRow?.grado?.subNivel}  {selectedRow?.sub_grado}</p>
                            <p><strong>Nivel:</strong> {selectedRow?.grado?.nivel}</p>
                            <p><strong>Docente Asignado:</strong> {selectedRow?.tutor?.nombre} {selectedRow?.tutor?.apellido}</p>
                            <div className="my-4 border-t border-gray-300"></div>
                            <CalendarSection events={formatHorarios(selectedRow?.horarios || [])} />
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col">
                        <Card className="border border-blue-gray-100 shadow-sm flex-grow">
                            <CardHeader
                                floated={false}
                                shadow={false}
                                color="transparent"
                                className="m-0 p-5"
                            >
                                <Typography variant="h6" color="blue-gray" className="mb-2 text-center">
                                    Alumnos
                                </Typography>
                            </CardHeader>
                            <CardBody className="pt-0">
                                {selectedRow?.alumnos
                                    ?.filter((alumno) => alumno.estado === 1)
                                    .map(({ nombre, apellido, dni }, key) => (
                                        <div key={dni} className="flex items-start gap-4 py-3">
                                            <div
                                                className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${key === selectedRow.alumnos.length - 1
                                                    ? "after:h-0"
                                                    : "after:h-4/6"
                                                    }`}
                                            >
                                                <UserIcon className="!w-5 !h-5 text-blue-gray-300" />
                                            </div>
                                            <div>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="block font-medium"
                                                >
                                                    {nombre} {apellido}
                                                </Typography>
                                                <Typography
                                                    as="span"
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-300"
                                                >
                                                    {dni}
                                                </Typography>
                                            </div>
                                        </div>
                                    ))}
                            </CardBody>
                        </Card>
                    </div>

                </div>
            </div>
        );
    };


    const renderForm = () => (
        <>
            <div>
                <FormContextProvider>
                    <div>
                        <button
                            className="-mt-4 px-4 py-2 bg-transparent text-black rounded-full flex items-center justify-center"
                            onClick={() => setShowForm(false)}
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="mt-10">
                        <MultiSteps />
                    </div>
                </FormContextProvider>
            </div>
        </>
    );

    return (
        <div>
            {!selectedRow ? (
                showForm ? renderForm() : renderTable()
            ) : (
                renderSelectedRow()
            )}
        </div>
    );
}
