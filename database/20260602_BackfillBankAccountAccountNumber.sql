USE [CalisiaWriteDb];
GO

IF COL_LENGTH(N'[dbo].[Products]', N'AccountNumber') IS NULL
BEGIN
    ALTER TABLE [dbo].[Products]
    ADD [AccountNumber] NVARCHAR(34) NULL;
END
GO

UPDATE [dbo].[Products]
SET [AccountNumber] = [ProductNumber]
WHERE [Discriminator] = N'BankAccount'
  AND ([AccountNumber] IS NULL OR LTRIM(RTRIM([AccountNumber])) = N'');
GO
