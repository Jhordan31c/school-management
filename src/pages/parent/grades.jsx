import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { AnimatePresence, easeOut, motion } from 'framer-motion'
import { useState, useEffect } from 'react';
import alumnoServicio from '@/services/alumnoServicio';
import { Select, Option, Typography } from '@material-tailwind/react';
import { useUser } from '@/context/UserContext';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { ApexChart } from '@/widgets/charts';

export function Grades() {

    const [selectedGrade, setSelectedGrade] = useState(null);
    const [academicLevels, setAcademicLevels] = useState([]);
    const [courses, setCourses] = useState([]);
    const [courseDetails, setCourseDetails] = useState({});
    const { user } = useUser();


    useEffect(() => {
        const idAlumno = user.id; // Replace with actual student ID

        alumnoServicio.getAcademicLevelsByStudent(idAlumno)
            .then(response => {
                const grades = response.data;
                setAcademicLevels(grades);
                if (grades.length > 0) {
                    setSelectedGrade(grades[0].id);
                }
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (selectedGrade) {
            const idAlumno = user.id; // Replace with actual student ID

            alumnoServicio.getCoursesByStudent(idAlumno, selectedGrade)
                .then(response => setCourses(response.data))
                .catch(error => console.error(error));
        }
    }, [selectedGrade]);

    const handleDisclosureClick = (idMateria) => {
        if (!courseDetails[idMateria]) {
            alumnoServicio.getTopicAllInformation(idMateria)
                .then(response => {
                    setCourseDetails(prevState => ({
                        ...prevState,
                        [idMateria]: response.data
                    }));
                })
                .catch(error => console.error(error));
        }
    };

    const groupedCourses = courses.reduce((acc, course) => {
        (acc[course.area] = acc[course.area] || []).push(course);
        return acc;
    }, {});


    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <Typography variant="h5" className="ml-1 text-purple-900 font-bold">
                    Cursos
                </Typography>
                <div className="flex mt-5 ml-1">
                    <div className="w-1/3">
                        {academicLevels.length > 0 && (
                            <Select
                                label="Grado Academico"
                                value={selectedGrade}
                                onChange={(val) => setSelectedGrade(val)}
                            >
                                {academicLevels.map((grade) => (
                                    <Option key={grade.id} value={grade.id}>
                                        {`${grade.subNivel} - ${grade.nivel}`}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </div>
                </div>
                <div>

                </div>
                <div className="mt-10" />
                {Object.entries(groupedCourses).map(([area, areaCourses], index) => (
                    <div key={index}>
                        <div className="relative mt-2">
                            <span className="absolute inset-0 flex items-center" aria-hidden="true">
                                <span className="w-full border-t border-gray-400" />
                            </span>
                            <span className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-100 text-gray-700 text-normal">{area}</span>
                            </span>
                        </div>
                        {areaCourses.map((course) => (
                            <Disclosure key={course.id}>
                                {({ open }) => (
                                    <div className="mt-1">
                                        <DisclosureButton
                                            className={`flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-left bg-white rounded-lg shadow-md focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 transition-transform duration-300 h-14 ${open ? "border-l-4 border-purple-800" : "border-l-4 border-purple-800"}`}
                                            onClick={() => handleDisclosureClick(course.id)}
                                        >
                                            <Typography variant="h6" className={`${open ? "font-semibold" : "font-medium"}`}>
                                                {course.materia}
                                            </Typography>
                                            <ChevronDownIcon
                                                className={`w-4 h-4 text-gray-500 transition-transform duration-500 ${open ? 'transform rotate-180' : ''}`}
                                            />
                                        </DisclosureButton>
                                        <div className="overflow-hidden py-1">
                                            <AnimatePresence>
                                                {open && (
                                                    <DisclosurePanel
                                                        static
                                                        as={motion.div}
                                                        initial={{ opacity: 0, y: -24 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -24 }}
                                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                                        className="px-8 pt-6 pb-7 text-sm text-gray-700 bg-white rounded-lg shadow-md shadow-black-400 border-l-4 border-purple-900"
                                                    >
                                                        {courseDetails[course.id] ? (
                                                            <>
                                                                <p><strong>Docente:</strong> {courseDetails[course.id].docente}</p>
                                                                <Typography variant='small' className='font-semibold'> Evaluación</Typography>
                                                                <div className='overflow-x-scroll'>
                                                                    <table className="w-full min-w-[640px] table-auto text-sm text-left text-gray-500">
                                                                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                                                            <tr>
                                                                                <th scope="col" className="px-6 py-3">Bimestre</th>
                                                                                <th scope="col" className="px-6 py-3">Nota 1 (PA)</th>
                                                                                <th scope="col" className="px-6 py-3">Nota 2 (TEC)</th>
                                                                                <th scope="col" className="px-6 py-3">Nota 3 (EM)</th>
                                                                                <th scope="col" className="px-6 py-3">Nota 4 (EF)</th>
                                                                                <th scope="col" className="px-6 py-3">Promedio Bimestral (PMB)</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {courseDetails[course.id].bimestres.map((bimestre, i) => {
                                                                                const promedioBimestral = (
                                                                                    (bimestre.nota1 + bimestre.nota2 + bimestre.nota3 + bimestre.nota4) / 4
                                                                                ).toFixed(2);
                                                                                return (
                                                                                    <tr key={i} className="bg-white border-b text-center">
                                                                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{`B${bimestre.orden}`}</td>
                                                                                        <td className="px-6 py-4 text-gray-700">{bimestre.nota1}</td>
                                                                                        <td className="px-6 py-4 text-gray-700">{bimestre.nota2}</td>
                                                                                        <td className="px-6 py-4 text-gray-700">{bimestre.nota3}</td>
                                                                                        <td className="px-6 py-4 text-gray-700">{bimestre.nota4}</td>
                                                                                        <td className="px-6 py-4 text-gray-700">{promedioBimestral}</td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                <div className=''>
                                                                    <p className="bg-orange-300 p-4 rounded mt-2">
                                                                        <strong className=''>Nota Final: </strong>
                                                                        {(
                                                                            courseDetails[course.id].bimestres.reduce((acc, bimestre) => acc +
                                                                                (bimestre.nota1 + bimestre.nota2 + bimestre.nota3 + bimestre.nota4) / 4, 0
                                                                            ) / courseDetails[course.id].bimestres.length
                                                                        ).toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <p>Cargando detalles...</p>
                                                        )}
                                                    </DisclosurePanel>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}
                            </Disclosure>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Grades;