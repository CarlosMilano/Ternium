const {Router} = require("express");
const {getAllEployees} = require("../controllers/tasks.controller")

const router = Router();


// Empleados

router.get("/empleados", getAllEployees )

// Ficha de empleados

router.get("/ficha", )

router.put("/ficha", )




module.exports = router;