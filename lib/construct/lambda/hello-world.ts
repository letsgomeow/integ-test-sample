import * as lambda from "aws-lambda";

/**
 * Lambda関数
 *
 * @remarks
 * API Gatewayリソースされた際のパスと、httpメソッドをJSONオブジェクトとして応答する。</br>
 * 応答例: </br>
 * `{ "calledPath": "foo", "calledMethod": "GET"}`
 * @param event API Gatewayから転送されてくるパラメータ
 * @param context Lambdaコンテキスト
 */
export const helloHandler: lambda.APIGatewayProxyHandler = async (
  event,
  context,
) => {
  // API Gatewayから転送されてきたパラメータからアクセスパスとhttpメソッドを取得
  const calledPath = event.path;
  const calledMethod = event.httpMethod;

  // API Gatewayから転送されてきたパラメータやLambdaコンテキストをログ出力する。
  // 出力先は、Lambda関数登録時に紐づけたCloudWatch Logsのロググループ。
  const output = {
    log_type: "REST API response object",
    ...event,
  };
  console.log(JSON.stringify(output));
  console.log(JSON.stringify(context));

  // 以下のようなhttp応答を行う。httpボディにJSONオブジェクトを設定する。
  // `{ "calledPath": "foo", "calledMethod": "GET"}`
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      calledPath: calledPath,
      calledMethod: calledMethod,
    }),
  };
};
