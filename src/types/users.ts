
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
  user_tests: IUserTest[];
  user_favourite_tests: string[]
}

export interface IUserTest {
  test_id: string;
  test_name: string;
}
export type IUsers = IUser[]