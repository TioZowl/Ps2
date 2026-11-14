
// URL base de la API. El token solo se envía en solicitudes autenticadas.
// El navegador envía al servidor los datos que se muestran o modifican en la tienda.
const API = 'http://localhost:3000';
const estado = { productos: [], categorias: [], usuario: null, token: localStorage.getItem('token') };
const $ = (selector) => document.querySelector(selector);
const listaProductos = $('#lista-productos');
const mensajeCatalogo = $('#mensaje-catalogo');

// Centraliza las llamadas al servidor, añade la sesión cuando existe y traduce respuestas de error.
async function api(ruta, opciones = {}) {
  const headers = { ...(opciones.body ? { 'Content-Type': 'application/json' } : {}), ...(estado.token ? { Authorization: `Bearer ${estado.token}` } : {}), ...opciones.headers };
  const respuesta = await fetch(`${API}${ruta}`, { ...opciones, headers });
  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new Error(datos?.message || `Error ${respuesta.status}`);
  return datos;
}

// Muestra confirmaciones y errores junto al formulario que inició la acción.
function aviso(selector, mensaje, tipo = 'success') {
  const elemento = $(selector);
  elemento.className = `mt-3 alert alert-${tipo}`;
  elemento.textContent = mensaje;
  if (!mensaje) elemento.className = '';
}

// Busca el nombre para mostrarlo en tarjetas sin repetirlo en cada componente.
function nombreCategoria(id) {
  return estado.categorias.find((categoria) => Number(categoria.id) === Number(id))?.nombre || 'Sin categoría';
}

function crearTarjeta(producto) {
  // Se construyen nodos y se asigna textContent para que datos de la API no se interpreten como HTML.
  const columna = document.createElement('div');
  columna.className = 'col-12 col-sm-6 col-lg-4';
  const tarjeta = document.createElement('article');
  tarjeta.className = 'card h-100 producto-card shadow-sm';
  const imagen = document.createElement('img');
  imagen.className = 'card-img-top imagen-producto';
  imagen.src = producto.imagen || 'https://placehold.co/600x400?text=Sin+imagen';
  imagen.alt = producto.nombre;
  imagen.loading = 'lazy';
  imagen.onerror = () => { imagen.src = 'https://placehold.co/600x400?text=Sin+imagen'; };
  const cuerpo = document.createElement('div');
  cuerpo.className = 'card-body d-flex flex-column';
  const titulo = document.createElement('h3'); titulo.className = 'card-title h5'; titulo.textContent = producto.nombre;
  const categoria = document.createElement('p'); categoria.className = 'text-secondary small mb-2'; categoria.textContent = nombreCategoria(producto.id_categoria);
  const descripcion = document.createElement('p'); descripcion.className = 'card-text text-secondary'; descripcion.textContent = producto.descripcion;
  const precio = document.createElement('p'); precio.className = 'precio-producto'; precio.textContent = `$${Number(producto.precio).toLocaleString('es-UY')}`;
  const stock = document.createElement('p'); stock.className = 'small'; stock.textContent = Number(producto.stock) > 0 ? `${producto.stock} unidades disponibles` : 'Sin stock';
  const boton = document.createElement('button'); boton.className = 'btn btn-outline-primary mt-auto'; boton.textContent = 'Ver detalle';
  boton.addEventListener('click', () => mostrarDetalle(producto));
  cuerpo.append(titulo, categoria, descripcion, precio, stock, boton);
  tarjeta.append(imagen, cuerpo); columna.append(tarjeta);
  return columna;
}

// Abre la ventana de detalle con la información del producto seleccionado.
function mostrarDetalle(producto) {
  $('#modal-producto-titulo').textContent = producto.nombre;
  const contenido = $('#modal-producto-contenido'); contenido.replaceChildren();
  const imagen = document.createElement('img'); imagen.src = producto.imagen; imagen.alt = producto.nombre; imagen.className = 'img-fluid rounded mb-3 detalle-imagen';
  const descripcion = document.createElement('p'); descripcion.textContent = producto.descripcion;
  const categoria = document.createElement('p'); categoria.textContent = `Categoría: ${nombreCategoria(producto.id_categoria)}`;
  const precio = document.createElement('p'); precio.className = 'fw-bold'; precio.textContent = `Precio: $${Number(producto.precio).toLocaleString('es-UY')}`;
  const stock = document.createElement('p'); stock.textContent = `Stock disponible: ${producto.stock}`;
  contenido.append(imagen, descripcion, categoria, precio, stock);
  bootstrap.Modal.getOrCreateInstance($('#modal-producto')).show();
}

