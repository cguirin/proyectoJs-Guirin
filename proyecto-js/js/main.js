/*
 COMENTARIOS IMPORTANTES :
 1) Dejé comentados los console.log porque me sirvieron de guía para ver en consola cómo iba con mi trabajo.
 2) Utilicé un servidor local creado y simulando un backend, pero cuando se ejecute esta aplicación, se debe instalar en consola: npm install -D json-server y luego ejecutar npx json-server proyecto-js/src/datos.json --watch.
 3) Por último, en la carpeta "src",  se encuentra un archivo llamado datos.json, el cual es el servidor local funcionando y donde se visualizan las personas que utilizan la calculadora.
*/

class Persona {
    constructor(nombre, apellido, peso, altura) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.peso = peso;
        this.altura = altura;
        this.imc = Math.round((peso / ((altura / 100) * (altura / 100))) * 10) / 10;
    }

    getNombreCompleto() {
        return `${this.nombre} ${this.apellido}`;
    }

    toJSON() {
        return {
            nombre: this.nombre,
            apellido: this.apellido,
            peso: this.peso,
            altura: this.altura,
            imc: this.imc,
        };
    }
}

const personasJSON = localStorage.getItem("personas");
const personas = personasJSON ? [...JSON.parse(personasJSON)].map(data => new Persona(data.nombre, data.apellido, data.peso, data.altura)) : [];
// console.log('Datos del localStorage:', personas);

async function enviarDatosAlServidor(persona) {
    const urlServidor = 'http://localhost:3000/personas';

    try {
        const response = await fetch(urlServidor, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(persona),
        });

        if (!response.ok) {
            console.error('Error al enviar los datos al servidor:', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud POST:', error);
    }
}

document.querySelector('#calcular').addEventListener("click", async function (event) {
    event.preventDefault();

    const nombre = document.querySelector("#nombre").value;
    const apellido = document.querySelector("#apellido").value;
    const peso = parseFloat(document.querySelector("#peso").value);
    const altura = parseFloat(document.querySelector("#altura").value);
    const persona = new Persona(nombre, apellido, peso, altura);

    const imc = persona.imc;
    const resultado =
        imc < 18.5 ? "Bajo peso" :
            imc < 25 ? "Peso Normal" :
                imc < 30 ? "Sobrepeso" :
                    imc <= 40 ? "Obesidad" :
                        "Obesidad Mórbida";

    // Mensaje con los resultados y datos del usuario
    document.querySelector("#resultado").innerText = `Tu IMC es: ${imc} - ${resultado}`;
    document.querySelector("#datos-persona").innerHTML = `Nombre completo: ${persona.getNombreCompleto()}, peso: ${persona.peso} kg, altura: ${persona.altura} cm`;

    // Muestro los resultados durante 9 segundos antes de enviar los datos al servidor
    await mostrarResultadosPorTiempo(9000);

    // Utilice el servidor local json-server, para que se pueda levantar dicho servidor en http://localhost:3000/ con su respectivo endpoint y, luego llame al fetch para enviar datos al servidor
    await enviarDatosAlServidor(persona);

    return false;
});

async function mostrarResultadosPorTiempo(tiempo) {
    return new Promise(resolve => {
        const resultadoElement = document.querySelector("#resultado");
        const datosPersonaElement = document.querySelector("#datos-persona");

        // Muestro los resultados
        resultadoElement.style.visibility = 'visible';
        datosPersonaElement.style.visibility = 'visible';

        // Después de 9 segundos, oculta los resultados y se recarga el formulario para que vuelva a realizarse una consulta
        setTimeout(() => {
            resultadoElement.style.visibility = 'hidden';
            datosPersonaElement.style.visibility = 'hidden';
            resolve();
        }, tiempo);
    });
}

document.querySelector("#consultaPrivada").addEventListener("click", async function () {
    Swal.fire({
        title: "Realizar Consulta Privada",
        text: "¿Desea iniciar una consulta privada por WhatsApp?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            window.open("https://wa.me/tunumero", "_blank");
        }
    });
});

const personasConCondicionesIMC = personas.filter(persona => {
    return persona.imc > 40 || persona.imc < 18.5 || (persona.imc >= 30 && persona.imc <= 40);
});

generarPlanNutricional(personasConCondicionesIMC)();


function generarPlanNutricional(personas) {
    return function () {
        personas.forEach(persona => {
            // console.log(`Plan nutricional para ${persona.getNombreCompleto()}, ${persona.peso} kg y ${persona.altura} cm de altura:`);
        });
    };
}


