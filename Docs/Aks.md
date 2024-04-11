# Aks
azure kubernetes services is provides deployment and management of
kubernetes cluster

Provisioning AKS using [terraform](https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-terraform?tabs=bash&pivots=development-environment-azure-cli)
``` terraform
resource "azurerm_kubernetes_cluster" "k8s" {
  location            = azurerm_resource_group.rg.location
  name                = random_pet.azurerm_kubernetes_cluster_name.id
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = random_pet.azurerm_kubernetes_cluster_dns_prefix.id

  identity {
    type = "SystemAssigned"
  }

  default_node_pool {
    name       = "agentpool"
    vm_size    = "Standard_D2_v2"
    node_count = var.node_count
  }
  linux_profile {
    admin_username = var.username

    ssh_key {
      key_data = jsondecode(azapi_resource_action.ssh_public_key_gen.output).publicKey
    }
  }
  network_profile {
    network_plugin    = "kubenet"
    load_balancer_sku = "standard"
  }
}
```
Commands
```sh
terraform init

terraform plan

terraform apply
```
resources will be created in azure console

### Connecting to the azure aks cluster

```sh
echo "$(terraform output kube_config)" > ./azurek8s

export KUBECONFIG=./azurek8s
```

### To deploy application to it run
```sh
kubectl apply -f <location of manifest files>
```

### Enabling [ingress](https://learn.microsoft.com/en-us/azure/aks/app-routing?tabs=default%2Cdeploy-app-default) ngix
```sh 
az aks approuting enable -g <ResourceGroupName> -n <ClusterName>
```