// Aplica el filtro escrito por la persona y vuelve a dibujar el catálogo.
function renderCatalogo() {
  const busqueda = $('#buscar-productos').value.trim().toLocaleLowerCase();
  const filtrados = estado.productos.filter((p) => `${p.nombre} ${p.descripcion} ${nombreCategoria(p.id_categoria)}`.toLocaleLowerCase().includes(busqueda));
  listaProductos.replaceChildren(...filtrados.map(crearTarjeta));
  mensajeCatalogo.textContent = filtrados.length ? `${filtrados.length} producto(s)` : 'No hay productos que coincidan con la búsqueda.';
}

async function cargarCatalogo() {
  try {
    [estado.productos, estado.categorias] = await Promise.all([api('/productos'), api('/categorias')]);
    renderCatalogo();
  } catch (error) {
    mensajeCatalogo.textContent = 'No se pudo conectar con el catálogo. Comprueba que el servidor y MySQL estén iniciados.';
    console.error(error);
  }
}

// Cambia lo que se ve en pantalla según la cuenta y su tipo de acceso.
function actualizarVistaSesion() {
  const autenticado = Boolean(estado.usuario);
  $('#panel-acceso').classList.toggle('d-none', autenticado);
  $('#panel-perfil').classList.toggle('d-none', !autenticado);
  $('#boton-cerrar-sesion').classList.toggle('d-none', !autenticado);
  $('#boton-admin-nav').classList.toggle('d-none', estado.usuario?.rol !== 'admin');
  $('#administracion').classList.toggle('d-none', estado.usuario?.rol !== 'admin');
  if (autenticado) {
    $('#perfil-nombre').value = estado.usuario.nombre || '';
    $('#perfil-email').value = estado.usuario.email || '';
    $('#perfil-foto').value = estado.usuario.foto || '';
    $('#perfil-password').value = '';
    $('#perfil-rol').textContent = `Sesión iniciada como ${estado.usuario.nombre} (${estado.usuario.rol})`;
  }
}

async function cargarPerfil() {
  if (!estado.token) return;
  try {
    estado.usuario = await api('/usuarios/me');
    actualizarVistaSesion();
    if (estado.usuario.rol === 'admin') await cargarAdministracion();
  } catch (_) {
    localStorage.removeItem('token'); estado.token = null; estado.usuario = null; actualizarVistaSesion();
  }
}

$('#form-login').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    const datos = await api('/usuarios/login', { method: 'POST', body: JSON.stringify({ email: $('#login-email').value, contraseña: $('#login-password').value }) });
    estado.token = datos.token; localStorage.setItem('token', estado.token);
    await cargarPerfil(); aviso('#mensaje-cuenta', 'Sesión iniciada correctamente.');
  } catch (error) { aviso('#mensaje-cuenta', error.message, 'danger'); }
});

// Registra una cuenta y luego devuelve a la persona a la pestaña de ingreso.
$('#form-registro').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    await api('/usuarios/registro', { method: 'POST', body: JSON.stringify({ nombre: $('#registro-nombre').value, email: $('#registro-email').value, contraseña: $('#registro-password').value }) });
    // Se busca el formulario por su ID después de esperar la respuesta del servidor.
    $("#form-registro").reset(); aviso('#mensaje-cuenta', 'Cuenta creada. Ya puedes iniciar sesión.');
    bootstrap.Tab.getOrCreateInstance(document.querySelector('[data-bs-target="#tab-login"]')).show();
  } catch (error) { aviso('#mensaje-cuenta', error.message, 'danger'); }
});

$('#form-perfil').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const cambios = { nombre: $('#perfil-nombre').value, email: $('#perfil-email').value, foto: $('#perfil-foto').value || null };
  if ($('#perfil-password').value) cambios.contraseña = $('#perfil-password').value;
  try {
    estado.usuario = await api(`/usuarios/${estado.usuario.id}`, { method: 'PUT', body: JSON.stringify(cambios) });
    actualizarVistaSesion(); aviso('#mensaje-perfil', 'Perfil actualizado.');
  } catch (error) { aviso('#mensaje-perfil', error.message, 'danger'); }
});

