import { useAuth } from "@clerk/nextjs";

export interface Prompt {
    id: string;
    title: string;
    description?: string;
    workspaceId: string;
    collectionId?: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
    tags: Array<{ tag: { name: string } }>;
    versions: Array<{
        id: string;
        versionNumber: number;
        content: string;
        isDefault: boolean;
    }>;
    _count: { versions: number };
}

export interface CreatePromptData {
    workspaceId: string;
    collectionId?: string;
    title: string;
    description?: string;
    content: string;
    tags?: string[];
}

export interface Workspace {
    id: string;
    name: string;
    type: "PERSONAL" | "TEAM";
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Hook to get authenticated fetch function
export function useApiClient() {
    const { getToken } = useAuth();

    const fetchApi = async (url: string, options: RequestInit = {}) => {
        const token = await getToken();
        console.log('🎫 Token retrieved:', token ? `${token.substring(0, 20)}...` : 'NULL');

        const response = await fetch(`${API_URL}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "An error occurred" }));
            throw new Error(error.message || response.statusText);
        }

        return response.json();
    };

    return { fetchApi };
}

// Prompts API
export const promptsApi = {
    list: async (fetchApi: any, workspaceId: string, filters?: { search?: string; collectionId?: string; tags?: string[] }) => {
        const params = new URLSearchParams({ workspaceId });
        if (filters?.search) params.append("search", filters.search);
        if (filters?.collectionId) params.append("collectionId", filters.collectionId);
        if (filters?.tags) filters.tags.forEach(tag => params.append("tags", tag));

        return fetchApi(`/prompts?${params.toString()}`);
    },

    get: async (fetchApi: any, id: string) => {
        return fetchApi(`/prompts/${id}`);
    },

    create: async (fetchApi: any, data: CreatePromptData) => {
        return fetchApi("/prompts", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    createVersion: async (fetchApi: any, promptId: string, content: string) => {
        return fetchApi(`/prompts/${promptId}/versions`, {
            method: "POST",
            body: JSON.stringify({ content }),
        });
    },
};

// Workspaces API
export const workspacesApi = {
    list: async (fetchApi: any) => {
        return fetchApi("/workspaces");
    },

    get: async (fetchApi: any, id: string) => {
        return fetchApi(`/workspaces/${id}`);
    },

    create: async (fetchApi: any, name: string, type: "PERSONAL" | "TEAM" = "TEAM") => {
        return fetchApi("/workspaces", {
            method: "POST",
            body: JSON.stringify({ name, type }),
        });
    },
};

// Collections API
export const collectionsApi = {
    list: async (fetchApi: any, workspaceId: string) => {
        return fetchApi(`/collections?workspaceId=${workspaceId}`);
    },

    get: async (fetchApi: any, id: string) => {
        return fetchApi(`/collections/${id}`);
    },

    create: async (fetchApi: any, workspaceId: string, data: { name: string; description?: string }) => {
        return fetchApi("/collections", {
            method: "POST",
            body: JSON.stringify({ ...data, workspaceId }),
        });
    },

    update: async (fetchApi: any, id: string, data: { name?: string; description?: string }) => {
        return fetchApi(`/collections/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    delete: async (fetchApi: any, id: string) => {
        return fetchApi(`/collections/${id}`, {
            method: "DELETE",
        });
    },
};

// Users API
export const usersApi = {
    sync: async (fetchApi: any, data: { name?: string; imageUrl?: string }) => {
        return fetchApi("/users/sync", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    me: async (fetchApi: any) => {
        return fetchApi("/users/me");
    },
};
