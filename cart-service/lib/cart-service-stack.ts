import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'node:path';

export class CartServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaHandler = new lambda.DockerImageFunction(this, 'CartServiceNestHandler', {
      timeout: cdk.Duration.seconds(30),
      functionName: 'CartServiceNestHandler',
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, '../../app')),
    });

    const api = new apigateway.RestApi(this, 'CartApi', {
      deploy: true,
      restApiName: 'Cart Service',
      description: 'This is the Cart Service API',
    });

    api.root.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(lambdaHandler, {
        proxy: true,
      }),
    });

    new cdk.CfnOutput(this, 'CartServiceUrl', {
      value: api.url,
    });
  }
}
