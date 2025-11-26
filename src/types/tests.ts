
export interface IQuestions {
    id: number,
    question: string,
    variants: string[],
    correct: string
}

export interface ITest {
    id: number,
    test_id: string,
    test_name: string,
    user_email: string,
    status: string,
    expire:string,
    user_connection?: number,
    password?: string[]
    questions: IQuestions[]
}

export type ITests = ITest[]