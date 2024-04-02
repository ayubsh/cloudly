# locals {
#   cluster_name = "${var.prefix}-cluster"
# }

# module "eks" {
#   source  = "terraform-aws-modules/eks/aws"
#   version = "20.8.4"

#   cluster_name    = local.cluster_name
#   cluster_version = "1.29"

#   vpc_id                               = module.vpc.vpc_id
#   subnet_ids                           = module.vpc.private_subnets
#   cluster_endpoint_public_access       = true
#   cluster_endpoint_public_access_cidrs = ["0.0.0.0/0"]

#   eks_managed_node_group_defaults = {
#     ami_type = "AL2_x86_64"
#   }

#   eks_managed_node_groups = {
#     one = {
#       name = "node-group-one"

#       instance_types = ["t3.small"]

#       min_size     = 1
#       max_size     = 1
#       desired_size = 1

#       labels = {
#         Environment = "Dev"
#       }
#     }
#   }
# }

# module "vpc_cni_irsa" {
#   source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
#   version = "~> 5.19"

#   role_name_prefix      = "${var.prefix}-vpc-cni-irsa"
#   attach_vpc_cni_policy = true
#   vpc_cni_enable_ipv4   = true

#   oidc_providers = {
#     main = {
#       provider_arn               = module.eks.oidc_provider_arn
#       namespace_service_accounts = ["kube-system:aws-node"]
#     }
#   }
# }

# module "irsa-ebs-csi" {
#   source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role-with-oidc"
#   version = "4.7.0"

#   create_role                   = true
#   role_name                     = "AmazonEKSTFEBSCSIRole-${module.eks.cluster_name}"
#   provider_url                  = module.eks.oidc_provider
#   role_policy_arns              = [data.aws_iam_policy.ebs_csi_policy.arn]
#   oidc_fully_qualified_subjects = ["system:serviceaccount:kube-system:ebs-csi-controller-sa"]
# }

# resource "aws_eks_addon" "ebs-csi" {
#   cluster_name             = module.eks.cluster_name
#   addon_name               = "aws-ebs-csi-driver"
#   addon_version            = "v1.20.0-eksbuild.1"
#   service_account_role_arn = module.irsa-ebs-csi.iam_role_arn
#   tags = {
#     "eks_addon" = "ebs-csi"
#     "terraform" = "true"
#   }
# }