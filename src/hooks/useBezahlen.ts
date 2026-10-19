import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bezahlen } from "../lib/bezahlenactions";

export function useBezahlen() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bezahlen,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kassenArtikels"] });
        },
    });
}