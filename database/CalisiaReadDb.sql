USE master
GO

IF DB_ID(N'CalisiaReadDb') IS NULL
BEGIN
    CREATE DATABASE [CalisiaReadDb];
END
GO

USE [CalisiaReadDb];
GO
