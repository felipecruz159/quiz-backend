import {
  IsEnum,
  IsArray,
  ValidateNested,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum QuestionType {
  BOOLEAN = 'BOOLEAN',
  INPUT = 'INPUT',
  CHECKBOX = 'CHECKBOX',
}

export class CreateAlternativeDto {
  @IsString()
  text: string;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean = false;
}

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  question: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAlternativeDto)
  alternatives: CreateAlternativeDto[];
}

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
