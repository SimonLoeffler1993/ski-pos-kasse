import { useMutation } from "@tanstack/react-query";
import { sendeQuittungMail } from "../lib/bezahlenactions";

export function useQuittungMail() {
    return useMutation({
        mutationFn: sendeQuittungMail,
    });
}
