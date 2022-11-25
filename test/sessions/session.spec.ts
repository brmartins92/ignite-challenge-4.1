import { InMemoryUsersRepository } from "../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../src/modules/users/useCases/createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "../../src/modules/users/useCases/authenticateUser/AuthenticateUserUseCase";

import { CreateUserError } from "../../src/modules/users/useCases/createUser/CreateUserError";

import 'jest';
import { IncorrectEmailOrPasswordError } from "../../src/modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";

let createCarUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Create Session', () => {
  //let instance: Environment;

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createCarUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to create a new session', async () => {
    const user = {
      name: "John doe",
      email: "johndoe@johndoe.com",
      password: "wqwqwqas21"
    };

    await createCarUseCase.execute(user);
    const sessionCreated = await authenticateUserUseCase.execute({
      email: "johndoe@johndoe.com",
      password: "wqwqwqas21"
    })

    expect(sessionCreated).toHaveProperty("token");

  });

  it('should be not able to create a new session with inexists user ', async () => {
    const user = {
      name: "John doe",
      email: "johndoe@johndoe.com",
      password: "wqwqwqas21"
    };

    await createCarUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: "jon@johndoe.com",
        password: "wqwqwqas21"
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it('should be not able to create a new session with inexists user ', async () => {
    const user = {
      name: "John doe",
      email: "johndoe@johndoe.com",
      password: "wqwqwqas21"
    };

    await createCarUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: "johndoe@johndoe.com",
        password: "wqwqw"
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

});
