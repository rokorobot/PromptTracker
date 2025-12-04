import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('sync')
    // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Sync Clerk user to database' })
    async syncUser(@Request() req, @Body() body: { name?: string; imageUrl?: string }) {
        // TEMPORARY: Mock user for testing
        const userId = 'user_temp_test_123';
        const email = 'test@example.com';
        return this.usersService.syncUser({
            clerkId: userId,
            email,
            name: body.name || 'Test User',
            imageUrl: body.imageUrl,
        });
    }

    @Get('me')
    // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    async getMe(@Request() req) {
        // TEMPORARY: Mock user for testing
        const userId = 'user_temp_test_123';
        return this.usersService.findByClerkId(userId);
    }
}
