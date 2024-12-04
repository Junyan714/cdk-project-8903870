import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class CdkProject8903870Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 Bucket
    const myBucket = new s3.Bucket(this, 'Bucket8903870', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
    });

    // Create DynamoDB Table
    const myTable = new dynamodb.Table(this, 'DynamoDB8903870', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'DynamoDB8903870',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
    });

    // Create Lambda Function
    const myLambda = new lambda.Function(this, 'Lambda8903870', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Hello from Lambda!');
          return { statusCode: 200, body: 'Hello from Lambda!' };
        };
      `),
      environment: {
        BUCKET_NAME: myBucket.bucketName,
        TABLE_NAME: myTable.tableName,
      },
    });

    // Grant permissions for Lambda to read/write to S3 and DynamoDB
    myBucket.grantReadWrite(myLambda);
    myTable.grantReadWriteData(myLambda);

    // Output resource information
    new cdk.CfnOutput(this, 'BucketName', {
      value: myBucket.bucketName,
      description: 'Name of the S3 Bucket',
    });

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: myLambda.functionName,
      description: 'Name of the Lambda Function',
    });

    new cdk.CfnOutput(this, 'DynamoDBTableName', {
      value: myTable.tableName,
      description: 'Name of the DynamoDB Table',
    });
  }
}
