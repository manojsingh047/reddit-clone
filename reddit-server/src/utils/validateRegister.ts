import { FieldError } from "./../resolvers/FieldError";
import { UserRegisterInput } from "./../resolvers/UserRegisterInput";

export const validateRegister = ({ userName, email, password, firstName }: UserRegisterInput): FieldError[] | null => {
    if ((userName || "").trim().length <= 2) {
        return [
            {
                field: "userName",
                message: "provide username with atleast 3 characters",
            },
        ]
    }
    if ((userName || "").includes("@")) {
        return [
            {
                field: "userName",
                message: "username can't have @",
            },
        ]
    }
    if ((email || "").trim().length <= 2) {
        return [
            {
                field: "userName",
                message: "provide email with atleast 3 characters",
            },
        ]
    }
    if (!(email || "").includes("@")) {
        return [
            {
                field: "email",
                message: "email must have @",
            },
        ]
    }
    if ((password || "").trim().length <= 2) {
        return [
            {
                field: "password",
                message: "provide password with atleast 3 characters",
            },
        ]
    }
    if ((firstName || "").trim().length <= 2) {
        return [
            {
                field: "firstName",
                message: "provide firstName with atleast 3 characters",
            },
        ]
    }
    return null;
}