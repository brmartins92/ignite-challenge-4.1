
import 'jest';
import { InMemoryStatementsRepository } from '../../src/modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../../src/modules/statements/useCases/createStatement/CreateStatementUseCase';
import { CreateStatementError } from '../../src/modules/statements/useCases/createStatement/CreateStatementError';
import { InMemoryUsersRepository } from "../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../src/modules/users/useCases/createUser/CreateUserUseCase"
import { ShowUserProfileError } from '../../src/modules/users/useCases/showUserProfile/ShowUserProfileError';


let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let createCarUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Deposit', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createCarUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepository);
  });

  it('should be able to create a deposit for the user', async () => {
    const user = {
      name: "John doe",
      email: "johndoe@johndoe.com",
      password: "wqwqwqas21"
    };

    const userCreated = await createCarUseCase.execute(user);

    const amountCreate = await createStatementUseCase.execute({
      user_id: String(userCreated.id),
      description: "deposito",
      amount: 100,
      type: OperationType.DEPOSIT
    })

    expect(amountCreate).toHaveProperty("user_id");
    expect(amountCreate).toHaveProperty("description");
    expect(amountCreate.amount).toBe(100);

  });

  it('should be not able to create a deposit for the inexist user ', async () => {
    const user = {
      name: "John doe",
      email: "johndoe@johndoe.com",
      password: "wqwqwqas21"
    };

    const userCreated = await createCarUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: String(userCreated.id),
      description: "deposito",
      amount: 100,
      type: OperationType.DEPOSIT
    })

    await expect(
      createStatementUseCase.execute({
        user_id: String('sdf232'),
        description: "deposito",
        amount: 100,
        type: OperationType.DEPOSIT
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

});