$('#boton-cerrar-sesion').addEventListener('click', () => {
  localStorage.removeItem('token'); estado.token = null; estado.usuario = null; actualizarVistaSesion();
  aviso('#mensaje-cuenta', 'Sesión cerrada.');
});
$('#boton-admin-nav').addEventListener('click', () => $('#administracion').scrollIntoView({ behavior: 'smooth' }));
$('#buscar-productos').addEventListener('input', renderCatalogo);

// Carga los datos necesarios para las tres pestañas del panel de administración.
async function cargarAdministracion() {
  try {
    [estado.productos, estado.categorias] = await Promise.all([api('/productos'), api('/categorias')]);
    const selector = $('#producto-categoria'); selector.replaceChildren();
    estado.categorias.forEach((c) => { const option = document.createElement('option'); option.value = c.id; option.textContent = c.nombre; selector.append(option); });
    renderCatalogo(); renderTablaProductos(); renderTablaCategorias(); await renderTablaUsuarios();
  } catch (error) { aviso('#mensaje-admin', error.message, 'danger'); }
}

// Construye tablas con texto seguro, sin insertar contenido de la base como HTML.
function tabla(contenedor, encabezados, filas) {
  const table = document.createElement('table'); table.className = 'table table-hover align-middle';
  const thead = table.createTHead().insertRow(); encabezados.forEach((texto) => { const th = document.createElement('th'); th.textContent = texto; thead.append(th); });
  const tbody = table.createTBody(); filas.forEach((fila) => tbody.append(fila));
  $(contenedor).replaceChildren(table);
}

function celda(texto) { const td = document.createElement('td'); td.textContent = texto ?? ''; return td; }
function accion(texto, clase, alClick) { const boton = document.createElement('button'); boton.type = 'button'; boton.className = `btn btn-sm ${clase} me-1`; boton.textContent = texto; boton.addEventListener('click', alClick); return boton; }

// Prepara la lista de productos y sus controles para editar o eliminar.
function renderTablaProductos() {
  const filas = estado.productos.map((p) => {
    const row = document.createElement('tr'); row.append(celda(p.nombre), celda(nombreCategoria(p.id_categoria)), celda(String(p.stock)), celda(`$${p.precio}`));
    const acciones = document.createElement('td'); acciones.append(accion('Editar', 'btn-outline-primary', () => editarProducto(p)), accion('Eliminar', 'btn-outline-danger', () => eliminarProducto(p)));
    row.append(acciones); return row;
  });
  tabla('#admin-lista-productos', ['Producto', 'Categoría', 'Stock', 'Precio', 'Acciones'], filas);
}

function editarProducto(p) {
  $('#producto-id').value = p.id; $('#producto-nombre').value = p.nombre; $('#producto-imagen').value = p.imagen;
  $('#producto-descripcion').value = p.descripcion; $('#producto-precio').value = p.precio; $('#producto-stock').value = p.stock; $('#producto-categoria').value = p.id_categoria;
  $('#cancelar-producto').classList.remove('d-none'); $('#form-producto').scrollIntoView({ behavior: 'smooth' });
}

function limpiarProducto() { $('#form-producto').reset(); $('#producto-id').value = ''; $('#cancelar-producto').classList.add('d-none'); }
$('#cancelar-producto').addEventListener('click', limpiarProducto);
$('#form-producto').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const id = $('#producto-id').value;
  const producto = { nombre: $('#producto-nombre').value, descripcion: $('#producto-descripcion').value, precio: Number($('#producto-precio').value), stock: Number($('#producto-stock').value), id_categoria: Number($('#producto-categoria').value), imagen: $('#producto-imagen').value };
  try {
    await api(id ? `/productos/${id}` : '/productos', { method: id ? 'PUT' : 'POST', body: JSON.stringify(producto) });
    limpiarProducto(); aviso('#mensaje-admin', id ? 'Producto actualizado.' : 'Producto creado.'); await cargarAdministracion();
  } catch (error) { aviso('#mensaje-admin', error.message, 'danger'); }
});

async function eliminarProducto(p) {
  if (!confirm(`¿Eliminar “${p.nombre}”?`)) return;
  try { await api(`/productos/${p.id}`, { method: 'DELETE' }); aviso('#mensaje-admin', 'Producto eliminado.'); await cargarAdministracion(); }
  catch (error) { aviso('#mensaje-admin', error.message, 'danger'); }
}

