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
    habilitado?: boolean;
    cet?: string;
    idm4: string;
};
export type TableTrayectoria = {
    id_trayectoria: number;
    empresa?: string;
    puesto?: string;
    id_empleado: number;
};
export type TableComentarios = {
    id_comentario: number;
    nota?: number;
    promedio_notas?: number;
    comentario?: string;
    id_empleado: number;
};
export type TableResumen = {
    id_resumen: number;
    resumen_perfil?: string;
    id_empleado: number;
};
export type TableEvaluacion = {
    id_evaluacion: number;
    año?: number;
    performance?: number;
    potencial?: number;
    curva?: string;
    id_empleado: number;
};
