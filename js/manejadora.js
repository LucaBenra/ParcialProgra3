// --- VARIABLES GLOBALES Y URL DE LA API ---
const API_URL = "https://utnfra-api-pinturas.onrender.com/pinturas";

// --- SELECTORES DEL DOM ---
// funcion para no escribir document.getElementById a cada rato
const get = (id) => document.getElementById(id);
const spinner = get("spinner");
const frmFormulario = get("frmFormulario");
const divListado = get("divListado");
const btnAgregar = get("btnAgregar");
const btnModificar = get("btnModificar");
const btnLimpiar = get("btnLimpiar");
const themeToggle = get("themeToggle");

// --- MANEJO DEL SPINNER ---
// funcion que muestra u oculta el spinner
const showSpinner = (show) => {
    spinner.classList.toggle("d-none", !show);
};

// --- FUNCION GENERICA PARA FETCH ---
// esta funcion hace los pedidos a la api GET POST PUT DELETE
const apiRequest = async (url, method = 'GET', data = null) => {
    // muestra el spinner antes de empezar
    showSpinner(true);
    try {
        // preparo las opciones del fetch
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        // si hay datos los paso a JSON y los pongo en el body
        if (data) {
            options.body = JSON.stringify(data);
        }
        // hago el pedido fetch
        const response = await fetch(url, options);
        // si la respuesta no es ok tiro un error
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        // si es un DELETE no devuelve nada asi que solo confirmo
        if (method.toUpperCase() === 'DELETE') {
            return { success: true };
        }
        // si todo sale bien devuelvo el JSON
        return await response.json();
    } catch (error) {
        // si hay un error muestro una alerta
        alert(`Error en la comunicacion con la API: ${error.message}`);
        return null;
    } finally {
        // al final de todo oculto el spinner
        showSpinner(false);
    }
};

