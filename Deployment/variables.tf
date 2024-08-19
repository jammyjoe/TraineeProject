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

# variable "RESOURCEGROUPNAME" {
#   type = string
# }

# variable "STORAGEACCOUNTNAME" {
#   type = string
# }


locals { 
  resource_name     = "pokedex"
  admin_username    = "jamil"
  admin_password    = "Password01!"
  env_name          = lower(terraform.workspace)
  resource_group    = "rg"
  sql_db_name       = "db"
  sql_server_name   = "sqlserver"
  web_app           = "web-app"
  web_api           = "web-api"

  tags = {
    SERVICE          = "TraineeProject"
    ENVIRONMENT      = local.env_name
    SERVICE_OWNER    = "Jamil Munayem"
  }
}