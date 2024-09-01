using Microsoft.EntityFrameworkCore;
using Pokedex.Repository;
using Pokedex.RepositoryInterface;
using PokedexAPI.Models;
using PokedexAPI.Repository;
using PokedexAPI.RepositoryInterface;
using AutoMapper;
using Azure.Storage.Blobs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddResponseCaching(x => x.MaximumBodySize = 1024);
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddScoped<IPokemonRepository, PokemonRepository>();
builder.Services.AddScoped<ITypeRepository, TypeRepository>();
builder.Services.AddSingleton(x => new BlobServiceClient("DefaultEndpointsProtocol=https;AccountName=pokedeximgstorage;AccountKey=dX9/MnnU3QQYzkyIkgyi8yvrXbW4Xl5tEza/36P8Oy+1vrtAOo3ssCzy6mJo9AhILuBlmjnT6aas+AStGnf1hQ==;EndpointSuffix=core.windows.net"));
builder.Services.AddDbContext<PokedexContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))); 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowedOriginsPolicy", builder =>
            {
                builder.AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials()
                       .WithOrigins("http://localhost:4200", "https://pokedex-dev-web-api.azurewebsites.net/api");
            });
        });
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowedOriginsPolicy");

app.UseHttpsRedirection();

app.UseStaticFiles(); 

//app.UseDirectoryBrowser();

app.UseExceptionHandler("/Error");

app.UseAuthorization();

app.UseResponseCaching();

app.MapControllers();

app.Run();
