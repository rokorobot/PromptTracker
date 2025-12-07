import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, promptsApi, workspacesApi, usersApi, collectionsApi, CreatePromptData } from "./services/api";

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

export function useDeletePrompt() {
    const { fetchApi } = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => fetchApi(`/prompts/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prompts"] });
        },
    });
}
// Collections hooks
export function useCollections(workspaceId: string) {
    const { fetchApi } = useApiClient();

    return useQuery({
        queryKey: ["collections", workspaceId],
        queryFn: () => collectionsApi.list(fetchApi, workspaceId),
        enabled: !!workspaceId,
    });
}

export function useCollection(id: string) {
    const { fetchApi } = useApiClient();

    return useQuery({
        queryKey: ["collection", id],
        queryFn: () => collectionsApi.get(fetchApi, id),
        enabled: !!id,
    });
}

export function useCreateCollection() {
    const { fetchApi } = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workspaceId, name, description }: { workspaceId: string; name: string; description?: string }) =>
            collectionsApi.create(fetchApi, workspaceId, { name, description }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["collections", variables.workspaceId] });
        },
    });
}

export function useUpdateCollection() {
    const { fetchApi } = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, name, description }: { id: string; name?: string; description?: string }) =>
            collectionsApi.update(fetchApi, id, { name, description }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["collection", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["collections"] });
        },
    });
}

export function useDeleteCollection() {
    const { fetchApi } = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => collectionsApi.delete(fetchApi, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
        },
    });
}
