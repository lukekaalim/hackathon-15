terraform {
  backend "remote" {
    organization = "luke"

    workspaces {
      name = "hackathon-15"
    }
  }
}

provider "aws" {
  profile    = "default"
  region     = "ap-southeast-2"
}

provider "aws-uncontrolled" {
  region = "ap-southeast-2"
}