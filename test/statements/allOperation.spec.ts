
import 'jest';
import { InMemoryStatementsRepository } from '../../src/modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../../src/modules/statements/useCases/createStatement/CreateStatementUseCase';
import { GetStatementOperationUseCase } from '../../src/modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase';
import { InMemoryUsersRepository } from "../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../src/modules/users/useCases/createUser/CreateUserUseCase";


let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let createCarUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create All Operations', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createCarUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepository);
  });

  it('should be able show balance', async () => {
    const user = {
      name: "John doe",
      email: "johndoe@johndoe.com",
      password: "wqwqwqas21"
    };

    const userCreated = await createCarUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: String(userCreated.id),
      description: "deposito",
      amount: 10000,
      type: OperationType.DEPOSIT
    })

    const statementCreated = await createStatementUseCase.execute({
      user_id: String(userCreated.id),
      description: "sacar",
      amount: 800,
      type: OperationType.WITHDRAW
    })

    const user_id = String(userCreated.id);
    const statement_id = String(statementCreated.id);
    const allOperationCreated = await getStatementOperationUseCase.execute({ user_id, statement_id });

    expect(allOperationCreated).toHaveProperty("id");
    expect(allOperationCreated).toHaveProperty("user_id");
    expect(allOperationCreated).toHaveProperty("type");
    expect(allOperationCreated.amount).toBe(800);

  });
});
