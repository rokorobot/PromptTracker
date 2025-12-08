import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Collections')
@Controller('collections')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) { }

    private getMockUserId() {
        return 'user_temp_test_123';
    }

    @Post()
    @ApiOperation({ summary: 'Create a new collection' })
    create(@Request() req, @Body() body: { workspaceId: string; name: string; description?: string }) {
        return this.collectionsService.create(req.user.userId, body.workspaceId, {
            name: body.name,
            description: body.description,
        });
    }

    @Get()
    @ApiOperation({ summary: 'List collections in a workspace' })
    @ApiQuery({ name: 'workspaceId', required: true })
    findAll(@Request() req, @Query('workspaceId') workspaceId: string) {
        return this.collectionsService.findAll(req.user.userId, workspaceId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get collection details' })
    findOne(@Request() req, @Param('id') id: string) {
        return this.collectionsService.findOne(req.user.userId, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update collection' })
    update(@Request() req, @Param('id') id: string, @Body() body: { name?: string; description?: string }) {
        return this.collectionsService.update(req.user.userId, id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete collection' })
    remove(@Request() req, @Param('id') id: string) {
        return this.collectionsService.remove(req.user.userId, id);
    }
}
