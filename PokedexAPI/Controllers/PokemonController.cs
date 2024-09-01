using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using Pokedex.DTOs;
using Pokedex.RepositoryInterface;
using PokedexAPI.Models;

namespace Pokedex.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowedOriginsPolicy")]
    public class PokemonController : ControllerBase
    {
        private readonly PokedexContext _context;
        private readonly IPokemonRepository _pokemonRepository;
        private readonly IMapper _mapper;

        public PokemonController(PokedexContext context, IPokemonRepository pokemonRepository, IMapper mapper)
        {
            _context = context;
            _pokemonRepository = pokemonRepository;
            _mapper = mapper;
        }
        
        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<ActionResult<PokemonDto>> GetPokemons()
        {
            var pokemons = _mapper.Map<List<PokemonDto>>(await _pokemonRepository.GetPokemons());

            return Ok(pokemons);
        }

        [HttpGet("{name}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]

        public async Task<ActionResult<Pokemon>> GetPokemon(string name)
        {
            if (!await _pokemonRepository.PokemonExists(name))
                return NotFound("This pokemon does not exist");

            var pokemon = _mapper.Map<PokemonDto>(await _pokemonRepository.GetPokemon(name));

            return Ok(pokemon);
        }
        
        [HttpGet("{id:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]

        public async Task<ActionResult<Pokemon>> GetPokemon(int id)
        {
            if (!await _pokemonRepository.PokemonExists(id))
                return NotFound("This pokemon does not exist");

            var pokemon = _mapper.Map<PokemonDto>(await _pokemonRepository.GetPokemon(id));

            return Ok(pokemon);
        }

        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<PokemonDto>> CreatePokemon([FromBody] PokemonDto pokemonCreate)
        {
            if(await _pokemonRepository.PokemonExists(pokemonCreate.Name))
            {
                return BadRequest("This pokemon already exists");
            }

            if (!await _pokemonRepository.ValidateDistinctTypes(pokemonCreate))
            {
                return BadRequest("Type 1 and Type 2 can not be the same");
            }

            if (!await _pokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonCreate))
            {
                return BadRequest("Strengths and weaknesses cannot have duplicate types.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdPokemon = await _pokemonRepository.CreatePokemon(pokemonCreate);
                var createdPokemonDto = _mapper.Map<PokemonDto>(createdPokemon);

                return CreatedAtAction(nameof(GetPokemon), new { name = createdPokemonDto.Name }, createdPokemonDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Pokemon>> UpdatePokemon(int id,
    [FromBody] PokemonDto pokemonUpdate)
        {
            if (pokemonUpdate == null)
                return BadRequest("This Id is invalid");

            if (!await _pokemonRepository.PokemonExists(id))
                return NotFound("This pokemon does not exist");

            if (!await _pokemonRepository.ValidateDistinctTypes(pokemonUpdate))
            {
                return BadRequest("Type 1 and Type 2 can not be the same");
            }

            if (!await _pokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonUpdate))
            {
                return BadRequest("Strengths and weaknesses cannot have duplicate types.");
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var pokemonMap = _mapper.Map<PokemonDto>(pokemonUpdate);

            if (!await _pokemonRepository.UpdatePokemon(id, pokemonMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }
            return NoContent();
        }


        [HttpDelete("{name}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Pokemon>> DeletePokemon(string name)
        {
            if (!(await _pokemonRepository.PokemonExists(name)))
                return NotFound("This pokemon does not exist");

            var pokemonToDelete = (await _pokemonRepository.GetPokemon(name));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!(await _pokemonRepository.DeletePokemon(pokemonToDelete)))
            {
                ModelState.AddModelError("", "Something went wrong deleting pokemon");
            }
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Pokemon>> DeletePokemon(int id)
        {
            if (!(await _pokemonRepository.PokemonExists(id)))
                return NotFound("This pokemon does not exist");

            var pokemonToDelete = (await _pokemonRepository.GetPokemon(id));

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!(await _pokemonRepository.DeletePokemon(pokemonToDelete)))
            {
                ModelState.AddModelError("", "Something went wrong deleting pokemon");
            }
            return NoContent();
        }
    }
}
