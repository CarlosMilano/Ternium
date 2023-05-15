const {Router} = require("express");
const {getAllEmployees, getTablas, updateTablaEmpleado} = require("../controllers/tasks.controller")

const router = Router();


// Empleados

router.get("/empleados", getAllEmployees)

// Ficha de empleados

router.get("/ficha", getTablas)

router.put("/ficha/:id_empleado", updateTablaEmpleado)



module.exports = router;