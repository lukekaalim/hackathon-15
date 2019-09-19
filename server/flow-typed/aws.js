// @flow strict

declare module "@aws-sdk/client-s3-node" {
  import type { PutObjectCommand }  from '@aws-sdk/client-s3-node/commands/PutObjectCommand';
  import type { HeadObjectCommand }  from '@aws-sdk/client-s3-node/commands/HeadObjectCommand';
  import type { GetObjectCommand }  from '@aws-sdk/client-s3-node/commands/GetObjectCommand';
  import type { DeleteObjectCommand }  from '@aws-sdk/client-s3-node/commands/DeleteObjectCommand';
  import type { ListObjectsCommand }  from '@aws-sdk/client-s3-node/commands/ListObjectsCommand';
  declare type ClientParams = {
    region?: string,
    accessKeyId?: string,
    secretAccessKey?: string,
  };
  declare export class S3Client {
    constructor(ClientParams): S3Client;
    send(PutObjectCommand): Promise<void>;
    send(GetObjectCommand): Promise<{ Body: Buffer }>;
    send(HeadObjectCommand): Promise<void>;
    send(DeleteObjectCommand): Promise<void>;
    send(ListObjectsCommand): Promise<{ Contents: Array<{ Key: string }>, NextMarker: string, IsTruncated: boolean }>
  }
}

declare module "@aws-sdk/client-s3-node/commands/PutObjectCommand" {
  declare type Params = {
    Body: string | Buffer,
    Bucket: string,
    Key: string,
  };
  declare export class PutObjectCommand {
    constructor(Params): PutObjectCommand;
  }
}
declare module "@aws-sdk/client-s3-node/commands/GetObjectCommand" {
  declare type Params = {
    Bucket: string,
    Key: string,
  }
  declare export class GetObjectCommand {
    constructor(Params): GetObjectCommand;
  }
}
declare module "@aws-sdk/client-s3-node/commands/HeadObjectCommand" {
  declare type Params = {
    Bucket: string,
    Key: string,
  }
  declare export class HeadObjectCommand {
    constructor(Params): HeadObjectCommand;
  }
}
declare module "@aws-sdk/client-s3-node/commands/DeleteObjectCommand" {
  declare type Params = {
    Bucket: string,
    Key: string,
  }
  declare export class DeleteObjectCommand {
    constructor(Params): DeleteObjectCommand;
  }
}
declare module "@aws-sdk/client-s3-node/commands/ListObjectsCommand" {
  declare type Params = {
    Bucket: string,
    Prefix?: string,
    MaxKeys?: number,
    Marker?: string,
  }
  declare export class ListObjectsCommand {
    constructor(Params): ListObjectsCommand;
  }
}