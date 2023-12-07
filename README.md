# integ-testのサンプルです

## integ-test実行方法
````shell
npx integ-runner --directory ./integ-tests --parallel-regions ap-northeast-1 --update-on-failed --clean
````

## CDK標準ライブラリに対して、以下を追加しています。
```shell
npm install --save-dev @aws-cdk/integ-runner @aws-cdk/integ-tests-alpha
npm install --save-dev esbuild
```

## 参考情報
- integ-runner  
  https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/integ-runner
- integ-test  
  https://docs.aws.amazon.com/cdk/api/v2/docs/integ-tests-alpha-readme.html
- integ-test sample  
  https://github.com/aws-samples/cdk-integ-tests-sample/blob/main/integ-tests/integ.sns-sqs-ddb.ts
- integ-test blog  
  https://aws.amazon.com/jp/blogs/news/how-to-write-and-execute-integration-tests-for-aws-cdk-applications/