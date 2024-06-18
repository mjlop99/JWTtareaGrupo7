// elementos de login
const login = document.getElementById('loginFormulario');
const passWordLogin = document.getElementById('loginContraseña');
const UserNameLogin = document.getElementById('loginUsuario');
// elementos de crear usuario formulario
const CrearCuentaFormulario = document.getElementById('CrearCuentaFormulario');
const crearCuentaCorreo = document.getElementById('crearCuentaCorreo');
const crearCuentaNombre = document.getElementById('crearCuentaNombre');
const crearCuentaApellido = document.getElementById('crearCuentaApellido');
const crearCuentaUsuario = document.getElementById('crearCuentaUsuario');
const crearCuentaContrasenia = document.getElementById('crearCuentaContrasenia');
// elementos de cambiar contraseña
const cambiarContraseniaFormulario = document.getElementById('cambiarContraseniaFormulario');
const cambiarContraseniaCorreo = document.getElementById('cambiarContraseniaCorreo');

// botones para navegar entre páginas
const cambiarContraseniaLogin = document.getElementById('cambiarContraseniaLogin');
const crearCuentaOpcion = document.getElementById('crearCuentaOpcionLogin');
const volverLogin = document.getElementsByClassName('volverLogin');
const notificacionOK = document.getElementById('notificacionOK');
const notificacionError = document.getElementById('notificacionError');
const notificacionRestricion = document.getElementById('notificacionRestricion');
const ingresarPaginaSecreto = document.getElementById('ingresarPaginaSecreto');



// vuelve visible el login
for (let i = 0; i < volverLogin.length; i++) {
    const element = volverLogin[i];
    element.addEventListener('click', (e) => {
        e.preventDefault();
        hacerInvisible(CrearCuentaFormulario);
        hacerInvisible(cambiarContraseniaFormulario);
        hacerVisible(login);
    });
}

// hace visible formulario para cambiar contraseñas
cambiarContraseniaLogin.addEventListener('click', (e) => {
    e.preventDefault();
    hacerInvisible(CrearCuentaFormulario);
    hacerInvisible(login);
    hacerVisible(cambiarContraseniaFormulario)
})
// hace visible formulario para cambiar contraseñas
crearCuentaOpcion.addEventListener('click', (e) => {
    e.preventDefault();
    hacerInvisible(cambiarContraseniaFormulario);
    hacerInvisible(login);
    hacerVisible(CrearCuentaFormulario)
})
const mostrarNotificacion = (notificacion, mensaje) => {
    notificacion.style.display = 'block';
    notificacion.style.opacity = '1';
    notificacion.textContent = mensaje;
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.display = 'none';
    }, 1500);
}

const hacerVisible = (element) => {
    element.style.display = 'flex'
}
const hacerInvisible = (element) => {
    element.style.display = 'none'
}

// buscar usuario
login.addEventListener('submit', async (e) => {
    e.preventDefault()
    let token;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombreUsuario: UserNameLogin.value,
                Password: passWordLogin.value,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            token=data.token;
            localStorage.setItem('token', token);
            mostrarNotificacion(notificacionOK, "Has iniciado sesión exitosamente");
            setTimeout(() => {
                location.href=`http://localhost:3000/api/auth/login/${token}`
            }, 1500);
        } else {
            mostrarNotificacion(notificacionError, "Error al iniciar sesión");
        }
    } catch (error) {
        throw new Error('Error al iniciar sesión el usuario');
    }

    
})

// crear un usuario
CrearCuentaFormulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Correo: crearCuentaCorreo.value,
                Nombre: crearCuentaNombre.value,
                Apellido: crearCuentaApellido.value,
                nombreUsuario: crearCuentaUsuario.value,
                Password: crearCuentaContrasenia.value,
            }),
        });

        if (response.ok) {
            mostrarNotificacion(notificacionOK, "Registro Exitoso!");
            setTimeout(() => {
                location.href="http://localhost:3000/"
            }, 1500);
        } else {
            throw new Error('Error al registrar usuario');
        }
    } catch (error) {
        mostrarNotificacion(notificacionError, "Error al registrar");
        console.error('Error al registrar usuario:', error);
    }
});



ingresarPaginaSecreto.addEventListener('click', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    location.href=`http://localhost:3000/api/auth/login/${token}`
});

cambiarContraseniaFormulario.addEventListener('submit',async (e)=>{
    e.preventDefault();

    hacerInvisible(CrearCuentaFormulario);
    hacerInvisible(login);
    hacerVisible(cambiarContraseniaFormulario)
    const response=await fetch("api/auth/forgot-password",{
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Correo: cambiarContraseniaCorreo.value,
            }),
    })
    if (response.ok) {
        mostrarNotificacion(notificacionOK,"se ha enviado un correo a tu correo")
        const data=response.json()
        localStorage.setItem('token',data.token)
    }else{
        mostrarNotificacion(notificacionError,"ha ocurrido un error")
    }

})


const crearUsuarios=()=>{
    
}
