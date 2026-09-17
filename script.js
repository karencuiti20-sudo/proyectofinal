// =========================================================================
// 1. BASES DE DATOS SIMULADAS
// =========================================================================
const baseDatosUsuarios = [
    { documento: "12345678", nombre: "Juan Pérez", curso: "4° Informática" },
    { documento: "53180996", nombre: "Karen Cuitiño", curso: "3° Informática" },
    { documento: "55555555", nombre: "Carlos Rodríguez", curso: "1° EMP Electrónica" },
    { documento: "56234655", nombre: "Heidy Rocha", curso: "3° Informática" }
];

const usuariosPermitidos = {
    "admin": "admin123",
    "encargado": "utu2026"
};

const baseDatosPC = [
    { id: "CEI-00015", marca: "Positivo BGH", modelo: "SF30", tipo: "Notebook Ceibal", estado: "Disponible" },
    { id: "TAB-00002", marca: "Samsung", modelo: "Galaxy Tab", tipo: "Tablet", estado: "Activo" },
    { id: "CEI-00042", marca: "JP Sa Couto", modelo: "MG101A", tipo: "Notebook Ceibal", estado: "En Mantenimiento" },
    { id: "CEI-00046", marca: "JP Sa Couto", modelo: "MG101A", tipo: "Notebook Ceibal", estado: "Activo" }
];

const baseDatosHistorial = [
    { id: "14", usuario: "Juan Pérez", pc: "CEI-00015", fecha: "2026-03-28", estado: "Devuelto" },
    { id: "15", usuario: "Karen Cuitiño", pc: "TAB-00002", fecha: "2026-03-29", estado: "Activo" },
    { id: "20", usuario: "Heidy Rocha", pc: "CEI-00046", fecha: "2026-09-15", estado: "Activo" }
];

// =========================================================================
// 2. CONTROL DE SESIÓN Y VISTAS
// =========================================================================
window.handleLogin = function() {
    const userInput = document.getElementById('login-user').value.trim();
    const passInput = document.getElementById('login-pass').value.trim();
    const errorMsg = document.getElementById('login-error');

    if (usuariosPermitidos[userInput] && usuariosPermitidos[userInput] === passInput) {
        if (errorMsg) errorMsg.style.display = 'none';
        document.getElementById('view-login').classList.remove('active');
        document.getElementById('app-system').style.display = 'flex';
        document.getElementById('user-display-name').textContent = userInput;
        actualizarTodo();
    } else {
        if (errorMsg) errorMsg.style.display = 'block';
    }
};

window.handleLogout = function() {
    document.getElementById('app-system').style.display = 'none';
    document.getElementById('view-login').classList.add('active');
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
};

window.switchView = function(targetId) {
    const views = document.querySelectorAll('.content-view');
    views.forEach(v => v.classList.remove('active'));

    const activeView = document.getElementById(targetId);
    if (activeView) activeView.classList.add('active');

    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (item.getAttribute('data-target') === targetId) {
            item.classList.add('active');
            document.getElementById('current-path').textContent = item.querySelector('span').textContent;
        } else {
            item.classList.remove('active');
        }
    });
};

// =========================================================================
// 3. RENDERING DE TABLAS Y MÉTRICAS
// =========================================================================
window.actualizarDashboard = function() {
    const pcDisponibles = baseDatosPC.filter(pc => pc.estado === "Disponible").length;
    const pcPrestadas = baseDatosPC.filter(pc => pc.estado === "Activo" || pc.estado === "Prestado").length;
    const totalUsuarios = baseDatosUsuarios.length;
    const prestamosActivos = baseDatosHistorial.filter(h => h.estado === "Activo").length;

    // Dashboard UI
    if (document.getElementById('dash-pc-disponibles')) document.getElementById('dash-pc-disponibles').textContent = pcDisponibles;
    if (document.getElementById('dash-pc-prestadas')) document.getElementById('dash-pc-prestadas').textContent = pcPrestadas;
    if (document.getElementById('dash-total-usuarios')) document.getElementById('dash-total-usuarios').textContent = totalUsuarios;
    if (document.getElementById('dash-prestamos-activos')) document.getElementById('dash-prestamos-activos').textContent = prestamosActivos;

    // Reportes UI
    if (document.getElementById('rep-total-prestamos')) document.getElementById('rep-total-prestamos').textContent = baseDatosHistorial.length;
    if (document.getElementById('rep-prestamos-activos')) document.getElementById('rep-prestamos-activos').textContent = prestamosActivos;
    if (document.getElementById('rep-equipos-disponibles')) document.getElementById('rep-equipos-disponibles').textContent = pcDisponibles;
    if (document.getElementById('rep-total-usuarios')) document.getElementById('rep-total-usuarios').textContent = totalUsuarios;
};

