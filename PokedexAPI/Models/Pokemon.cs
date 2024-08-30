using System;
using System.Collections.Generic;

namespace PokedexAPI.Models;

public partial class Pokemon
{
    public int Id { get; set; }

    public string Name { get; set; }

    public int Type1Id { get; set; }

    public int? Type2Id { get; set; }

    public virtual ICollection<PokemonImage> PokemonImages { get; set; } = new List<PokemonImage>();

    public virtual ICollection<PokemonStrength> PokemonStrengths { get; set; } = new List<PokemonStrength>();

    public virtual ICollection<PokemonWeakness> PokemonWeaknesses { get; set; } = new List<PokemonWeakness>();

    public virtual PokemonType Type1 { get; set; }

    public virtual PokemonType Type2 { get; set; }
}
