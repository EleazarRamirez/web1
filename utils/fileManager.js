const fs = require('fs');
const path =  require('path');

const DB_PACIENTES = path.join(__dirname, '..', 'data', 'pacientes.json');
const DB_DOCTORES = path.join(__dirname, '..', 'data', 'doctores.json');
const DB_CITAS = path.join(__dirname, '..', 'data', 'citas.json');

const leerPacientes = () => {
    try{
        const pacientes = fs.readFileSync(DB_PACIENTES, 'utf-8');
        return JSON.parse(pacientes);
    } catch(error){
        return {pacientes: []}
    }
};

const escribirPaciente = (paciente) => {
    try{
        fs.writeFileSync(DB_PACIENTES, JSON.stringify(paciente, null, 2), 'utf-8');
        return true;
    } catch(error){
        return false;
    }
}
/*#####################PACIENTES#################################### */
//obtener pacientes
const obtenerPacientes = () => {
    const pac = leerPacientes();
    return pac.pacientes;
};

//Funcion auxiliar para encontrar el id
const formatId = (num) => {
    // Usamos padStart(3, '0') para asegurar que la cadena tenga 3 dígitos,
    // rellenando con '0' a la izquierda si es necesario.
    return String(num).padStart(3, '0');
};

//obtener paciente por id
const obtenerPacientePorId = (id) => {
    const pac = leerPacientes();
    //console.log(pac.pacientes.find(p => p.id === id))
    return pac.pacientes.find(p => p.id === id);
}

//post - pacientes
const crearPaciente = (nombre, edad, telefono, email, fechaRegistro) => {
    const pac = leerPacientes();
    
        let siguienteNumero = 1;
        if(pac.pacientes.length > 0){
            const idExistentes = pac.pacientes.map(p => p.id);
            const numeros = idExistentes.map(id => parseInt(id.substring(1)));
    
            siguienteNumero = Math.max(...numeros) + 1;
        }
    
        const nuevoIdPac = 'P' + formatId(siguienteNumero);

    if(pac.pacientes.find(p => p.email === email)) return "Este email ya existente, ingrese otro correo"
    if(telefono === "") return "Ingrese un numero de telefono"
    if(edad > 0){
    const nuevoPaciente = {id: nuevoIdPac, nombre, edad, telefono, email, fechaRegistro};
    pac.pacientes.push(nuevoPaciente);
    escribirPaciente(pac)
    return nuevoPaciente;
    }else{
        return "ingrese una edad valida, mayor a 0"
    }
}

//actualizar paciente
const actualizarPaciente = (id, nombre, edad, telefono, email, fechaRegistro) => {
    const pac = leerPacientes();
    const index = pac.pacientes.findIndex(p => p.id === id);
    if(index === -1) return null;
    if(nombre) pac.pacientes[index].nombre = nombre;
    if(edad) pac.pacientes[index].edad = edad;
    if(telefono) pac.pacientes[index].telefono = telefono;
    if(email) pac.pacientes[index].email = email;
    if(fechaRegistro) pac.pacientes[index].fechaRegistro = fechaRegistro;
    escribirPaciente(pac);
    return pac.pacientes[index];
}

//eliminar paciente
const eliminarPaciente = (id) => {
    const pac = leerPacientes();
    const index = pac.pacientes.findIndex(p => p.id === id);
    if(index === -1) return false;
    pac.pacientes.splice(index,1);
    escribirPaciente(pac);
    return true;
}
//ver historial de citas del paciente
const historialPaciente = (id) => {
    const citas = leerCitas();
    const historial = citas.citas.filter(p => p.pacienteId === id);
    if(historial){
        return historial;
    }
    return null;
}

/*#######################DOCTORES#######################################3 */
const leerDoctores = () => {
    try{
        const doctores = fs.readFileSync(DB_DOCTORES, 'utf-8');
        return JSON.parse(doctores);
    } catch(error){
        return {doctores: []}
    }
};

