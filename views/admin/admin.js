document.addEventListener("DOMContentLoaded", () => {
  const emailList = document.getElementById("email-list");
  let emails = [];
  let users = [];
  let currentEmail = {}; // Para almacenar el correo seleccionado

  const fetchEmails = async () => {
    try {
      let response = await fetch("http://localhost:3000/api/correo/correos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al traer los correos");
      }

      emails = await response.json();
      console.log(emails);
      renderEmails();
    } catch (error) {
      console.error("Error al obtener los correos:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      let response = await fetch("http://localhost:3000/api/usuario/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al traer los usuarios");
      }

      users = await response.json();
      console.log(users);
      renderUsers();
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const addDeleteButtonListeners = () => {
    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", () => {
        const emailId = button.getAttribute("data-id");
        deleteEmail(emailId);
      });
    });
  };

  const renderEmails = () => {
    emailList.innerHTML = "";
    emails.forEach((email) => {
      const id = email._id;

      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${email.asunto || "Sin asunto"}</td>
      <td>
        <button class="btn btn-sm btn-success" onclick="prepareEmailToSend('${id}')" data-bs-toggle="modal" data-bs-target="#sendModal" style="margin-right: 10px">Enviar correo</button>
        <button class="btn btn-sm btn-primary" onclick="viewEmailDetail('${id}')" data-bs-toggle="modal" data-bs-target="#detailModal" style="margin-right: 10px">Ver detalle</button>
        <button class="btn btn-sm btn-danger delete-button" data-id="${id}">Eliminar correo</button>
      </td>
    `;
      emailList.appendChild(row);
    });

    addDeleteButtonListeners();
  };

  const renderUsers = () => {
    sendForm.innerHTML = "";
    users.forEach((user, index) => {
      const userItem = document.createElement("div");
      userItem.classList.add("form-check");
      userItem.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${user.correo}" id="dest${index}" />
        <label class="form-check-label" for="dest${index}">
          ${user.correo}
        </label>
      `;
      sendForm.appendChild(userItem);
    });
  };

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

      const newEmail = await response.json();
      emails.push(newEmail);
      renderEmails();
    } catch (error) {
      console.error("Error al agregar el correo:", error);
    }
  };

  const emailForm = document.getElementById("email-form");
  emailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const asunto = document.getElementById("emailSubject").value;
    const contenido = document.getElementById("emailMessage").value;

    addEmail(asunto, contenido);

    emailForm.reset();
    const addModal = new bootstrap.Modal(document.getElementById("addModal"));
    addModal.hide();
  });

  window.viewEmailDetail = (emailId) => {
    const email = emails.find((email) => email._id === emailId);
    if (!email) return;

    // Crear una nueva ventana
    const detailWindow = window.open("", "_blank");

    // Configurar el contenido HTML de la nueva ventana
    detailWindow.document.write(`
    <html>
      <head>
        <title>${email.asunto || "Detalle del correo"}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background-color: #121212 !important;}
          .asdasd {font-size: 1.5em; color: white !important; text-align: center; padding:20px !important;}
          .a1a1 {color: white !important; text-align: center;}
          p { font-size: 1em; }
        </style>
      </head>
      <body>
        <h1 class="asdasd">Asunto: ${email.asunto || "Sin asunto"}</h1>
        <p class="a1a1">${email.contenido || "Mensaje no disponible"}</p>
      </body>
    </html>
  `);

    // Cerrar el documento para terminar de cargar la página
    detailWindow.document.close();
  };

  /*
  window.viewEmailDetail = (emailId) => {
    console.log(emailId);
    const email = emails.find((email) => email._id === emailId);
    console.log(email);
    if (!email) return;

    document.getElementById("detailSubject").textContent = email.asunto;
    document.getElementById("detailMessage").innerHTML = email.contenido;
  };
  */

  // Preparar el correo para enviar
  window.prepareEmailToSend = (emailId) => {
    currentEmail = emails.find((email) => email._id === emailId);
    console.log("Correo seleccionado para enviar:", currentEmail);
  };

  // Cargar usuarios cuando se abre el modal de enviar correo
  const sendModal = document.getElementById("sendModal");
  sendModal.addEventListener("show.bs.modal", fetchUsers);

  const sendForm = document.getElementById("sendForm");
  sendForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Obtener el asunto y mensaje del correo seleccionado
    const subject = currentEmail.asunto || "Sin asunto";
    const message = currentEmail.contenido || "Sin mensaje";

    // Obtener los correos seleccionados
    const selectedEmails = Array.from(
      document.querySelectorAll("#sendForm input[type='checkbox']:checked")
    ).map((input) => input.value);

    console.log(selectedEmails);

    if (selectedEmails.length === 0) {
      alert("Por favor selecciona al menos un destinatario");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/empresa/sendMultipleEmails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientEmails: selectedEmails,
            subject,
            message,
          }),
        }
      );
      /*
      if (!response.ok) {
        throw new Error("Error al enviar el correo");
      }
*/
      alert("Correos enviados exitosamente");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      alert("Error al enviar los correos");
    }
  });

  const deleteEmail = async (emailId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/correo/correos/${emailId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el correo");
      }

      // Actualizar la lista de correos después de eliminar
      emails = emails.filter((email) => email._id !== emailId);
      renderEmails();
    } catch (error) {
      console.error("Error al eliminar el correo:", error);
      alert("Error al eliminar el correo");
    }
  };

  fetchEmails();
});
