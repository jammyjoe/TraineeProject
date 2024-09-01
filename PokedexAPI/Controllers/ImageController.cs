using AutoMapper;
using Azure.Storage.Blobs;
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
    private readonly IMapper _mapper;
    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName = "pokedeximgcontainer";
    public ImageController(PokedexContext context, IMapper mapper, BlobServiceClient blobServiceClient)
    {
        _context = context;
        _mapper = mapper;
        _blobServiceClient = blobServiceClient;

    }

    [HttpGet("pokemon")]
    public async Task<IActionResult> GetPokemonImages()
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

        if (!await containerClient.ExistsAsync())
        {
            return NotFound("Image container not found.");
        }

        var images = new List<object>();
        await foreach (var blobItem in containerClient.GetBlobsAsync())
        {
            var blobUrl = containerClient.GetBlobClient(blobItem.Name).Uri.AbsoluteUri;
            images.Add(new 
            { 
                url = blobUrl, 
                name = Path.GetFileNameWithoutExtension(blobItem.Name) 
            });
        }

        return Ok(images);
    }

    // [HttpGet("pokemon")]
    // public IActionResult GetPokemonImages()
    // {
    //     // Path to your images directory
    //     var imageFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/pokemon");
        
    //     // Ensure the directory exists
    //     if (!Directory.Exists(imageFolder))
    //     {
    //         return NotFound("Image directory not found.");
    //     }

    //     // Get all image files
    //     var imageFiles = Directory.GetFiles(imageFolder);

    //     // Map image file paths to URL and name
    //     var images = imageFiles.Select(file => new 
    //     { 
    //         url = $"/images/pokemon/{Path.GetFileName(file)}", 
    //         name = Path.GetFileNameWithoutExtension(file) 
    //     }).ToList();

    //     return Ok(images);
    // }
}
