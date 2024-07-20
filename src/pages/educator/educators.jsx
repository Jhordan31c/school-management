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
import { PencilIcon, UserPlusIcon, EllipsisVerticalIcon, ChevronLeftIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Transition, TransitionChild, Dialog, DialogTitle } from "@headlessui/react";
import docenteServicio from "@/services/docenteServicio";


export function EducatorsDocentes() {

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

  const aulasFiltradas = aulasAsignadas.filter(aula => {
    const gradoSubGrado = (aula.grado.toString() + ' ' + aula.subGrado.toString()).toLowerCase();
    const filtroLowerCase = filtro.toLowerCase().replace('-', '');

    return (
      aula.nivel === activeTabAula &&
      (
        aula.materia.toString().toLowerCase().startsWith(filtroLowerCase) ||
        gradoSubGrado.startsWith(filtroLowerCase) ||
        `${aula.grado}-${aula.subGrado}`.toLowerCase().replace('-', '').startsWith(filtroLowerCase) ||
        `${aula.grado} - ${aula.subGrado}`.toLowerCase().replace('-', '').startsWith(filtroLowerCase) ||
        `${aula.grado}  ${aula.subGrado}`.toLowerCase().replace('-', '').startsWith(filtroLowerCase) ||
        `${aula.grado} ${aula.subGrado}`.toLowerCase().replace('-', '').startsWith(filtroLowerCase)
      )
    );
  });


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
                  Colegas de Docencia
                </Typography>
              </CardHeader>
            </div>
            <div className="relative mt-16">
              <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
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
                  {["Nombre", "Apellido", "Correo", "Estado"].map((el, index) => (
                    <th
                      key={index}
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
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={docente.estado === 1 ? "online" : "offline"}
                            color={docente.estado === 1 ? "green" : "blue-gray"}
                          />
                        </div>
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
        </div>
      )}
    </div>
  );
}

export default EducatorsDocentes;