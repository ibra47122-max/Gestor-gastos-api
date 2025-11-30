import {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance,
    filtrarGastos,
    agruparGastos
} from '../js/gestionPresupuesto.js';


const agregarGastoBton = document.querySelector(".agregar-gasto")
let listadoGastos = document.querySelector(".listado-gastos")
const botones = document.querySelectorAll("button")
let gastoId = 0

//Con esto cada vez que un boton es pulsado se calcula el total
botones.forEach(boton => {
    boton.addEventListener('click', (event) => {
        let gastosTotales = calcularTotalGastos(listadoGastos)
        console.log(gastosTotales)
        mostrarGastosTotales(gastosTotales)
    });
});

function crearGastoHTML(gasto) {
    //Esta funcion sirve para crear el gasto en html

    gastoId += 1 //Suma la variable para crear un id nuevo
    const gastoDiv = document.createElement('div');
    gastoDiv.className = 'gasto';
    gastoDiv.id = `gasto-${gastoId}`;
    
    const informacionGasto = document.createElement('div');
    informacionGasto.className = 'informacion-gasto';
    
    const descripcionH4 = document.createElement('h4');
    descripcionH4.className = 'descripcion';
    descripcionH4.textContent = gasto.descripcion
    
    const fechaP = document.createElement('p');
    fechaP.className = 'fecha';
    fechaP.textContent = gasto.fecha 
    
    const valorP = document.createElement('p');
    valorP.className = 'Valor';
    valorP.textContent = gasto.valor
    
    informacionGasto.appendChild(descripcionH4);
    informacionGasto.appendChild(fechaP);
    informacionGasto.appendChild(valorP);
    
    const etiquetasContainer = document.createElement('div');
    etiquetasContainer.className = 'etiquetas-container';
    
    if (gasto.etiquetas && gasto.etiquetas.length > 0) {
        gasto.etiquetas.forEach(etiqueta => {
            const etiquetaP = document.createElement('p');
            etiquetaP.className = 'etiqueta';
            etiquetaP.textContent = etiqueta;
            etiquetasContainer.appendChild(etiquetaP);
        });
    } else {
        const etiquetaP = document.createElement('p');
        etiquetaP.className = 'etiqueta';
        etiquetaP.textContent = 'Etiqueta';
        etiquetasContainer.appendChild(etiquetaP);
    }
    
    const borrarBtn = document.createElement('button');
    borrarBtn.className = 'borrar-gasto borrar';
    borrarBtn.id = `borrar-${gasto.id}`;
    borrarBtn.textContent = 'Borrar gasto';
    
    //Este evento sirve para borrar el gasto y eliminarlo del html
    borrarBtn.addEventListener('click', () => {
        borrarGasto(gasto.id);
        gastoDiv.remove();
    });
    
    gastoDiv.appendChild(informacionGasto);
    gastoDiv.appendChild(etiquetasContainer);
    gastoDiv.appendChild(borrarBtn);

    anyadirGasto(gasto) //Añade el gasto
    
    return gastoDiv;
}

function agregarGasto(gasto) {
    //Funcion para agregar el gasto al html y a la lista de gastos
    let gastoDiv = crearGastoHTML(gasto)
    listadoGastos.appendChild(gastoDiv)
}

function getValoresDatos() {
    //Obtiene los datos del formulario y tranforma las etiquetas
    const descripcionInput = document.querySelector("#descripcion-input").value
    const valorInput = document.querySelector("#valor-input").value
    const fechaInput = document.querySelector("#fecha-input").value
    const etiquetasInput = document.querySelector("#etiquetas-input").value
    const arrayEtiquetas = etiquetasInput.split(',').map(etiqueta => etiqueta.trim())
    console.log(arrayEtiquetas)

    const gasto = {
        "descripcion": descripcionInput,
        "valor": valorInput,
        "fecha": fechaInput,
        "etiquetas": arrayEtiquetas
    }

    return gasto
}

function mostrarGastosTotales(gastoTotal) {
    const gastoTotalDiv = document.querySelector(".total-gastos")
    const totalElement = document.createElement('p');
    totalElement.textContent = `Gasto total: ${gastoTotal} €`;
    gastoTotalDiv.appendChild(totalElement);
}

agregarGastoBton.addEventListener('click', (event) => {
    event.preventDefault()
    const gasto = getValoresDatos()
    agregarGasto(gasto)
})