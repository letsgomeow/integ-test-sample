import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";

import * as path from "path";

/**
 * Lambda関数作成コンストラクタ
 */
export class BackendLambdaConstruct extends Construct {
  public readonly function: lambda.IFunction;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // integ-test側でremovalPolicyの上書き設定するためにここでロググループを作成しています。
    const logGroup = new logs.LogGroup(this, "BackendFunctionLog", {
      logGroupName: "/aws/lambda/BackendFunction",
      retention: logs.RetentionDays.ONE_DAY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Lambda関数を登録する
    this.function = new lambdaNodeJS.NodejsFunction(this, "BackendFunction", {
      functionName: "BackendFunction",
      entry: path.join(__dirname, "lambda/hello-world.ts"),
      handler: "helloHandler",
      timeout: cdk.Duration.seconds(30),
      logGroup: logGroup,
      environment: {
        hoge: "fuga",
        bar: "baz",
        my: "value",
      },
    });
  }
}
