variable "region" {
  description = "Azure region"
  default     = "eastus"
}

variable "prefix" {
  description = "Project name"
  default     = "cloudly"
}

variable "ssh_key" {
  description = "SSH public key"
  default     = "~/.ssh/id_rsa.pub"
}