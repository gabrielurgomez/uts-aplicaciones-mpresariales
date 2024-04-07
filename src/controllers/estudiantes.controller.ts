import { Request, Response } from 'express';
import { prisma } from "../libs/prisma"
import { estudiantes } from '@prisma/client';
import ExcelJS from 'exceljs';

export const consultarEstudiantes = async (req: Request, res: Response) => {
    try {

        let estudiantes: estudiantes[] = await prisma.estudiantes.findMany({
            include: {
                curso: true,
            }
        })
        if (estudiantes.length > 0) {
            let datos = [["NUM DOC", "NOMBRE", "EDAD", "CURSO"]];
            estudiantes.forEach(estudiante => {
                datos.push([estudiante.numeroDocumento, estudiante.nombre, estudiante.edad, (estudiante as any).curso.nombre])
            })
            //console.log(datos);
            let nombreArchivo = "estudiantes.xlsx";
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Estudiantes', { properties: { tabColor: { argb: 'FFC0000' } } });
            sheet.addRows(datos);
            await workbook.xlsx.writeFile(nombreArchivo);
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
        //se crea el estudiante con prisma
        let rta = await prisma.estudiantes.create({
            data: {
                numeroDocumento: numeroDocumento,
                nombre: nombre,
                telefono: telefono,
                idCurso: 1
            }
        })
        console.log(rta);
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