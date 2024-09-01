using Microsoft.EntityFrameworkCore;
using Pokedex.DTOs;
using Pokedex.RepositoryInterface;
using PokedexAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PokedexAPI.DTOs;
using Microsoft.Extensions.Hosting;

namespace Pokedex.Repository
{
    public class PokemonRepository : IPokemonRepository
    {
        private readonly PokedexContext _context;
        private readonly IWebHostEnvironment _environment;


        public PokemonRepository(PokedexContext context, IWebHostEnvironment environment )
        {
            _context = context;
            _environment = environment;
        }

        public async Task<ICollection<Pokemon>> GetPokemons()
        {
            return await _context.Pokemons
                .Include(t => t.Type1)
                .Include(t => t.Type2)
                .Include(p => p.PokemonWeaknesses)
                    .ThenInclude(pw => pw.Type)
                .Include(p => p.PokemonStrengths)
                    .ThenInclude(pr => pr.Type)
                .OrderBy(p => p.Id)
                .ToListAsync();
        }
        public async Task<Pokemon> GetPokemon(int id)
        {
            return await _context.Pokemons
                .Include(p => p.Type1)
                .Include(p => p.Type2)
                .Include(p => p.PokemonWeaknesses)
                    .ThenInclude(pw => pw.Type)
                .Include(p => p.PokemonStrengths)
                    .ThenInclude(ps => ps.Type)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Pokemon> GetPokemon(string name)
        {
            return await _context.Pokemons
                .Include(p => p.Type1)
                .Include(p => p.Type2)
                .Include(p => p.PokemonWeaknesses)
                .ThenInclude(pw => pw.Type)
                .Include(p => p.PokemonStrengths)
                .ThenInclude(ps => ps.Type)
                .FirstOrDefaultAsync(p => p.Name == name);
        }

        public async Task<Pokemon> CreatePokemon(PokemonDto pokemonDto)
        {

            var pokemon = new Pokemon
            {
                Name = pokemonDto.Name,
                ImageUrl = pokemonDto.ImageUrl,                
                //ImageData = pokemonDto.ImageData // For base64 image data
            };

            async Task<PokemonType> GetValidatedPokemonType(string typeName)
            {
                if (!await PokemonTypeExists(typeName))
                {
                    throw new Exception($"Invalid Type specified: {typeName}");
                }
                return await _context.PokemonTypes.FirstOrDefaultAsync(pt => pt.TypeName == typeName);
            }

            pokemon.Type1 = await GetValidatedPokemonType(pokemonDto.Type1.TypeName);
            pokemon.Type1Id = pokemon.Type1.Id;

            if (pokemonDto.Type2 != null)
            {
                pokemon.Type2 = await GetValidatedPokemonType(pokemonDto.Type2.TypeName);
                pokemon.Type2Id = pokemon.Type2.Id;
            }

            async Task AddWeaknesses(IEnumerable<PokemonWeaknessDto> weaknesses)
            {
                foreach (var weaknessDto in weaknesses)
                {
                    var weaknessType = await GetValidatedPokemonType(weaknessDto.Type.TypeName);
                    var weakness = new PokemonWeakness
                    {
                        Pokemon = pokemon,
                        Type = weaknessType
                    };
                    _context.PokemonWeaknesses.Add(weakness);
                }
            }

            async Task AddStrengths(IEnumerable<PokemonStrengthDto> strengths)
            {
                foreach (var strengthDto in strengths)
                {
                    var strengthType = await GetValidatedPokemonType(strengthDto.Type.TypeName);
                    var strength = new PokemonStrength
                    {
                        Pokemon = pokemon,
                        Type = strengthType
                    };
                    _context.PokemonStrengths.Add(strength);
                }
            }

            if (pokemonDto.PokemonWeaknesses != null)
            {
                await AddWeaknesses(pokemonDto.PokemonWeaknesses);
            }

            if (pokemonDto.PokemonStrengths != null)
            {
                await AddStrengths(pokemonDto.PokemonStrengths);
            }

            try
            {
                _context.Pokemons.Add(pokemon);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                var exceptionMessage = ex.Message;
                var stackTrace = ex.StackTrace;
                var innerException = ex.InnerException?.Message;

                throw new Exception("An error occurred while saving the Pokémon.", ex);
            }

            return pokemon;
        }

        public async Task<bool> DeletePokemon(Pokemon pokemon)
        {
            _context.Remove(pokemon);
            return await SavePokemon();
        }

        public async Task<bool> UpdatePokemon(int id, PokemonDto updatedPokemonDto)
        {
            var existingPokemon = await _context.Pokemons
                .Include(p => p.Type1)
                .Include(p => p.Type2)
                .Include(p => p.PokemonStrengths)
                .ThenInclude(ps => ps.Type)
                .Include(p => p.PokemonWeaknesses)
                .ThenInclude(pw => pw.Type)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingPokemon == null)
            {
                return false;
            }

            existingPokemon.Name = updatedPokemonDto.Name;
            if (!string.IsNullOrEmpty(updatedPokemonDto.ImageUrl))
            {
                existingPokemon.ImageUrl = updatedPokemonDto.ImageUrl;
            }
            
            var updateTypeResult = await UpdateType(updatedPokemonDto, existingPokemon);
            if (!updateTypeResult)
            {
                return false;
            }

            try
            {
                _context.Update(existingPokemon);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException ex)
            {
                var exceptionMessage = ex.Message;
                var stackTrace = ex.StackTrace;
                var innerException = ex.InnerException?.Message;
                return false;
            }
        }


