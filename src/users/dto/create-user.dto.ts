import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from 'src/commons/decorators/match.decorator';
import ValidationMessages from 'src/commons/validations/validation-messages';

export class CreateUserDto {
  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('Nome') })
  name: string;

  @IsNotEmpty({ message: ValidationMessages.isNotEmpty('E-mail') })
  @IsEmail({}, { message: ValidationMessages.isEmail('E-mail') })
  email: string;

  @MinLength(6, { message: ValidationMessages.minLength(6, 'Senha') })
  password: string;

  @Match('password', { message: ValidationMessages.passwordConfirmation() })
  passwordConfirm: string;
}
