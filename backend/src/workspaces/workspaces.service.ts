import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceType, MemberRole } from '@prisma/client';

@Injectable()
export class WorkspacesService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, name: string, type: WorkspaceType = WorkspaceType.TEAM) {
        // Get internal user ID
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        return this.prisma.$transaction(async (tx) => {
            const workspace = await tx.workspace.create({
                data: {
                    name,
                    type,
                    ownerId: user.id,
                },
            });

            await tx.workspaceMember.create({
                data: {
                    workspaceId: workspace.id,
                    userId: user.id,
                    role: MemberRole.OWNER,
                },
            });

            return workspace;
        });
    }

    async findAllForUser(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        return this.prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId: user.id,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    async findOne(id: string, userId: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        const workspace = await this.prisma.workspace.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
        });

        if (!workspace) throw new NotFoundException('Workspace not found');

        // Check if user is a member
        const isMember = workspace.members.some((m) => m.userId === user.id);
        if (!isMember) throw new ForbiddenException('Access denied');

        return workspace;
    }

    async update(id: string, userId: string, data: { name?: string }) {
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        // Check permissions (Owner or Editor)
        const member = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: id,
                    userId: user.id,
                },
            },
        });

        if (!member || member.role === MemberRole.VIEWER) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return this.prisma.workspace.update({
            where: { id },
            data,
        });
    }

    async delete(id: string, userId: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        // Only owner can delete
        const member = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: id,
                    userId: user.id,
                },
            },
        });

        if (!member || member.role !== MemberRole.OWNER) {
            throw new ForbiddenException('Only owner can delete workspace');
        }

        return this.prisma.workspace.delete({
            where: { id },
        });
    }
}