        public async Task<bool> UpdateType(PokemonDto updatePokemonDto, Pokemon existingPokemon)
        {
            var type1 = await _context.PokemonTypes.FirstOrDefaultAsync(pt => pt.TypeName == updatePokemonDto.Type1.TypeName);
            if (type1 == null)
            {
                return false;
            }
            existingPokemon.Type1Id = type1.Id;

            if (updatePokemonDto.Type2 == null || string.IsNullOrEmpty(updatePokemonDto.Type2.TypeName))
            {
                existingPokemon.Type2Id = null;
            }
            else
            {
                var type2 = await _context.PokemonTypes.FirstOrDefaultAsync(pt => pt.TypeName == updatePokemonDto.Type2.TypeName);
                if (type2 == null)
                {
                    return false;
                }
                existingPokemon.Type2Id = type2.Id;
            }

            var existingWeaknesses = _context.PokemonWeaknesses.Where(pw => pw.PokemonId == existingPokemon.Id);
            _context.PokemonWeaknesses.RemoveRange(existingWeaknesses);

            foreach (var weaknessDto in updatePokemonDto.PokemonWeaknesses)
            {
                var weaknessType = await _context.PokemonTypes.FirstOrDefaultAsync(pt => pt.TypeName == weaknessDto.Type.TypeName);
                if (weaknessType != null)
                {
                    var newWeakness = new PokemonWeakness()
                    {
                        PokemonId = existingPokemon.Id,
                        TypeId = weaknessType.Id
                    };
                    existingPokemon.PokemonWeaknesses.Add(newWeakness);
                }
            }

            var existingStrengths = _context.PokemonStrengths.Where(ps => ps.PokemonId == existingPokemon.Id);
            _context.PokemonStrengths.RemoveRange(existingStrengths);

            foreach (var strengthDto in updatePokemonDto.PokemonStrengths)
            {
                var strengthType = await _context.PokemonTypes.FirstOrDefaultAsync(pt => pt.TypeName == strengthDto.Type.TypeName);
                if (strengthType != null)
                {
                    var newStrength = new PokemonStrength()
                    {
                        PokemonId = existingPokemon.Id,
                        TypeId = strengthType.Id
                    };
                    existingPokemon.PokemonStrengths.Add(newStrength);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException ex)
            {
                var exceptionMessage = ex.Message;
                var stackTrace = ex.StackTrace;
                var innerException = ex.InnerException?.Message;
                return false;
            }
        }

        public Task<bool> ValidateDistinctTypes(PokemonDto pokemonDto)
        {
            bool areTypesDistinct = pokemonDto.Type2 == null || pokemonDto.Type1.TypeName != pokemonDto.Type2.TypeName;

            return Task.FromResult(areTypesDistinct);
        }

        public Task<bool> AreStrengthsAndWeaknessesDistinct(PokemonDto pokemonDto)
        {
            var strengthTypes = pokemonDto.PokemonStrengths.Select(s => s.Type.TypeName).ToList();
            bool hasDuplicateStrengths = strengthTypes.Count != strengthTypes.Distinct().Count();

            var weaknessTypes = pokemonDto.PokemonWeaknesses.Select(w => w.Type.TypeName).ToList();
            bool hasDuplicateWeaknesses = weaknessTypes.Count != weaknessTypes.Distinct().Count();

            bool result = !hasDuplicateStrengths && !hasDuplicateWeaknesses;

            return Task.FromResult(result);
        }


        public async Task<bool> PokemonTypeExists(string typeName)
        {
            return await _context.PokemonTypes.AnyAsync(pt => pt.TypeName == typeName);
        }

        public async Task<bool> PokemonExists(int id)
        {
            return await _context.Pokemons.AnyAsync(p => p.Id == id);
        }

        public async Task<bool> PokemonExists(string name)
        {
            return await _context.Pokemons.AnyAsync(p => p.Name == name);
        }
        public async Task<bool> SavePokemon()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0 ? true : false;
        }
    }
}