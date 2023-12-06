import style from "./AllMedicines.module.css";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { useContext } from "react";
import { ShowContext } from "../../../context/ShowContext";
import { useEffect } from "react";
import { motion } from "framer-motion";
import LinkWithBack from "../../../components/LinkWithBack/LinkWithBack";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import MedicineItem from "./../../../components/MedicineItem/MedicineItem";
const AllMedicines = () => {
  const medicines = ["Panadol", "Antiflu", "An", "Hamada", "Mohsen"];
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  useEffect(() => {
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  useDocumentTitle("شرائط");
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      style={{ margin: "auto" }}
      className={" d-flex flex-column px-sm-5 px-0 pb-4`"}
    >
      {spinner && spinnerElement}
      <LinkWithBack link="/stock/medicines" title="شرائط" />
      <Container className="d-flex justify-content-center align-items-center m-auto">
        <div style={{ width: "90%" }}>
          <Form.Group className={`mt-1`} controlId="formBasicEmail">
            <Form.Control
              type="text"
              style={{ direction: "rtl" }}
              placeholder="ادخل اسم الدواء"
            />
          </Form.Group>
          <Row className="w-100 m-0 ">
            <Container className={`${style.container2222} pb-3 pt-1 mt-3`}>
              <div
                className={`${style.rowTitle} d-flex pe-lg-3 pe-2 flex-row  text-white fw-bold mt-2`}
              >
                <p>كود الدواء</p>
                <p>اسم الدواء</p>
              </div>
              {medicines
                ? medicines.map((medicine, idx) => (
                    <MedicineItem key={idx} idx={idx + 1} name={medicine} />
                  ))
                : ""}
                <div className="d-flex justify-content-end align-items-end">
                <Button className={`${style.btn} mt-3`}>اضافة دواء</Button>
                </div>
            </Container>
          </Row>
        </div>
      </Container>
    </motion.div>
  );
};

export default AllMedicines;
