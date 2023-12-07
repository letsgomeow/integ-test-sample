import * as cdk from "aws-cdk-lib";
import { IConstruct } from "constructs";
import * as logs from "aws-cdk-lib/aws-logs";

/**
 * integ-testヘルパークラス
 *
 * @remarks
 * テスト対象スタックにこのAspectを付与することにより、該当リソースのRemovalPolicyをDESTROYに上書きする。
 */
export class ApplyDestroyPolicyAspect implements cdk.IAspect {
  public visit(node: IConstruct) {
    if (node instanceof logs.CfnLogGroup) {
      node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
  }
}
