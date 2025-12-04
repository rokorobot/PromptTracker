import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, promptsApi, workspacesApi, usersApi, CreatePromptData } from "./services/api";

// Prompts hooks
export function usePrompts(workspaceId: string, filters?: { search?: string; collectionId?: string; tags?: string[] }) {
    const { fetchApi } = useApiClient();

    return useQuery({
        queryKey: ["prompts", workspaceId, filters],
        queryFn: () => promptsApi.list(fetchApi, workspaceId, filters),
        enabled: !!workspaceId,
    });
}

export function usePrompt(id: string) {
    const { fetchApi } = useApiClient();

    return useQuery({
        queryKey: ["prompt", id],
        queryFn: () => promptsApi.get(fetchApi, id),
        enabled: !!id,
    });
}

export function useCreatePrompt() {
    const { fetchApi } = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePromptData) => promptsApi.create(fetchApi, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prompts"] });
        },
    });
}

export function useCreateVersion() {
    const { fetchApi } = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ promptId, content }: { promptId: string; content: string }) =>
            promptsApi.createVersion(fetchApi, promptId, content),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["prompt", variables.promptId] });
            queryClient.invalidateQueries({ queryKey: ["prompts"] });
        },
    });
}

// Workspaces hooks
export function useWorkspaces() {
    const { fetchApi } = useApiClient();

    return useQuery({
        queryKey: ["workspaces"],
        queryFn: () => workspacesApi.list(fetchApi),
    });
}

export function useWorkspace(id: string) {
    const { fetchApi } = useApiClient();

    return useQuery({
        queryKey: ["workspace", id],
        queryFn: () => workspacesApi.get(fetchApi, id),
        enabled: !!id,
    });
}

export function useCreateWorkspace() {
    const { fetchApi } = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ name, type }: { name: string; type: "PERSONAL" | "TEAM" }) =>
            workspacesApi.create(fetchApi, name, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
    });
}

// User hooks
export function useSyncUser() {
    const { fetchApi } = useApiClient();

    return useMutation({
        mutationFn: (data: { name?: string; imageUrl?: string }) => usersApi.sync(fetchApi, data),
    });
}

export function useCurrentUser() {
    const { fetchApi } = useApiClient();

    return useQuery({
        queryKey: ["currentUser"],
        queryFn: () => usersApi.me(fetchApi),
    });
}
