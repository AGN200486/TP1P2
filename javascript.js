const form = document.getElementById('registroForm');
const statusEl = document.getElementById('formStatus');

const validators = {
  nombre: value => value.trim() !== '' ? '' : 'El nombre es obligatorio.',
  email: value => /^\S+@\S+\.\S+$/.test(value) ? '' : 'Ingrese un email válido.',
  telefono: value => /^[0-9]{7,15}$/.test(value) ? '' : 'Teléfono inválido. Solo números (7-15 dígitos).',
  fechaNacimiento: value => value ? '' : 'La fecha es obligatoria.',
  genero: value => value ? '' : 'Debe seleccionar un género.',
  pais: value => value ? '' : 'Seleccione un país.',
};

form.addEventListener('input', e => {
  validarCampo(e.target.name);
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  let valido = true;

  // Validar todos los campos
  for (let campo in validators) {
    if (validarCampo(campo) !== true) {
      valido = false;
    }
  }

  if (!valido) {
    statusEl.textContent = 'Por favor corrija los errores antes de enviar.';
    statusEl.style.color = 'red';
    return;
  }

  // Preparar datos
  const formData = new FormData(form);
  const data = {
    nombre: formData.get('nombre'),
    email: formData.get('email'),
    telefono: formData.get('telefono'),
    fechaNacimiento: formData.get('fechaNacimiento'),
    genero: formData.get('genero'),
    pais: formData.get('pais'),
    intereses: formData.getAll('intereses'),
    terminos: formData.get('terminos') === 'on'
  };

  try {
    const res = await fetch('http://localhost:3000/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      const result = await res.json();
      statusEl.textContent = 'Formulario enviado con éxito.';
      statusEl.style.color = 'green';
      form.reset();
      document.querySelectorAll('.form-group').forEach(g => g.classList.remove('valid', 'invalid'));
    } else {
      statusEl.textContent = 'Error al enviar el formulario.';
      statusEl.style.color = 'red';
    }
  } catch (error) {
    statusEl.textContent = 'Error de red o servidor.';
    statusEl.style.color = 'red';
    console.error(error);
  }
});

function validarCampo(campo) {
  let input = form.elements[campo];
  let formGroup = input.closest('.form-group') || document.querySelector(`[name="${campo}"]`).closest('.form-group');
  let mensaje = '';

  if (campo === 'intereses') {
    mensaje = validators[campo](form.querySelectorAll('[name="intereses"]'));
  } else if (campo === 'terminos') {
    mensaje = validators[campo](form.elements[campo]);
  } else {
    mensaje = validators[campo](form.elements[campo].value);
  }

  const small = formGroup.querySelector('small');
  if (mensaje) {
    formGroup.classList.add('invalid');
    formGroup.classList.remove('valid');
    small.textContent = mensaje;
    return false;
  } else {
    formGroup.classList.add('valid');
    formGroup.classList.remove('invalid');
    small.textContent = '✓';
    return true;
  }
}