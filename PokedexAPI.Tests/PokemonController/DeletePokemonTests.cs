using AutoMapper;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Pokedex.Controllers;
using Pokedex.DTOs;
using Pokedex.RepositoryInterface;
using PokedexAPI.Models;

[TestFixture]
public class DeletePokemonTests
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
    public async Task DeletePokemonByName_ReturnsNotFound_WhenPokemonDoesNotExist()
    {
        // Arrange
        var pokemonName = "NonExistentPokemon";
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonName)).Returns(false);

        // Act
        var result = await _fakePokemonController.DeletePokemon(pokemonName);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>().Which
            .Value.Should().Be("This pokemon does not exist");
    }

    [Test]
    public async Task DeletePokemonByName_ReturnsBadRequest_WhenModelStateIsInvalid()
    {
        // Arrange
        var pokemonName = "Pikachu";
        var pokemonToDelete = new Pokemon { Name = pokemonName };
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonName)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonName)).Returns(pokemonToDelete);
        _fakePokemonController.ModelState.AddModelError("Name", "Required");

        // Act
        var result = await _fakePokemonController.DeletePokemon(pokemonName);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which.Value.Should().BeOfType<SerializableError>();

        var badRequestResult = result.Result as BadRequestObjectResult;
        var modelState = badRequestResult.Value as SerializableError;

        modelState.Should().ContainKey("Name").WhoseValue.Should().BeEquivalentTo(new[] { "Required" });
    }


    [Test]
    public async Task DeletePokemonByName_ReturnsNoContent_WhenDeletionFails()
    {
        // Arrange
        var pokemonName = "Pikachu";
        var pokemonToDelete = new Pokemon { Name = pokemonName };
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonName)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonName)).Returns(pokemonToDelete);
        A.CallTo(() => _fakePokemonRepository.DeletePokemon(pokemonToDelete)).Returns(false);

        // Act
        var result = await _fakePokemonController.DeletePokemon(pokemonName);

        // Assert
        result.Result.Should().BeOfType<NoContentResult>();
    }

    [Test]
    public async Task DeletePokemonByName_ReturnsNoContent_WhenDeletionIsSuccessful()
    {
        // Arrange
        var pokemonName = "Pikachu";
        var pokemonToDelete = new Pokemon { Name = pokemonName };
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonName)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonName)).Returns(pokemonToDelete);
        A.CallTo(() => _fakePokemonRepository.DeletePokemon(pokemonToDelete)).Returns(true);

        // Act
        var result = await _fakePokemonController.DeletePokemon(pokemonName);

        // Assert
        result.Result.Should().BeOfType<NoContentResult>();
    }


    [Test]
    public async Task DeletePokemonById_ReturnsNotFound_WhenPokemonDoesNotExist()
    {
        // Arrange
        var pokemonId = 1;
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonId)).Returns(false);

        // Act
        var result = await _fakePokemonController.DeletePokemon(pokemonId);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>().Which
            .Value.Should().Be("This pokemon does not exist");
    }

    //[Test]
    //public async Task DeletePokemonById_ReturnsBadRequest_WhenModelStateIsInvalid()
    //{
    //    // Arrange
    //    var pokemonId = 1;
    //    var pokemonToDelete = new Pokemon { Id = pokemonId };
    //    A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonId)).Returns(true);
    //    A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonId)).Returns(pokemonToDelete);

    //    // Simulate an invalid model state
    //    _fakePokemonController.ModelState.AddModelError("Id", "Required");

    //    // Act
    //    var result = await _fakePokemonController.DeletePokemon(pokemonId);

    //    // Assert
    //    // Ensure the result is of type BadRequestObjectResult
    //    var badRequestResult = result.Result.Should().BeOfType<BadRequestObjectResult>().Subject;

    //    // Check that the result's Value is a SerializableError and contains the expected key and message
    //    badRequestResult.Value.Should().BeOfType<SerializableError>()
    //        .Which.Should().ContainKey("Id")
    //        .WhoseValue.Should().Contain("Required");
    //}


    [Test]
    public async Task DeletePokemonById_ReturnsNoContent_WhenDeletionFails()
    {
        // Arrange
        var pokemonId = 1;
        var pokemonToDelete = new Pokemon { Id = pokemonId };
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonId)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonId)).Returns(pokemonToDelete);
        A.CallTo(() => _fakePokemonRepository.DeletePokemon(pokemonToDelete)).Returns(false);

        // Act
        var result = await _fakePokemonController.DeletePokemon(pokemonId);

        // Assert
        result.Result.Should().BeOfType<NoContentResult>();
    }

    [Test]
    public async Task DeletePokemonById_ReturnsNoContent_WhenDeletionIsSuccessful()
    {
        // Arrange
        var pokemonId = 1;
        var pokemonToDelete = new Pokemon { Id = pokemonId };
        A.CallTo(() => _fakePokemonRepository.PokemonExists(pokemonId)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.GetPokemon(pokemonId)).Returns(pokemonToDelete);
        A.CallTo(() => _fakePokemonRepository.DeletePokemon(pokemonToDelete)).Returns(true);

        // Act
        var result = await _fakePokemonController.DeletePokemon(pokemonId);

        // Assert
        result.Result.Should().BeOfType<NoContentResult>();
    }

}