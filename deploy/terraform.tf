terraform {
  backend "remote" {
    organization = "luke"

    workspaces {
      name = "atlas"
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