import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});

export const alertas = {
    async confirmar({
        titulo,
        texto,
        textoConfirmar = 'Sí',
        textoCancelar = 'Cancelar',
    }) {
        const result = await Swal.fire({
            title: titulo,
            text: texto,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: textoConfirmar,
            cancelButtonText: textoCancelar,
            confirmButtonColor: '#EE6055',
            cancelButtonColor: '#636E72',
            reverseButtons: true,
        });
        return result.isConfirmed;
    },

    exito(mensaje) {
        Toast.fire({ icon: 'success', title: mensaje });
    },

    error(mensaje) {
        Toast.fire({ icon: 'error', title: mensaje });
    },

    errorGrande({ titulo = 'Error', texto }) {
        return Swal.fire({
            title: titulo,
            text: texto,
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#EE6055',
        });
    },
};