import style from "./NewOrder.module.css";
import { createPortal } from "react-dom";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import Input from "../../../components/input/Input";
import { useFormik } from "formik";
import { BiBarcodeReader, BiCalendar, BiReset } from "react-icons/bi";
import { AiFillLock, AiOutlineNumber } from "react-icons/ai";
import { GiMedicinePills, GiPill } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import * as yup from "yup";
import ButtonSubmit from "../../../components/ButtonSubmit";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { useContext, useEffect, useState } from "react";
import MediSelected from "./../../../components/MediSelected/MediSelected";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { ShowContext } from "../../../context/ShowContext";
import { motion } from "framer-motion";
import InputAutoComplete2 from "../../../components/InputAutoComplete2/InputAutoComplete2";
import LinkWithBack from "../../../components/LinkWithBack/LinkWithBack";
import { MedicineContext } from "../../../context/MedicinesContext";
import IconV2 from "../../../components/IconV2/IconV2";
import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import Select from "./../../../components/Select/Select";
import { PiFactoryFill } from "react-icons/pi";
import { ToastContainer, toast } from "react-toastify";
const NewOrder = () => {
  const { nameOrCode, setNameOrCode, handleNameOrCode } =
    useContext(MedicineContext);
  const [change, setChange] = useState(false);
  const falseChange = () => {
    setChange(false);
  };
  useDocumentTitle("إضافة طلبية جديدة");
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  useEffect(() => {
    setNameOrCode("name");
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  const [error, setError] = useState(null);
  const { items, getMedicines, suppliers, handleNewOrder, itemsWithCompany } =
    useContext(MedicineContext);
  const { show: show2 } = useContext(ShowContext);
  const [mode, setMode] = useState("");
  const [loading , setLoading] = useState(false)
  const [currentId, setId] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expire, setExpire] = useState("");
  const [price, setPrice] = useState("");
  const [supply, setSupply] = useState("");
  const [supplier, setSupplier] = useState("");
  const [show, setShow] = useState(false);
  const [medicines, setMedicines] = useState(
    sessionStorage.getItem(`medicines-${location.pathname}`)
      ? JSON.parse(sessionStorage.getItem(`medicines-${location.pathname}`))
      : []
  );
  const medicineRef = useRef(null);
  const handleClose = () => {
    setShow(false);
    setName("");
    setQuantity("");
    setExpire("");
    setPrice("");
    setSupply("");
    setSupplier("");
  };

  const handleShow = () => {
    setShow(true);
    setError(null);
  };
  const formik = useFormik({
    validateOnMount: true,
    initialValues: {
      reqnum:
        sessionStorage.getItem(`reqnum-${window.location.pathname}`) || "",
      delivaryAuth:
        sessionStorage.getItem(`delivaryAuth-${window.location.pathname}`) ||
        "",
        supplierName:
        sessionStorage.getItem(`supplierName-${window.location.pathname}`) || "",
      dateofsupply:
        sessionStorage.getItem(`dateofsupply-${window.location.pathname}`) ||
        "",
    },
    validationSchema: yup.object().shape({
      reqnum: yup.number().required("الرجاء ادخال طلب الإمداد"),
      delivaryAuth: yup.string().required("الرجاء ادخال إذن التسليم"),
      supplierName: yup.string().required("الرجاء ادخال اسم المورد"),
      dateofsupply: yup.date().required("الرجاء ادخال تاريخ التوريد"),
    }),
    onSubmit: (values) => {
      values.supplierName = {
        name: values.supplierName,
        id: suppliers.find((sup) => sup.name === values.supplierName).id,
      };
      values = {
        ...values,
        medicine: [...medicines],
      };
      console.log(values);
      setLoading(true)
      try {
        handleNewOrder(values);
        toast.success("تم ادخال الطلبية بنجاح")
        setMedicines([]);
        formik.resetForm();
        sessionStorage.setItem(`reqnum-${window.location.pathname}`, "");
        sessionStorage.setItem(`delivaryAuth-${window.location.pathname}`, "");
        sessionStorage.setItem(`supplierName-${window.location.pathname}`, "");
        sessionStorage.setItem(`medicines-${window.location.pathname}`, "");
        sessionStorage.setItem(`dateofsupply-${window.location.pathname}`, "");
        formik.setValues({
          reqnum: "",
          delivaryAuth: "",
          supplierName: "",
          dateofsupply: "",
        });
      }
      catch (err) {
        toast.error("حدث خطأ ما , الرجاء المحاولة مرة اخرى")
      }
      setTimeout(() => {
        setLoading(false)
      }, 500);
    },
  });
  const handleMedicines = (e) => {
    e.preventDefault();
    //Search for the medicine in the items array
    console.log(items);
    const found = items.find((item) => item === name.trim());
    //Check if the medicine already added to the order
    const alreadyExists = medicines.find((medi) => medi.name === name);
    if (found && !alreadyExists) {
      const getMedi = [
        ...medicines,
        {
          name: name,
          quantity,
          expire,
          price,
          supply,
          supplier,
        },
      ];
      setMedicines(getMedi);
      sessionStorage.setItem(
        `medicines-${window.location.pathname}`,
        JSON.stringify(getMedi)
      );
      setError(null);
      handleClose();
    } else if (!found) {
      setError("الرجاء التأكد من ادخال اسم الدواء بشكل صحيح");
    } else if (alreadyExists) {
      setError("الدواء موجود بالفعل في الطلبية");
    }
  };
  const handleDelete = (id) => {
    const newMedicine = medicines.filter((medi) => medi.id !== id);
    setMedicines(newMedicine);
    sessionStorage.setItem(
      `medicines-${window.location.pathname}`,
      JSON.stringify(newMedicine)
    );
  };
  const handleEdit = (id, name) => {
    const medicine = medicines.find((medi) => medi.id === id);
    setName(medicine.name);
    setQuantity(medicine.quantity);
    setExpire(medicine.expire);
    setPrice(medicine.price);
    setSupply(medicine.supply);
    setSupplier(medicine.supplier);
    handleShow();
  };
  const saveChanges = (id) => {
    const newMedicine = medicines.map((medi) => {
      if (medi.id === id) {
        return {
          ...medi,
          name: name,
          quantity,
          expire,
          price,
          supply,
          supplier,
        };
      }
      sessionStorage.setItem(
        `medicines-${window.location.pathname}`,
        JSON.stringify(newMedicine)
      );

      return medi;
    });
    setMedicines(newMedicine);
    handleClose();
  };
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
      className={`${style.newOrder} d-flex flex-column px-sm-5 px-0 pb-4 w-md-75 w-sm-100 w-lg-100`}
    >
      {spinner && spinnerElement}
      <LinkWithBack title="إضافة طلبية جديدة" link="/stock" />
      <Form onSubmit={formik.handleSubmit}>
        <Row className="flex-wrap" lg="2" xs="1" md="1">
          <Col>
            <Input
              className="text-end"
              error={formik.errors.reqnum}
              touched={formik.touched.reqnum}
              onBlur={formik.handleBlur}
              value={formik.values.reqnum}
              onChange={formik.handleChange}
              width={"100%"}
              label="طلب الإمداد"
              type="number"
              id="reqnum"
              name="reqnum"
              icon={"#"}
            />
            <Input
              error={formik.errors.delivaryAuth}
              onBlur={formik.handleBlur}
              touched={formik.touched.delivaryAuth}
              value={formik.values.delivaryAuth}
              onChange={formik.handleChange}
              width={"100%"}
              className="mt-2 text-end"
              label="إذن التسليم"
              type="number"
              id="delivaryAuth"
              name="delivaryAuth"
              icon={<AiFillLock />}
            />
            <Select
              error={formik.errors.supplierName}
              onBlur={formik.handleBlur}
              touched={formik.touched.supplierName}
              value={formik.values.supplierName}
              onChange={formik.handleChange}
              width={"100%"}
              className="mt-2 text-end"
              label="اسم المورد"
              id="supplierName"
              name="supplierName"
              icon={<TbTruckDelivery />}
            >
              <option value="">اختر اسم المورد</option>
              {suppliers.map((supplier) => (
                <option key={crypto.randomUUID()} value={supplier.name}>
                  {supplier.name}
                </option>
              ))}
            </Select>
            <div className={`${style.mediTable} overflow-y-scroll mt-2 px-1`}>
              <Table striped hover>
                <thead>
                  <tr>
                    <th className={show2 ? "showFonts" : "noshowFonts"}>#</th>
                    <th className={show2 ? "showFonts" : "noshowFonts"}>
                      الدواء
                    </th>
                    <th className={show2 ? "showFonts" : "noshowFonts"}>
                      الكمية
                    </th>
                    <th className={show2 ? "showFonts" : "noshowFonts"}>
                      الصلاحية
                    </th>
                    <th className={show2 ? "showFonts" : "noshowFonts"}>
                      المورد
                    </th>
                    <th className={show2 ? "showFonts" : "noshowFonts"}>
                      السعر
                    </th>
                    <th className={show2 ? "showFonts" : "noshowFonts"}>
                      الأيقونات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.length
                    ? medicines.map((medi, index) => (
                        <MediSelected
                          show={show2}
                          mode="order"
                          setId={setId}
                          setMode={setMode}
                          key={crypto.randomUUID()}
                          name={medi.name}
                          quantity={medi.quantity}
                          price={medi.price}
                          supplier={medi.supplier}
                          expire={medi.expire}
                          supply={medi.supply}
                          id={medi.id}
                          idx={index + 1}
                          handleDelete={handleDelete}
                          handleEdit={handleEdit}
                        />
                      ))
                    : null}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col className="">
            <Input
              error={formik.errors.dateofsupply}
              onBlur={formik.handleBlur}
              touched={formik.touched.dateofsupply}
              value={formik.values.dateofsupply}
              onChange={formik.handleChange}
              width={"100%"}
              className="mt-2 mt-lg-0 text-end"
              label="تاريخ التوريد"
              type="date"
              id="dateofsupply"
              name="dateofsupply"
              icon={<BiCalendar />}
            />
            <div className={`${style.buttonandsvg} overflow-hidden mt-2`}>
              <div
                className=""
                style={{ width: "fit-content", margin: "auto" }}
              >
                <div
                  className={`${style.imgSvg} btnnn text-center mt-4 mt-lg-0 m-auto`}
                >
                  <img src="/medicine.svg" alt="" />
                </div>
              </div>
              <div className="btnnn d-flex gap-2 justify-content-lg-end justify-content-center w-100 mt-4 my-lg-0 mt-lg-2">
                <Button
                  className="btn-main w-50"
                  onClick={() => {
                    handleShow();
                    setMode("add");
                  }}
                >
                  إضافة دواء
                </Button>
                <ButtonSubmit
                  disabled={!formik.isValid || !medicines.length}
                  className="btn-main w-50"
                >
                  {loading ? "جاري التحميل..." : "إدخال الطلبية"}
                </ButtonSubmit>
                <Button
                  id="not-clickable"
                  className="btn-main"
                  onClick={() => {
                    sessionStorage.setItem(
                      `reqnum-${window.location.pathname}`,
                      ""
                    );
                    sessionStorage.setItem(
                      `delivaryAuth-${window.location.pathname}`,
                      ""
                    );
                    sessionStorage.setItem(
                      `supplierName-${window.location.pathname}`,
                      ""
                    );
                    sessionStorage.setItem(
                      `medicines-${window.location.pathname}`,
                      ""
                    );
                    sessionStorage.setItem(
                      `dateofsupply-${window.location.pathname}`,
                      ""
                    );
                    setMedicines([]);
                    formik.resetForm();
                    formik.setValues({
                      reqnum: "",
                      delivaryAuth: "",
                      supplierName: "",
                      dateofsupply: "",
                    });
                  }}
                >
                  <BiReset />
                </Button>
                <Tooltip
                  anchorSelect="#not-clickable"
                  clickable={true}
                  style={{ fontSize: "12px" }}
                >
                  اعادة تعيين البيانات
                </Tooltip>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
      {createPortal(
        <Modal show={show} centered={true} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>
              {mode === "add"
                ? "اختر اسم الدواء المراد اضافته"
                : "تعديل معلومات الدواء"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleMedicines}>
              <Row className="flex-wrap">
                <Col>
                  <div className="d-flex gap-2">
                    <InputAutoComplete2
                      ref={medicineRef}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setChange(true);
                        setError(null);
                      }}
                      className="text-end "
                      width={"100%"}
                      label={
                        nameOrCode === "name" ? "اسم الدواء" : "كود الدواء"
                      }
                      allValues={itemsWithCompany}
                      linkedAttr={[{name : 'supplier' , setValue : setSupplier}]}
                      type="text"
                      id="medicine"
                      name="medicine"
                      items={items.sort()}
                      dropFunction={() => getMedicines(name)}
                      direction={"ltr"}
                      icon={
                        nameOrCode === "name" ? (
                          <GiMedicinePills />
                        ) : (
                          <BiBarcodeReader />
                        )
                      }
                      linkAdded={"/stock/medicines/add-medicine?return=true"}
                      message={"الدواء غير موجود , هل تريد اضافته؟"}
                      setValue={setName}
                      formik={false}
                      change={change}
                      error={error}
                      falseChange={falseChange}
                    />
                    <IconV2
                      id='selectType'
                      icon={
                        nameOrCode === "name" ? <BiBarcodeReader /> : <GiPill />
                      }
                      onClick={() => {
                        handleNameOrCode();
                        setName("");
                        medicineRef.current.focus();
                      }}
                    />
                                    <Tooltip
                  anchorSelect="#selectType"
                  clickable={true}
                  place="bottom"
                  style={{ fontSize: "12px" , zIndex :500 }}
                >
                  اختر طريقة البحث
                </Tooltip>
                  </div>
                  <p className="descriptiveP">
                    يمكنك البحث باستعمال اسم الدواء او الباركود*
                  </p>
                </Col>
                <Col>
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="text-end mt-2 mt-md-0"
                    width={"100%"}
                    label="الكمية"
                    type="number"
                    id="quantity"
                    name="quantity"
                    icon={<AiOutlineNumber />}
                  />
                </Col>
              </Row>
              <Row className="mt-2 flex-wrap ">
                <Col>
                  <Input
                    value={expire}
                    onChange={(e) => setExpire(e.target.value)}
                    className="text-end mt-2 mt-md-0"
                    width={"100%"}
                    label="تاريخ التوريد"
                    type="date"
                    id="supply"
                    name="supply"
                    icon={<BsFillCalendarDateFill />}
                  />
                </Col>
                <Col>
                  <Input
                    value={supply}
                    onChange={(e) => setSupply(e.target.value)}
                    className="text-end mt-2 mt-md-0"
                    width={"100%"}
                    label="تاريخ الصلاحية"
                    type="date"
                    id="expire"
                    name="expire"
                    icon={<BsFillCalendarDateFill />}
                  />
                </Col>
              </Row>
              <Row className="mt-2 flex-wrap ">
                <Col>
                  <Input
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="text-end mt-2 mt-md-0"
                    width={"100%"}
                    label="الشركة المصنعة"
                    type="text"
                    id="supplier"
                    name="supplier"
                    icon={<PiFactoryFill />}
                  />
                </Col>
                <Col>
                  <Input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="text-end mt-2 mt-md-0"
                    width={"100%"}
                    label="السعر"
                    type="number"
                    id="price"
                    name="price"
                    icon={"جنيه"}
                  />
                </Col>
              </Row>
              <Row></Row>
              <div className="btns mt-4 d-flex gap-2 me-auto justify-content-end ">
                {mode === "edit" ? (
                  <Button
                    variant="danger"
                    onClick={() => saveChanges(currentId)}
                  >
                    حفظ التعديلات
                  </Button>
                ) : (
                  <ButtonSubmit
                    disabled={
                      !name ||
                      !quantity.trim() ||
                      !expire.trim() ||
                      !supply.trim() ||
                      !supplier.trim() ||
                      !price.trim()
                    }
                    className="btn-main"
                    variant="primary"
                  >
                    حفظ التغييرات
                  </ButtonSubmit>
                )}
                <Button variant="secondary" onClick={handleClose}>
                  إغلاق
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>,
        document.getElementById("modal")
      )}
            <ToastContainer position="bottom-center" hideProgressBar  className='mb-2' rtl={true} />
    </motion.div>
  );
};

export default NewOrder;
