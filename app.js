
const inicioDebug = require("debug")("app:inicio");
// const dbDebug = require("debug")("app:db"); *ejemplo de otra variable de entorno*
const express = require("express");
const config = require("config");
const app = express();
const usuarios = require("./routes/usuarios");
const auth = require("./auth");
const morgan = require("morgan");


app.use(express.json()); //requerido para hacer el put y poder recibir JSON
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use("/api/usuarios", usuarios);//cuando se invoca esa ruta, se usan las funciones que estan en "usuarios"

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
// dbDebug("Conectando con la bd...");

app.use(function(req, res, next){
    // esta funcion es para demostrar cuando se ejecuta el middleware
    console.log("logging...");
    // si yo no pongo la linea siguiente, el cliente no recibe respuesta y el programa no continua
    next();
    // en definitiva, esto es para mostrar que el middleware se ejectuta entre la peticion del cliente y la respuesta del servidor
});

app.use(auth);

// app.get(); //peticion
// app.post(); //envio de datos
// app.put(); //actualizacion
// app.delete(); //eliminacion

app.get("/", (req, res)=>{
    res.send("Hola, desde express");

});



const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`escuchando en el puerto ${port}`);
})


