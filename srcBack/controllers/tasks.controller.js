const db = require("../db");


// Empleados

const getAllEployees = async (req, res) => {
    try{
        const allEmployees = await db.query("SELECT * FROM empleado")
    res.json(allEmployees.rows)
    } catch(error){
        console.log(error.message);
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
    getAllEployees
}