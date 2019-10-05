/**
 * Clase contenedora de opciones generales de las tablas dinamicas.
 * 
 * @export
 * @class OptionsTable
 * 
 */

export class OptionsTable {
    public options;
    constructor(
    ) {
        this.options = {
            pagingType: 'full_numbers',
            responsive: true,
            scrollY:        '40vh',
            scrollCollapse: true,
            paging:         true,
            language: {
                "lengthMenu":     "Mostrar _MENU_ registros",
                "zeroRecords":    "No se encontraron coincidencias",
                "info":           "<b>Total de registros: _TOTAL_</b> ",
                "infoEmpty":      "0 de un total de 0 registros",
                "infoFiltered":   "(filtrado de _MAX_ registros)",
                "paginate": {
                    "first":    "<i class='fas fa-less-than-equal'></i>",
                    "last":     "<i class='fas fa-greater-than-equal'></i>",
                    "next":     "<i class='fas fa-greater-than'></i>",
                    "previous": "<i class='fas fa-less-than'></i>"
                },
                "processing":     "<b>Procesando...</b>",
                "emptyTable":     "Ningún dato disponible en esta tabla",
                "search":         "<b>Buscar:</b>",
                "loadingRecords": "Cargando...",
            },
        };
    }
}