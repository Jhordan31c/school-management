import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Button,
  Tabs,
  TabsHeader,
  Tab,
  Input,
  IconButton,
  CardFooter
} from "@material-tailwind/react";
import { authorsTableData, projectsTableData, datas, studentInfo } from "@/data";
import React, { useState, useEffect, Fragment } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Example } from "@/widgets/components";
import { PencilIcon, UserPlusIcon, EllipsisVerticalIcon, ChevronLeftIcon, TrashIcon, XMarkIcon, UserIcon,BookOpenIcon } from "@heroicons/react/24/solid";
import { Transition, TransitionChild, Dialog, DialogTitle } from "@headlessui/react";
import docenteServicio from "@/services/docenteServicio";
import { ProfileInfoCard } from "@/widgets/cards";


export function Educators() {

  const { TABLE_HEAD, TABLE_ROWS, TABS } = datas;
  const rowsPerPage = 4;
  const initialGrade = studentInfo.historialAcademico.length > 0 ? studentInfo.historialAcademico[0] : null;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState("Online");
  const [activeTabAula, setActiveTabAula] = useState("INICIAL");
  const [selectedGrade, setSelectedGrade] = useState(initialGrade);
  const [isEditing, setIsEditing] = useState(false);


  const verificarEstado = (estado) => {
    if (estado === 'Online') {
      setActiveTab('Online');
    } else if (estado === 'Offline') {
      setActiveTab('Offline');
    }
  };

  const verificarEstadoAula = (estado) => {
    if (estado === 'INICIAL') {
      setActiveTabAula('INICIAL');
    } else if (estado === 'PRIMARIA') {
      setActiveTabAula('PRIMARIA');
    } else if (estado === 'SECUNDARIA') {
      setActiveTabAula('SECUNDARIA');
    }
  };

  const handleModified = () => {
    setIsEditing(false);
    setSelectedDocente({ nombre: '', apellido: '', correo: '', dni: '', user: { username: "", password: "" } });
    setNuevoDocente({ nombre: '', apellido: '', correo: '', dni: '', user: { username: "", password: "" } });
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
    setNuevoDocente({ nombre: '', apellido: '', correo: '', dni: '', user: { username: "", password: "" } });
    setSelectedDocente({ nombre: '', apellido: '', correo: '', dni: '', user: { username: "", password: "" } });
    setConfirmPassword('');
    setIsEditing(false);
  }

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
    console.log(row);
    fetchAulasAsignadas(row.id);
  };

  const handleBackToTable = () => {
    setSelectedRow(null);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };


  const [docentes, setDocentes] = useState([]);
  const [nuevoDocente, setNuevoDocente] = useState({ nombre: '', apellido: '', correo: '', dni: '', user: { username: "", password: "" } });
  const [selectedDocente, setSelectedDocente] = useState({ nombre: '', apellido: '', correo: '', dni: '', user: { username: "", password: "" } });
  const [cantidadDocentes, setCantidadDocentes] = useState(0);
  const [filtro, setFiltro] = useState('');
  const [aulasAsignadas, setAulasAsignadas] = useState([]);


  const TABSNIVEL = [
    {
      label: "INICIAL",
      value: "INICIAL",
    },
    {
      label: "PRIMARIA",
      value: "PRIMARIA",
    },
    {
      label: "SECUNDARIA",
      value: "SECUNDARIA",
    },
  ];


  //METODO PARA TRAER LOS DOCENTES
  const fetchDocentes = async () => {
    try {
      const response =
        activeTab === "Online"
          ? await docenteServicio.getDocentesActivate()
          : await docenteServicio.getDocentesDesactivate();
      if (response.data) {
        setDocentes(response.data);
        setCantidadDocentes(response.data.length);
      } else {
        console.error('No se encontraron docentes');
      }
    } catch (error) {
      console.error('Error al acceder a encontrar docente', error);
    }
  };

  //PARA FILTRAR DOCENTES Y HACER MAPEO TBM DE LA TABLA
  const docentesFiltrados = docentes.filter(docente =>
    docente.dni.toString().startsWith(filtro) ||
    docente.nombre.toLowerCase().startsWith(filtro.toLowerCase()) ||
    docente.apellido.toLowerCase().startsWith(filtro.toLowerCase())
  );

  const [filteredRows, setFilteredRows] = useState([]);

  //PARA CARGAR DESDE UN INICIO LA TABLA CON LOS DOCENTES EN LA BD
  useEffect(() => {
    fetchDocentes();
    setCantidadDocentes(docentes.length);
    setCurrentPage(1);
  }, [activeTab, activeTabAula]);

  const paginatedRows = docentesFiltrados.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSave = async () => {
    if (isEditing) {
      if (selectedDocente.user.password !== confirmPassword) {
        setPasswordError('Las contraseñas no coinciden');
        return;
      }
      await handleUpdateDocente();
    } else {
      if (nuevoDocente.user.password !== confirmPassword) {
        setPasswordError('Las contraseñas no coinciden');
        return;
      }
      await handleAddDocente();
    }

    setPasswordError('');
    setIsOpen(false);
  };




  //MÉTODO PARA AÑADIR DOCETNES
  const handleAddDocente = async () => {
    // Verifica si los campos necesarios están vacíos
    if (
      !nuevoDocente.nombre ||
      !nuevoDocente.apellido ||
      !nuevoDocente.correo ||
      !nuevoDocente.dni ||
      !nuevoDocente.user.username ||
      !nuevoDocente.user.password
    ) {
      console.error('Por favor, completa todos los campos.');
      return;
    }

    try {
      // OBJETO DEL DOCENTE
      const nuevoDocenteObj = {
        nombre: nuevoDocente.nombre,
        apellido: nuevoDocente.apellido,
        correo: nuevoDocente.correo,
        dni: nuevoDocente.dni,
        user: {
          username: nuevoDocente.user.username,
          password: nuevoDocente.user.password
        }
      };

      //ENVÍO DE LA SOLICITUD MEDIANTE EL SERVICIO PAL BACKEND
      const response = await docenteServicio.addDocente(nuevoDocenteObj);

      if (response.data) {
        // ACTUALZIAR EL ESTADO DEL NUEVO DOCENTE
        setDocentes([...docentes, response.data]);
        //REESTABLECER VALORES
        setNuevoDocente({ nombre: '', apellido: '', correo: '', dni: '', user: { username: "", password: "" } });
        setIsOpen(false);
      } else {
        console.error('No se pudo agregar el docente');
      }
    } catch (error) {
      console.error('Error al agregar el docente:', error);
    }
  };

  //MÉTODO PARA TRAER LOS DATOS AL MODAL DE EDITAR
  const handleEditClickDocente = (docente) => {
    setSelectedDocente(docente);
    setIsEditing(true);
    setIsOpen(true);
    setConfirmPassword(docente.user.password);
  };


  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(docentesFiltrados.length / rowsPerPage)));
  };

  //MÉTODO PARA ACTUALIZAR MATERIA
  const handleUpdateDocente = async () => {
    try {
      const response = await docenteServicio.updateDocente(selectedDocente.id, selectedDocente);
      if (response.data) {
        setIsOpen(false);
        // VOLVER A CARGAR LOS DOCENTES
        fetchDocentes();
      } else {
        console.error('No se recibieron datos al actualizar el docente');
      }
    } catch (error) {
      console.error('Error al actualizar el docente:', error);
    }
  };

  //MÉTODO PARA ELIMINAR DOCENTE
  const DesactivarDocente = async (docente) => {
    try {
      const response = await docenteServicio.actualizarEstado(docente.id, 0);
      if (response.data) {
        fetchDocentes();
      } else {
        console.error('No se recibieron datos al actualizar el docente');
      }
    } catch (error) {
      console.error('Error al desactivar el docente:', error);
    }
  };

  //MÉTODO PARA ACTIVAR DOCENTE
  const ActivarDocente = async (docente) => {
    try {
      const response = await docenteServicio.actualizarEstado(docente.id, 1);
      if (response.data) {
        fetchDocentes();
      } else {
        console.error('No se recibieron datos al actualizar el docente');
      }
    } catch (error) {
      console.error('Error al desactivar el docente:', error);
    }
  };

  const fetchAulasAsignadas = async (docenteId) => {
    try {
      const response = await docenteServicio.getAulasAsignadas(docenteId);
      console.log("AULAS ASIGNADAS", response.data); // Verifica los datos obtenidos en la consola para asegurarte que recibes los datos correctamente
      if (response.data) {
        setAulasAsignadas(response.data);
      } else {
        console.error('No se encontraron datos de aulas asignadas.');
      }
    } catch (error) {
      console.error('Error al obtener datos de aulas asignadas:', error);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {!selectedRow ? (
        <Card className="h-full w-full">
          <div className="relative">
            <div className="absolute top-0 left-0 w-full z-10">
              <CardHeader variant="gradient" color="gray" className="mb-8 p-6 text-center">
                <Typography variant="h6" color="white">
                  Docentes
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
                {docentesFiltrados.map((docente, index) => {
                  const classes = index === docentesFiltrados.length - 1 ? "p-4" : "p-4 border-b border-blue-gray-50";
                  return (
                    <tr key={docente.id || index}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {docente.nombre}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {docente.apellido}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {docente.correo}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {docente.dni}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={docente.estado === 1 ? "online" : "offline"}
                            color={docente.estado === 1 ? "green" : "blue-gray"}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Editar Docente">
                          <IconButton variant="text">
                            <PencilIcon className="h-4 w-4" onClick={() => handleEditClickDocente(docente)} />
                          </IconButton>
                        </Tooltip>
                      </td>
                      <td className={classes}>
                        {docente.estado === 1 ? (
                          <Tooltip content="Desactivar Docente">
                            <IconButton variant="text" onClick={() => DesactivarDocente(docente)}>
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip content="Activar Docente">
                            <IconButton variant="text" onClick={() => ActivarDocente(docente)}>
                              <UserPlusIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </td>
                      <td className={classes}>
                        <Tooltip content="Ver Perfil">
                          <IconButton variant="text" onClick={() => handleSelectRow(docente)}>
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
              Page {currentPage} of {Math.ceil(docentesFiltrados.length / rowsPerPage)}
            </Typography>
            <div className="flex gap-2">
              <Button variant="outlined" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button variant="outlined" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(docentesFiltrados.length / rowsPerPage)))} disabled={currentPage === Math.ceil(docentesFiltrados.length / rowsPerPage)}>
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <div>
          <button className="-mt-10 px-4 py-2 bg-transparent text-black rounded-full flex items-center justify-center" >
            <ChevronLeftIcon onClick={handleBackToTable} className="w-5 h-5" />
          </button>
          <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
            <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
          </div>
          <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
            <CardBody className="p-4">
              <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-6">
                  <Avatar
                    src="https://i.ibb.co/wsL6Jp6/teacher-2.png"
                    size="lg"
                    variant="rounded"
                    className="rounded-lg shadow-blue-gray-500/40"
                  />
                  <div>
                    <Typography variant="h5" color="blue-gray" className="mb-1">
                      {selectedRow.nombre} {selectedRow.apellido}
                    </Typography>
                    <Typography
                      variant="small"
                      className="font-normal text-blue-gray-600"
                    >
                      Docente
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
                <ProfileInfoCard
                  title="Datos Personales"
                  description="Nos alegra tener como parte de nuestra docencia a este profesor en el Colegio Apostol Santiago. Su experiencia y dedicación enriquecen nuestra comunidad educativa."
                  details={{
                    FirstName:selectedRow.nombre,
                    LastName:selectedRow.apellido,
                    DNI:selectedRow.dni,
                    Email:selectedRow.correo,
                    Usuario:selectedRow.user.username
                  }}
                />
                <div>
                <Card className="border-none shadow-none">
                  <CardHeader
                    floated={false}
                    shadow={false}
                    color="transparent"
                    className="m-0 p-6"
                  >
                    <Typography variant="h6" color="blue-gray" className="mb-0">
                      Salones y Materias
                    </Typography>
                  </CardHeader>
                  <CardBody className="pt-0 overflow-y-auto" style={{ maxHeight: '500px' }}>
                    {aulasAsignadas.map((aula, key) => (
                      <div key={key} className="flex items-start gap-4 py-3">
                        <div
                          className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${key === aulasAsignadas.length - 1
                            ? "after:h-0"
                            : "after:h-4/6"
                            }`}
                        >
                          <BookOpenIcon className="!w-5 !h-5 text-blue-gray-300" />
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="block font-medium"
                          >
                            {aula.nivel} : {aula.grado}-{aula.subGrado}
                          </Typography>
                          <Typography
                            as="span"
                            variant="small"
                            className="text-xs font-medium text-blue-gray-300"
                          >
                            {aula.materia}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
      <div>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
            <div className="min-h-screen px-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
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
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 text-center">
                    {isEditing ? "Editar Docente" : "Agregar Docente"}
                  </DialogTitle>
                  <div className="mt-2">
                    {/* Información personal */}
                    <div className="relative mt-5">
                      <span className="absolute inset-0 flex items-center" aria-hidden="true">
                        <span className="w-full border-t border-gray-300" />
                      </span>
                      <span className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Información personal</span>
                      </span>
                    </div>
                    <div className="mt-5">
                      <Input color="gray" label="Nombre"
                        value={isEditing ? selectedDocente?.nombre : nuevoDocente.nombre}
                        onChange={(e) => isEditing
                          ? setSelectedDocente({ ...selectedDocente, nombre: e.target.value })
                          : setNuevoDocente({ ...nuevoDocente, nombre: e.target.value })
                        } />
                    </div>
                    <div className="mt-5">
                      <Input color="gray" label="Apellido"
                        value={isEditing ? selectedDocente?.apellido : nuevoDocente.apellido}
                        onChange={(e) => isEditing
                          ? setSelectedDocente({ ...selectedDocente, apellido: e.target.value })
                          : setNuevoDocente({ ...nuevoDocente, apellido: e.target.value })
                        }
                      />
                    </div>
                    <div className="mt-5">
                      <Input color="gray" label="Correo"
                        value={isEditing ? selectedDocente?.correo : nuevoDocente.correo}
                        onChange={(e) => isEditing
                          ? setSelectedDocente({ ...selectedDocente, correo: e.target.value })
                          : setNuevoDocente({ ...nuevoDocente, correo: e.target.value })
                        }
                      />
                    </div>
                    <div className="mt-5">
                      <Input color="gray" label="DNI"
                        value={isEditing ? selectedDocente?.dni : nuevoDocente.dni}
                        onChange={(e) => isEditing
                          ? setSelectedDocente({ ...selectedDocente, dni: e.target.value })
                          : setNuevoDocente({ ...nuevoDocente, dni: e.target.value })
                        }
                      />
                    </div>

                    {/* Crear cuenta */}
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
                        value={isEditing ? selectedDocente?.user?.username : nuevoDocente.user.username}
                        onChange={(e) => isEditing
                          ? setSelectedDocente({ ...selectedDocente, user: { ...selectedDocente.user, username: e.target.value } })
                          : setNuevoDocente({ ...nuevoDocente, user: { ...nuevoDocente.user, username: e.target.value } })}
                      />
                    </div>
                    <div className="mt-5">
                      <Input color="gray" label="Contraseña" type="password"
                        value={isEditing ? selectedDocente?.user?.password : nuevoDocente.user.password}
                        onChange={(e) => isEditing
                          ? setSelectedDocente({ ...selectedDocente, user: { ...selectedDocente.user, password: e.target.value } })
                          : setNuevoDocente({ ...nuevoDocente, user: { ...nuevoDocente.user, password: e.target.value } })
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

export default Educators;