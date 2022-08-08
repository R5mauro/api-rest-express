const express = require("express");
const rutas = express.Router();
const Joi = require('joi');

const usuarios = [
    {id: 1, nombre: "mauro"},
    {id: 2, nombre: "Pablo"},
    {id: 3, nombre: "Ana"},
]

rutas.get("/", (req, res)=>{
    res.send(usuarios)
})

rutas.get("/:id", (req,res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send("El usuario no fue encontrado");
        return;
    }
    res.send(usuario);
});

rutas.post("/", (req, res)=>{
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



rutas.put("/:id", (req, res) =>{
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


rutas.delete("/:id", (req, res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send("El usuario no fue encontrado");
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuarios);
});


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


module.exports = rutas;