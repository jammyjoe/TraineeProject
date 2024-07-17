variable "SUBSCRIPTION_ID" {
  type = string
}


locals {
  resource_name = "pokedex"
  admin_username = "jamil"
  admin_password = "Password01."
  sql_db_name = "pokedex_db"
  env_name = lower(terraform.workspace)
  resource_group = "rg"
  web_app = "web-app"
  web_api = "web-api"

  tags = {
    SERVICE          = "TraineeProject"
    ENVIRONMENT      = local.env_name
    SERVICE_OWNER    = "Jamil Munayem"
  }
}