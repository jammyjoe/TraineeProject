using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokedexAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<string>(
                name: "details",
                table: "pokemon",
                type: "varchar(max)",
                unicode: false,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "details",
                table: "pokemon",
                type: "varchar(max)",
                unicode: false,
                nullable: true);
        }
    }
}