// Muestra las categorías y sus acciones de edición y eliminación.
function renderTablaCategorias() {
  const filas = estado.categorias.map((c) => {
    const row = document.createElement('tr'); row.append(celda(c.nombre));
    const acciones = document.createElement('td'); acciones.append(accion('Editar', 'btn-outline-primary', () => { $('#categoria-id').value = c.id; $('#categoria-nombre').value = c.nombre; $('#cancelar-categoria').classList.remove('d-none'); }), accion('Eliminar', 'btn-outline-danger', async () => {
      if (!confirm(`¿Eliminar la categoría “${c.nombre}”?`)) return;
      try { await api(`/categorias/${c.id}`, { method: 'DELETE' }); aviso('#mensaje-admin', 'Categoría eliminada.'); await cargarAdministracion(); }
      catch (error) { aviso('#mensaje-admin', error.message, 'danger'); }
    })); row.append(acciones); return row;
  });
  tabla('#admin-lista-categorias', ['Categoría', 'Acciones'], filas);
}

function limpiarCategoria() { $('#form-categoria').reset(); $('#categoria-id').value = ''; $('#cancelar-categoria').classList.add('d-none'); }
$('#cancelar-categoria').addEventListener('click', limpiarCategoria);
$('#form-categoria').addEventListener('submit', async (evento) => {
  evento.preventDefault(); const id = $('#categoria-id').value;
  try { await api(id ? `/categorias/${id}` : '/categorias', { method: id ? 'PUT' : 'POST', body: JSON.stringify({ nombre: $('#categoria-nombre').value }) }); limpiarCategoria(); aviso('#mensaje-admin', 'Categoría guardada.'); await cargarAdministracion(); }
  catch (error) { aviso('#mensaje-admin', error.message, 'danger'); }
});

// Muestra los usuarios; los cambios de rol y las bajas quedan disponibles al administrador.
async function renderTablaUsuarios() {
  const usuarios = await api('/usuarios');
  const filas = usuarios.map((u) => {
    const row = document.createElement('tr');
    const nombreCell = document.createElement('td');
    const nombreInput = document.createElement('input'); nombreInput.className = 'form-control form-control-sm'; nombreInput.value = u.nombre; nombreInput.maxLength = 100; nombreInput.setAttribute('aria-label', `Nombre de ${u.email}`); nombreCell.append(nombreInput);
    const emailCell = document.createElement('td');
    const emailInput = document.createElement('input'); emailInput.className = 'form-control form-control-sm'; emailInput.type = 'email'; emailInput.value = u.email; emailInput.setAttribute('aria-label', `Email de ${u.nombre}`); emailCell.append(emailInput);
    row.append(nombreCell, emailCell);
    const rol = document.createElement('td'); const select = document.createElement('select'); select.className = 'form-select form-select-sm';
    ['usuario', 'admin'].forEach((r) => { const option = document.createElement('option'); option.value = r; option.textContent = r; option.selected = u.rol === r; select.append(option); });
    rol.append(select); row.append(rol);
    const acciones = document.createElement('td');
    acciones.append(accion('Guardar', 'btn-outline-primary', async () => {
      try {
        await api(`/usuarios/${u.id}`, { method: 'PUT', body: JSON.stringify({ nombre: nombreInput.value, email: emailInput.value, rol: select.value }) });
        aviso('#mensaje-admin', 'Usuario actualizado.'); await renderTablaUsuarios();
      } catch (error) { aviso('#mensaje-admin', error.message, 'danger'); }
    }), accion('Eliminar', 'btn-outline-danger', async () => {
      if (!confirm(`¿Eliminar el usuario ${u.email}?`)) return;
      try { await api(`/usuarios/${u.id}`, { method: 'DELETE' }); aviso('#mensaje-admin', 'Usuario eliminado.'); await renderTablaUsuarios(); }
      catch (error) { aviso('#mensaje-admin', error.message, 'danger'); }
    })); row.append(acciones); return row;
  });
  tabla('#admin-lista-usuarios', ['Nombre', 'Email', 'Rol', 'Acciones'], filas);
}

// Catálogo público y recuperación de sesión permiten abrir el sitio sin login.
cargarCatalogo();
cargarPerfil();
