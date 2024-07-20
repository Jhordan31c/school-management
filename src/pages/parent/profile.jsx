import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  EnvelopeIcon
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { useUser } from '@/context/UserContext';
import citaServicio from "@/services/citaServicio";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import alumnoServicio from "@/services/alumnoServicio";

export function ProfileParent() {
  const { user } = useUser();
  const [apoderadoInfo, setApoderadoInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedApoderadoInfo, setEditedApoderadoInfo] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    username: '',
    estado: '1' // Asegura que el estado siempre sea 1 al inicio
  });
  const [cita, setCita] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      fetchApoderadoInfo();
    }
  }, [user]);

  const fetchApoderadoInfo = async () => {
    try {
      const response = await alumnoServicio.getAlumnoId(user.id); // Reemplaza esta línea con la llamada real a tu API
      if (response.data) {
        setApoderadoInfo(response.data);
        setEditedApoderadoInfo({
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          dni: response.data.dni,
          username: response.data.user.username, // Ajuste para obtener el username correcto
          estado: response.data.estado
        });
        fetchCitas(1, user.id);
      } else {
        console.error('No se encontraron datos del apoderado.');
      }
    } catch (error) {
      console.error('Error al acceder a encontrar datos del apoderado:', error);
    }
  };

  const fetchCitas = async (estado, idAlumno) => {
    try {
      const response = await citaServicio.getCitaAlumnoConfirmado(estado, idAlumno);
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
    setEditedApoderadoInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = async () => {
    try {
      console.log('Datos a enviar:', editedApoderadoInfo);
      const response = await alumnoServicio.updateMyInformation(apoderadoInfo.id, editedApoderadoInfo); // Reemplaza con la llamada real a tu API
      console.log('Respuesta del servidor:', response.data);
      if (response.data) {
        setApoderadoInfo(prevApoderadoInfo => ({
          ...prevApoderadoInfo,
          nombre: editedApoderadoInfo.nombre,
          apellido: editedApoderadoInfo.apellido,
          dni: editedApoderadoInfo.dni,
          user: {
            ...prevApoderadoInfo.user,
            username: editedApoderadoInfo.username
          }
        }));
        setIsEditing(false);
      } else {
        console.error('No se recibieron datos al actualizar el apoderado');
      }
    } catch (error) {
      console.error('Error al actualizar el apoderado:', error);
    }
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        {apoderadoInfo ? (
          <CardBody className="p-4">
            <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-6">
                <Avatar
                  src="https://i.ibb.co/6Z1zb6p/father-and-son-2.png"
                  alt="apoderado-avatar"
                  size="lg"
                  variant="rounded"
                  className="rounded-lg shadow-blue-gray-500/40"
                />
                <div>
                  <Typography variant="h5" color="blue-gray" className="mb-1">
                    {apoderadoInfo.nombre} {apoderadoInfo.apellido}
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-600"
                  >
                    Apoderado
                  </Typography>
                </div>
              </div>
            </div>
            <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
              <ProfileInfoCard
                title="Datos Personales"
                description="Nos alegra tener como parte de nuestra comunidad educativa a este apoderado. Su apoyo y compromiso son invaluables."
                details={{
                  "Nombre": isEditing ? (
                    <input
                      type="text"
                      name="nombre"
                      value={editedApoderadoInfo.nombre}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    apoderadoInfo.nombre
                  ),
                  "Apellido": isEditing ? (
                    <input
                      type="text"
                      name="apellido"
                      value={editedApoderadoInfo.apellido}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    apoderadoInfo.apellido
                  ),
                  "DNI": isEditing ? (
                    <input
                      type="text"
                      name="dni"
                      value={editedApoderadoInfo.dni}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    apoderadoInfo.dni
                  ),
                  "Usuario": isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={editedApoderadoInfo.username}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    apoderadoInfo.user.username
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

export default ProfileParent;
