param (
    # [Parameter(Mandatory = $true)] [string] $resourceGroupName,
    # [Parameter(Mandatory = $true)] [string] $storageAccountName,
    [Parameter(Mandatory = $true)] [string] $deploymentEnvironment
)

cd $env:BUILD_SOURCESDIRECTORY/Deployment


terraform init #-backend-config="resource_group_name=$resouceGroupName" -backend-config="storage_account_name=$storageAccountName"
if(!$?) { echo "Unable to init Terraform"; throw "Init Error"}

terraform workspace select -or-create=true $deploymentEnvironment
if(!$?) { echo "Unable to select workspace"; throw "Workspace Error"}

terraform validate
if(!$?) { echo "Invalid terraform"; throw "Validation Error"}
 
terraform -destroy plan -out "terraform.deployment.tfplan" | tee terraform_plan_output.txt
if(!$?) { echo "Terraform plan failed"; throw "Plan Error"}

terraform apply "terraform.deployment.tfplan"

