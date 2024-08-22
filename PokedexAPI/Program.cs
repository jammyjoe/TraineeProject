using Microsoft.EntityFrameworkCore;
using Pokedex.Repository;
using Pokedex.RepositoryInterface;
using PokedexAPI.Models;
using PokedexAPI.Repository;
using PokedexAPI.RepositoryInterface;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddResponseCaching(x => x.MaximumBodySize = 1024);
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddScoped<IPokemonRepository, PokemonRepository>();
builder.Services.AddScoped<ITypeRepository, TypeRepository>();
builder.Services.AddDbContext<PokedexContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowedOriginsPolicy", builder =>
            {
                builder.AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials()
                       .WithOrigins("http://localhost:4200", "https://pokedex-dev-web-app.azurewebsites.net/api");
            });
        });
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.Authority = "https://login.microsoftonline.com/e712b66c-2cb8-430e-848f-dbab4beb16df";
		options.Audience = "api://76792183-f318-4ab5-9eab-da4315d62dc3";
        options.RequireHttpsMetadata = true;
	});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowedOriginsPolicy");

app.UseHttpsRedirection();

app.UseExceptionHandler("/Error");

app.UseAuthentication();

app.UseAuthorization();

app.UseResponseCaching();

app.MapControllers();

app.Run();
