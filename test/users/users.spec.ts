import { InMemoryUsersRepository } from "../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../src/modules/users/useCases/createUser/CreateUserUseCase"

import 'jest';
import { CreateUserError } from "../../src/modules/users/useCases/createUser/CreateUserError";
//import Environment from '../../../src/environments/environment';
//import { Environments } from '../../../src/environments/environment.constant';
let createCarUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe('Create User', () => {
  //let instance: Environment;

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createCarUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to create a new user', async () => {
    const user = {
      name: "John doe",
      email: "johndoe@johndoe.com",
      password: "wqwqwqas21"
    };

    const userCreated = await createCarUseCase.execute(user);
    const userReceived = {
      name: userCreated.name,
      email: userCreated.email,
    }
    const userExpected = {
      name: "John doe",
      email: "johndoe@johndoe.com",
    }
    expect(userCreated).toHaveProperty("id");
    expect(userReceived).toEqual(userExpected);

  });

  it('should not be able to create a user with exists user', async () => {

    const user = {
      name: "John doe",
      email: "johndoe@johndoe.com",
      password: "wqwqwqas21"
    };

    await createCarUseCase.execute(user);

    await expect(
      createCarUseCase.execute(user)
    ).rejects.toEqual(new CreateUserError());

  });
});
