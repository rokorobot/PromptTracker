import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MemberRole } from '@prisma/client';

@Injectable()
export class PromptsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, data: { workspaceId: string; collectionId?: string; title: string; description?: string; content: string; tags?: string[] }) {
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        await this.verifyWorkspaceAccess(user.id, data.workspaceId, [MemberRole.OWNER, MemberRole.EDITOR]);

        return this.prisma.$transaction(async (tx) => {
            // Create prompt
            const prompt = await tx.prompt.create({
                data: {
                    workspaceId: data.workspaceId,
                    collectionId: data.collectionId,
                    title: data.title,
                    description: data.description,
                    createdById: user.id,
                },
            });

            // Create initial version
            await tx.promptVersion.create({
                data: {
                    promptId: prompt.id,
                    versionNumber: 1,
                    content: data.content,
                    isDefault: true,
                    createdById: user.id,
                },
            });

            // Handle tags
            if (data.tags && data.tags.length > 0) {
                for (const tagName of data.tags) {
                    // Find or create tag
                    const tag = await tx.tag.upsert({
                        where: { name: tagName },
                        update: {},
                        create: { name: tagName },
                    });

                    // Link tag to prompt
                    await tx.promptTag.create({
                        data: {
                            promptId: prompt.id,
                            tagId: tag.id,
                        },
                    });
                }
            }

            return prompt;
        });
    }

    async findAll(userId: string, workspaceId: string, filters?: { collectionId?: string; search?: string; tags?: string[] }) {
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        await this.verifyWorkspaceAccess(user.id, workspaceId);

        const where: any = { workspaceId };

        if (filters?.collectionId) {
            where.collectionId = filters.collectionId;
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                {
                    versions: {
                        some: {
                            content: { contains: filters.search, mode: 'insensitive' }
                        }
                    }
                },
                {
                    tags: {
                        some: {
                            tag: {
                                name: { contains: filters.search, mode: 'insensitive' }
                            }
                        }
                    }
                }
            ];
        }

        if (filters?.tags && filters.tags.length > 0) {
            where.tags = {
                some: {
                    tag: {
                        name: { in: filters.tags },
                    },
                },
            };
        }

        return this.prisma.prompt.findMany({
            where,
            include: {
                versions: {
                    where: { isDefault: true },
                    take: 1,
                },
                tags: {
                    include: { tag: true },
                },
                _count: {
                    select: { versions: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async findOne(userId: string, id: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        const prompt = await this.prisma.prompt.findUnique({
            where: { id },
            include: {
                versions: {
                    orderBy: { versionNumber: 'desc' },
                    include: {
                        createdBy: {
                            select: { id: true, name: true, imageUrl: true },
                        },
                    },
                },
                tags: {
                    include: { tag: true },
                },
                collection: true,
                createdBy: {
                    select: { id: true, name: true, imageUrl: true },
                },
            },
        });

        if (!prompt) throw new NotFoundException('Prompt not found');

        await this.verifyWorkspaceAccess(user.id, prompt.workspaceId);

        return prompt;
    }

    async update(userId: string, id: string, data: { title?: string; description?: string; tags?: string[]; collectionId?: string | null }) {
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        const prompt = await this.prisma.prompt.findUnique({ where: { id } });
        if (!prompt) throw new NotFoundException('Prompt not found');

        await this.verifyWorkspaceAccess(user.id, prompt.workspaceId, [MemberRole.OWNER, MemberRole.EDITOR]);

        return this.prisma.$transaction(async (tx) => {
            // Update basic fields
            const updated = await tx.prompt.update({
                where: { id },
                data: {
                    title: data.title,
                    description: data.description,
                    collectionId: data.collectionId,
                },
            });

            // Handle tags if provided
            if (data.tags !== undefined) {
                // Remove existing tags
                await tx.promptTag.deleteMany({
                    where: { promptId: id },
                });

                // Add new tags
                if (data.tags.length > 0) {
                    for (const tagName of data.tags) {
                        // Find or create tag
                        const tag = await tx.tag.upsert({
                            where: { name: tagName },
                            update: {},
                            create: { name: tagName },
                        });

                        // Link tag to prompt
                        await tx.promptTag.create({
                            data: {
                                promptId: id,
                                tagId: tag.id,
                            },
                        });
                    }
                }
            }

            // Return updated prompt with relations
            return tx.prompt.findUnique({
                where: { id },
                include: {
                    versions: {
                        orderBy: { versionNumber: 'desc' },
                    },
                    tags: {
                        include: { tag: true },
                    },
                },
            });
        });
    }

    async delete(userId: string, id: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        const prompt = await this.prisma.prompt.findUnique({ where: { id } });
        if (!prompt) throw new NotFoundException('Prompt not found');

        await this.verifyWorkspaceAccess(user.id, prompt.workspaceId, [MemberRole.OWNER, MemberRole.EDITOR]);

        // Delete in transaction to ensure all related data is removed
        return this.prisma.$transaction(async (tx) => {
            // Delete prompt runs (via versions)
            const versions = await tx.promptVersion.findMany({
                where: { promptId: id },
                select: { id: true },
            });

            for (const version of versions) {
                await tx.promptRun.deleteMany({
                    where: { promptVersionId: version.id },
                });
            }

            // Delete versions
            await tx.promptVersion.deleteMany({
                where: { promptId: id },
            });

            // Delete tags
            await tx.promptTag.deleteMany({
                where: { promptId: id },
            });

            // Delete prompt
            return tx.prompt.delete({
                where: { id },
            });
        });
    }

    async createVersion(userId: string, promptId: string, data: { content: string; model?: string }) {
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        const prompt = await this.prisma.prompt.findUnique({ where: { id: promptId } });
        if (!prompt) throw new NotFoundException('Prompt not found');

        await this.verifyWorkspaceAccess(user.id, prompt.workspaceId, [MemberRole.OWNER, MemberRole.EDITOR]);

        // Get last version number
        const lastVersion = await this.prisma.promptVersion.findFirst({
            where: { promptId },
            orderBy: { versionNumber: 'desc' },
        });

        const newVersionNumber = (lastVersion?.versionNumber || 0) + 1;

        return this.prisma.promptVersion.create({
            data: {
                promptId,
                versionNumber: newVersionNumber,
                content: data.content,
                model: data.model,
                createdById: user.id,
            },
        });
    }

    async logRun(userId: string, versionId: string, data: { rating?: number; notes?: string; usedModel?: string; responseLength?: number }) {
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        const version = await this.prisma.promptVersion.findUnique({
            where: { id: versionId },
            include: { prompt: true },
        });

        if (!version) throw new NotFoundException('Version not found');

        await this.verifyWorkspaceAccess(user.id, version.prompt.workspaceId);

        return this.prisma.promptRun.create({
            data: {
                promptVersionId: versionId,
                createdById: user.id,
                ...data,
            },
        });
    }

    private async verifyWorkspaceAccess(userId: string, workspaceId: string, requiredRoles: MemberRole[] = []) {
        const member = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
        });

        if (!member) throw new ForbiddenException('Access denied to workspace');

        if (requiredRoles.length > 0 && !requiredRoles.includes(member.role)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return member;
    }
}
