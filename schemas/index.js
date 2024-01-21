import mongoose from 'mongoose'; // 몽구스 불러오기.

// connnect가 실행되면 MongoDB가 연결된다.
const connect = () => {
  mongoose
    .connect(
      'mongodb+srv://soule125:242804@cluster0.vtgmuez.mongodb.net/?retryWrites=true&w=majority',
      {
        dbName: 'todo_memo', // 데이터 베이스 이름을 todo_memo로 설정한다.
      },
    )
    // 만약 MongoDB가 연결되었을 때
    .then(() => console.log('MongoDB 연결에 성공하였습니다.'))
    // 연결에 실패하거나 에러가 발생 되었을 때
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on('error', () => {
  // 서버스 중에 에러가 났을 때
  console.error('MongoDB 연결 에러', err);
});

// export default를 통해서 connect를 밖으로 수출할 준비를 마침
export default connect;
