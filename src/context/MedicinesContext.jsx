import { useEffect, useState } from "react";
import { createContext } from "react";
import axiosApi from "../data/axios";

export const MedicineContext = createContext();

const MedicinesProvider = ({ children }) => {
  const [medicineType, setMedicineType] = useState([]);
  const [items, setItems] = useState([]);
  const [itemsWithCompany , setItemsWithCompany] = useState([])
  const [medicineList, setMedicineList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [nameOrCode, setNameOrCode] = useState("name");
  // Submiting Medicine Handler
  const submitMedicine = async (medicine) => {
    const response = await axiosApi.post(
      "http://localhost:9090/medicines",
      {
        arabicname: medicine.ar,
        name: (medicine.en).trim().toUpperCase(),
        medicineCategory: medicine.type,
        manufacturer: medicine.company,
        alertamount: medicine.quantity,
        barcode: medicine.code,
        alertexpired: medicine.days,
        activeingredient : 'Not Available'
      },
      {
        headers: {
          Authorization: `Basic ${btoa(`admin:admin`)}`,
        },
      }
    );
    console.log(response);
    setResponses()
  };
  //Change Searching Mode : With name or barcode
  const handleNameOrCode = () => {
    setNameOrCode(nameOrCode === "name" ? "code" : "name");
  };
  // Get All Medicines
  const setResponses = async () => {
    const response = await axiosApi.get("http://localhost:9090/medicines", {
      headers: {
        Authorization: `Basic ${btoa(`admin:admin`)}`,
      },
    });
    setMedicineList(response.data);
  };
  // Searching for Medicine Handler
  const getMedicines = async (name) => {
    let names = medicineList.map((medi) => ({
      name: medi.name,
      code: medi.barcode.toString(),
      supplier : medi.manufacturer
    }));
    names =
      nameOrCode === "name"
        ? names.filter((el) => el.name !== "" && el.name.startsWith(name.toUpperCase()))
        : names.filter((el) => el.name !== "" && el.code.startsWith(name));
        setItemsWithCompany(() => {
          return names.map(el => ({name : el.name , supplier : el.supplier}))
        })
    names = names.map((el) => el.name);
    setItems(names);
  };
  // Get Medicine Type
  const getMedicineType = async () => {
    const response = await axiosApi.get(
      "http://localhost:9090/medicinecategories",
      {
        headers: {
          Authorization: `Basic ${btoa(`admin:admin`)}`,
        },
      }
    );
    const names = response.data.map((medi) => medi.name);
    setMedicineType(names);
  };
  // Run on Component Mount to get Medicine Type and Medicines
  useEffect(() => {
    const timeOut = setTimeout(() => {
      getMedicineType();
      setResponses();
      suppliersHandler();
    }, 10);
    return () => clearTimeout(timeOut);
  }, []);
  // New Order Form Handler
  const handleNewOrder = async (order) => {
    const orderNames = order.medicine.map((el) => el.name);
    const medi2 = medicineList.filter((medi) => orderNames.includes(medi.name));
    const response = await axiosApi.post(
      "http://localhost:9090/orders",
      {
        supplyrequest: order.reqnum,
        deliveryrequest: order.delivaryAuth,
        dateofsupply: order.dateofsupply,
        supplier: order.supplierName,
        orderMedicines: [
          ...order.medicine.map((medi) => ({
            medicine: {
              ...(medi2
                ? medi2.filter((el) => el.name === medi.name)
                : null)[0],
            },
            amount: parseInt(medi.quantity),
            price: parseInt(medi.price),
            expirydate: medi.expire,
          })),
        ],
      },
      {
        headers: {
          Authorization: `Basic ${btoa(`admin:admin`)}`,
        },
      }
    );
    console.log(response);
  };
  const suppliersHandler = async () => {
    const response = await axiosApi.get("http://localhost:9090/suppliers", {
      headers: {
        Authorization: `Basic ${btoa(`admin:admin`)}`,
      },
    });
    setSuppliers(response.data);
  };
  console.log(medicineList);
  console.log(itemsWithCompany);
  return (
    <MedicineContext.Provider
      value={{
        items,
        setItems,
        handleNameOrCode,
        nameOrCode,
        setNameOrCode,
        getMedicines,
        medicineType,
        submitMedicine,
        suppliers,
        handleNewOrder,
        itemsWithCompany
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
};

export default MedicinesProvider;
