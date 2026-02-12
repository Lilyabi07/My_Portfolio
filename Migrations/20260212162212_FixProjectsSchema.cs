using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyPortfolio.Migrations
{
    /// <inheritdoc />
    public partial class FixProjectsSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Fix the buggy migration: TitleEn column has description data, needs to be DescriptionFr
            // First, copy the data from the incorrectly named TitleEn to DescriptionFr
            migrationBuilder.Sql(
                "UPDATE [Projects] SET [DescriptionFr] = [TitleEn] WHERE [TitleEn] IS NOT NULL AND [DescriptionFr] IS NULL");

            // Now add TitleEn column with correct data (empty for now, will be populated from TitleFr or DescriptionFr)
            migrationBuilder.AddColumn<string>(
                name: "TitleEn_Correct",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            // Copy TitleFr to TitleEn_Correct as temporary content
            migrationBuilder.Sql(
                "UPDATE [Projects] SET [TitleEn_Correct] = [TitleFr]");

            // Drop the incorrectly named TitleEn column
            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "Projects");

            // Rename TitleEn_Correct to TitleEn
            migrationBuilder.RenameColumn(
                name: "TitleEn_Correct",
                table: "Projects",
                newName: "TitleEn");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverse the fix
            migrationBuilder.RenameColumn(
                name: "TitleEn",
                table: "Projects",
                newName: "TitleEn_Correct");

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql(
                "UPDATE [Projects] SET [TitleEn] = [DescriptionFr]");

            migrationBuilder.DropColumn(
                name: "TitleEn_Correct",
                table: "Projects");
        }
    }
}
