import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkspaceType } from '@prisma/client';

@ApiTags('Workspaces')
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new workspace' })
    create(@Request() req, @Body() body: { name: string; type?: WorkspaceType }) {
        return this.workspacesService.create(req.user.userId, body.name, body.type);
    }

    @Get()
    @ApiOperation({ summary: 'List all workspaces for current user' })
    findAll(@Request() req) {
        return this.workspacesService.findAllForUser(req.user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get workspace details' })
    findOne(@Request() req, @Param('id') id: string) {
        return this.workspacesService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update workspace' })
    update(@Request() req, @Param('id') id: string, @Body() body: { name: string }) {
        return this.workspacesService.update(id, req.user.userId, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete workspace' })
    remove(@Request() req, @Param('id') id: string) {
        return this.workspacesService.delete(id, req.user.userId);
    }
}
