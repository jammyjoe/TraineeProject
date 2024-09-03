variable "SUBSCRIPTION_ID" {
  type = string
}

variable "CLIENT_ID" {
  type = string
}

variable "CLIENT_SECRET" {
  type = string
}

variable "TENANT_ID" {
  type = string
}

variable "ACCESS_KEY" {
  type = string
}

variable "ADMIN_PASSWORD" {
  type = string
}

variable "RESOURCEGROUPNAME" {
  type = string
}

variable "STORAGEACCOUNTNAME" {
  type = string
}


locals { 
  resource_name     = "pokedex"
  admin_username    = "jamil"
  resource_group    = "rg"
  sql_db_name       = "db"
  sql_server_name   = "sqlserver"
  web_app           = "web-app"
  web_api           = "web-api"
  connection_string = "Server=tcp:${azurerm_mssql_server.pokedex_sqlserver.name}.database.windows.net,1433;Initial Catalog=${azurerm_mssql_database.pokedex_db.name}Persist Security Info=False;User ID=jamil;Password=Password01!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

  tags = {
    SERVICE          = "TraineeProject"
    SERVICE_OWNER    = "Jamil Munayem"
  }
}