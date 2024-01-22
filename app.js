// express 라이브러리를 가져온다.
import express from "express";
// connect를 수입해서 사용을 하겠다.
import connect from './schemas/index.js';
// router를 수입해서 사용을 하겠다.
import todosRouter from './routes/todos.route.js';
import errorHandlerMiddleware from './middlewares/error.handler.middleware.js';

const app = express();
const PORT = 3000;

// MongoDB를 실행한다.
connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정한다.
// 아래 두개 app. 은 항상 같이 다니는 미들웨어 듀오
app.use(express.json()); // 미들웨어 1

app.use(express.urlencoded({ extended: true })); // 미들웨어 2

app.use(express.static('./assets')); // 미들웨어 3

app.use((req, res, next) => {
  // 미들웨어 4
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});

// 라우터를 생성을 해서 해당하는 라우터에다가 API를 구현을 했다.
const router = express.Router(); // express에 있는 라우터 기능을 사용한다.

router.get('/', (req, res) => {
  return res.json({ message: 'Hi' });
});

// 미들웨어 5
app.use('/api', [router, todosRouter]); // 라우터를 사용한다.

// 에러 처리 미들웨어를 등록한다.
app.use(errorHandlerMiddleware);

// 서버를 여는 것
app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸습니다.');
});
