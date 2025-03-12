import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() //is a decorator that tells NestJS to listen for GET requests on the root URL.
  getHello(): string {
    return this.appService.getHello();
  }
}
