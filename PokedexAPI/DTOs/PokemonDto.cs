using System.ComponentModel.DataAnnotations;
using PokedexAPI.DTOs;

namespace Pokedex.DTOs
{
    public record PokemonDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(50, ErrorMessage = "Name cannot be longer than 50 characters.")]
        public string Name { get; set; }
		public string? ImageUrl { get; set; }
        public byte[]? ImageData { get; set; } // Nullable byte array for image data

		[Required(ErrorMessage = "Type1 is required.")]
        public PokemonTypeDto Type1 { get; set; }
        public PokemonTypeDto Type2 { get; set; }

        public ICollection<PokemonWeaknessDto> PokemonWeaknesses { get; set; }
        public ICollection<PokemonStrengthDto> PokemonStrengths { get; set; }
    }
}