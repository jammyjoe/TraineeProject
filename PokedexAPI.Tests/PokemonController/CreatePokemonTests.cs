using AutoMapper;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Pokedex.Controllers;
using Pokedex.DTOs;
using Pokedex.RepositoryInterface;
using PokedexAPI.Models;


[TestFixture]
public class CreatePokemonTests
{
    private PokedexContext _fakeContext;
    private IPokemonRepository _fakePokemonRepository;
    private IMapper _fakeMapper;
    private PokemonController _fakePokemonController;

    [SetUp]
    public void Setup()
    {
        _fakePokemonRepository = A.Fake<IPokemonRepository>();
        _fakeMapper = A.Fake<IMapper>();
        _fakePokemonController = new PokemonController(_fakeContext, _fakePokemonRepository, _fakeMapper);
    }

    [Test]
    public async Task CreatePokemon_ReturnsCreatedAtActionResult_WhenSuccessful()
    {
        // Arrange
        var pokemonCreate = A.Fake<PokemonDto>();
        var createdPokemon = A.Fake<Pokemon>();
        var createdPokemonDto = A.Fake<PokemonDto>();

        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonCreate.Name)).Returns(false);
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonCreate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonCreate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.CreatePokemon(pokemonCreate)).Returns(createdPokemon);
        A.CallTo(() => _fakeMapper.Map<PokemonDto>(createdPokemon)).Returns(createdPokemonDto);

        // Act
        var result = await _fakePokemonController.CreatePokemon(pokemonCreate);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<CreatedAtActionResult>().Which
            .Value.Should().Be(createdPokemonDto);
        var createdAtActionResult = result.Result as CreatedAtActionResult;
        createdAtActionResult.ActionName.Should().Be(nameof(_fakePokemonController.GetPokemon));
        createdAtActionResult.RouteValues["name"].Should().Be(createdPokemonDto.Name);
    }


    //[Test]
    //public async Task CreatePokemon_ReturnsBadRequest_WhenModelStateIsInvalid()
    //{
    //    // Arrange
    //    var pokemonCreate = new PokemonDto(); // Missing required fields
    //    _fakePokemonController.ModelState.AddModelError("Name", "The Name field is required.");
    //    _fakePokemonController.ModelState.AddModelError("Type1", "The Type1 field is required.");

    //    // Act
    //    var result = await _fakePokemonController.CreatePokemon(pokemonCreate);

    //    // Assert
    //    result.Should().BeOfType<BadRequestObjectResult>().Which
    //        .Value.Should().BeOfType<SerializableError>()
    //        .Which.Should().ContainKey("Name");
    //    result.Should().BeOfType<BadRequestObjectResult>().Which
    //        .Value.Should().BeOfType<SerializableError>()
    //        .Which.Should().ContainKey("Type1");
    //}


    [Test]
    public async Task CreatePokemon_ReturnsBadRequest_WhenPokemonAlreadyExists()
    {
        // Arrange
        var pokemonCreate = A.Fake<PokemonDto>();
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonCreate.Name)).Returns(true);

        // Act
        var result = await _fakePokemonController.CreatePokemon(pokemonCreate);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
            .Value.Should().Be("This pokemon already exists");
    }

    [Test]
    public async Task CreatePokemon_ReturnsBadRequest_WhenTypesAreNotDistinct()
    {
        // Arrange
        var pokemonCreate = A.Fake<PokemonDto>();
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonCreate)).Returns(false);

        // Act
        var result = await _fakePokemonController.CreatePokemon(pokemonCreate);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
            .Value.Should().Be("Type 1 and Type 2 can not be the same");
    }

    [Test]
    public async Task CreatePokemon_ReturnsBadRequest_WhenStrengthsAndWeaknessesAreNotDistinct()
    {
        // Arrange
        var pokemonCreate = A.Fake<PokemonDto>();
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonCreate)).Returns(true);

        A.CallTo(() => _fakePokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonCreate)).Returns(false);

        // Act
        var result = await _fakePokemonController.CreatePokemon(pokemonCreate);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
            .Value.Should().Be("Strengths and weaknesses cannot have duplicate types.");
    }
}