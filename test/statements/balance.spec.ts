
import 'jest';
import { InMemoryStatementsRepository } from '../../src/modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../../src/modules/statements/useCases/createStatement/CreateStatementUseCase';
import { InMemoryUsersRepository } from "../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../src/modules/users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "../../src/modules/statements/useCases/getBalance/GetBalanceUseCase";

let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let createCarUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Balance', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createCarUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepositoryInMemory);
  });

  it('should be able show balance', async () => {
    const user = {
      name: "John doe",
      email: "johndoe@johndoe.com",
      password: "wqwqwqas21"
    };

    const userCreated = await createCarUseCase.execute(user);

    createStatementUseCase.execute({
      user_id: String(userCreated.id),
      description: "deposito",
      amount: 1000,
      type: OperationType.DEPOSIT
    })

    await createStatementUseCase.execute({
      user_id: String(userCreated.id),
      description: "sacar",
      amount: 800,
      type: OperationType.WITHDRAW
    })

    const user_id = String(userCreated.id);

    const balanced = await getBalanceUseCase.execute({
      user_id
    });

    expect(balanced).toHaveProperty("balance");
    expect(balanced.balance).toBe(200);

  });
});
