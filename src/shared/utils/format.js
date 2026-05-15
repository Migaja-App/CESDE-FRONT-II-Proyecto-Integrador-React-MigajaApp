// Este archivo de format.js es para estandarizar los formatos del proyecto entre ellos las fecha y la moneda. 


/* 

En la funcion de abajo de formato moneda 
uso el objeto Intl.NumberFormat de JavaScript para establecer
el tipo de moneda que vamos a trabajar en el proyecto la cual seran
los pesos colombiano (COP)

*/

export function formatoMoneda(monto) {
    return new Intl.NumberFormat( 
        'es-CO',
        {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }
    ).format(monto);
}


/* 

En esta funcion estoy estandarizando la fecha a una mas
amigable con el horario colombiano.


*/

export function formatoFecha(fechaString) {
    const fecha = new Date(fechaString + 'T00:00:00');
    return new Intl.DateTimeFormat(
        'es-CO',
        {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }
    ).format(fecha);
}

export function hoyIso() {
    return new Date().toISOString().split('T')[0];
}