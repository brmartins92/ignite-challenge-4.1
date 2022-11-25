import { InMemoryUsersRepository } from "../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../src/modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../../src/modules/users/useCases/showUserProfile/ShowUserProfileUseCase";

import { CreateUserError } from "../../src/modules/users/useCases/createUser/CreateUserError";

import 'jest';
import { IncorrectEmailOrPasswordError } from "../../src/modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { ShowUserProfileError } from "../../src/modules/users/useCases/showUserProfile/ShowUserProfileError";

let createCarUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Profile', () => {
  //let instance: Environment;

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createCarUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  interface UserInfo {
    id: '1ec0e4c5-7b7c-4e11-8e85-ab7dfe93d298',
    email: 'johndoe@johndoe.com',
    name: 'John doe',
    password: '$2a$08$s6L7fb9Fx8qTZU1F3LfQVO/ovCzH8HsClD0/mOi7MPux1h40vNFWe'

  }

  it('should be show profile', async () => {
    let user = {
      name: "John doe",
      email: "johndoe@johndoe.com",
      password: "wqwqwqas21"
    };

    const userCreated = await createCarUseCase.execute(user);
    const userInfo = await showUserProfileUseCase.execute(String(userCreated.id));

    expect(userInfo).toHaveProperty("id");
    expect(userInfo).toHaveProperty("email");
    expect(userInfo).toHaveProperty("name");

    const received = {
      name: userInfo.name,
      email: userInfo.email
    }

    expect(received).toEqual({
      name: "John doe",
      email: "johndoe@johndoe.com",
    })
  });

  it('should be show Error when pass inexist id', async () => {

    await expect(
      showUserProfileUseCase.execute("asd4564")
    ).rejects.toEqual(new ShowUserProfileError());
  });

});
