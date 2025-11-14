//importar express
const express = require('express');
const {
    //pacientes
    obtenerPacientes,
    obtenerPacientePorId,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
    //doctores
    crearDoctor,
    obtenerDoctores,
    obtenerDoctorPorId,
    obtenerDoctorPorEspecialidad,
    doctorConMasCitas,
    especialidadMasSolicitada,
    //citas
    crearCita,
    obtenerCitas,
    obtenerCitaPorId,
    cancelarCita,
    obtenerAgendaDoctor,
    historialPaciente
} = require('../citas_Medicas/utils/fileManager');
//crear app
const app = express();

//middleware para parsear JSON
app.use(express.json());
//midleware para parsear datos de formulario
app.use(express.urlencoded({extended: true}));
//definimos el puerto
const PORT = process.env.PORT || 3000;

//ruta de pruba basica
app.get('/', (req, res) => {
    res.send('Servidor express funcionando correctamente!')
});
//get - obtener todos los pacientes
app.get('/api/pacientes', (req, res) => {
    const pacientes = obtenerPacientes();
    res.json({
        success: true,
        data: pacientes
    })
});

//GET- pacientes por id
app.get('/api/pacientes/:id', (req, res) => {
    const paciente = obtenerPacientePorId(req.params.id);
    res.json({ success: true, data: paciente});
})

//POST - creamos paciente
app.post('/api/pacientes', (req, res) => {
    const { nombre, edad, telefono, email, fechaRegistro} = req.body;

    //validacion basica
    if(!nombre || !email || !fechaRegistro) return res.status(400).json({ Error});
    const nuevo = crearPaciente(nombre, edad, telefono, email, fechaRegistro);
    res.status(201).json({data: nuevo});
});

//PUT - actualiza un paciente
app.put('/api/pacientes/:id', (req, res) => {
    const {nombre, edad, telefono, email, fechaRegistro} = req.body;
    const actualizado = actualizarPaciente( req.params.id, nombre, edad, telefono, email, fechaRegistro);
    if(!actualizado) return res.status(404).json({...actualizado});
    res.json({data: actualizado})
})

//DELETE - eliminar un paciente
app.delete('/api/pacientes/:id', (req, res) => {
    const eliminado = eliminarPaciente(req.params.id);
    if(!eliminado) return res.status(404).json({...eliminado});
    res.json({message: 'Eliminado'});
})

//ver historial del paciente
app.get('/api/pacientes/:id/historial', (req, res) => {
    const historial = historialPaciente(req.params.id);
    res.json({ success: true, message:'Historial del paciente', data: historial})
})
/*####################Doctores########################################### */
// GET - obtener todos los doctores
app.get('/api/doctores', (req, res) => {
    const doctores = obtenerDoctores();
    res.json({
        success: true,
        data: doctores
    })
})

//POST - crear doctor
app.post('/api/doctores', (req, res) => {
    const {nombre, especialidad, horarioInicio, horarioFin, diasDisponibles} = req.body;

    //validacion
    if(!nombre || !especialidad || !horarioInicio || !horarioFin || !diasDisponibles) return res.status(400).json({Error})
    const nuevoDoctor = crearDoctor(nombre, especialidad, horarioInicio, horarioFin, diasDisponibles);
    res.status(201).json({data: nuevoDoctor})
})
//GET- doctores por id
app.get('/api/doctores/:id', (req, res) => {
    const doctores = obtenerDoctorPorId(req.params.id);
    //console.log(req.params.id)
    res.json({ success: true, data: doctores});
})

//GET- doctores por especialidad
app.get('/api/doctores/especialidad/:especialidad', (req, res) => {
    const especialidadConsultada = req.params.especialidad;
    const doctor = obtenerDoctorPorEspecialidad(especialidadConsultada);
    res.json({ success: true, data: doctor });
})

//GET- obtener el nombre del doctor con mas citas
app.get('/api/estadisticas/doctores', (req, res) => {
    const doctor = doctorConMasCitas();
    res.json({ success: true, data: doctor})
})

//GET- obtener la especialidad mas solicitada
app.get('/api/estadisticas/especialidad', (req, res) => {
    const especialidad = especialidadMasSolicitada();
    res.json({ success: true,  data: especialidad})
})
/*#############Citas################################################*/
//get todas las citas
app.get('/api/citas', (req, res) => {
    const citas = obtenerCitas();
    res.json({
        success: true,
        data: citas
    })
})
//POST crear nueva cita
app.post('/api/citas', (req, res) => {
    const {pacienteId, doctorId, fecha, hora, motivo, estado} = req.body;

    //validacion
    if(!pacienteId || !doctorId || !fecha || !hora || !motivo || !estado) return res.status(400).json({Error})
    const nuevaCita = crearCita(pacienteId,doctorId, fecha, hora, motivo, estado);
    res.status(201).json({data: nuevaCita})
})

//GET- citas por id
app.get('/api/citas/:id', (req, res) => {
    const cita = obtenerCitaPorId(req.params.id);
    res.json({ success: true, data: cita});
})

//PUT - cancelar cita
app.put('/api/citas/:id/cancelar', (req, res) => {
    const cancelado = cancelarCita( req.params.id);
    if(!cancelado) return res.status(404).json({...cancelado});
    res.json({data: cancelado})
})
//GET - obtener las citas de un doctor
app.get('/api/citas/doctor/:DoctorId', (req, res) => {
    const agenda = obtenerAgendaDoctor(req.params.DoctorId);
    res.json({ success: true, data: agenda});
})

//midleware para manejo de errores globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        messaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'Development' ? err.messaje : {}
    });
});

//iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});