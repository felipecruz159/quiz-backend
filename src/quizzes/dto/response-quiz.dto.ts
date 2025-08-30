export class ResponseAlternativeDto {
  id: string;
  text: string;
  isCorrect: boolean;
}

export class ResponseQuestionDto {
  id: string;
  type: string;
  alternatives: ResponseAlternativeDto[];
}

export class ResponseQuizDto {
  title: string;
  questions: ResponseQuestionDto[];
}

export class ResponseFindAllQuizDto {
  title: string;
  totalQuestions: number;
}
