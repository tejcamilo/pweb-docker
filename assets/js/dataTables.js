$(document).ready(function () {

    // Para ordenar los cards por estado. Primero habilitados
    $.fn.dataTable.ext.order['estado-orden'] = function (settings, colIndex) {
        return settings.aoData.map(function (row) {
            const cell = $(row.anCells[colIndex]);
            const estado = cell.data('estado');
            return estado === true || estado === "true" ? 0 : 1; // Habilitados (0), Inhabilitados (1)
        });
    };

    var table = $('#tablaActividades').DataTable({
        columns: [
            { data: 'cards' },
            { data: 'estado', visible: false } // Estado, oculto pero necesario para ordenar
        ],
        columnDefs: [
            { targets: 1, orderDataType: 'estado-orden' } // Ordenar por estado
        ],
        order: [[1, 'asc']], // Ordenar por estado
        paging: true, // Habilitar paginación
        searching: true, // Habilitar búsqueda
        info: false, // Ocultar información del estado
        pageLength: 10, // Número de elementos por página
        lengthChange: false, // Ocultar selector de "mostrar x registros"
        dom: '<"top"f>rt<"bottom"lp><"clear">', // Personaliza el DOM de DataTables
        language: {
            search: "Buscar:",
            paginate: {
                next: "Siguiente",
                previous: "Anterior"
            },
            emptyTable: "No hay datos disponibles",
            zeroRecords: "No se encontraron resultados",
        },
        autoWidth: false, // Evitar estilos automáticos de ancho
    });
});