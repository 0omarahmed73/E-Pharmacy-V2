import { BiPencil } from "react-icons/bi";
import style from "./MedicineItem.module.css";
import { BsArrowLeft, BsFillArrowLeftCircleFill } from "react-icons/bs";
const MedicineItem = ({name , idx , icon , ...props}) => {
  return (
  <div {...props}>
      <div className={style.item}>
        <h1 className={style.index}>{idx}</h1>
        <h1 className={style.medicine} dir="ltr">
          {name}
        </h1>
        <div className={style.icons}>
          <div>
            <BiPencil className={style.bordered} />
          </div>
          <div>
            <BsArrowLeft className={style.bordered} />
          </div>
        </div>
      </div>
  </div>
  );
};

export default MedicineItem;
