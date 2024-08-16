
resource "azurerm_resource_group" "resource_group" {
  name                            = "${local.resource_name}-${local.env_name}-${local.resource_group}"
  location                        = "UK South"
  tags = local.tags
  lifecycle {
    ignore_changes = [ 
      tags
     ]
  }
}

resource "azurerm_mssql_server" "pokedex_sqlserver" {
  name                         = "${local.resource_name}-${local.env_name}-${local.sql_server_name}"
  resource_group_name          = azurerm_resource_group.resource_group.name
  location                     = azurerm_resource_group.resource_group.location
  administrator_login          = "${local.admin_username}"
  administrator_login_password = "${local.admin_password}"
  version                      = "12.0"
}

resource "azurerm_mssql_firewall_rule" "allow_client_ip" {
  name                = "allow-client-ip"
  start_ip_address    = "62.172.108.16" 
  end_ip_address      = "62.172.108.16"
  server_id           = azurerm_mssql_server.pokedex_sqlserver.id
}

resource "azurerm_mssql_database" "pokedex_db" {
  name                =  "${local.resource_name}-${local.env_name}-${local.sql_db_name}"
  server_id           = azurerm_mssql_server.pokedex_sqlserver.id
  collation           = "Latin1_General_CI_AS"
  sku_name            = "Basic" 
  }

resource "azurerm_service_plan" "appserviceplan" {
  name                = "${local.resource_name}-${local.env_name}-asp"
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
  os_type             = "Windows"
  sku_name            = "B1"
  worker_count        = "1" 

  tags = local.tags
}

resource "azurerm_windows_web_app" "pokedex_webapi" {
  name                          = "${local.resource_name}-${local.env_name}-${local.web_api}"
  location                      = azurerm_resource_group.resource_group.location
  resource_group_name           = azurerm_resource_group.resource_group.name
  service_plan_id               = azurerm_service_plan.appserviceplan.id            
  https_only                    = false
  
  site_config { 
    application_stack {
      dotnet_version = "v8.0"
    }
    cors {
      allowed_origins = "https:/${azurem_windows_web_app.pokedex_webapp.name}.azurewebsites.net"
    }
  }
  
  connection_string {
    name = connection_string
    type = SQLServer
    value = "Server=tcp:${azurerm_mssql_server.pokedex_sqlserver.name}.database.windows.net;Database=${azurerm_mssql_database.pokedex_db.name};User ID=jamil;Password=Password01!;Encrypt=true;Connection Timeout=30;"
  }
  
  app_settings = {
    default_site_hostname                = "pokedexapi"
    "CORS_ALLOWED_ORIGINS"               = "https:/${azurem_windows_web_app.pokedex_webapp.name}.azurewebsites.net"
    #"AzureVault__Uri"                   = azurerm_key_vault.key_vault.vault_uri
    "SQL_CONNECTION_STRING" = "Server=tcp:${azurerm_mssql_server.pokedex_sqlserver.name}.database.windows.net;Database=${azurerm_mssql_database.pokedex_db.name};User ID=jamil;Password=Password01!;Encrypt=true;Connection Timeout=30;"
    "WEBSITE_ENABLE_SYNC_UPDATE_SITE"   = "true" 
    "WEBSITE_RUN_FROM_PACKAGE"          = "1"
  }
}

resource "azurerm_windows_web_app" "pokedex_webapp" {
  name                          = "${local.resource_name}-${local.env_name}-${local.web_app}"
  service_plan_id               = azurerm_service_plan.appserviceplan.id
  location                      = azurerm_resource_group.resource_group.location
  resource_group_name           = azurerm_resource_group.resource_group.name

  site_config {
    app_command_line = "npm start"
  }
  
  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
    "API_URL"                  = "https://${azurerm_windows_web_app.pokedex_webapi.default_hostname}"
  }
}