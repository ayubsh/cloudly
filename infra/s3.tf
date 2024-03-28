resource "aws_s3_bucket" "cloudly-bucket" {
  bucket = "${var.prefix}-bucket"
}

resource "aws_s3_bucket_public_access_block" "cloudly-bucket" {
  bucket                 = aws_s3_bucket.cloudly-bucket.id
  block_public_acls      = false
  block_public_policy    = false
  ignore_public_acls     = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "cloudly-bucket" {
  bucket         = aws_s3_bucket.cloudly-bucket.id
  index_document {
    suffix = "index.html"
  } 
  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_ownership_controls" "cloudly-bucket" {
  bucket = aws_s3_bucket.cloudly-bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "cloudly-bucket" {
  bucket     = aws_s3_bucket.cloudly-bucket.id
  acl        = "public-read"
  depends_on = [aws_s3_bucket_public_access_block.cloudly-bucket, aws_s3_bucket_ownership_controls.cloudly-bucket]
}

resource "aws_s3_bucket_policy" "cloudly-bucket" {
  bucket = aws_s3_bucket.cloudly-bucket.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "arn:aws:s3:::${aws_s3_bucket.cloudly-bucket.bucket}/*",
      },
      {
        Sid       = "PublicReadGetObject",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "arn:aws:s3:::${aws_s3_bucket.cloudly-bucket.bucket}/*",
      },
    ],
  })

  depends_on = [aws_s3_bucket_public_access_block.cloudly-bucket]
}