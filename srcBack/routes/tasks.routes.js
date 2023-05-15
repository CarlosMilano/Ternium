const {Router} = require("express");
const {getAllEmployees} = require("../controllers/tasks.controller")

const router = Router();


// Empleados

router.get("/empleados", getAllEmployees)

// Ficha de empleados

router.get("/ficha", )

router.put("/ficha", )



module.exports = router;