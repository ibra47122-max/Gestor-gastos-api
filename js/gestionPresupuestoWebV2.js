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

//Botones para guardar y cargar los datos al localstorage
const guardarButton = document.querySelector(".guardar")
const cargarButton = document.querySelector(".cargar")

guardarButton.addEventListener("click", () => {
  /*
  Cuandos se pulsa sobre el boton de guardar, guarda los gastos,
  únicamente se guardan si la lista tiene gastos, si no da error
  */ 
  const gastos = listarGastos()
  if (gastos.length > 0) {
    localStorage.setItem("gastos", JSON.stringify(gastos))
  } else {
    alert("No hay gastos para guardar")
  }
})

cargarButton.addEventListener("click", () => {
  /*
  Esta funcion se encargar de cargar los gastos. Si no hay gastos
  no los añade a la pagina, en caso contrario, si los añade
  */
  const gastosLocal = JSON.parse(localStorage.getItem("gastos"))
  if (gastosLocal.length > 0) {
    gastosLocal.forEach((gasto) => {
      let item = document.createElement("gasto-item");
      item.gasto = gasto;
      lista.appendChild(item);
    })
  } else {
    alert("No hay gastos guardadp")
  }
})

class GastoItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" }); //Crea el shadow DOM
    }
  
    set gasto(valor) {
      this._gasto = valor;
      this.render();
    }
  
    get gasto() {
      return this._gasto;
    }
  
    render() {
      const template = document.getElementById("plantilla-gasto");
      const clone = template.content.cloneNode(true);
  
      // Se guardan los datos de del gasto en el text content
      clone.getElementById("descripcion").textContent = this._gasto.descripcion;
      clone.getElementById("valor").textContent = this._gasto.valor;
      clone.getElementById("fecha").textContent = this._gasto.fecha;
      clone.getElementById("etiquetas").textContent = this._gasto.etiquetas;
  
      const btnEditar = clone.getElementById("btn-editar");
      const btnBorrar = clone.getElementById("btn-borrar");
      const form = clone.getElementById("form-edicion");
      const btnCancelar = clone.getElementById("btn-cancelar");
  
      // Cuando se hace click en editar se altera la clase visible para mostrar el formulario
      btnEditar.addEventListener("click", () => {
        form.classList.toggle("visible");
      });
  
      // Cuando se hace click para borrar sale la alerta para confirar
      btnBorrar.addEventListener("click", () => {
        if (confirm("¿Seguro que quieres borrar este gasto?")) {
          this.remove();
          borrarGasto(this._gasto)
        }
      });
  
      console.log(listarGastos())
  
      // Cancela el formulario de edicion del gasto
      btnCancelar.addEventListener("click", () => {
        form.classList.remove("visible");
      });
  
      // Se guarda la edicion del gasto
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this._gasto.descripcion = form.querySelector("#input-descripcion").value;
        this._gasto.valor = parseFloat(form.querySelector("#input-valor").value);
        this._gasto.fecha = form.querySelector("#input-fecha").value;
        this._gasto.etiquetas = form.querySelector("#input-etiquetas").value.split(",");
        this.render();
      });
  
      this.shadowRoot.innerHTML = "";
      this.shadowRoot.appendChild(clone);
    }
  }

// Registrar el componente
customElements.define("gasto-item", GastoItem);

// Variables que guardan el formulario para añadir gastos y la lista donde añadir los gastos
const formNuevo = document.querySelector(".formulario-gastos");
console.log(formNuevo)
const lista = document.querySelector(".listado-gastos")

formNuevo.addEventListener("submit", (e) => {
    e.preventDefault();

    // En estas variables se almacenan los datos del gasto añadido
    const descripcionInput = document.querySelector("#descripcion-input").value
    const valorInput = parseFloat(document.querySelector("#valor-input").value)
    const fechaInput = document.querySelector("#fecha-input").value
    const etiquetasInput = document.querySelector("#etiquetas-input").value
    const arrayEtiquetas = etiquetasInput.split(',').map(etiqueta => etiqueta.trim())

    //Se crea el objeto gasto con las variables del los datos del gasto
    const gasto = new CrearGasto(
    descripcionInput,
    valorInput,
    fechaInput,
    arrayEtiquetas
    );

    //Se añade el gasto al array deg gastos
    anyadirGasto(gasto);

    //Crea el elemento web y lo añade al html
    const item = document.createElement("gasto-item");
    item.gasto = gasto;
    lista.appendChild(item);

    //Actualiza el valor total de los gastos y los añade al html
    const totalGastosDiv = document.querySelector(".total-gastos")
    totalGastosDiv.innerHTML = 
    `<p>
        Total gastos: ${calcularTotalGastos()}
    </p>`
    console.log(calcularTotalGastos())
    console.log(listarGastos())


});

  