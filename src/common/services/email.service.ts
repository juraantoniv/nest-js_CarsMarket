import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { log } from 'console';
import { join } from 'path';
import * as path from 'path';
import process from 'process';

import { UserEntity } from '../../database/entities/user.entity';
import { CreateUserDto } from '../../modules/user/dto/request/create-user.dto';
import { templates } from '../constans/email.constant';
import { EEmailAction } from '../enums/email.action.enum';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public async send(
    email: string,
    emailAction: EEmailAction,
    context: Record<string, string | number> = {},
  ): Promise<void> {
    const { subject, templateName } = templates[emailAction];

    const mailOptions = {
      to: email,
      subject,
      template: templateName,
      context,
    };
    try {
      await this.mailerService.sendMail(mailOptions);
    } catch (e) {}
  }
}
