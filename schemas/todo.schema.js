import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true, // value 필드는 필수 요소이다.
  },
  order: {
    type: Number,
    required: true, // order 필드도 필수 요소이다.
  },
  doneAt: {
    type: Date, // doneAt 필드는 Date 타입을 가진다.
    required: false, // doneAt 필드는 필수 요소는 아니다.
  },
});

// 프론트엔드 서빙을 위한 코드입니다. 모르셔도 괜찮아요!
TodoSchema.virtual('todoId').get(function () {
  return this._id.toHexString();
});
TodoSchema.set('toJSON', {
  virtuals: true,
});

// TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Todo', TodoSchema);
