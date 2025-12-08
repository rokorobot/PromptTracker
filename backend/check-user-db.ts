import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const clerkId = 'user_36Ifs1P8UWzxJL3uS022JtPElpD';
    console.log(`Checking user with Clerk ID: ${clerkId}`);

    const user = await prisma.user.findUnique({
        where: { clerkId },
        include: {
            ownedWorkspaces: true,
            workspaceMembers: {
                include: {
                    workspace: true,
                },
            },
        },
    });

    if (!user) {
        console.log('❌ User NOT found in database.');
    } else {
        console.log('✅ User found:', user.id, user.email);
        console.log('Owned Workspaces:', user.ownedWorkspaces.length);
        user.ownedWorkspaces.forEach(w => console.log(` - ${w.name} (${w.id})`));

        console.log('Member Workspaces:', user.workspaceMembers.length);
        user.workspaceMembers.forEach(m => console.log(` - ${m.workspace.name} (${m.workspace.id}) as ${m.role}`));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
