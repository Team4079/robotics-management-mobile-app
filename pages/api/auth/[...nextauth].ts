import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"
import { RoboticsManagementConfig } from "../../../config/RoboticsManagementConfig";

export default NextAuth({
    secret: RoboticsManagementConfig.SECRET,
    providers: [
        GoogleProvider({
            clientId: RoboticsManagementConfig.GOOGLE_OAUTH.CLIENT_ID,
            clientSecret: RoboticsManagementConfig.GOOGLE_OAUTH.CLIENT_SECRET
        }),
        EmailProvider({
            server: RoboticsManagementConfig.GOOGLE_NODEMAILER,
            from: RoboticsManagementConfig.EMAIL_AUTH_FROM
        })
    ],
    adapter: DynamoDBAdapter(RoboticsManagementConfig.DDB_DOCUMENT),
    pages: {
        signIn: '/auth/signin',
        // signOut: '/auth/signout',
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
      }
})