const escribirDoctor = (doctor) => {
    try{
        fs.writeFileSync(DB_DOCTORES, JSON.stringify(doctor, null, 2), 'utf-8');
        return true;
    } catch(error){
        return false;
    }
}

//post - Doctores
const crearDoctor = (nombre, especialidad, horarioInicio, horarioFin, diasDisponibles) => {
    const doc = leerDoctores();
    
        let siguienteNumero = 1;
        if(doc.doctores.length > 0){
            const idExistentes = doc.doctores.map(p => p.id);
            const numeros = idExistentes.map(id => parseInt(id.substring(1)));
    
            siguienteNumero = Math.max(...numeros) + 1;
        }
    
        const nuevoIdDoc = 'D' + formatId(siguienteNumero);
    if(doc.doctores.find(d => d.nombre === nombre) && doc.doctores.find(d => d.especialidad === especialidad)) return "ya existe este doctor y especialidad"
    if(horarioFin < horarioInicio) return "error en el horario, ingrese un horario valido"
    if(diasDisponibles.length == 0) return "por favor ingrese dias disponibles"
    const nuevoDoctor = {id: nuevoIdDoc, nombre, especialidad, horarioInicio, horarioFin, diasDisponibles};
    doc.doctores.push(nuevoDoctor);
    escribirDoctor(doc)
    return nuevoDoctor;
}
//obtener doctores
const obtenerDoctores = () => {
    const doc = leerDoctores();
    return doc.doctores;
};

//obtenerdoctor por id
const obtenerDoctorPorId = (id) => {
    const doc = leerDoctores();
    console.log(doc.doctores.find(p => p.id === id))
    return doc.doctores.find(p => p.id === id);
}

//obtener doctor por especialidad
const obtenerDoctorPorEspecialidad = (especialidad) => {
    const doc = leerDoctores();
    return doc.doctores.filter(d => d.especialidad == especialidad);
}
//obtener estadisticas del doctor con mas citas
const doctorConMasCitas = () => {
    const citas = leerCitas();
    const doc = leerDoctores();

    //contar las citas por doctor
    const conteoCitas = {};

    citas.citas.forEach(cita => {
        const doctorId = cita.doctorId;
        conteoCitas[doctorId] = (conteoCitas[doctorId] || 0) + 1;
    });

    //encontrar el doctor con el conteo mas alto
    let doctorIdMasOcupado = null;
    let maxCitas = -1;

    for (const id in conteoCitas) {
        if(conteoCitas[id] > maxCitas){
            maxCitas = conteoCitas[id];
            doctorIdMasOcupado = id;
        }
    }

    //si no hay citas, regresamos este mensaje
    if(!doctorIdMasOcupado){
        return "No hay citas Registradas"
    }
    
    //buscamos el nombre del doctor para retornarlo
    const doctorMasOcupado = doc.doctores.find(doc => doc.id === doctorIdMasOcupado);
    return doctorMasOcupado ? doctorMasOcupado.nombre : "Doctor no encontrado";
} 

//obtener especialidad mas solicitada
const especialidadMasSolicitada = () => {
   const doctorMasCitas =  doctorConMasCitas();
   const doc = leerDoctores();

   const doctorEncontrado = doc.doctores.find(d => d.nombre === doctorMasCitas)

   if(doctorEncontrado) {return doctorEncontrado.especialidad; } else{ return "Especialidad no encontrada" + doctorMasCitas}
 }

/*########################CITAS##########################################*/
const leerCitas = () => {
    try{
        const citas = fs.readFileSync(DB_CITAS, 'utf-8');
        return JSON.parse(citas);
    } catch(error){
        return {citas: []}
    }
};

const escribirCitas = (citas) => {
    try{
        fs.writeFileSync(DB_CITAS, JSON.stringify(citas, null, 2), 'utf-8');
        return true;
    } catch(error){
        return false;
    }
}

