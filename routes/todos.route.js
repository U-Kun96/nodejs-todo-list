import express, { response } from "express"; // router를 만들기 위해 express를 불러온다.
import Joi from 'joi';
import Todo from '../schemas/todo.schema.js';

const router = express.Router(); // 라우터를 생성할 준비가 끝났다.

/**
 * 1. `value` 데이터는 **필수적으로 존재**해야한다.
2. `value` 데이터는 **문자열 타입**이어야한다.
3. `value` 데이터는 **최소 1글자 이상**이어야한다.
4. `value` 데이터는 **최대 50글자 이하**여야한다.
5. 유효성 검사에 실패했을 때, 에러가 발생해야한다.
 */
const createdTodoSchema = Joi.object({
  value: Joi.string().min(1).max(50).required(),
});

/** 할 일 등록 API **/
// 실제로 api를 구현할 때는 해당하는 라우터에 바탕하여 시작함.
router.post('/todos', async (req, res, next) => {
  try {
    // 1. 클라이언트로 부터 받아 온 value 데이터를 가져온다.
    // const { value } = req.body;

    const validation = await createdTodoSchema.validateAsync(req.body);

    const { value } = validation;

    // 1-5. 만약, 클라이언트가 value 데이터를 전달하지 않았을 때, 클라이언트에게 에러 메세지를 전달한다.
    if (!value) {
      return res
        .status(400)
        .json({ errorMessage: '해야할 일(value) 데이터가 존재하지 않습니다.' });
    }

    // 2. 해당하는 마지막 oreder 데이터를 조회한다.
    // findOne()은 하나의 데이터를 조회한다.
    // sort() : 정렬하다. -> '어떤 컬럼을?'
    const todoMaxOrder = await Todo.findOne().sort('-order').exec(); // todo.schema.js 에 있는 Todo 몽구스 모델이다.

    // 3. 만약에 존재한다면 현재 해야할 일을 +1 하고, order 데이터가 존재하지 않다면 1로 할당한다.
    const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1;

    // 4. 해야할 일을 등록
    const todo = new Todo({ value, order }); // todo는 실제 인스턴스 형식으로 만든 것
    await todo.save(); // 실제로 데이터베이스에 저장하는 것.

    // 5. 해야할 일을 클라이언트에게 반환한다.
    return res.status(201).json({ todo: todo });
  } catch (error) {
    next(error);
  }
});

/** 해야할 일 목록 조회 API **/
router.get('/todos', async (req, res, next) => {
  // 1. 해야할 일 목록 조회를 진행한다.
  const todos = await Todo.find().sort('-order').exec();

  // 2. 해야할 일 목록 조회 결과를 클라이언트에게 반환한다.
  return res.status(200).json({ todos });
});

/** 해야할 일 순서 변경, 완료 / 해제, 내용 변경 API**/
router.patch('/todos/:todoId', async (req, res, next) => {
  const { todoId } = req.params;
  const { order, done, value } = req.body;

  // 현재 나의 order가 무엇인지 알아야함.
  const currentTodo = await Todo.findById(todoId).exec();
  if (!currentTodo) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 해야할 일 입니다.' });
  }

  if (order) {
    const targetTodo = await Todo.findOne({ order }).exec();
    if (targetTodo) {
      targetTodo.order = currentTodo.order;
      await targetTodo.save();
    }
    currentTodo.order = order;
  }

  if (done !== undefined) {
    currentTodo.doneAt = done ? new Date() : null;
  }

  if (value) {
    currentTodo.value = value;
  }

  await currentTodo.save();
  return res.status(200).json({});
});

/** 할 일 삭제 API **/
router.delete('/todos/:todoId', async (req, res, next) => {
  const { todoId } = req.params;

  const todo = await Todo.findById(todoId).exec();
  if (!todo) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 해야할 일 정보입니다.' });
  }

  await Todo.deleteOne({ _id: todoId });

  return res.status(200).json({});
});

export default router; // router를 외부 파일에서 사용할 수 있게 수출을 한다.
