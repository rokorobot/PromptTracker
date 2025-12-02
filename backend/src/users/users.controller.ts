import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('sync')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Sync Clerk user to database' })
    async syncUser(@Request() req, @Body() body: { name?: string; imageUrl?: string }) {
        // req.user is populated by JwtStrategy
        const { userId, email } = req.user;
        return this.usersService.syncUser({
            clerkId: userId,
            email,
            name: body.name,
            imageUrl: body.imageUrl,
        });
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    async getMe(@Request() req) {
        const { userId } = req.user;
        return this.usersService.findByClerkId(userId);
    }
}
