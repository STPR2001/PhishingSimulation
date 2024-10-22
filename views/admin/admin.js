document.addEventListener("DOMContentLoaded", () => {
  const emailList = document.getElementById("email-list");
  let emails = []; // Inicializamos el arreglo vacío que llenaremos con la API

  const fetchEmails = async () => {
    try {
      // Realiza la solicitud GET a la API
      let response = await fetch("http://localhost:3000/api/correo/correos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al traer los correos");
      }

      emails = await response.json(); // Asignamos los correos obtenidos al arreglo 'emails'
      console.log(emails);
      renderEmails();
    } catch (error) {
      console.error("Error al obtener los correos:", error);
    }
  };

  // Función para agregar un nuevo correo
  const addEmail = async (asunto, contenido) => {
    try {
      let response = await fetch("http://localhost:3000/api/correo/correos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asunto: asunto,
          contenido: contenido,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el correo");
      }

      const newEmail = await response.json(); // El correo nuevo agregado
      emails.push(newEmail); // Agregar el correo a la lista
      renderEmails();
    } catch (error) {
      console.error("Error al agregar el correo:", error);
    }
  };

  // Manejar el envío del formulario de agregar/editar correo
  const emailForm = document.getElementById("email-form");
  emailForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario
    const asunto = document.getElementById("emailSubject").value;
    const contenido = document.getElementById("emailMessage").value;

    addEmail(asunto, contenido); // Llamar la función para agregar el correo

    // Cerrar el modal y reiniciar el formulario
    emailForm.reset();
    const addModal = new bootstrap.Modal(document.getElementById("addModal"));
    addModal.hide();
  });

  const renderEmails = () => {
    emailList.innerHTML = "";
    emails.forEach((email) => {
      const message = email.contenido
        ? email.contenido
        : "Mensaje no disponible";
      const truncatedMessage =
        message.length > 50 ? message.slice(0, 50) + "..." : message;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${email.asunto || "Sin asunto"}</td>
        <td>${truncatedMessage}</td>
        <td>
          <button class="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#sendModal">Enviar</button>
          <button class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#addModal">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteEmail(${
            email._id
          })">Eliminar</button>
          <button class="btn btn-sm btn-info" onclick="viewEmailDetail(${
            email._id
          })" data-bs-toggle="modal" data-bs-target="#detailModal">Ver Detalle</button>
        </td>
      `;
      emailList.appendChild(row);
    });
  };

  const viewEmailDetail = (id) => {
    const email = emails.find((e) => e.id === id);
    console.log("ENTROOOOO");

    if (email) {
      // Actualiza los elementos del modal de detalles con los valores del correo seleccionado
      document.getElementById("detailSubject").textContent =
        email.asunto || "Sin asunto";
      document.getElementById("detailMessage").textContent =
        email.contenido || "Mensaje no disponible";
    } else {
      console.error("Correo no encontrado");
    }
  };

  const deleteEmail = (id) => {
    const index = emails.findIndex((e) => e.id === id);
    if (index !== -1) {
      emails.splice(index, 1);
      renderEmails();
    }
  };

  // Llamada para obtener los correos al cargar la página
  fetchEmails();
});
