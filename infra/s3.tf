module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"
    version = "4.1.1"

    bucket = "${var.prefix}-bucket"
    acl = "public-read"
    website = {
        index_document = "index.html"
        error_document = "error.html"
    }
}
