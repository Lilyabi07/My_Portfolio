using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyPortfolio.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectsI18n : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Projects",
                newName: "TitleFr");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Projects",
                newName: "TitleEn");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionFr",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "DescriptionFr",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "TitleFr",
                table: "Projects",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "TitleEn",
                table: "Projects",
                newName: "Description");
        }
    }
}
