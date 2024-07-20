import React, { useState, useEffect } from 'react';
import alumnoServicio from '@/services/alumnoServicio'; // Asegúrate de importar el servicio correctamente
import { Select, Option, Typography, Card, CardBody, CardHeader, Avatar } from '@material-tailwind/react';
import { ProfileInfoCard } from "@/widgets/cards";
import { ApexChart } from '@/widgets/charts';
import { ChevronLeftIcon, BookOpenIcon } from "@heroicons/react/24/solid";

const GetDataAcademic = ({ selectedRow, handleBackToTable }) => {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [academicLevels, setAcademicLevels] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedBimester, setSelectedBimester] = useState(null);
    const [courseDetails, setCourseDetails] = useState({});
    const [activeCourseSelector, setActiveCourseSelector] = useState(null);
    const [activeBimesterSelector, setActiveBimesterSelector] = useState(null);


    useEffect(() => {
        if (selectedRow) {
            const idAlumno = selectedRow.id;

            alumnoServicio.getAcademicLevelsByStudent(idAlumno)
                .then(response => {
                    const grades = response.data;
                    setAcademicLevels(grades);
                    if (grades.length > 0) {
                        setSelectedGrade(grades[0].id);
                    } else {
                        console.warn('No grades found for student.');
                    }
                })
                .catch(error => console.error(error));
        }
    }, [selectedRow]);

    useEffect(() => {
        if (selectedGrade !== null && selectedRow) {
            const idAlumno = selectedRow.id;

            alumnoServicio.getCoursesByStudent(idAlumno, selectedGrade)
                .then(response => setCourses(response.data))
                .catch(error => console.error(error));
        } else {
            console.warn('selectedGrade is null or selectedRow is null, skipping course fetch.');
        }
    }, [selectedGrade, selectedRow]);

    const groupedCourses = courses.reduce((acc, course) => {
        (acc[course.area] = acc[course.area] || []).push(course);
        return acc;
    }, {});

    const handleGradeSelect = (selectedId) => {
        setSelectedGrade(selectedId !== '' ? selectedId : null);
        setSelectedCourse(null);
        setSelectedBimester(null);
        setCourseDetails({});
    };

    const handleCourseSelect = (courseId) => {
        setSelectedCourse(courseId);
        setSelectedBimester(null);
        setActiveCourseSelector(courseId);
        setActiveBimesterSelector(null);
        if (!courseDetails[courseId]) {
            alumnoServicio.getTopicAllInformation(courseId)
                .then(response => {
                    setCourseDetails(prevState => ({
                        ...prevState,
                        [courseId]: response.data
                    }));
                })
                .catch(error => console.error(error));
        }
    };
    
    const handleBimesterSelect = (bimesterId) => {
        setSelectedBimester(bimesterId);
        setActiveBimesterSelector(bimesterId);
    };
    

    const currentCourseDetails = courseDetails[selectedCourse] || { bimestres: [] };
    const selectedBimesterDetails = currentCourseDetails.bimestres.find(b => b.id === parseInt(selectedBimester)) || {};

    const seriesData = selectedBimesterDetails ? [
        selectedBimesterDetails.nota1,
        selectedBimesterDetails.nota2,
        selectedBimesterDetails.nota3,
        selectedBimesterDetails.nota4,
    ] : [];

    return (
        <div>
            {!selectedRow ? (
                <div />
            ) : (
                <div>
                    <button className="-mt-10 px-4 py-2 bg-transparent text-black rounded-full flex items-center justify-center">
                        <ChevronLeftIcon onClick={handleBackToTable} className="w-5 h-5" />
                    </button>
                    <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
                        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
                    </div>
                    <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
                        <CardBody className="p-4">
                            <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
                                <div className="flex items-center gap-6">
                                    <Avatar
                                        src="https://i.ibb.co/6Z1zb6p/father-and-son-2.png"
                                        size="lg"
                                        variant="rounded"
                                        className="rounded-lg shadow-blue-gray-500/40"
                                    />
                                    <div>
                                        <Typography variant="h5" color="blue-gray" className="mb-1">
                                            {selectedRow.nombre} {selectedRow.apellido}
                                        </Typography>
                                        <Typography variant="small" className="font-normal text-blue-gray-600">
                                            Alumno
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                            <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-3">
                                <ProfileInfoCard
                                    title="Datos Personales"
                                    description="Nos alegra tener como parte de nuestra docencia a este profesor en el Colegio Apostol Santiago. Su experiencia y dedicación enriquecen nuestra comunidad educativa."
                                    details={{
                                        FirstName: selectedRow.nombre,
                                        LastName: selectedRow.apellido,
                                        DNI: selectedRow.dni,
                                        Usuario: selectedRow.user?.username
                                    }}
                                />
                                <Card className="border-none shadow-none">
                                    <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6">
                                        <Typography variant="h6" color="blue-gray" className="mb-0">
                                            Salones y Materias
                                        </Typography>
                                    </CardHeader>
                                    <CardBody className="pt-0 overflow-y-auto" style={{ maxHeight: '500px' }}>
                                        <div className="mt-4 mb-6">
                                            {academicLevels.length > 0 && (
                                                <Select
                                                    label="Grado Académico"
                                                    value={selectedGrade}
                                                    onChange={(val) => handleGradeSelect(val)}
                                                >
                                                    {academicLevels.map((grade) => (
                                                        <Option key={grade.id} value={grade.id}>
                                                            {`${grade.subNivel} - ${grade.nivel}`}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </div>
                                        {selectedGrade ? (
                                            Object.entries(groupedCourses).map(([area, areaCourses], index) => (
                                                <div key={index} className="flex items-start gap-4 py-3">
                                                    <div className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${index === Object.entries(groupedCourses).length - 1 ? "after:h-0" : "after:h-4/6"}`}>
                                                        <BookOpenIcon className="!w-5 !h-5 text-blue-gray-300" />
                                                    </div>
                                                    <div>
                                                        <Typography variant="small" color="blue-gray" className="block font-medium">
                                                            {area}
                                                        </Typography>
                                                        <div className="flex flex-col gap-4 mt-2">
                                                            <Select
                                                                label="Seleccione la Materia"
                                                                value={selectedCourse}
                                                                onChange={(val) => handleCourseSelect(val)}
                                                            >
                                                                {areaCourses.map(course => (
                                                                    <Option key={course.id} value={course.id}>
                                                                        {course.materia}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                            {selectedCourse && (
                                                                <Select
                                                                    label="Seleccione el Bimestre"
                                                                    value={selectedBimester}
                                                                    onChange={(val) => handleBimesterSelect(val)}
                                                                >
                                                                    {currentCourseDetails.bimestres.map(bimestre => (
                                                                        <Option key={bimestre.id} value={bimestre.id}>
                                                                            Bimestre {bimestre.orden}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center p-6">
                                                <p className='text-sm'>No hay grados asignados.</p>
                                            </div>
                                        )}
                                    </CardBody>
                                </Card>
                                <div className="flex justify-center items-center">
                                    {selectedBimester && (
                                        <ApexChart
                                            seriesData={seriesData}
                                            categories={['Nota 1', 'Nota 2', 'Nota 3', 'Nota 4']}
                                        />
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default GetDataAcademic;