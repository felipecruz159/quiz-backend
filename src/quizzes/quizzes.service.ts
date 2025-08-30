/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ResponseFindAllQuizDto,
  ResponseQuizDto,
} from './dto/response-quiz.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto): Promise<ResponseQuizDto> {
    try {
      const quiz = await this.prisma.quiz.create({
        data: {
          title: createQuizDto.title,
          questions: {
            create: createQuizDto.questions.map((q) => ({
              type: q.type,
              question: q.question,
              alternatives: {
                create: q.alternatives.map((a) => ({
                  text: a.text,
                  isCorrect: a.isCorrect ?? false,
                })),
              },
            })),
          },
        },
        select: {
          title: true,
          questions: {
            select: {
              id: true,
              type: true,
              question: true,
              alternatives: {
                select: {
                  id: true,
                  text: true,
                  isCorrect: true,
                },
              },
            },
          },
        },
      });

      const response: ResponseQuizDto = {
        title: quiz.title,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          type: q.type,
          alternatives: q.alternatives.map((a) => ({
            id: a.id,
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        })),
      };

      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create quiz';

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<ResponseFindAllQuizDto[]> {
    try {
      const { limit, offset } = paginationDto ?? { limit: 10, offset: 0 };

      const quizzes = await this.prisma.quiz.findMany({
        take: +limit,
        skip: +offset,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          title: true,
          _count: { select: { questions: true } },
        },
      });

      return quizzes.map((quiz) => ({
        title: quiz.title,
        totalQuestions: quiz._count.questions,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch quizzes';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<ResponseQuizDto> {
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id },
        include: {
          questions: {
            include: {
              alternatives: true,
            },
          },
        },
      });

      if (!quiz) {
        throw new HttpException('Quiz not found', HttpStatus.NOT_FOUND);
      }

      return quiz;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch quiz';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.quiz.delete({
        where: { id },
      });

      return { message: 'Quiz removed successfully' };
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to remove quiz',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
