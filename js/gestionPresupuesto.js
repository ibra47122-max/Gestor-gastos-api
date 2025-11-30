// TODO: Variables globales
let presupuesto = 0;
let gastos = []
let idGasto = 0

// TODO: Funciones adicionales
function actualizarPresupuesto(nuevoPresupuesto) {

    if (nuevoPresupuesto > 0) {
        presupuesto = nuevoPresupuesto
        console.log(presupuesto)
        return presupuesto
    } else if (nuevoPresupuesto = 0){
        return 0
    } else if (nuevoPresupuesto < 0) {
        alert("Debes introducir un valor positivo")
        return -1
    } else {
        return -1
    }
}

function mostrarPresupuesto() {
    return `Tu presupuesto actual es de ${presupuesto} €`
}

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
    this.descripcion = descripcion
    this.etiquetas = [...etiquetas]
    if (valor >= 0) {
        this.valor = valor
    } else {
        this.valor = 0
    }

    if (fecha === undefined || new Date(fecha.toString()) === "Invalid Date" || typeof fecha !== 'string') {
        console.log("No se ha pasado fecha")
        this.fecha = new Date()
    } else {
        this.fecha = new Date(fecha).getTime()
    }

}

CrearGasto.prototype.mostrarGasto = function() {
    return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`
}

CrearGasto.prototype.actualizarDescripcion = function(nuevaDescripcion) {
    this.descripcion = nuevaDescripcion
    return this.descripcion
}

CrearGasto.prototype.actualizarValor = function(nuevoValor) {
    if (nuevoValor >= 0) {
        this.valor = nuevoValor
    }

    return this.valor
}

CrearGasto.prototype.mostrarGastoCompleto = function() {
    const fechaFormateada = new Date(this.fecha).toLocaleString()
    
    let resultado = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.`
    resultado += `\nFecha: ${fechaFormateada}`
    resultado += `\nEtiquetas:`
    
    this.etiquetas.forEach(etiqueta => {
        resultado += `\n- ${etiqueta}`
    })
    resultado += `\n` 
    
    return resultado
}

CrearGasto.prototype.actualizarFecha = function (fecha) {
    console.log(new Date(fecha).toString())
    if (new Date(fecha).toString() === "Invalid Date") {
        return 
    } else {
        this.fecha = new Date(fecha).getTime()
        return this.fecha
    }
}

CrearGasto.prototype.anyadirEtiquetas = function (...etiquetas) {
    for (let etiqueta of etiquetas) {
        if (!this.etiquetas.includes(etiqueta)){
            this.etiquetas.push(etiqueta)
        }
    }
}

CrearGasto.prototype.borrarEtiquetas = function (...etiquetas) {
    this.etiquetas = this.etiquetas.filter(etiqueta => !etiquetas.includes(etiqueta))
    return this.etiquetas
}

CrearGasto.prototype.obtenerPeriodoAgrupacion = function (formato) {
    
    const fechaFormateada = new Date(this.fecha)
    const año = fechaFormateada.getFullYear()
    const mes = String(fechaFormateada.getMonth() + 1).padStart(2, '0')
    const dia = String(fechaFormateada.getDate()).padStart(2, '0')
    
    switch (formato) {
        case 'anyo':
            return String(año)
        case 'mes':
            return `${año}-${mes}`
        case 'dia':
            return `${año}-${mes}-${dia}`
        default:
            throw new Error('Formato no válido')
    }
}

function listarGastos() {
    return gastos
}

function anyadirGasto(Gasto) {
    Gasto.id = idGasto
    idGasto += 1
    gastos.push(Gasto)
}   

function borrarGasto(idGasto) {
    const gastosSinId = gastos.filter(gasto => gasto.id !== idGasto)
    gastos = gastosSinId
}

function calcularTotalGastos() {
    return gastos.reduce((total, gasto) => total + gasto.valor, 0)
}

function calcularBalance() {
    return (presupuesto - gastos.reduce((total, gasto) => total + gasto.valor, 0))
}

function filtrarGastos(filtros) {
    return gastos.filter(gasto => {
        if (filtros.fechaDesde) {
            const fechaDesde = Date.parse(filtros.fechaDesde);
            if (gasto.fecha < fechaDesde) {
                return false;
            }
        }
        
        if (filtros.fechaHasta) {
            const fechaHasta = Date.parse(filtros.fechaHasta);
            if (gasto.fecha > fechaHasta) {
                return false;
            }
        }
        
        if (filtros.valorMinimo !== undefined) {
            if (gasto.valor < filtros.valorMinimo) {
                return false;
            }
        }
        
        if (filtros.valorMaximo !== undefined) {
            if (gasto.valor > filtros.valorMaximo) {
                return false;
            }
        }
        
        if (filtros.descripcionContiene) {
            if (!gasto.descripcion.toLowerCase().includes(filtros.descripcionContiene.toLowerCase())) {
                return false;
            }
        }
        
        if (filtros.etiquetasTiene) {
            const tieneAlgunaEtiqueta = filtros.etiquetasTiene.some(etiqueta => 
                gasto.etiquetas.includes(etiqueta)
            );
            if (!tieneAlgunaEtiqueta) {
                return false;
            }
        }
        
        return true;
    });
}

function agruparGastos(periodo, etiquetas = [], fechaDesde, fechaHasta) {
    const filtros = {};
    
    if (etiquetas.length > 0) {
        filtros.etiquetasTiene = etiquetas;
    }
    
    if (fechaDesde) {
        filtros.fechaDesde = fechaDesde;
    }
    
    if (fechaHasta) {
        filtros.fechaHasta = fechaHasta;
    }
    
    const gastosFiltrados = filtrarGastos(filtros);
    
    const agrupacion = {};
    
    gastosFiltrados.forEach(gasto => {
        const periodoGasto = gasto.obtenerPeriodoAgrupacion(periodo);
        
        if (agrupacion[periodoGasto]) {
            agrupacion[periodoGasto] += gasto.valor;
        } else {
            agrupacion[periodoGasto] = gasto.valor;
        }
    });
    
    return agrupacion;
}

// Exportación de funciones
export   {
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
}