// --- RENDERIZADO DE LA TABLA ---
// funcion que dibuja la tabla en el html
const renderizarListado = (data) => {
    if (!data) return;
    // creo el elemento tabla y le pongo clases
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-hover', 'table-bordered');

    // creo la cabecera de la tabla
    table.innerHTML = `
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Precio (USD)</th>
                <th>Color</th>
                <th>Cantidad</th>
                <th>Acciones</th>
            </tr>
        </thead>
    `;

    // creo el cuerpo de la tabla
    const tbody = document.createElement('tbody');
    // si no hay datos muestro un mensaje
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center">No hay pinturas para mostrar.</td></tr>`;
    } else {
        // si hay datos recorro el array y creo las filas
        data.forEach(item => {
            tbody.innerHTML += `
                <tr data-id="${item.id}">
                    <td>${item.id}</td>
                    <td>${item.marca}</td>
                    <td>$${parseFloat(item.precio).toFixed(2)}</td>
                    <td><input type="color" value="${item.color}" disabled></td>
                    <td>${item.cantidad}</td>
                    <td>
                        <button class="btn btn-sm btn-info btn-seleccionar" title="Seleccionar"><i class="bi bi-check-circle"></i></button>
                        <button class="btn btn-sm btn-danger btn-eliminar" title="Eliminar"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }
    // agrego el cuerpo a la tabla
    table.appendChild(tbody);
    // limpio el div y meto la tabla nueva
    divListado.innerHTML = '';
    divListado.appendChild(table);
};

// --- OBTENER LISTADO INICIAL Y LIMPIAR DATOS ---
const obtenerPinturas = async () => {
    // pido las pinturas a la api
    const data = await apiRequest(API_URL);
    // si la api devuelve algo
    if (data) {
        // limpio los datos que vienen de la api para evitar errores
        // filtro por precio no nulo que sea un numero entre 50 y 500 y que tenga marca
        const dataLimpia = data.filter(p => p.precio != null && !isNaN(parseFloat(p.precio)) && parseFloat(p.precio) >= 50 && parseFloat(p.precio) <= 500 && p.marca);

        // ordeno por id para que el mas nuevo este arriba
        dataLimpia.sort((a, b) => b.id - a.id);

        // guardo los datos limpios en una variable global
        window.pinturasData = dataLimpia;
        // llamo a las funciones que dibujan todo
        renderizarListado(dataLimpia);
        renderizarEstadisticas(dataLimpia);
        actualizarDashboard(dataLimpia);
    }
};

// --- MANEJO DEL FORMULARIO ---
// funcion que valida el formulario con bootstrap
const validarFormulario = () => {
    frmFormulario.classList.add('was-validated');
    return frmFormulario.checkValidity();
};

// funcion que resetea la validacion
const resetValidacion = () => {
    frmFormulario.classList.remove('was-validated');
};

// funcion que limpia el formulario y lo prepara para un alta
const limpiarFormulario = () => {
    frmFormulario.reset();
    get('inputId').value = '';
    btnAgregar.classList.remove('d-none');
    btnModificar.classList.add('d-none');
    resetValidacion();
};

// funcion que carga los datos de una pintura en el form para modificar
const cargarFormulario = (item) => {
    get('inputId').value = item.id;
    get('inputMarca').value = item.marca;
    get('inputPrecio').value = item.precio;
    get('inputColor').value = item.color;
    get('inputCantidad').value = item.cantidad;

    btnAgregar.classList.add('d-none');
    btnModificar.classList.remove('d-none');

    // cambio a la pestaña del formulario
    cambiarTab('tab-formulario');
};

// --- EVENTO SUBMIT DEL FORMULARIO PARA ALTA Y MODIFICACION ---
frmFormulario.addEventListener('submit', async (e) => {
    // prevengo el comportamiento por defecto del form
    e.preventDefault();
    e.stopPropagation();

    // valido el formulario
    if (!validarFormulario()) {
        alert("Por favor complete todos los campos correctamente.");
        return;
    }

    const id = get('inputId').value;
    // creo el objeto pintura con los datos del form
    const pintura = {
        marca: get('inputMarca').value,
        precio: parseFloat(get('inputPrecio').value),
        color: get('inputColor').value,
        cantidad: parseInt(get('inputCantidad').value)
    };

    // si hay un id estamos modificando
    if (id) {
        const result = await apiRequest(`${API_URL}/${id}`, 'PUT', pintura);
        if (result) {
            alert("Pintura modificada con exito.");
            limpiarFormulario();
            await obtenerPinturas();
            cambiarTab('tab-listado');
        }
    } else { // si no hay id estamos agregando uno nuevo
        const result = await apiRequest(API_URL, 'POST', pintura);
        if (result) {
            alert("Pintura agregada con exito.");
            limpiarFormulario();
            await obtenerPinturas();
            cambiarTab('tab-listado');
        }
    }
});

// --- EVENTO CLICK EN LA TABLA PARA SELECCIONAR Y ELIMINAR ---
divListado.addEventListener('click', async (e) => {
    const target = e.target.closest('button');
    // si no se hizo clic en un boton cortamos
    if (!target) return;

    // obtengo el id de la fila
    const row = target.closest('tr');
    const id = row.dataset.id;

    // si es el boton de eliminar
    if (target.classList.contains('btn-eliminar')) {
        // pido confirmacion
        if (confirm(`Esta seguro de que desea eliminar la pintura con ID ${id}?`)) {
            // si confirma llamo a la api para borrar
            const result = await apiRequest(`${API_URL}/${id}`, 'DELETE');
            if (result) {
                alert("Pintura eliminada con exito.");
                await obtenerPinturas();
            }
        }
    }
    // si es el boton de seleccionar
    else if (target.classList.contains('btn-seleccionar')) {
        // busco la pintura en mi array de datos
        const pintura = window.pinturasData.find(p => p.id == id);
        if (pintura) {
            // cargo los datos en el formulario
            cargarFormulario(pintura);
        }
    }
});

// --- EVENTOS DE LOS BOTONES DE ACCION ---
get('btnFiltro').addEventListener('click', () => {
    const marca = get('filtroMarca').value.trim().toLowerCase();
    if (!marca) {
        renderizarListado(window.pinturasData);
        return;
    }
    const dataFiltrada = window.pinturasData.filter(p => p.marca.toLowerCase().includes(marca));
    renderizarListado(dataFiltrada);
});

get('btnPromedio').addEventListener('click', () => {
    const resultadoSpan = get('resultadoPromedio');
    const dataAUsar = window.pinturasData;
    if (!dataAUsar || dataAUsar.length === 0) {
        resultadoSpan.textContent = "No hay datos para calcular.";
        resultadoSpan.className = 'ms-3 badge bg-warning';
        return;
    }
    const total = dataAUsar.reduce((acc, p) => acc + parseFloat(p.precio), 0);
    const promedio = total / dataAUsar.length;
    resultadoSpan.textContent = `Promedio: $${promedio.toFixed(2)}`;
    resultadoSpan.className = 'ms-3 badge bg-success fs-6';
    setTimeout(() => {
        resultadoSpan.textContent = '';
        resultadoSpan.className = 'ms-3';
    }, 5000);
});

get('btnActualizar').addEventListener('click', obtenerPinturas);

btnLimpiar.addEventListener('click', limpiarFormulario);

get('btnExportar').addEventListener('click', () => {
    if (!window.pinturasData || window.pinturasData.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }
    const headers = ['ID', 'Marca', 'Precio', 'Color', 'Cantidad'];
    const csvContent = [
        headers.join(','),
        ...window.pinturasData.map(p => `${p.id},${p.marca},${p.precio},${p.color},${p.cantidad}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pinturas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// --- FUNCIONES DE ESTADISTICAS Y DASHBOARD ---
// funcion para actualizar los datos del dashboard de inicio
const actualizarDashboard = (data) => {
    if (!data || data.length === 0) return;
    const totalPinturas = data.length;
    get('stat-total-pinturas').textContent = totalPinturas;
    const totalPrecios = data.reduce((acc, p) => acc + parseFloat(p.precio), 0);
    const promedio = totalPrecios / totalPinturas;
    get('stat-precio-promedio').textContent = `$${promedio.toFixed(2)}`;
    const conteoMarcas = data.reduce((acc, p) => {
        acc[p.marca] = (acc[p.marca] || 0) + 1;
        return acc;
    }, {});
    const marcaMasComun = Object.keys(conteoMarcas).reduce((a, b) => conteoMarcas[a] > conteoMarcas[b] ? a : b, 'N/A');
    get('stat-marca-comun').textContent = marcaMasComun;
};

// funcion para renderizar el panel de estadisticas
const renderizarEstadisticas = (data) => {
    const statsContainer = get('statsContainer');
    if (!data || data.length === 0) {
        statsContainer.innerHTML = '<p class="text-center">No hay datos para mostrar estadisticas.</p>';
        return;
    }
    const totalPinturas = data.length;
    const pinturaMasCara = data.reduce((a, b) => parseFloat(a.precio) > parseFloat(b.precio) ? a : b);
    const promedioGeneral = data.reduce((acc, p) => acc + parseFloat(p.precio), 0) / totalPinturas;
    const conteoMarcas = data.reduce((acc, p) => {
        acc[p.marca] = (acc[p.marca] || 0) + 1;
        return acc;
    }, {});
    const marcaMasComun = Object.keys(conteoMarcas).reduce((a, b) => conteoMarcas[a] > conteoMarcas[b] ? a : b);
    get('stats-total').textContent = totalPinturas;
    get('stats-mas-cara').textContent = `$${parseFloat(pinturaMasCara.precio).toFixed(2)}`;
    get('stats-promedio').textContent = `$${promedioGeneral.toFixed(2)}`;
    get('stats-marca-comun').textContent = marcaMasComun;
    const tbodyPromedios = get('stats-promedio-marca-body');
    tbodyPromedios.innerHTML = '';
    const pinturasPorMarca = data.reduce((acc, p) => {
        if (!acc[p.marca]) {
            acc[p.marca] = [];
        }
        acc[p.marca].push(p);
        return acc;
    }, {});
    for (const marca in pinturasPorMarca) {
        const pinturas = pinturasPorMarca[marca];
        const totalMarca = pinturas.reduce((acc, p) => acc + parseFloat(p.precio), 0);
        const promedioMarca = totalMarca / pinturas.length;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${marca}</td>
            <td>$${promedioMarca.toFixed(2)}</td>
        `;
        tbodyPromedios.appendChild(tr);
    }
};

// --- MANEJO DE TEMA (MODO OSCURO) Y PESTAÑAS ---
// funcion que aplica el tema oscuro o claro
const aplicarTema = (theme) => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.checked = theme === 'dark';
};

// evento para el boton de cambiar tema
themeToggle.addEventListener('change', () => {
    aplicarTema(themeToggle.checked ? 'dark' : 'light');
});

// funcion que maneja el cambio de pestañas
const cambiarTab = (tabId) => {
    document.querySelectorAll('.tab-pane').forEach(tab => {
        tab.classList.add('d-none');
        tab.classList.remove('active');
    });
    get(tabId).classList.remove('d-none');
    get(tabId).classList.add('active');
    document.querySelectorAll('[data-tab]').forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
};

// evento para los links de navegacion
document.querySelectorAll('[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarTab(e.currentTarget.dataset.tab);
    });
});

// --- INICIALIZACION DE LA APLICACION ---
// cuando el DOM este cargado
document.addEventListener('DOMContentLoaded', () => {
    // aplico el tema guardado en el local storage
    const temaGuardado = localStorage.getItem('theme') || 'light';
    aplicarTema(temaGuardado);
    // obtengo las pinturas por primera vez
    obtenerPinturas();
    // establezco la pestaña de inicio como la principal
    cambiarTab('tab-inicio');
});