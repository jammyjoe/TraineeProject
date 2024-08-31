using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Pokedex.DTOs;
using PokedexAPI.DTOs;
using PokedexAPI.Models;
using PokedexAPI.RepositoryInterface;

namespace Pokedex.Controllers;

[ApiController]
[Route("api/[controller]")]
[ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
public class ImageController : ControllerBase
{
    private readonly PokedexContext _context;
    private readonly ITypeRepository _typeRepository;
    private readonly IMapper _mapper;

    public ImageController(PokedexContext context, ITypeRepository typeRepository, IMapper mapper)
    {
        _context = context;
        _typeRepository = typeRepository;
        _mapper = mapper;
    }

    [HttpGet("pokemon")]
    public IActionResult GetPokemonImages()
    {
        // Path to your images directory
        var imageFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/pokemon");
        
        // Ensure the directory exists
        if (!Directory.Exists(imageFolder))
        {
            return NotFound("Image directory not found.");
        }

        // Get all image files
        var imageFiles = Directory.GetFiles(imageFolder);

        // Map image file paths to URL and name
        var images = imageFiles.Select(file => new 
        { 
            url = $"/images/pokemon/{Path.GetFileName(file)}", 
            name = Path.GetFileNameWithoutExtension(file) 
        }).ToList();

        return Ok(images);
    }
}
