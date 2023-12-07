import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { RestApiConstruct } from "../construct/rest-api";

/**
 * テスト対象スタック
 */
export class ServerlessStack extends cdk.Stack {
  public readonly restApiConstruct: RestApiConstruct;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.restApiConstruct = new RestApiConstruct(this, "Serverless");
  }
}
