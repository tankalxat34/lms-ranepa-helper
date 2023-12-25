/// <reference types="chrome-types" />

declare module "*.png";
declare module "*.jpg";
declare module "*.svg";
declare module "*.html";



// ChatGPT
interface IOpenAIUserObject {
    user: {
        id: string
        name: string
        email: string
        image: string
        picture: string
        idp: string
        iat: number
        mfa: boolean
        groups: any[]
        intercom_hash: string
    }
    expires: string
    accessToken: string
    authProvider: string
}

interface IChatGPTMessage {
    role: string
    content: string
}
