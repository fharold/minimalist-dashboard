import {randomBytes} from "crypto";

export namespace StringUtils {
    export function isAnEmail(email: string): boolean {
        //redundant check as typescript is not strict enough.
        if (!email) return false;

        const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return !!email.toLowerCase().match(regexEmail);
    }

    /**
     * Verify password strength.
     * Should contain between 8 and 32 characters.
     * Should contain at least one lowercase, one uppercase, one digit and a special character.
     * @param password
     */
    export function isPasswordStrongEnough(password: string): boolean {
        //redundant check as typescript is not strict enough.
        if (!password) return false;

        const regexPassword = /^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{8,32}$/;

        return !!password.match(regexPassword);
    }

    export function generatePseudoRandomString(length: number): string {
        let buffer = String();
        randomBytes(length).forEach(
            randomValue => {
                let maxedValue = randomValue % 36;
                buffer += maxedValue.toString(36).substring(0, 1)
            });
        return buffer;
    }
}