const db = require("../db");


// Empleados

const getAllEmployees = async (req, res) => {
    try{
        const allEmployees = await db.query("SELECT * FROM empleado")
    res.json(allEmployees.rows)
    } catch(error){
        console.log(error.message);
    }
}

const createEmployee = async (req, res) => {
    const { nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat} = req.body;

    try{
        const result = await db.query("INSERT INTO empleado (nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *", [nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat]);
    res.json(result.rows[0]);
    } catch(error){
        res.json({error : error.message});
    }
}

// Ficha de empleados

 (req, res) => {
    res.send("");
}

(req, res) => {
    res.send("");
}

module.exports = {
    getAllEmployees,
    createEmployee
}