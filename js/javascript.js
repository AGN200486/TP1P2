form = document.getElementById("registroForm");

const campos = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  telefono: document.getElementById("telefono"),
  fechaNacimiento: document.getElementById("fechaNacimiento"),
  genero: form.querySelectorAll("input[name='genero']"),
  pais: document.getElementById("pais"),
};


function setError(input, mensaje) { /*cambia el texto de error y lo muestra*/
  const contenedor = input.closest(".form-group"); /*Busca el contenedor más cercano con la clase .form-group*/
  const error = contenedor.querySelector(".errorMens")
  const icono = contenedor.querySelector(".estado-icon");
  error.textContent = mensaje;
  error.style.display = "block"; /*por si estaba oculto*/

  input.classList.remove("valid");
  input.classList.add("invalid");

  if (icono) {
    icono.textContent = "❌";
    icono.classList.add("invalid");
    icono.classList.remove("valid");
  }
}

function clearError(input) { /*Borra el texto de error y lo oculta.*/
  const contenedor = input.closest(".form-group"); /*Busca el contenedor más cercano con la clase .form-group*/
  const error = contenedor.querySelector(".errorMens")
  const icono = contenedor.querySelector(".estado-icon");

  error.textContent = ""; /*deja el mensaje vacio*/
  error.style.display = "none"; /*Ocultar el elemento para que no ocupe espacio en el diseño*/

  input.classList.remove("invalid");
  input.classList.add("valid");

  if (icono) {
    icono.textContent = "✅";
    icono.classList.add("valid");
    icono.classList.remove("invalid");

  }
}

/*Validaciones individuales*/
function validarNombre() {
  const valor = campos.name.value.trim();
  if (valor.length < 3) {
    setError(campos.name, "El nombre debe tener al menos 3 caracteres");
    return false;
  }
  clearError(campos.name);
  return true;
}

function validarEmail() {
  const valor = campos.email.value.trim();

  const arrobaPos = valor.indexOf("@");
  const puntoPos = valor.lastIndexOf(".");

  if (arrobaPos < 1) { /*Que haya un "@" y que no sea el primer carácter*/
    setError(campos.email, "Email Invalido");
    return false;
  }
  if (puntoPos < arrobaPos + 2) { /*Que exista un "." después del "@" (no inmediatamente, al menos 2 caracteres después)*/
    setError(campos.email, "Debe haber un punto después del @");
    return false;
  }
  if (puntoPos == valor.length - 1) { /*Que el "." no sea el último carácter*/
    setError(campos.email, "Email Invalido");
    return false;
  }

  clearError(campos.email);
  return true;
}

function validarTelefono() {
  const valor = campos.telefono.value.trim();

  if (valor.length < 7 || valor.length > 15) {
    setError(campos.telefono, "El teléfono debe tener entre 7 y 15 dígitos");
    return false;
  }

  if (isNaN(valor)) { /*Comprobacion si valor es un numero*/
    setError(campos.telefono, "El teléfono debe tener solo números");
    return false;
  }

  clearError(campos.telefono);
  return true;
}


function validarFechaNacimiento() {
  const valor = campos.fechaNacimiento.value;
  if (!valor) {
    setError(campos.fechaNacimiento, "La fecha de nacimiento es obligatoria");
    return false;
  }
  const fecha = new Date(valor); /*convierte el string de la fecha en un objeto Date de JavaScript*/
  const hoy = new Date(); /*Guardamos la fecha actual*/
  const edad = hoy.getFullYear() - fecha.getFullYear(); /*Calculamos la edad haciendo la diferencia de años entre el año actual y el año de nacimiento.*/
  const mes = hoy.getMonth() - fecha.getMonth(); /*Diferencia de meses entre la fecha actual y el mes de nacimiento (para ajustar la edad si aún no llegó el cumpleaños en el año actual).*/

  let edadReal = edad;
  /*Si el mes actual es antes del mes de nacimiento o está en el mismo mes pero el día actual es menor que el día de nacimiento*/
  if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
    edadReal--; /*Restamos un año ya que no cumplió años aún este año*/
  }

  if (edadReal < 18) {
    setError(campos.fechaNacimiento, "Debes ser mayor de 18 años");
    return false;
  }
  clearError(campos.fechaNacimiento);
  return true;
}

function validarGenero() {
  /* campos.genero es un NodeList con todos los inputs radio de género*/
  let seleccionado = false;
  for (let i = 0; i < campos.genero.length; i++) { /* pasa por todas las opciones y si no esta ninguna seleccionada saltara un error*/
    if (campos.genero[i].checked) {
      seleccionado = true;
    }
  }
  if (!seleccionado) {
    setError(campos.genero[0], "Seleccione un género");
    return false;
  }
  clearError(campos.genero[0]);
  return true;
}

function validarPais() {
  if (campos.pais.value === "") {
    setError(campos.pais, "Seleccione un país");
    return false;
  }
  clearError(campos.pais);
  return true;
}

/* Asignar eventos para validación en tiempo real */
campos.name.addEventListener("input", validarNombre); /*se dispara cada vez que el usuario escribe en un input, se llama a la función de validación correspondiente*/
campos.email.addEventListener("input", validarEmail);
campos.telefono.addEventListener("input", validarTelefono);
campos.fechaNacimiento.addEventListener("change", validarFechaNacimiento); /*se dispara cuando cambia el valor, llama a la función de validación correspondiente*/
/*No hacemos la validacion en tiempo real del select pais ya que solo saltara mensaje de error al apretar el boton enviar*/
/*No hacemos la validacion en tiempo real del radio genero ya que solo saltara mensaje de error al apretar el boton enviar*/

/* Validación al enviar*/
form.addEventListener("submit", e => {
  e.preventDefault(); /*evita que el formulario se envíe, para que primero podamos validar todos los campos*/

  const valido =
    validarNombre() &
    validarEmail() &
    validarTelefono() &
    validarFechaNacimiento() &
    validarGenero() &
    validarPais();
  /*La variable valido será True si todas las funciones devuelven True*/
  if (valido) {
    // 1. Crear un objeto con todos los valores del formulario
    const datosFormulario = {
      nombre: campos.name.value.trim(),
      email: campos.email.value.trim(),
      telefono: campos.telefono.value.trim(),
      fechaNacimiento: campos.fechaNacimiento.value,
      genero: form.querySelector('input[name="genero"]:checked')?.value || "",
      pais: campos.pais.value
    };

    // 2. Enviar los datos con Fetch a tu API
    fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosFormulario)
    })
      .then(respuesta => {
        if (!respuesta.ok) throw new Error("Error en el envío");
        return respuesta.json();
      })
      .then(data => {
        alert("Formulario enviado con éxito ✅\nID asignado: " + data.id);
        form.reset(); // limpia el formulario
      })
      .catch(() => alert("Ocurrió un error al enviar el formulario ❌"));
  } else {
    alert("Por favor, corrija los errores antes de enviar ❌");
  }
});

