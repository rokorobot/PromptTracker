import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollectionsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, workspaceId: string, data: { name: string; description?: string }) {
        // Verify access to workspace
        await this.verifyWorkspaceAccess(userId, workspaceId);

        return this.prisma.collection.create({
            data: {
                ...data,
                workspaceId,
            },
        });
    }

    async findAll(userId: string, workspaceId: string) {
        await this.verifyWorkspaceAccess(userId, workspaceId);

        return this.prisma.collection.findMany({
            where: { workspaceId },
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { prompts: true },
                },
            },
        });
    }

    async findOne(userId: string, id: string) {
        const collection = await this.prisma.collection.findUnique({
            where: { id },
        });

        if (!collection) throw new NotFoundException('Collection not found');

        await this.verifyWorkspaceAccess(userId, collection.workspaceId);

        return collection;
    }

    async update(userId: string, id: string, data: { name?: string; description?: string }) {
        const collection = await this.prisma.collection.findUnique({
            where: { id },
        });

        if (!collection) throw new NotFoundException('Collection not found');

        await this.verifyWorkspaceAccess(userId, collection.workspaceId);

        return this.prisma.collection.update({
            where: { id },
            data,
        });
    }

    async remove(userId: string, id: string) {
        const collection = await this.prisma.collection.findUnique({
            where: { id },
        });

        if (!collection) throw new NotFoundException('Collection not found');

        await this.verifyWorkspaceAccess(userId, collection.workspaceId);

        return this.prisma.collection.delete({
            where: { id },
        });
    }

    private async verifyWorkspaceAccess(userId: string, workspaceId: string) {
        const user = await this.prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new NotFoundException('User not found');

        const member = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: user.id,
                },
            },
        });

        if (!member) throw new ForbiddenException('Access denied to workspace');
        return member;
    }
}
