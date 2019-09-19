resource "aws_s3_bucket" "asset_bucket" {
  bucket = "assets.sushi.lukekaalim.com"
  acl    = "public-read"

  website {
    index_document = "index.html"
  }
}

resource "aws_s3_bucket" "app_sources" {
  bucket_prefix = "hackathon-application-versions"
}

locals {
  content-types = { png = "image/png", html = "text/html" }
}

resource "aws_s3_bucket_object" "asset_bucket_objects" {
  for_each = "${fileset("${path.module}/../assets", "**/*.{png,html}")}"
  acl = "public-read"
  bucket = "${aws_s3_bucket.asset_bucket.bucket}"
  key    = "${each.value}"
  source = "${path.module}/../assets/${each.value}"

  etag = "${filemd5("${path.module}/../assets/${each.value}")}"
  content_type = "${local.content-types[ element(split(".", each.value), length(split(".", each.value)) - 1) ]}"
}

data "aws_route53_zone" "lukekaalim_zone" {
  name         = "lukekaalim.com."
}

resource "aws_route53_record" "asset_domain" {
  zone_id = "${data.aws_route53_zone.lukekaalim_zone.zone_id}"
  name    = "assets.sushi.${data.aws_route53_zone.lukekaalim_zone.name}"
  type    = "CNAME"
  ttl     = "300"
  records = ["${aws_s3_bucket.asset_bucket.website_endpoint}"]
}


resource "aws_ecr_repository" "docker-repo" {
  name = "hackathon-repo"
}

data "external" "server_version" {
  program = ["sh", "-c", "cat ../server/package.json | jq  '{\"version\": .version }'"]
}

# Build Docker image and push to ECR from folder: ./example-service-directory
module "ecr_docker_build" {
  source = "github.com/onnimonni/terraform-ecr-docker-build-module"

  # Absolute path into the service which needs to be build
  dockerfile_folder = "${path.module}/../server"

  # Tag for the builded Docker image (Defaults to 'latest')
  docker_image_tag = "${data.external.server_version.result.version}"
  
  # The region which we will log into with aws-cli
  aws_region = "ap-southeast-2"

  # ECR repository where we can push
  ecr_repository_url = "${aws_ecr_repository.docker-repo.repository_url}"
}

data "archive_file" "hack-server-package" {
  type        = "zip"
  source {
    content  = "${templatefile("${path.module}/../server/Dockerrun.aws.json", map("imageName", "${module.ecr_docker_build.ecr_image_url}"))}"
    filename = "Dockerrun.aws.json"
  }
  output_path = "hack-server-${data.external.server_version.result.version}.zip"
}

resource "aws_elastic_beanstalk_application" "hack-server" {
  name = "hack-server"
}

resource "aws-uncontrolled_elastic_beanstalk_application_version" "current-version" {
  application_name = "${aws_elastic_beanstalk_application.hack-server.name}"
  application_store_bucket_name = "${aws_s3_bucket.app_sources.bucket}"
  application_version_filename = "${data.archive_file.hack-server-package.output_path}"
}

data "aws_iam_role" "aws-elasticbeanstalk-ec2-role" {
  name = "aws-elasticbeanstalk-ec2-role"
}

data "aws_iam_policy" "ecr-readonly-policy" {
  arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "ecr-policy-attach" {
  role = "${data.aws_iam_role.aws-elasticbeanstalk-ec2-role.name}"
  policy_arn = "${data.aws_iam_policy.ecr-readonly-policy.arn}"
}

resource "aws_elastic_beanstalk_environment" "hack-server-env" {
  name                = "hack-server"
  version_label       = "${aws-uncontrolled_elastic_beanstalk_application_version.current-version.application_version_label}"
  application         = "${aws_elastic_beanstalk_application.hack-server.name}"
  solution_stack_name = "64bit Amazon Linux 2018.03 v2.12.17 running Docker 18.06.1-ce"

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "${aws_iam_role_policy_attachment.ecr-policy-attach.role}"
  }
}

resource "aws_route53_record" "api_domain" {
  zone_id = "${data.aws_route53_zone.lukekaalim_zone.zone_id}"
  name    = "api.sushi.${data.aws_route53_zone.lukekaalim_zone.name}"
  type    = "CNAME"
  ttl     = "300"
  records = ["${aws_elastic_beanstalk_environment.hack-server-env.cname}"]
}

output "asset_server" {
  value = "http://assets.sushi.${data.aws_route53_zone.lukekaalim_zone.name}"
}
output "hackathon_server" {
  value = "http://api.sushi.${data.aws_route53_zone.lukekaalim_zone.name}"
}
output "hackathon_server_origin" {
  value = "http://${aws_elastic_beanstalk_environment.hack-server-env.cname}"
}
output "docker_image" {
  value = "${module.ecr_docker_build.ecr_image_url}"
}