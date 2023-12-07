import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import * as it from "@aws-cdk/integ-tests-alpha";

import { ServerlessStack } from "../lib/stack/serverless-stack";
import { ApplyDestroyPolicyAspect } from "./helper";

// テスト対象のCDKアプリケーションを作成
const app = new cdk.App();
// テスト対象のスタックを作成。このスタック内部でAPI GatewayとLambda関数が作成される。
const target = new ServerlessStack(app, "TestTargetStack");
// Lambda関数に紐づくCloudWatch LogsロググループのDeletionPolicyを上書きするアスペクトを登録。
cdk.Aspects.of(target).add(new ApplyDestroyPolicyAspect());

// integ-testコンストラクタ作成
// testCasesの配列にテスト対象のコンストラクタを登録する
const integ = new it.IntegTest(app, "IntegTest", {
  testCases: [target],
});

// テスト対象のスタックに対してアサーションを実施
const assersion = integ.assertions
  // API Gatewayリソースにhttp GETでアクセスする。
  // 本関数を登録することにより内部でLambda関数が登録され、httpアクセスを行う。
  .httpApiCall(`${target.restApiConstruct.restApi.url}foo`, {
    method: "GET",
    port: 443,
  })
  // 上記Lambda関数の応答内容をアサーションする。
  // httpのボディ部に以下のJSONが含まれるはず、というテストケースです。
  .expect(
    it.ExpectedResult.objectLike({
      body: { calledPath: "/foo", calledMethod: "GET" },
    }),
  );
