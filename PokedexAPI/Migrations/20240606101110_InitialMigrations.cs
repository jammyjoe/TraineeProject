using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokedexAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "pokemon_type",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false),
                    type_name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pokemon_type", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "pokemon",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(256)", unicode: false, maxLength: 256, nullable: false),
                    type1_id = table.Column<int>(type: "int", nullable: false),
                    type2_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pokemon", x => x.id);
                    table.ForeignKey(
                        name: "FK_pokemon_pokemon_type_type2_id",
                        column: x => x.type2_id,
                        principalTable: "pokemon_type",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_type_id",
                        column: x => x.type1_id,
                        principalTable: "pokemon_type",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "pokemon_strength",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    pokemon_id = table.Column<int>(type: "int", nullable: true),
                    type_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pokemon_strength", x => x.id);
                    table.ForeignKey(
                        name: "FK__pokemon_r__pokem__5441852A",
                        column: x => x.pokemon_id,
                        principalTable: "pokemon",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__pokemon_r__type___5535A963",
                        column: x => x.type_id,
                        principalTable: "pokemon_type",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "pokemon_weakness",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    pokemon_id = table.Column<int>(type: "int", nullable: true),
                    type_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pokemon_weakness", x => x.id);
                    table.ForeignKey(
                        name: "FK__pokemon_w__pokem__4D94879B",
                        column: x => x.pokemon_id,
                        principalTable: "pokemon",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__pokemon_w__weakn__4E88ABD4",
                        column: x => x.type_id,
                        principalTable: "pokemon_type",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_pokemon_type1_id",
                table: "pokemon",
                column: "type1_id");

            migrationBuilder.CreateIndex(
                name: "IX_pokemon_type2_id",
                table: "pokemon",
                column: "type2_id");

            migrationBuilder.CreateIndex(
                name: "IX_pokemon_resistance_pokemon_id",
                table: "pokemon_strength",
                column: "pokemon_id");

            migrationBuilder.CreateIndex(
                name: "IX_pokemon_resistance_type_id",
                table: "pokemon_strength",
                column: "type_id");

            migrationBuilder.CreateIndex(
                name: "IX_pokemon_weakness_pokemon_id",
                table: "pokemon_weakness",
                column: "pokemon_id");

            migrationBuilder.CreateIndex(
                name: "IX_pokemon_weakness_type_id",
                table: "pokemon_weakness",
                column: "type_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "pokemon_strength");

            migrationBuilder.DropTable(
                name: "pokemon_weakness");

            migrationBuilder.DropTable(
                name: "pokemon");

            migrationBuilder.DropTable(
                name: "pokemon_type");
        }
    }
}
