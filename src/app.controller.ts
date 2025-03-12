import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiProduces, ApiConsumes, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('App') // Categorizes this controller in Swagger UI
@ApiProduces('application/json') // Specifies response format
@ApiConsumes('application/json') // Specifies accepted request format
@ApiHeader({
  name: 'X-Correlation-Id',
  description: 'Unique request identifier for tracking (optional)',
  required: false,
})
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Returns a greeting message', 
    description: 'This endpoint returns a simple greeting message as a health check.' 
  }) // Adds a title and description in Swagger UI
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful response', type: String }) // Defines expected response
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal Server Error' }) // Error case
  getHello(): string {
    return this.appService.getHello();
  }
}