window.actualizarTablaUsuarios = function() {
    const tbody = document.getElementById('tabla-usuarios-body');
    if (!tbody) return;
    tbody.innerHTML = "";

    baseDatosUsuarios.forEach((u, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${u.documento}</td>
            <td>${u.nombre}</td>
            <td>${u.curso}</td>
            <td>
                <i class="fas fa-edit text-blue" style="cursor:pointer; margin-right: 12px;" onclick="editarUsuario('${u.documento}')" title="Editar"></i>
                <i class="fas fa-trash text-red" style="cursor:pointer;" onclick="eliminarUsuario(${index})" title="Eliminar"></i>
            </td>
        `;
        tbody.appendChild(fila);
    });
};

window.actualizarTablaPC = function() {
    const tbody = document.getElementById('tabla-pc-body');
    if (!tbody) return;
    tbody.innerHTML = "";

    baseDatosPC.forEach((pc, index) => {
        let badgeClass = "badge-green";
        if (pc.estado === "Prestado" || pc.estado === "Activo") {
            badgeClass = "badge-red";
        } else if (pc.estado === "En Mantenimiento") {
            badgeClass = "badge-yellow";
        }

        const iconoTipo = pc.tipo === "Tablet" ? "fa-tablet-alt" : "fa-laptop";

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${pc.id}</td>
            <td>${pc.marca}</td>
            <td>${pc.modelo}</td>
            <td><i class="fas ${iconoTipo}"></i> ${pc.tipo}</td>
            <td><span class="badge ${badgeClass}">${pc.estado}</span></td>
            <td>
                <i class="fas fa-edit text-blue" style="cursor:pointer; margin-right: 12px;" onclick="editarPC('${pc.id}')" title="Editar"></i>
                <i class="fas fa-trash text-red" style="cursor:pointer;" onclick="eliminarPC(${index})" title="Eliminar"></i>
            </td>
        `;
        tbody.appendChild(fila);
    });
};

