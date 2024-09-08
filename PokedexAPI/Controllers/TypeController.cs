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
    private readonly ITypeRepository _typeRepository;
    private readonly IMapper _mapper;

    public TypeController(ITypeRepository typeRepository, IMapper mapper)
    {
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