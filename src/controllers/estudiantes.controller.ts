import { Request, Response } from 'express';
import { pool } from '../db';
import { Estudiante } from '../interfaces';

let sqlCrearEstudiante = 'INSERT INTO estudiantes (numeroDocumento, nombre, telefono) VALUES (?, ?, ?)'
let sqlConsultarEstudiantes = 'SELECT * FROM estudiantes'
export const consultarEstudiantes = async (req: Request, res: Response) => {
    try {
        const { numeroDocumento, nombre, telefono } = req.body

        let rta: any = await pool.query(sqlConsultarEstudiantes, []);
        let estudiantes = rta[0];
        if (estudiantes.length > 0) {
            return res.status(200).json(estudiantes);
        } else {
            return res.status(204).json();
        }
    }
    catch (e) {
        console.log('error', e)
        return res.status(500).json({ message: `Ha ocurrido un error en el servidor, error=> ${e}` })
    }
}

export const crearEstudiante = async (req: Request, res: Response) => {
    console.log(req.body);
    const { numeroDocumento, nombre, telefono } = req.body;
    try {
        let [rta]: any = await pool.query(sqlCrearEstudiante, [numeroDocumento, nombre, telefono])
        console.log(rta)
        if (rta.affectedRows > 0) {
            return res.status(200).json({ message: 'Estudiante creado correctamente' })
        }
    } catch (error: unknown) {
        if (error instanceof Error && 'code' in error && 'sqlMessage' in error) {
            if (error.code == "ER_DUP_ENTRY") {
                return res.status(500).json({ mensaje: "Estudiante ya existe" });
            } else {
                return res.status(500).json({ mensaje: error.sqlMessage });
            }
        } else {
            console.log("Unknown error:", error);
            return res.status(500).json({ mensaje: "Ocurrió un error desconocido" });
        }
    }
}