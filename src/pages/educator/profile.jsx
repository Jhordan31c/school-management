import React, { useContext, useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Typography,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import { PencilIcon, EnvelopeIcon, UserIcon } from "@heroicons/react/24/solid";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { conversationsData } from "@/data";
import { UserContext } from "@/context/UserContext";
import docenteServicio from '@/services/docenteServicio';
import citaServicio from '@/services/citaServicio';
import dayjs from 'dayjs';

export function ProfileEducator() {
  const { user, setUser } = useContext(UserContext);
  const rolDocente = 'ROLE_DOCENTE';
  const idUser = user?.user?.id;
  const idDocente = user?.id;
  const [docenteInfo, setDocenteInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocenteInfo, setEditedDocenteInfo] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    correo: '',
    username: '',
    estado: ''  // Asegura que el estado siempre sea 1 al inicio
  });

  const [cita, setCita] = useState([]);

  useEffect(() => {
    if (idDocente) {
      fetchDocenteInfo(idDocente);
    }
    fetchCitas(1, idDocente);
  }, [idUser, rolDocente, setUser]);

  const fetchDocenteInfo = async (idDocente) => {
    try {
      const response = await docenteServicio.getDocentesId(idDocente);
      if (response.data) {
        setDocenteInfo(response.data);
        setEditedDocenteInfo({
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          dni: response.data.dni,
          correo: response.data.correo,
          username: response.data.user.username,
          estado: response.data.estado
        });
        fetchCitas(1, idDocente);
      } else {
        console.error('No se encontraron datos del docente.');
      }
    } catch (error) {
      console.error('Error al acceder a encontrar datos del docente:', error);
    }
  };

  const fetchCitas = async (estado, idDocente) => {
    try {
      const response = await citaServicio.getCitaDocenteConfirmado(estado, idDocente);
      console.log(response.data);
      if (response.data) {
        setCita(response.data);
      } else {
        console.error('No se encontraron citas.');
      }
    } catch (error) {
      console.error('Error al acceder a encontrar citas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDocenteInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = async () => {
    try {
      console.log('Datos a enviar:', editedDocenteInfo);
      const response = await docenteServicio.actualizarMisDatos(docenteInfo.id, editedDocenteInfo);
      console.log('Respuesta del servidor:', response.data);
      if (response.data) {
        setDocenteInfo(prevDocenteInfo => ({
          ...prevDocenteInfo,
          nombre: editedDocenteInfo.nombre,
          apellido: editedDocenteInfo.apellido,
          dni: editedDocenteInfo.dni,
          correo: editedDocenteInfo.correo,
          user: {
            ...prevDocenteInfo.user,
            username: editedDocenteInfo.username
          },
        }));
        setIsEditing(false);
      } else {
        console.error('No se recibieron datos al actualizar el docente');
      }
    } catch (error) {
      console.error('Error al actualizar el docente:', error);
    }
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        {docenteInfo ? (
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
                    {docenteInfo.nombre} {docenteInfo.apellido}
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
                  FirstName: isEditing ? (
                    <input
                      type="text"
                      name="nombre"
                      value={editedDocenteInfo.nombre}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    docenteInfo.nombre
                  ),
                  LastName: isEditing ? (
                    <input
                      type="text"
                      name="apellido"
                      value={editedDocenteInfo.apellido}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    docenteInfo.apellido
                  ),
                  DNI: isEditing ? (
                    <input
                      type="text"
                      name="dni"
                      value={editedDocenteInfo.dni}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    docenteInfo.dni
                  ),
                  Email: isEditing ? (
                    <input
                      type="email"
                      name="correo"
                      value={editedDocenteInfo.correo}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    docenteInfo.correo
                  ),
                  Usuario: isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={editedDocenteInfo.username}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    docenteInfo.user.username
                  )
                }}
                action={
                  <Tooltip content={isEditing ? "Save Changes" : "Edit Profile"}>
                    <PencilIcon
                      className="h-4 w-4 cursor-pointer text-blue-gray-500"
                      onClick={isEditing ? saveChanges : toggleEdit}
                    />
                  </Tooltip>
                }
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
                      Citas Confirmadas
                    </Typography>
                  </CardHeader>
                  <CardBody className="pt-0 overflow-y-auto" style={{ maxHeight: '500px' }}>
                    {cita.map(({ id, titulo, detalle }, key) => (
                      <div key={id} className="flex items-start gap-4 py-3">
                        <div
                          className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${key === cita.length - 1
                            ? "after:h-0"
                            : "after:h-4/6"
                            }`}
                        >
                          <EnvelopeIcon className="!w-5 !h-5 text-blue-gray-300" />
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="block font-medium"
                          >
                            {titulo}
                          </Typography>
                          <Typography
                            as="span"
                            variant="small"
                            className="text-xs font-medium text-blue-gray-300"
                          >
                            {detalle}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </div>
            </div>
          </CardBody>
        ) : (
          <div className="p-4 text-center">Loading...</div> // Mensaje de carga
        )}
      </Card>
    </>
  );
}

export default ProfileEducator;