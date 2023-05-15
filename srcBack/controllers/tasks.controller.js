const db = require("../db");


// Empleados

const getAllEmployees = async (req, res) => {
    try {
        const allEmployees = await db.query("SELECT * FROM empleado")
        res.json(allEmployees.rows)
    } catch (error) {
        console.log(error.message);
    }
}

// Ficha de empleados

const getTablas = async (req, res) => {
    try {
        const allEmployees = await db.query("SELECT * FROM empleado, comentarios, evaluacion, resumen, trayectoria WHERE empleado.id_empleado = comentarios.id_comentario AND comentarios.id_comentario = evaluacion.id_evaluacion AND evaluacion.id_evaluacion = resumen.id_resumen AND resumen.id_resumen = trayectoria.id_trayectoria")
        res.json(allEmployees.rows)
    } catch (error) {
        console.log(error.message);
    }
}

const updateTablaEmpleado = async (req, res) => {
    const { id_empleado } = req.params;
    const { nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat} = req.body;

    const result = await db.query("UPDATE empleado SET nombre = $1, edad = $2, antiguedad = $3, universidad = $4, area_manager = $5, direccion = $6, puesto = $7, pc_cat = $8 WHERE id_empleado = $9 RETURNING *", 
    [nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat, id_empleado]);

    console.log(result)

    return res.json(result.rows[0])
}

const updateTablaComentario = async (req, res) => {
    const { id_comentario } = req.params;
    const { nota, promedio_notas, comentario} = req.body;

    const result = await db.query("UPDATE comentarios SET nota = $1, promedio_notas = $2, comentario = $3 WHERE id_comentario = $4 RETURNING *", 
    [nota, promedio_notas, comentario, id_comentario]);

    console.log(result)

    return res.json(result.rows[0])
}

const updateTablaEvaluacion = async (req, res) => {
    const { id_evaluacion } = req.params;
    const { año, performance, potencial, curva} = req.body;

    const result = await db.query("UPDATE evaluacion SET año = $1, performance = $2, potencial = $3, curva = $4 WHERE id_evaluacion = $5 RETURNING *", 
    [año, performance, potencial, curva, id_evaluacion]);

    console.log(result)

    return res.json(result.rows[0])
}

const updateTablaResumen = async (req, res) => {
    const { id_evaluacion } = req.params;
    const { resumen_perfil} = req.body;

    const result = await db.query("UPDATE resumen SET año = $1 WHERE id_resumen = $2 RETURNING *", 
    [resumen_perfil, id_evaluacion]);

    console.log(result)

    return res.json(result.rows[0])
}

const updateTablaTrayectoria = async (req, res) => {
    const { id_trayectoria } = req.params;
    const { empresa} = req.body;

    const result = await db.query("UPDATE trayectoria SET empresa = $1 WHERE id_resumen = $2 RETURNING *", 
    [empresa, id_trayectoria]);

    console.log(result)

    return res.json(result.rows[0])
}


module.exports = {
    getAllEmployees,
    getTablas,
    updateTablaEmpleado,
    updateTablaComentario,
    updateTablaEvaluacion,
    updateTablaResumen,
    updateTablaTrayectoria
}