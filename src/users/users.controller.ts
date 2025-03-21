import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { UserRole } from './dto/user-role.enum';
  import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  
  @ApiTags('Users')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get all users', description: 'Accessible by admin only' })
    @ApiResponse({ status: 200, description: 'List of users' })
    findAll() {
      return this.usersService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'User found' })
    @ApiResponse({ status: 404, description: 'User not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.findOne(id);
    }
  
    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({
      type: CreateUserDto,
      examples: {
        admin: {
          summary: 'Create admin user',
          value: {
            email: 'admin@example.com',
            password: 'Admin123',
            role: 'admin',
          },
        },
        editor: {
          summary: 'Create editor user',
          value: {
            email: 'editor@example.com',
            password: 'Editor123',
            role: 'editor',
          },
        },
      },
    })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a user' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({
      type: UpdateUserDto,
      examples: {
        updateEmail: {
          summary: 'Update only email',
          value: {
            email: 'new.email@example.com',
          },
        },
        updateAll: {
          summary: 'Update email, password, and role',
          value: {
            email: 'updated@example.com',
            password: 'NewPass123',
            role: 'viewer',
          },
        },
      },
    })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateUserDto: UpdateUserDto,
    ) {
      return this.usersService.update(id, updateUserDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.remove(id);
    }
  }
  