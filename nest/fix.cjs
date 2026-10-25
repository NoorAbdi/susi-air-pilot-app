const fs = require('fs');
const path = require('path');

const files = {
  'src/app.module.ts': `import { Module } from '@nestjs/common';\nimport { DataModule } from './data/data.module';\nimport { AuthModule } from './auth/auth.module';\n\n@Module({\n  imports: [DataModule, AuthModule],\n})\nexport class AppModule {}`,
  
  'src/data/data.service.ts': `import { Injectable, OnModuleInit } from '@nestjs/common';\nimport * as fs from 'fs';\nimport * as path from 'path';\n\n@Injectable()\nexport class DataService implements OnModuleInit {\n  public schedulesData: any;\n  public documentsData: any;\n  public flightHoursData: any;\n  public readonly today = '2026-05-15';\n\n  onModuleInit() {\n    const dataDir = path.join(process.cwd(), 'src', 'data');\n    this.schedulesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'mock-schedules.json'), 'utf8'));\n    this.documentsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'mock-documents.json'), 'utf8'));\n    this.flightHoursData = JSON.parse(fs.readFileSync(path.join(dataDir, 'mock-flight-hours.json'), 'utf8'));\n  }\n}`,
  
  'src/data/data.module.ts': `import { Global, Module } from '@nestjs/common';\nimport { DataService } from './data.service';\n\n@Global()\n@Module({\n  providers: [DataService],\n  exports: [DataService],\n})\nexport class DataModule {}`,
  
  'src/auth/auth.service.ts': `import { Injectable, UnauthorizedException } from '@nestjs/common';\nimport { JwtService } from '@nestjs/jwt';\n\n@Injectable()\nexport class AuthService {\n  constructor(private jwtService: JwtService) {}\n\n  login(username: string, pass: string) {\n    if (username === 'johndoe' && pass === 'susiairtest') {\n      return { token: this.jwtService.sign({ sub: 1, username: 'johndoe' }) };\n    }\n    throw new UnauthorizedException('Invalid credentials');\n  }\n}`,
  
  'src/auth/dto/login.dto.ts': `import { IsNotEmpty, IsString } from 'class-validator';\n\nexport class LoginDto {\n  @IsString()\n  @IsNotEmpty()\n  username!: string;\n\n  @IsString()\n  @IsNotEmpty()\n  password!: string;\n}`,
  
  'src/auth/auth.controller.ts': `import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';\nimport { AuthService } from './auth.service';\nimport { LoginDto } from './dto/login.dto';\n\n@Controller('auth')\nexport class AuthController {\n  constructor(private authService: AuthService) {}\n\n  @Post('login')\n  @HttpCode(HttpStatus.OK)\n  login(@Body() loginDto: LoginDto) {\n    return this.authService.login(loginDto.username, loginDto.password);\n  }\n}`,
  
  'src/auth/auth.module.ts': `import { Module } from '@nestjs/common';\nimport { JwtModule } from '@nestjs/jwt';\nimport { AuthService } from './auth.service';\nimport { AuthController } from './auth.controller';\n\n@Module({\n  imports: [\n    JwtModule.register({ global: true, secret: 'susiair-secret-key', signOptions: { expiresIn: '1d' } }),\n  ],\n  controllers: [AuthController],\n  providers: [AuthService],\n})\nexport class AuthModule {}`
};

for (const [filepath, content] of Object.entries(files)) {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Fixed on disk:', filepath);
}