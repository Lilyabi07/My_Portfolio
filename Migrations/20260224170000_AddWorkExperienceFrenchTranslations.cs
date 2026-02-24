using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using MyPortfolio.Data;

#nullable disable

namespace MyPortfolio.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260224170000_AddWorkExperienceFrenchTranslations")]
    public partial class AddWorkExperienceFrenchTranslations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompanyFr",
                table: "WorkExperiences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionFr",
                table: "WorkExperiences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PositionFr",
                table: "WorkExperiences",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyFr",
                table: "WorkExperiences");

            migrationBuilder.DropColumn(
                name: "DescriptionFr",
                table: "WorkExperiences");

            migrationBuilder.DropColumn(
                name: "PositionFr",
                table: "WorkExperiences");
        }
    }
}
