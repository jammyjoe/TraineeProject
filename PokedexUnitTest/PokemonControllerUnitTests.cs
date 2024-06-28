using AutoMapper;
using FakeItEasy;
using Microsoft.AspNetCore.Mvc;
using Pokedex.Controllers;
using Pokedex.DTOs;
using Pokedex.RepositoryInterface;
using PokedexAPI.Models;

[TestFixture]
public class PokemonControllerTests
{
    private PokedexContext _fakeContext;
    private IPokemonRepository _fakePokemonRepository;
    private IMapper _fakeMapper;
    private PokemonController _pokemonController;

    [SetUp]
    public void Setup()
    {
        _pokemonController = new PokemonController(_fakeContext, _fakePokemonRepository, _fakeMapper);
        _fakePokemonRepository = A.Fake<IPokemonRepository>();
        _fakeMapper = A.Fake<IMapper>();
    }

    [Test]
    public async Task PokemonController_GetPokemons_ReturnsOkObjectResult()
    {
        var pokemons = A.Fake<ICollection<PokemonDto>>();
        var pokemonsList = A.Fake<List<PokemonDto>>();
        A.CallTo(() => _fakeMapper.Map<List<PokemonDto>>(pokemons)).Returns(pokemonsList);
        var controller = new PokemonController(_fakeContext, _fakePokemonRepository, _fakeMapper);

        var result = await controller.GetPokemons();

        Assert.That(result, Is.Not.Null);
        Assert.IsInstanceOf<OkObjectResult>(result.Result);

    }

    [Test]
    public async Task PokemonController_GetPokemon_ReturnsOkObjectResult_WhenPokemonExists()
    {
        // Arrange
        string pokemonName = "";
        var pokemonDto = new Pokemon { Name = pokemonName }; 
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonName)).Returns(true);
        //A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonName)).Returns(pokemonDto);
        var controller = new PokemonController(_fakeContext, _fakePokemonRepository, _fakeMapper);

        // Act
        var result = await controller.GetPokemon(pokemonName);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.IsInstanceOf<OkObjectResult>(result.Result);
    }

    [Test]
    public async Task PokemonController_GetPokemon_ReturnsNotFoundObjectResult_WhenPokemonDoesNotExist()
    {
        // Arrange
        string nonExistentPokemonName = "NonExistentPokemon"; 
        A.CallTo(() => _fakePokemonRepository.PokemonExists(nonExistentPokemonName)).Returns(false);
        var controller = new PokemonController(_fakeContext, _fakePokemonRepository, _fakeMapper);

        // Act
        var result = await controller.GetPokemon(nonExistentPokemonName);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.IsInstanceOf<NotFoundObjectResult>(result.Result);
    }

    [Test]
    public async Task PokemonController_CreatePokemon_ReturnOK()
    {
        var pokemonCreate = A.Fake<PokemonDto>();
        var pokemon = A.Fake<Pokemon>();

        A.CallTo(() => _fakeMapper.Map<Pokemon>(pokemonCreate)).Returns(pokemon);
        A.CallTo(() => _fakePokemonRepository.CreatePokemon(pokemonCreate));
        var controller = new PokemonController(_fakeContext, _fakePokemonRepository, _fakeMapper);

        var result = controller.CreatePokemon(pokemonCreate);

        Assert.That(result, Is.Not.Null);
    }

}
