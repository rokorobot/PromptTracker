import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, WorkspaceType, MemberRole } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async findByClerkId(clerkId: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { clerkId },
        });
    }

    async syncUser(data: { clerkId: string; email: string; name?: string; imageUrl?: string }) {
        const { clerkId, email, name, imageUrl } = data;

        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { clerkId },
            include: { ownedWorkspaces: true },
        });

        if (existingUser) {
            // Update existing user
            await this.prisma.user.update({
                where: { id: existingUser.id },
                data: { email, name, imageUrl },
            });

            // Ensure user has at least one workspace
            if (existingUser.ownedWorkspaces.length === 0) {
                const workspace = await this.prisma.workspace.create({
                    data: {
                        name: `${name || 'User'}'s Workspace`,
                        type: WorkspaceType.PERSONAL,
                        ownerId: existingUser.id,
                    },
                });

                await this.prisma.workspaceMember.create({
                    data: {
                        workspaceId: workspace.id,
                        userId: existingUser.id,
                        role: MemberRole.OWNER,
                    },
                });
            }

            return existingUser;
        }

        // Create new user and personal workspace
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    clerkId,
                    email,
                    name,
                    imageUrl,
                },
            });

            // Create personal workspace
            const workspace = await tx.workspace.create({
                data: {
                    name: `${name || 'User'}'s Workspace`,
                    type: WorkspaceType.PERSONAL,
                    ownerId: user.id,
                },
            });

            // Add user as owner of the workspace
            await tx.workspaceMember.create({
                data: {
                    workspaceId: workspace.id,
                    userId: user.id,
                    role: MemberRole.OWNER,
                },
            });

            return user;
        });
    }
}
