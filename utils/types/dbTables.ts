export type TableEmpleado = {
    id_empleado: number;
    nombre?: string;
    edad?: number;
    antiguedad?: number;
    estudios?: string;
    universidad?: string;
    area_manager?: string;
    direccion?: string;
    puesto?: string;
    pc_cat?: string;
};
export type TableTrayectoria = {
    id_trayectoria?: string;
    empresa?: string;
    puesto?: string;
    id_empleado?: string;
};
export type TableComentarios = {
    id_comentario?: string;
    nota?: number;
    promedio_notas?: number;
    comentario?: string;
    id_empleado?: string;
};
export type TableResumen = {
    id_resumen?: string;
    resumen_perfil?: string;
    id_empleado?: string;
};
export type TableEvaluacion = {
    id_evaluacion?: string;
    anio?: number;
    performance?: number;
    potencial?: number;
    curva?: string;
    id_empleado?: string;
};