window.actualizarTablaHistorial = function() {
    const tbody = document.getElementById('tabla-historial-body');
    if (!tbody) return;
    tbody.innerHTML = "";

    baseDatosHistorial.forEach((h, index) => {
        const badgeClass = h.estado === "Devuelto" ? "badge-green" : "badge-red";
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${h.id}</td>
            <td>${h.usuario}</td>
            <td>${h.pc}</td>
            <td>${h.fecha}</td>
            <td><span class="badge ${badgeClass}">${h.estado}</span></td>
            <td>
                <i class="fas fa-edit text-blue" style="cursor:pointer; margin-right: 12px;" onclick="editarHistorial('${h.id}')" title="Editar"></i>
                <i class="fas fa-trash text-red" style="cursor:pointer;" onclick="eliminarHistorial(${index})" title="Eliminar"></i>
            </td>
        `;
        tbody.appendChild(fila);
    });
};

function actualizarTodo() {
    actualizarDashboard();
    actualizarTablaUsuarios();
    actualizarTablaPC();
    actualizarTablaHistorial();
}

// =========================================================================
// 4. FUNCIONES DE EDICIÓN Y ELIMINACIÓN (SIN DIV / PROMPT SECUENCIAL)
// =========================================================================

// --- USUARIOS ---
window.editarUsuario = function(doc) {
    const usuario = baseDatosUsuarios.find(u => u.documento === doc);
    if (!usuario) return;

    const nuevoNombre = prompt("Nombre completo:", usuario.nombre);
    if (nuevoNombre === null) return;

    const nuevoCurso = prompt("Curso:", usuario.curso);
    if (nuevoCurso === null) return;

    if (nuevoNombre.trim() !== "") usuario.nombre = nuevoNombre.trim();
    if (nuevoCurso.trim() !== "") usuario.curso = nuevoCurso.trim();

    actualizarTodo();
};

window.eliminarUsuario = function(index) {
    if (confirm(`¿Deseas eliminar a ${baseDatosUsuarios[index].nombre}?`)) {
        baseDatosUsuarios.splice(index, 1);
        actualizarTodo();
    }
};

// --- EQUIPOS (PC / TABLET) ---
window.editarPC = function(id) {
    const pc = baseDatosPC.find(p => p.id === id);
    if (!pc) return;

    const nuevaMarca = prompt("Marca:", pc.marca);
    if (nuevaMarca === null) return;

    const nuevoModelo = prompt("Modelo:", pc.modelo);
    if (nuevoModelo === null) return;

    const nuevoTipo = prompt("Tipo (Notebook Ceibal, Tablet, etc.):", pc.tipo);
    if (nuevoTipo === null) return;

    const nuevoEstado = prompt("Estado (Disponible / Activo / En Mantenimiento):", pc.estado);
    if (nuevoEstado === null) return;

    if (nuevaMarca.trim() !== "") pc.marca = nuevaMarca.trim();
    if (nuevoModelo.trim() !== "") pc.modelo = nuevoModelo.trim();
    if (nuevoTipo.trim() !== "") pc.tipo = nuevoTipo.trim();
    if (nuevoEstado.trim() !== "") pc.estado = nuevoEstado.trim();

    actualizarTodo();
};

window.eliminarPC = function(index) {
    if (confirm(`¿Deseas eliminar el equipo ${baseDatosPC[index].id}?`)) {
        baseDatosPC.splice(index, 1);
        actualizarTodo();
    }
};

// --- HISTORIAL DE PRÉSTAMOS ---
window.editarHistorial = function(id) {
    const registro = baseDatosHistorial.find(h => h.id === id);
    if (!registro) return;

    const nuevoUsuario = prompt("Usuario del préstamo:", registro.usuario);
    if (nuevoUsuario === null) return;

    const nuevoEquipo = prompt("N° Inventario del equipo (PC/Tablet):", registro.pc);
    if (nuevoEquipo === null) return;

    const nuevaFecha = prompt("Fecha (AAAA-MM-DD):", registro.fecha);
    if (nuevaFecha === null) return;

    const nuevoEstado = prompt("Estado del préstamo (Activo / Devuelto):", registro.estado);
    if (nuevoEstado === null) return;

    if (nuevoUsuario.trim() !== "") registro.usuario = nuevoUsuario.trim();
    if (nuevoEquipo.trim() !== "") registro.pc = nuevoEquipo.trim();
    if (nuevaFecha.trim() !== "") registro.fecha = nuevaFecha.trim();
    if (nuevoEstado.trim() !== "") registro.estado = nuevoEstado.trim();

    actualizarTodo();
};

window.eliminarHistorial = function(index) {
    if (confirm(`¿Deseas eliminar el registro N° ${baseDatosHistorial[index].id}?`)) {
        baseDatosHistorial.splice(index, 1);
        actualizarTodo();
    }
};

// =========================================================================
// 5. REGISTRAR PRÉSTAMO Y DEVOLUCIÓN
// =========================================================================
window.buscarUsuarioPrestamo = function() {
    const docInput = document.getElementById('search-doc').value.trim();
    const inputNombre = document.getElementById('res-nombre');
    const inputCurso = document.getElementById('res-curso');

    if (!docInput) {
        alert("Por favor, ingrese un número de documento.");
        return;
    }

    const usuarioEncontrado = baseDatosUsuarios.find(u => u.documento === docInput);

    if (usuarioEncontrado) {
        inputNombre.value = usuarioEncontrado.nombre;
        inputCurso.value = usuarioEncontrado.curso;
    } else {
        alert("Usuario no encontrado en el sistema.");
        inputNombre.value = "";
        inputCurso.value = "";
    }
};

window.guardarPrestamo = function() {
    const doc = document.getElementById('search-doc').value.trim();
    const nombre = document.getElementById('res-nombre').value;

    if (!nombre) {
        alert("Primero debes buscar y seleccionar un usuario válido.");
        return;
    }

    const pcDisponible = baseDatosPC.find(pc => pc.estado === "Disponible");

    if (!pcDisponible) {
        alert("No hay equipos disponibles en este momento.");
        return;
    }

    pcDisponible.estado = "Activo";

    const nuevoId = (baseDatosHistorial.length + 1).toString();
    const hoy = new Date().toISOString().split('T')[0];

    baseDatosHistorial.push({
        id: nuevoId,
        usuario: nombre,
        pc: pcDisponible.id,
        fecha: hoy,
        estado: "Activo"
    });

    alert(`¡Préstamo registrado exitosamente! Asignado equipo: ${pcDisponible.id}`);

    document.getElementById('search-doc').value = "";
    document.getElementById('res-nombre').value = "";
    document.getElementById('res-curso').value = "";
    actualizarTodo();
};

window.buscarPrestamoDevolucion = function() {
    const idPrestamo = document.getElementById('input-dev-prestamo').value.trim();
    
    if (!idPrestamo) {
        alert("Ingrese un N° de préstamo válido.");
        return;
    }

    const prestamo = baseDatosHistorial.find(h => h.id === idPrestamo && h.estado === "Activo");

    if (prestamo) {
        alert(`Préstamo encontrado: ${prestamo.usuario} tiene la PC ${prestamo.pc}`);
    } else {
        alert("No se encontró un préstamo activo con ese número.");
    }
};

window.confirmarDevolucion = function() {
    const idPrestamo = document.getElementById('input-dev-prestamo').value.trim();
    const prestamo = baseDatosHistorial.find(h => h.id === idPrestamo && h.estado === "Activo");

    if (!prestamo) {
        alert("Ingrese un N° de préstamo activo válido.");
        return;
    }

    prestamo.estado = "Devuelto";

    const pc = baseDatosPC.find(p => p.id === prestamo.pc);
    if (pc) {
        pc.estado = "Disponible";
    }

    alert("Devolución registrada correctamente.");
    document.getElementById('input-dev-prestamo').value = "";
    actualizarTodo();
};

// =========================================================================
// 6. EVENTOS DEL DOM
// =========================================================================
window.toggleModoOscuro = function() {
    document.body.classList.toggle('dark-mode');
};

window.guardarSeguridad = function(e) {
    e.preventDefault();
    const p1 = document.getElementById('cfg-pass-nueva').value;
    const p2 = document.getElementById('cfg-pass-confirm').value;

    if (p1 && p1 === p2) {
        alert("Contraseña actualizada con éxito.");
        document.getElementById('form-config-seguridad').reset();
    } else {
        alert("Las contraseñas no coinciden.");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const btnHamburger = document.getElementById('btn-hamburger');
    const sidebar = document.getElementById('sidebar');

    if (btnHamburger && sidebar) {
        btnHamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('collapsed');
        });
    }

    actualizarTodo();
});


window.actualizarDashboard = function() {
    const pcDisponibles = baseDatosPC.filter(pc => pc.estado === "Disponible").length;
    const pcPrestadas = baseDatosPC.filter(pc => pc.estado === "Activo" || pc.estado === "Prestado").length;
    const totalUsuarios = baseDatosUsuarios.length;
    
    // Obtener array de préstamos activos
    const listaActivos = baseDatosHistorial.filter(h => h.estado === "Activo");
    const prestamosActivos = listaActivos.length;

    // Métricas del Dashboard UI
    if (document.getElementById('dash-pc-disponibles')) document.getElementById('dash-pc-disponibles').textContent = pcDisponibles;
    if (document.getElementById('dash-pc-prestadas')) document.getElementById('dash-pc-prestadas').textContent = pcPrestadas;
    if (document.getElementById('dash-total-usuarios')) document.getElementById('dash-total-usuarios').textContent = totalUsuarios;
    if (document.getElementById('dash-prestamos-activos')) document.getElementById('dash-prestamos-activos').textContent = prestamosActivos;

    // Métricas de Reportes UI
    if (document.getElementById('rep-total-prestamos')) document.getElementById('rep-total-prestamos').textContent = baseDatosHistorial.length;
    if (document.getElementById('rep-prestamos-activos')) document.getElementById('rep-prestamos-activos').textContent = prestamosActivos;
    if (document.getElementById('rep-equipos-disponibles')) document.getElementById('rep-equipos-disponibles').textContent = pcDisponibles;
    if (document.getElementById('rep-total-usuarios')) document.getElementById('rep-total-usuarios').textContent = totalUsuarios;

    // Renderizar listado detallado de activos en Reportes
    const tbodyReportes = document.getElementById('tabla-reportes-activos-body');
    if (tbodyReportes) {
        tbodyReportes.innerHTML = "";
        
        if (listaActivos.length === 0) {
            tbodyReportes.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay préstamos activos actualmente.</td></tr>`;
        } else {
            listaActivos.forEach(h => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${h.id}</td>
                    <td>${h.usuario}</td>
                    <td>${h.pc}</td>
                    <td>${h.fecha}</td>
                    <td><span class="badge badge-red">${h.estado}</span></td>
                `;
                tbodyReportes.appendChild(fila);
            });
        }
    }
};

// =========================================================================
// 7. PARÁMETROS DE CONFIGURACIÓN Y REGLAS DINÁMICAS
// =========================================================================

// Configuración global del sistema
let configuracionSistema = {
    diasMaximos: 30,
    limiteEquipos: 1
};

// Función para actualizar parámetros desde el formulario de Configuración
window.guardarParametros = function(e) {
    if (e) e.preventDefault();
    
    const dias = parseInt(document.getElementById('param-dias').value);
    const limite = parseInt(document.getElementById('param-limite').value);

    if (isNaN(dias) || dias < 1 || isNaN(limite) || limite < 1) {
        alert("Por favor, ingrese valores válidos.");
        return;
    }

    configuracionSistema.diasMaximos = dias;
    configuracionSistema.limiteEquipos = limite;

    alert("¡Parámetros de préstamo actualizados exitosamente!");
};