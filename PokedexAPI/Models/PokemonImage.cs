using System;
using System.Collections.Generic;

namespace PokedexAPI.Models;

public partial class PokemonImage
{
    public int Id { get; set; }

    public int? PokemonId { get; set; }

    public string ImageUrl { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Pokemon Pokemon { get; set; }
}
