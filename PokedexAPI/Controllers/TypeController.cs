using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using Pokedex.DTOs;
using PokedexAPI.DTOs;
using PokedexAPI.Models;
using PokedexAPI.RepositoryInterface;

namespace Pokedex.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowedOriginsPolicy")]
public class TypeController : ControllerBase
{
    private readonly PokedexContext _context;
    private readonly ITypeRepository _typeRepository;
    private readonly IMapper _mapper;

    public TypeController(PokedexContext context, ITypeRepository typeRepository, IMapper mapper)
    {
        _context = context;
        _typeRepository = typeRepository;
        _mapper = mapper;
    }

    [HttpGet]
    [ProducesResponseType(200)]
    public async Task<ActionResult<PokemonTypeDto>> GetTypes()
    {
        var types = _mapper.Map<List<PokemonTypeDto>>(await _typeRepository.GetTypes());

        return Ok(types);
    }

//     [HttpGet("{typeName}")]
//     [ProducesResponseType(200)]
//     [ProducesResponseType(400)]

//     public async Task<ActionResult<Type>> GetPokemonsByType(string typeName)
//     {
//         var pokemons = await _typeRepository.GetPokemonsByType(typeName);

//         if (pokemons == null || pokemons.Count == 0)
//         {
//             return NotFound();
//         }

//         var pokemonDtos = _mapper.Map<List<PokemonDto>>(pokemons);

//         return Ok(pokemonDtos);
//     }
// }
        [HttpGet("by-types")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<List<PokemonDto>>> GetPokemonsByTypes([FromQuery] List<string> typeNames)
        {
            if (typeNames == null || !typeNames.Any())
            {
                return BadRequest("At least one type name must be provided.");
            }

            var pokemons = await _typeRepository.GetPokemonsByType(typeNames);

            if (pokemons == null || !pokemons.Any())
            {
                return NotFound("No Pokémon found for the given types.");
            }

            var pokemonDtos = _mapper.Map<List<PokemonDto>>(pokemons);

            return Ok(pokemonDtos);
        }

}