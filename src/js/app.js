// let puede cambiar de valor const no cambia de valor
let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;
const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion();// Muestra y oculta las secciones
    tabs();//cambia la sección cuando se presionen los tabs
    botonesPaginador();// Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend de PHP

    idCliente();
    nombreCliente();// Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); // Añade la fecha de la cita en el objeto
    seleccionarHora();// Añade la hora de la cita en el objeto 

    mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSeccion() {
    // Ocultar la sección que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }
    //Seleccionar la seccion con el paso..
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Eliminando resaltado al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab acctual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach(boton => {
        boton.addEventListener('click', function (e) {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        })
    })
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if (paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    } else if (paso === 2) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function () {
        if (paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    });
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');

    paginaSiguiente.addEventListener('click', function () {
        if (paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    });
}

async function consultarAPI() {

    //try catch hace que puede que haya un error hasta ahi 
    // lo que hace es intentar ejecutar el try si no sale manda el catch
    try {
        //location.origin detecta donde se esta ejecutando el codigo y lo va a agregar
        const url = '/api/servicios';
        //fetch funcion que permite consumir el servicio 
        const resultado = await fetch(url); // await espera a qeu descargue todo (detiene la ejecucion hasta ahi)
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach(servicio => {
        const { id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV')
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        // pasar solo el objeto seleccionado no todo entero  es mediante collback
        servicioDiv.onclick = function () {
            seleccionarServicio(servicio);
        };

        // Scripting JavaScript
        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    })
}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = cita;

    // Identificar al elemento que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`)

    //comprobar si un servicio ya fue agregado o quitarlo
    if (servicios.some(agregado => agregado.id === id)) {// some  
        // Eliminarlo
        // filter
        cita.servicios = servicios.filter(agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregarlo
        // que tome una copia de los servicios y que agregue los nuevos servicios
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
}

function idCliente() {
    // value nos da el valor de html como atributo a JavaScript como objeto
    cita.id = document.querySelector('#id').value;

}
function nombreCliente() {
    // value nos da el valor de html como atributo a JavaScript como objeto
    cita.nombre = document.querySelector('#nombre').value;

}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function (e) {

        const dia = new Date(e.target.value).getUTCDay();

        if ([6, 0].includes(dia)) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }
    })
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function (e) {

        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if (hora < 10 || hora > 18) {
            e.target.value = '';
            mostrarAlerta('Hora No Válida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
        }
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

    // Previene que se generen más de 1 alerta
    const alertaPrevia = document.querySelector('.alerta');
    // si no existe alertaPrevio devuelve null
    if (alertaPrevia) {
        alertaPrevia.remove();
    }

    // Scripting para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    // eliminar la alerta despues de 3 seg
    if (desaparece) {
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el contenido de Resumen
    while (resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    // con length puedes validar si un arrreglo esta vacio
    //Object.values metodo especificamente para objetos (sirve para comprobar string vacios) 
    if (Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);
        return;
    }

    // Formateal el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para serviciios en resumen
    const headeingServicios = document.createElement('H3');
    headeingServicios.textContent = 'Resumen de servicios';
    resumen.appendChild(headeingServicios);

    //Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio: </span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })

    // Heading para serviciios en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));


    //weekday dia de la semana y day dia del mes
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    // Boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);
}

async function reservarCita() {

    const { id, fecha, hora, servicios } = cita;

    // Iterando los servicios y retornando en la variable
    const idServicios = servicios.map(servicio => servicio.id);

    // FormData para registrar datos
    const datos = new FormData();
    datos.append('usuarioid', id);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);

    try {
        // Petición hacia la API
        const url = '/api/citas';

        const respuesta = await fetch(url, {
            method: 'POST',
            // body es el cuerpo de la peticion que se va a enviar
            body: datos
        });

        const resultado = await respuesta.json();
        console.log(resultado.resultado);

        if (resultado.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: "Tu cita fue creada correctamente",
                button: 'OK'
            }).then(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
        }
    } catch (error) {
        Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un error al guardar la cita",
                button: 'OK'
            })
    }
    // [...]  -> Esto es sprait Operator toma como copia del formData y lo formatea dentro de ese arreglo
    /* console.log([...datos]); */
}
