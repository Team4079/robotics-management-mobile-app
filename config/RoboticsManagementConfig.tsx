import { DynamoDB, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { AuthenticationTypeOAuth2 } from "nodemailer/lib/smtp-connection";

const ENVVAR_DEFAULTS: {[key: string]: string} = {
    EMAIL_AUTH_FROM_EMAIL: "robotics-management-app@frc4079.org",
    EMAIL_AUTH_FROM_NAME: "Robotics Management App"
}

function getOptionalEnvVarOrDefault(key: string): string | undefined {
    return process.env[key] ?? ENVVAR_DEFAULTS[key]
}

function getRequiredEnvVar(key: string): string {
    const environmentVariableValue = process.env[key]
    if (environmentVariableValue != undefined) {
        return environmentVariableValue
    }
    else {
        throw new Error(`Required environment variable ${key} is not defined`)
    }
}

const ddbConfig = {
    credentials: {
        accessKeyId: process.env.DDB_AWS_ACCESS_KEY_ID ?? "fakeAccessKeyId",
        secretAccessKey: process.env.DDB_AWS_SECRET_ACCESS_KEY  ?? "fakeSecretAccessKey",
    },
    region: process.env.DDB_AWS_REGION ?? "us-west-2",
    endpoint: process.env.DDB_ENDPOINT ?? "http://db:8000"
}

export const RoboticsManagementConfig = {
    TABLE_NAME_REQUISITION: process.env.TABLE_NAME_REQUISITION ?? "requisitions",
    SECRET: process.env.SECRET ?? "secret",
    GOOGLE_OAUTH: {
        CLIENT_ID: getRequiredEnvVar("GOOGLE_OAUTH_ID"),
        CLIENT_SECRET: getRequiredEnvVar("GOOGLE_OAUTH_SECRET")
    },
    GOOGLE_NODEMAILER: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: getOptionalEnvVarOrDefault("EMAIL_AUTH_FROM_EMAIL"),
            clientId: getRequiredEnvVar("EMAIL_OAUTH_ID"),
            clientSecret:  getRequiredEnvVar("EMAIL_OAUTH_SECRET"),
            refreshToken: getRequiredEnvVar("EMAIL_OAUTH_REFRESH_TOKEN")
        } as AuthenticationTypeOAuth2,
        from: getOptionalEnvVarOrDefault("EMAIL_AUTH_FROM_EMAIL")
    },
    EMAIL_AUTH_FROM: `${getOptionalEnvVarOrDefault("EMAIL_AUTH_FROM_NAME")} <${getOptionalEnvVarOrDefault("EMAIL_AUTH_FROM_EMAIL")}>`,
    DDB_CLIENT: new DynamoDBClient(ddbConfig),
    DDB_DOCUMENT: DynamoDBDocument.from(new DynamoDB(ddbConfig), {
        marshallOptions: {
          convertEmptyValues: true,
          removeUndefinedValues: true,
          convertClassInstanceToMap: true,
        },
      })
}
