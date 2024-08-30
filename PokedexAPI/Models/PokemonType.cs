using System;
using System.Collections.Generic;

namespace PokedexAPI.Models;

public partial class PokemonType
{
    public int Id { get; set; }

    public string TypeName { get; set; }

    public virtual ICollection<PokemonStrength> PokemonStrengths { get; set; } = new List<PokemonStrength>();

    public virtual ICollection<Pokemon> PokemonType1s { get; set; } = new List<Pokemon>();

    public virtual ICollection<Pokemon> PokemonType2s { get; set; } = new List<Pokemon>();

    public virtual ICollection<PokemonWeakness> PokemonWeaknesses { get; set; } = new List<PokemonWeakness>();
}
