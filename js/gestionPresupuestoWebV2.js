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
const usuarioModal = document.querySelector("#usuario-modal") //Modal que aparece en centro de la pantalla para introducir el usuario
const btnGuardarUsuario = document.querySelector("#btn-guardar-usuario")
const formularioGastos = document.querySelector(".formulario-gastos")
const usuarioInput = document.querySelector("#usuario-input")
let usuario = usuarioInput.value

document.addEventListener("DOMContentLoaded", () => {
  usuarioModal.classList.remove("hidden")
})

if (btnGuardarUsuario) {
  btnGuardarUsuario.addEventListener("click", () => {
    if (usuarioInput.value.trim() !== "") {

      //Elimina el modal y muestra el formulario
      usuarioModal.classList.add("hidden")
      formularioGastos.classList.remove("hidden")
      usuario = usuarioInput.value

    } else {
      alert("Tienes que introducir un usuario")
    }
  })
}

guardarButton.addEventListener("click", async () => {
  /*
  Cuandos se pulsa sobre el boton de guardar, guarda los gastos,
  únicamente se guardan si la lista tiene gastos, si no da error
  */
  const gastosLocal = await fetch(`http://localhost:3000/${usuario}`, { method: "GET" })
  const gastos = await gastosLocal.json()
  console.log(gastos)

  if (gastos.length > 0) {
    gastos.forEach((gasto) => {
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
    btnBorrar.addEventListener("click", async () => {
      if (confirm("¿Seguro que quieres borrar este gasto?")) {
        this.remove();
        borrarGasto(this._gasto)
        try {
          await fetch(`http://localhost:3000/${usuario}/${this._gasto.id}`, {
            method: "DELETE"
          });
        } catch (error) {
          console.error("Error al borrar el gasto:", error);
        }
      }
    });

    console.log(listarGastos())

    // Cancela el formulario de edicion del gasto
    btnCancelar.addEventListener("click", () => {
      form.classList.remove("visible");
    });

    // Se guarda la edicion del gasto
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      this._gasto.descripcion = form.querySelector("#input-descripcion").value;
      this._gasto.valor = parseFloat(form.querySelector("#input-valor").value);
      this._gasto.fecha = form.querySelector("#input-fecha").value;
      this._gasto.etiquetas = form.querySelector("#input-etiquetas").value.split(",");
      this.render();

      try {
        await fetch(`http://localhost:3000/${usuario}/${this._gasto.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this._gasto)
        });
      } catch (error) {
        console.error("Error al actualizar el gasto:", error);
      }
    });

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(clone);
  }
}

// Registrar el componente
customElements.define("gasto-item", GastoItem);

// Variables que guardan el formulario para añadir gastos y la lista donde añadir los gastos
const formNuevo = document.querySelector(".formulario-gastos form");
console.log(formNuevo)
const lista = document.querySelector(".listado-gastos")

if (formNuevo) {
  formNuevo.addEventListener("submit", async (e) => {
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

    if (usuario) {
      try {
        const response = await fetch(`http://localhost:3000/${usuario}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(gasto)
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error al guardar el gasto:", error);
      }
    } else {
      console.error("No hay usuario seleccionado");
    }

  });
}
