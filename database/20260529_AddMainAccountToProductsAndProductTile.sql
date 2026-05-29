USE [CalisiaWriteDb];
GO

IF COL_LENGTH(N'[dbo].[Products]', N'MainAccount') IS NULL
BEGIN
    ALTER TABLE [dbo].[Products]
    ADD [MainAccount] BIT NULL;
END
GO

USE [CalisiaReadDb];
GO

IF COL_LENGTH(N'[dbo].[ProductTile]', N'MainAccount') IS NULL
BEGIN
    ALTER TABLE [dbo].[ProductTile]
    ADD [MainAccount] BIT NULL;
END
GO
