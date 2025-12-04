import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Prompts')
@Controller('prompts')
// @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
@ApiBearerAuth()
export class PromptsController {
    constructor(private readonly promptsService: PromptsService) { }

    // TEMPORARY: Mock user ID for all requests
    private getMockUserId() {
        return 'user_temp_test_123';
    }

    @Post()
    @ApiOperation({ summary: 'Create a new prompt' })
    create(@Request() req, @Body() body: { workspaceId: string; collectionId?: string; title: string; description?: string; content: string; tags?: string[] }) {
        return this.promptsService.create(this.getMockUserId(), body);
    }

    @Get()
    @ApiOperation({ summary: 'List prompts with filters' })
    @ApiQuery({ name: 'workspaceId', required: true })
    @ApiQuery({ name: 'collectionId', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'tags', required: false, isArray: true })
    findAll(
        @Request() req,
        @Query('workspaceId') workspaceId: string,
        @Query('collectionId') collectionId?: string,
        @Query('search') search?: string,
        @Query('tags') tags?: string[],
    ) {
        return this.promptsService.findAll(this.getMockUserId(), workspaceId, { collectionId, search, tags });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get prompt details' })
    findOne(@Request() req, @Param('id') id: string) {
        return this.promptsService.findOne(this.getMockUserId(), id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update prompt' })
    update(@Request() req, @Param('id') id: string, @Body() body: { title?: string; description?: string; tags?: string[] }) {
        return this.promptsService.update(this.getMockUserId(), id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete prompt' })
    delete(@Request() req, @Param('id') id: string) {
        return this.promptsService.delete(this.getMockUserId(), id);
    }

    @Post(':id/versions')
    @ApiOperation({ summary: 'Create a new version' })
    createVersion(@Request() req, @Param('id') id: string, @Body() body: { content: string; model?: string }) {
        return this.promptsService.createVersion(this.getMockUserId(), id, body);
    }

    @Post('versions/:id/run')
    @ApiOperation({ summary: 'Log a run for a version' })
    logRun(@Request() req, @Param('id') id: string, @Body() body: { rating?: number; notes?: string; usedModel?: string; responseLength?: number }) {
        return this.promptsService.logRun(this.getMockUserId(), id, body);
    }
}
