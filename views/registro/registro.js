document
  .getElementById("register-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Evitar el comportamiento predeterminado del formulario

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;

    // Crear el cuerpo de la solicitud
    const data = {
      nombre: nombre,
      apellido: apellido,
      correo: email,
    };

    try {
      // Realizar la solicitud POST al endpoint
      const response = await fetch("http://localhost:3000/api/usuario/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Convertir el objeto data a JSON
      });

      // Manejar la respuesta
      const result = await response.json();

      if (!response.ok) {
        document.getElementById("error-message").textContent =
          result.message || "Error en el registro";
        document.getElementById("error-message").style.display = "block";
      } else {
        // Si la respuesta fue exitosa (status 201)
        window.location.href = "../afterRegister/afterRegister.html";
      }
    } catch (error) {
      // Manejar errores de red o cualquier otro tipo de error
      document.getElementById("error-message").textContent =
        "Error de conexión: " + error.message;
      document.getElementById("error-message").style.display = "block";
    }
  });
