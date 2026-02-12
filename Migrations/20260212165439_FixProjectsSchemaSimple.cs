using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyPortfolio.Migrations
{
    /// <inheritdoc />
    public partial class FixProjectsSchemaSimple : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add missing columns to Projects table that EF expects
            // These should have been added by previous migrations but got messed up
            
            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Projects' AND COLUMN_NAME = 'TitleEn'
                )
                BEGIN
                    ALTER TABLE [Projects] ADD [TitleEn] nvarchar(max) NULL
                END");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Projects' AND COLUMN_NAME = 'TitleFr'
                )
                BEGIN
                    ALTER TABLE [Projects] ADD [TitleFr] nvarchar(max) NULL
                END");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Projects' AND COLUMN_NAME = 'DescriptionEn'
                )
                BEGIN
                    ALTER TABLE [Projects] ADD [DescriptionEn] nvarchar(max) NOT NULL DEFAULT ''
                END");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Projects' AND COLUMN_NAME = 'DescriptionFr'
                )
                BEGIN
                    ALTER TABLE [Projects] ADD [DescriptionFr] nvarchar(max) NOT NULL DEFAULT ''
                END");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Projects' AND COLUMN_NAME = 'ImageUrl'
                )
                BEGIN
                    ALTER TABLE [Projects] ADD [ImageUrl] nvarchar(max) NULL
                END");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // No Down operation - we just added columns
        }
    }
}
