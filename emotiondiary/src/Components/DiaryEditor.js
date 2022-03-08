import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DiaryDispatchContext } from "../App";
import EmotionItem from "./EmotionItem";

import MyButton from "./MyButton";
import MyHeader from "./MyHeader";

import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";

const DiaryEditor = ({ isEdit, originData }) => {
  const [date, setDate] = useState(getStringDate(new Date()));
  const [emotion, setEmotion] = useState();
  const [content, setContent] = useState("");

  const contentRef = useRef();

  const navigate = useNavigate();
  const handleClickEmotion = (emotion) => {
    setEmotion(emotion);
  };

  const { onCreate, onEdit, onRemove } = useContext(DiaryDispatchContext);
  const handleSubmit = () => {
    if (content.length < 1) {
      contentRef.current.focus();
      return;
    }

    if (
      window.confirm(
        isEdit ? "일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?"
      )
    ) {
      if (!isEdit) {
        onCreate(date, content, emotion);
      } else {
        onEdit(originData.id, date, content, emotion);
      }
    }
    navigate("/", { replace: true });
  };
  const handleRemove = () => {
    if (window.confirm(`일기를 삭제하시겠습니까?`)) {
      onRemove(originData.id);
    }
  };
  useEffect(() => {
    if (isEdit) {
      setDate(getStringDate(new Date(parseInt(originData.date))));
      setEmotion(originData.emotion);
      setContent(originData.content);
    }
  }, [isEdit, originData]);

  return (
    <div className="DiaryEditor">
      <MyHeader
        headText={isEdit ? "일기 수정하기" : "새 일기쓰기"}
        leftChild={
          <MyButton
            text={"< 뒤로가기"}
            type={"default"}
            onClick={() => navigate(-1)}
          />
        }
        rightChild={
          <MyButton
            type={"negative"}
            text={"삭제하기"}
            onClick={handleRemove}
          />
        }
      />
      <div>
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className="input_box">
            <input
              className="input_date"
              value={date}
              type="date"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </section>
        <section>
          <h4>오늘의 감정</h4>
          <div className="input_box emotion_list_wrapper">
            {emotionList.map((v) => (
              <EmotionItem
                key={v.emotion_id}
                {...v}
                onClick={handleClickEmotion}
                isSelected={v.emotion_id === emotion}
              />
            ))}
          </div>
        </section>
        <section>
          <h4>오늘의 일기</h4>
          <div className="input_box_text_wrapper">
            <textarea
              placeholder="오늘은 어땠나요?"
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </section>
      </div>
      <div className="control_box">
        <MyButton
          text={"취소하기"}
          type={"default"}
          onClick={() => navigate(-1)}
        />
        <MyButton text={"작성완료"} type={"positive"} onClick={handleSubmit} />
      </div>
    </div>
  );
};
export default DiaryEditor;