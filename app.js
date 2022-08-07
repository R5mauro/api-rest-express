
const inicioDebug = require("debug")("app:inicio");
// const dbDebug = require("debug")("app:db"); *ejemplo de otra variable de entorno*
const express = require("express");
const config = require("config");
const app = express();
const auth = require("./auth");
const Joi = require('joi');
const morgan = require("morgan");

app.use(express.json()); //requerido para hacer el put y poder recibir JSON
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

// Configuracion de entornos
console.log("aplicación: " + config.get("nombre"));
console.log("DB server: " + config.get("configDB.host"));
// middleware de tercero
if(app.get("env") === "development"){
    app.use(morgan("tiny"));
    // console.log("morgan habilitado");
    inicioDebug("Morgan está habilitado.");
}

// trabajos con la base de datos (ejemplo debug module)
// dbDebug("Conectando con la bd...")

app.use(function(req, res, next){
    // esta funcion es para demostrar cuando se ejecuta el middleware
    console.log("logging...");
    // si yo no pongo la linea siguiente, el cliente no recibe respuesta y el programa no continua
    next();
    // en definitiva, esto es para mostrar que el middleware se ejectuta entre la peticion del cliente y la respuesta del servidor
});

app.use(auth);

const usuarios = [
    {id: 1, nombre: "mauro"},
    {id: 2, nombre: "Pablo"},
    {id: 3, nombre: "Ana"},
]

// app.get(); //peticion
// app.post(); //envio de datos
// app.put(); //actualizacion
// app.delete(); //eliminacion

app.get("/", (req, res)=>{
    res.send("Hola, desde express");

});

app.get("/api/usuarios", (req, res)=>{
    res.send(usuarios)
})

app.get("/api/usuarios/:id", (req,res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send("El usuario no fue encontrado");
        return;
    }
    res.send(usuario);
});

app.post("/api/usuarios", (req, res)=>{
    const {error, value} = validarUsuario(req.body.nombre);

    if(!error){
        const usuario = {
            id:usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    }else{
        res.status(400).send(error.details[0].message);
    }  
});



app.put("/api/usuarios/:id", (req, res) =>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send("El usuario no fue encontrado");
        return;
    } 

    const {error, value} = validarUsuario(req.body.nombre);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }  
    usuario.nombre = value.nombre;
    res.send(usuario);
});


app.delete("/api/usuarios/:id", (req, res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send("El usuario no fue encontrado");
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuarios);
});

const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`escuchando en el puerto ${port}`);
})


function existeUsuario(id){
    return (usuarios.find(u=>u.id===Number.parseInt(id)));
}

function validarUsuario(name){
    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required()
    });
    return (schema.validate({ nombre: name }));

}