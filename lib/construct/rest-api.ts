import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as iam from "aws-cdk-lib/aws-iam";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

import { BackendLambdaConstruct } from "./backend-lambda";

/**
 * テスト対象のAPI Gatewayコンストラクタ
 */
export class RestApiConstruct extends Construct {
  // テスト対象のAPI Gateway。integ-runner側でテストすべきURLを設定するためにプロパティ公開する。
  public readonly restApi: apigateway.RestApi;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Lambda関数を作成する
    const backendFunction = new BackendLambdaConstruct(this, "BackendFunction");

    // API GatewayがLambdaを起動するために必要なIAMポリシーを作成する
    const apiGatewayLambdaExecutionPolicy = new iam.ManagedPolicy(
      this,
      "ApiGatewayLambdaExecutionPolicy",
      {
        managedPolicyName: "ApiGatewayLambdaExecutionPolicy",
        statements: [
          new iam.PolicyStatement({
            sid: "ApiGatewayLambdaExecution",
            effect: iam.Effect.ALLOW,
            actions: ["lambda:InvokeFunction"],
            resources: [
              `arn:aws:lambda:${cdk.Stack.of(this).region}:${
                cdk.Stack.of(this).account
              }:function:*`,
            ],
          }),
        ],
      },
    );
    // API GatewayがLambdaを起動するために必要なIAMロールを作成する
    const apiGatewayLambdaExecutionRole = new iam.Role(
      this,
      "ApiGatewayLambdaExecutionRole",
      {
        roleName: "ApiGatewayLambdaExecutionRole",
        assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
        managedPolicies: [apiGatewayLambdaExecutionPolicy],
      },
    );

    // API Gatewayを作成する
    this.restApi = new apigateway.RestApi(this, "RestApi", {
      restApiName: "TestTargetApi",
      // CDKデプロイ時に、自動的にAPI Gatewayリソースもデプロイされるように設定
      deploy: true,
      deployOptions: {
        stageName: "test-stage",
      },
      retainDeployments: true,
      endpointConfiguration: {
        // サンプルとしてテストしやすいようにインターネット公開のAPI Gatewayを作成する
        types: [apigateway.EndpointType.EDGE],
      },
      cloudWatchRole: true,
      cloudWatchRoleRemovalPolicy: cdk.RemovalPolicy.DESTROY,
      // API Gatewayのリソース作成時にデフォルトで紐づけるLambda関数を登録する
      defaultIntegration: new apigateway.LambdaIntegration(
        backendFunction.function,
        {
          timeout: cdk.Duration.seconds(29),
          credentialsRole: apiGatewayLambdaExecutionRole,
        },
      ),
    });

    // API Gatewayにリソースを登録する。
    const foo = this.restApi.root.addResource("foo");
    foo.addMethod("GET");
    const bar = this.restApi.root.addResource("bar");
    bar.addMethod("POST");
    const baz = this.restApi.root.addResource("baz");
    baz.addMethod("GET");

    new cdk.CfnOutput(this, "URL", {
      value: `${this.restApi.url}/${this.restApi.deploymentStage.stageName}`,
    });
  }
}
