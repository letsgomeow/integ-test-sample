#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { ServerlessStack } from "../lib/stack/serverless-stack";

const app = new cdk.App();

// すべてのリソースにタグを付与する
cdk.Tags.of(app).add("Project", "Qiita-Sample");

new ServerlessStack(app, "ServerlessStack");
