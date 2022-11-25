
import 'jest';
import { InMemoryStatementsRepository } from '../../src/modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../../src/modules/statements/useCases/createStatement/CreateStatementUseCase';
import { CreateStatementError } from '../../src/modules/statements/useCases/createStatement/CreateStatementError';
import { InMemoryUsersRepository } from "../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../src/modules/users/useCases/createUser/CreateUserUseCase"

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

    createStatementUseCase.execute({
      user_id: String(userCreated.id),
      description: "deposito",
      amount: 600,
      type: OperationType.DEPOSIT
    })

    const amountCreate = await createStatementUseCase.execute({
      user_id: String(userCreated.id),
      description: "sacar",
      amount: 500,
      type: OperationType.WITHDRAW
    })

    expect(amountCreate).toHaveProperty("user_id");
    expect(amountCreate).toHaveProperty("description");
    expect(amountCreate.amount).toBe(500);

  });

  it('should be not able to create a withdraw for the inexist user ', async () => {

    const user = {
      name: "John doe",
      email: "johndoe@johndoe.com",
      password: "wqwqwqas21"
    };

    const userCreated = await createCarUseCase.execute(user);

    createStatementUseCase.execute({
      user_id: String(userCreated.id),
      description: "deposito",
      amount: 600,
      type: OperationType.DEPOSIT
    })

    await expect(
      createStatementUseCase.execute({
        user_id: String('sdf232'),
        description: "sacar",
        amount: 1000,
        type: OperationType.WITHDRAW
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

});
