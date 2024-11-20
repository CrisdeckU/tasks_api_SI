/*
El siguiente script fue desarrollado por lo integrantes del grupo 1 de Integración de Sistemas.


Fecha de creacion: 13-11-2024 21:40
Última versión: 13-11-2024 21:40

**********************************
-- Verificacion de existencia de la base de datos y creacion de la misma
**********************************
*/

-- Usar master para creación de base.
USE Master
GO

-- Verificar si la base de datos TasksManagementSI ya existe; si existe, eliminarla
IF EXISTS(SELECT name FROM sys.databases WHERE name = 'TasksManagementSI')
BEGIN
    DROP DATABASE TasksManagementSI;
END

CREATE DATABASE TasksManagementSI;
GO

-- Usar la base de datos TasksManagementSI
USE TasksManagementSI
GO


-- Creación de la tabla Tasks
CREATE TABLE Tasks (
    id INT PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(500),
    status NVARCHAR(50) CHECK (status IN ('pendiente', 'en progreso', 'completado')) NOT NULL
);

USE TasksManagementSI;
GO

-- Inserts para la tabla
INSERT INTO Tasks (id, title, description, status)
VALUES (1, 'Revisar código', 'Revisar el código del módulo de usuarios', 'en progreso');

INSERT INTO Tasks (id, title, description, status)
VALUES (2, 'Crear documentación', 'Generar documentación técnica para el proyecto', 'pendiente');

INSERT INTO Tasks (id, title, description, status)
VALUES (3, 'Realizar pruebas', 'Ejecutar pruebas unitarias y de integración', 'pendiente');

INSERT INTO Tasks (id, title, description, status)
VALUES (4, 'Depurar errores', 'Corregir errores detectados en la última revisión', 'en progreso');

INSERT INTO Tasks (id, title, description, status)
VALUES (5, 'Implementar autenticación', 'Agregar sistema de autenticación de usuarios', 'completado');
