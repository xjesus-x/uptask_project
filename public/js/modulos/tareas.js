import axios from "axios";
import Swal from "sweetalert2";
import { actualizarAvance } from "../funciones/avance";

const tareas = document.querySelector(".listado-pendientes");

if (tareas) {
  tareas.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-check-circle")) {
      const icono = e.target;
      const idTarea = icono.parentElement.parentElement.dataset.tarea;

      const url = `${location.origin}/tareas/${idTarea}`;

      axios.patch(url, { idTarea }).then(function (respuesta) {
        if (respuesta.status === 200) {
          icono.classList.toggle("completo");
          //actualizar barra de progreso
          actualizarAvance();
        }
      });
    }

    if (e.target.classList.contains("fa-trash")) {
      const tareaHTML = e.target.parentElement.parentElement,
        idTarea = tareaHTML.dataset.tarea;

      Swal.fire({
        title: "¿Deseas borrar esta tarea?",
        text: "Una tarea borrada no se puede recuperar.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Borrar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          const url = `${location.origin}/tareas/${idTarea}`;

          //En el caso de delete sí se deben pasar parámetros en axios
          axios.delete(url, { params: { idTarea } }).then(function (respuesta) {
            if (respuesta.status === 200) {
              //Borrando el HTML
              tareaHTML.parentElement.removeChild(tareaHTML);

              //Alerta
              Swal.fire("Tarea eliminada", respuesta.data, "success");

              //actualizar barra de progreso
              actualizarAvance();
            }
          });
        }
      });
    }
  });
}

export default tareas;
