
export interface IUser {
      id: number;
  name: string;
  email: string;
  draft: number;
  local: number;
  public: number;
  private: number;
  expire: number;
  users_connect: number;
  user_tests: string[];
}

export type IUsers = IUser[]