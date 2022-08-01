export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "mpsdriverapp": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string",
            "CreatedSNSRole": "string"
        }
    },
    "storage": {
        "s3mpsdriverappstoragedev": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "api": {
        "mpsdriverapp": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    }
}