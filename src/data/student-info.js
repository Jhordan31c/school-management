export const studentInfo = {
    alumno: {
        nombre: "Juan Pérez",
        edad: 16,
        grado: "10mo",
        sección: "B"
    },
    apoderado: {
        nombre: "María Gómez",
        relación: "Madre",
        teléfono: "123-456-7890"
    },
    historialAcademico: [
        {
            grado: "9no",
            sección: "A",
            aula: {
                número: "A-201",
                horario: [
                    { dia: "Lunes", inicio: "08:00", fin: "14:00" },
                    { dia: "Martes", inicio: "08:00", fin: "14:00" },
                    { dia: "Jueves", inicio: "08:00", fin: "14:00" }
                ]
            },
            docenteAsignado: {
                nombre: "Ana Martínez"
            },
            notas: [
                { materia: "Matemáticas", nota: 80 },
                { materia: "Ciencias", nota: 85 },
                { materia: "Historia", nota: 75 },
                { materia: "Literatura", nota: 90 },
                { materia: "Algebra", nota: 30 },
                { materia: "Lol", nota: 40 },
                { materia: "Algebra", nota: 30 },
                { materia: "Lol", nota: 40 }
            ],
            areas: [
                { nombre: "Ciencias Exactas", materias: ["Matemáticas", "Física", "Química"] },
                { nombre: "Ciencias Naturales", materias: ["Ciencias", "Biología"] },
                { nombre: "Ciencias Sociales", materias: ["Historia", "Geografía"] },
                { nombre: "Humanidades", materias: ["Literatura", "Filosofía"] }
            ]
        },
        {
            grado: "8vo",
            sección: "B",
            aula: {
                número: "B-102",
                horario: [
                    { dia: "Lunes", inicio: "08:00", fin: "14:00" },
                    { dia: "Miércoles", inicio: "08:00", fin: "14:00" },
                    { dia: "Viernes", inicio: "08:00", fin: "14:00" }
                ]
            },
            docenteAsignado: {
                nombre: "Luis García"
            },
            notas: [
                { materia: "Matemáticas", nota: 78 },
                { materia: "Ciencias", nota: 88 },
                { materia: "Historia", nota: 70 },
                { materia: "Literatura", nota: 85 },
                { materia: "Algebra", nota: 30 },
                { materia: "Lol", nota: 40 },
                { materia: "Algebra", nota: 30 },
                { materia: "Lol", nota: 40 }
            ],
            areas: [
                { nombre: "Ciencias Exactas", materias: ["Matemáticas", "Física", "Química"] },
                { nombre: "Ciencias Naturales", materias: ["Ciencias", "Biología"] },
                { nombre: "Ciencias Sociales", materias: ["Historia", "Cultura Global"] },
                { nombre: "Humanidades", materias: ["Literatura", "Filosofía"] }
            ]
        }
    ],
    notasActuales: [
        { materia: "Matemáticas", nota: 85 },
        { materia: "Ciencias", nota: 90 },
        { materia: "Historia", nota: 78 },
        { materia: "Literatura", nota: 88 },
        { materia: "Algebra", nota: 30 },
        { materia: "Lol", nota: 40 },
        { materia: "Algebra", nota: 30 },
        { materia: "Lol", nota: 40 }
    ],
    aulaActual: {
        número: "A-101",
        horario: [
            { dia: "Lunes", inicio: "08:00", fin: "14:00" },
            { dia: "Miércoles", inicio: "08:00", fin: "14:00" },
            { dia: "Viernes", inicio: "08:00", fin: "14:00" }
        ]
    },
    docenteAsignadoActual: {
        nombre: "Carlos Rodríguez",
    },
    areasActuales: [
        { nombre: "Ciencias Exactas", materias: ["Matemáticas", "Física", "Química"] },
        { nombre: "Ciencias Naturales", materias: ["Ciencias", "Biología"] },
        { nombre: "Ciencias Sociales", materias: ["Historia", "Geografía"] },
        { nombre: "Humanidades", materias: ["Literatura", "Filosofía"] }
    ]
};


export default studentInfo;