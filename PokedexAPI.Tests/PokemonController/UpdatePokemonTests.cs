using AutoMapper;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NUnit.Framework;
using Pokedex.Controllers;
using Pokedex.DTOs;
using Pokedex.RepositoryInterface;
using PokedexAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

[TestFixture]
public class UpdatePokemonTests
{
    private IPokemonRepository _fakePokemonRepository;
    private IMapper _fakeMapper;
    private PokemonController _fakePokemonController;

    [SetUp]
    public void Setup()
    {
        _fakePokemonRepository = A.Fake<IPokemonRepository>();
        _fakeMapper = A.Fake<IMapper>();
        _fakePokemonController = new PokemonController(_fakePokemonRepository, _fakeMapper);
    }

[Test]
public async Task UpdatePokemon_ReturnsNoContent_WhenUpdateIsSuccessful()
{
    // Arrange
    var pokemonUpdate = new PokemonDto { Name = "UpdatedPikachu" };
    A.CallTo(() => _fakePokemonRepository.PokemonExists(1)).Returns(true);
    A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonUpdate)).Returns(true);
    A.CallTo(() => _fakePokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonUpdate)).Returns(true);
    A.CallTo(() => _fakePokemonRepository.UpdatePokemon(1, A<PokemonDto>._)).Returns(true);

    // Act
    var result = await _fakePokemonController.UpdatePokemon(1, pokemonUpdate);

    // Assert
    var noContentResult = result.Result.Should().BeOfType<NoContentResult>().Which;
    noContentResult.StatusCode.Should().Be(StatusCodes.Status204NoContent);
}



    [Test]
    public async Task UpdatePokemon_ReturnsBadRequest_WhenPokemonUpdateIsNull()
    {
        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, null);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
            .Value.Should().Be("This Id is invalid");
    }

    [Test]
    public async Task UpdatePokemon_ReturnsNotFound_WhenPokemonDoesNotExist()
    {
        // Arrange
        var pokemonUpdate = new PokemonDto();
        A.CallTo(() => _fakePokemonRepository.PokemonExists(1)).Returns(false);

        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, pokemonUpdate);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>().Which
            .Value.Should().Be("This pokemon does not exist");
    }

   [Test]
    public async Task UpdatePokemon_ReturnsBadRequest_WhenModelStateIsInvalid()
    {
        // Arrange
        var pokemonUpdate = A.Fake<PokemonDto>();
        _fakePokemonController.ModelState.AddModelError("Name", "Required");

        A.CallTo(() => _fakePokemonRepository.PokemonExists(1)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonUpdate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonUpdate)).Returns(true);

        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, pokemonUpdate);

        // Assert
        result.Should().NotBeNull();

        var badRequestResult = result.Result as BadRequestObjectResult;
        badRequestResult.Should().NotBeNull();
        badRequestResult?.StatusCode.Should().Be(400);

        var modelState = badRequestResult?.Value as SerializableError;
        modelState.Should().NotBeNull();  
        modelState.Should().ContainKey("Name");
        var errorMessages = modelState?["Name"] as IEnumerable<string>;
        errorMessages.Should().NotBeNull();
        errorMessages.Should().Contain("Required");
    }

    [Test]
    public async Task UpdatePokemon_ReturnsBadRequest_WhenTypesAreNotDistinct()
    {
        // Arrange
        var pokemonUpdate = new PokemonDto();
        A.CallTo(() => _fakePokemonRepository.PokemonExists(1)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonUpdate)).Returns(false);

        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, pokemonUpdate);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
            .Value.Should().Be("Type 1 and Type 2 can not be the same");
    }

    [Test]
    public async Task UpdatePokemon_ReturnsBadRequest_WhenStrengthsAndWeaknessesAreNotDistinct()
    {
        // Arrange
        var pokemonUpdate = new PokemonDto();
        A.CallTo(() => _fakePokemonRepository.PokemonExists(1)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonUpdate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonUpdate)).Returns(false);

        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, pokemonUpdate);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>().Which
            .Value.Should().Be("Strengths and weaknesses cannot have duplicate types.");
    }

   [Test]
    public async Task UpdatePokemon_ReturnsStatusCode500_WhenUpdateFails()
    {
        // Arrange
        var pokemonUpdate = A.Fake<PokemonDto>();
        A.CallTo(() => _fakePokemonRepository.PokemonExists(1)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.ValidateDistinctTypes(pokemonUpdate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.AreStrengthsAndWeaknessesDistinct(pokemonUpdate)).Returns(true);
        A.CallTo(() => _fakePokemonRepository.UpdatePokemon(1, A<PokemonDto>._)).Returns(false);

        // Act
        var result = await _fakePokemonController.UpdatePokemon(1, pokemonUpdate);

        // Assert
        var statusCodeResult = result.Result.Should().BeOfType<ObjectResult>().Which;
        statusCodeResult.StatusCode.Should().Be(500);
        
        // Assert that ModelState is included in the response
        var modelState = statusCodeResult.Value as ModelStateDictionary;
        modelState.Should().NotBeNull();
        
        // Ensure that model state contains the specific error message
        modelState.Should().ContainKey("");
        modelState?[""]?.Errors.Should().ContainSingle(e => e.ErrorMessage == "Something went wrong while saving.");
    }
}
