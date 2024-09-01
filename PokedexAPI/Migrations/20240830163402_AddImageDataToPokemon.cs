using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokedexAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddImageDataToPokemon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "image_data",
                table: "pokemon",
                type: "varbinary(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "image_data",
                table: "pokemon");
        }
    }
}