//funcion para saber el dia de la semana
function obtenerNombreDelDia(diaNumero) {
    // Definimos un array donde el índice corresponde al número de getDay()
    const diasSemana = [
        'Domingo', 
        'Lunes', 
        'Martes', 
        'Miércoles', 
        'Jueves', 
        'Viernes', 
        'Sábado'
    ];

    // Verificamos que el número esté dentro del rango válido (0 a 6)
    if (diaNumero >= 0 && diaNumero <= 6) {
        // Usamos el número como índice para obtener el nombre del día
        return diasSemana[diaNumero];
    } else {
        // Manejo de error si el número no es válido
        return 'fecha incorrecta';
    }
}

function citaExistente (doctorId, fechaNueva, horaNueva) {
    const ct = leerCitas();
    const yaExiste = ct.citas.some(cita => {
        const mismoDoctor = cita.doctorId === doctorId;
        const mismaFecha = cita.fecha === fechaNueva;
        const mismaHora = cita.hora === horaNueva;
        const estadoProgramado = cita.estado === "Programado";

        return mismoDoctor && mismaFecha && mismaHora && estadoProgramado;
    })
    return yaExiste;
}

//post - citas
const crearCita = (pacienteId, doctorId, fecha, hora, motivo, estado) => {
    const cita = leerCitas();
    const paciente = leerPacientes();
    const doc = leerDoctores();
    const fechaActual = new Date();
        let siguienteNumero = 1;
        if(cita.citas.length > 0){
            const idExistentes = cita.citas.map(p => p.id);
            const numeros = idExistentes.map(id => parseInt(id.substring(1)));
    
            siguienteNumero = Math.max(...numeros) + 1;
        }
    
        const nuevoIdCita = 'C' + formatId(siguienteNumero);
    
    if(paciente.pacientes.find(p => p.id === pacienteId) == null) return "El paciente ingresado no existe"; 
    if(doc.doctores.find(d => d.id === doctorId) == null) return "El doctor ingresado no existe"
    if(fechaActual.toISOString().split('T')[0] > fecha) return "ingrese una fecha valida disponible";
    const fechaRecibida = new Date(fecha);
    const numeroDia = fechaRecibida.getDay();
    const doctorActual = doc.doctores.find(d => d.id === doctorId)
    if(doctorActual.diasDisponibles.includes(obtenerNombreDelDia(numeroDia+1)) === false) return "Esta fecha no es posible agendar";
    if(doctorActual.horarioInicio > hora || doctorActual.horarioFin < hora) return "la hora no es valida, agende en un horario dentro del horario del doctor";
    if(citaExistente(doctorId, fecha, hora)) return "No se puede agregar esta cita, el doctor ya tiene una cita programada a esta hora y fecha"
    const nuevaCita = {id: nuevoIdCita, pacienteId, doctorId, fecha, hora, motivo, estado};
    cita.citas.push(nuevaCita);
    escribirCitas(cita)
    return nuevaCita;
}

//obtener citas
const obtenerCitas = () => {
    const citas = leerCitas();
    return citas.citas;
};

//obtener cita por id
const obtenerCitaPorId = (id) => {
    const cita = leerCitas();
    console.log(cita.citas.find(c => c.id === id))
    return cita.citas.find(c => c.id === id);
}
//GET - obtener agenda de un doctor
const obtenerAgendaDoctor = (doctorId) => {
    const cita = leerCitas();
    return cita.citas.filter(c => c.doctorId === doctorId)
}

//Cancelar Cita
const cancelarCita = (id) => {
    const cita = leerCitas();
    const index =cita.citas.findIndex(p => p.id === id);
    if(index === -1) return "Cita no encotrada";
    if(cita.citas[index].estado === "Programada"){
    cita.citas[index].estado = "Cancelada";
    escribirCitas(cita);
    return cita.citas[index];
    }else{return "Esta cita ya ha sido cancelada"}
}

//agregamos el archivo a exportar
module.exports = {
    //pacientes
    obtenerPacientes,
    obtenerPacientePorId,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
    historialPaciente,
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
    obtenerAgendaDoctor
}