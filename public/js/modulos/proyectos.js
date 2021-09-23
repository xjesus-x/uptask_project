import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector("#eliminar-proyecto");

if (btnEliminar) {
  btnEliminar.addEventListener("click", (e) => {
    const urlProyecto = e.target.dataset.proyectoUrl;

    Swal.fire({
      title: "¿Deseas borrar este proyecto?",
      text: "Un proyecto borrado no se puede recuperar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        //Hacer petición a axios
        const url = `${location.origin}/proyectos/${urlProyecto}`;

        axios
          .delete(url, { params: { urlProyecto } })
          .then(function (respuesta) {
            //Respuesta.data es lo que retorna la función en el controller
            Swal.fire("¡Eliminado!", respuesta.data, "success");

            //redireccionar al inicio desde navegador
            setTimeout(() => {
              window.location.href = "/";
            }, 3000);
          })
          .catch(() => {
            Swal.fire({
              type: "error",
              title: "Hubo un error",
              text: "No se pudo eliminar el proyecto.",
            });
          });
      }
    });
  });
}

export default btnEliminar;
