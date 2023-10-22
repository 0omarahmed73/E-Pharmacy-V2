import { Link } from "react-router-dom";
import style from "./LinkWithBack.module.css";
import { AiFillRightCircle } from "react-icons/ai";
const LinkWithBack = ({title , link}) => {
  return (
    <div className="d-flex flex-row align-items-center mb-2 gap-2">
        <Link to={link}>
          <AiFillRightCircle size={24} fill="#28465C" />
        </Link>
        <p className="mainTitle">{title}</p>
      </div>
  )
}

export default LinkWithBack