/*
El siguiente script fue desarrollado por lo integrantes del grupo 1 de Integraci�n de Sistemas.


Fecha de creacion: 13-11-2024 21:40
�ltima versi�n: 13-11-2024 21:40

**********************************
-- Verificacion de existencia de la base de datos y creacion de la misma
**********************************
*/

-- Usar master para creaci�n de base.
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


-- Creaci�n de la tabla Tasks
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
VALUES (1, 'Revisar c�digo', 'Revisar el c�digo del m�dulo de usuarios', 'en progreso');

INSERT INTO Tasks (id, title, description, status)
VALUES (2, 'Crear documentaci�n', 'Generar documentaci�n t�cnica para el proyecto', 'pendiente');

INSERT INTO Tasks (id, title, description, status)
VALUES (3, 'Realizar pruebas', 'Ejecutar pruebas unitarias y de integraci�n', 'pendiente');

INSERT INTO Tasks (id, title, description, status)
VALUES (4, 'Depurar errores', 'Corregir errores detectados en la �ltima revisi�n', 'en progreso');

INSERT INTO Tasks (id, title, description, status)
VALUES (5, 'Implementar autenticaci�n', 'Agregar sistema de autenticaci�n de usuarios', 'completado');
