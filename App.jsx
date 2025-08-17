import { useState } from 'react';
import './App.css';
import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";



function App() {

  const [customerName, setcustomerName] = useState("");
  const [customerPhone, setcustomerPhone] = useState("+91");


  const [productName, setproductName] = useState("");
  const [quantityNo, setquantityNo] = useState(0);
  const [priceNo, setpriceNo] = useState(0);

  const [productlist, setproductList] = useState([]);
  const [showlist, setshowlist] = useState(false);
  const [errorname, seterrorname] = useState();
  const [errorphone, seterrorphone] = useState();

  const now = new Date();

  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();


  const handleNameChange = (e) => {
    const input = e.target.value;
    const lettersOnly = input.replace(/[^A-Za-z]/g, " "); // block numbers & special chars
    if (input === lettersOnly) {
      setcustomerName(input);
      seterrorname("");
    }
    else {
      seterrorname("Type letters only");
    }
  };

  const checkphoneNo = (e) => {
    const input = e.target.value;
    const phoneNo = (/^\+91[0-9]*$/).test(input);
    if (phoneNo) {
      setcustomerPhone(input);
      seterrorphone("");
    }
    else {
      seterrorphone("Type numbers only")
    }

  }

  const onAdd = (e) => {
    {
      if (!productName && quantityNo === 0 && priceNo === 0) {
        alert("Please fill all product details")
        return;
      }
      if (!customerName || customerName.length <= 2) {
        alert("Please type Customer Name properly!");
        return;

      }
      if (!customerPhone || customerPhone.length <= 3 || customerPhone.length <= 12) {
        alert("Please type valid Phone Number!");
        return;
      }
      if (!productName.trim()) {
        alert("Please add a valid Product name!");
        return;
      }
      if (quantityNo <= 0) {
        alert("Please add proper quantities!");
        return;
      }
      if (priceNo <= 0) {
        alert("Please add correct price!");
        return;
      }

      const total = Number(quantityNo * priceNo);
      const discount = 0.05; // 5% discount
      const discountedTotal = (total - (total * discount));

      const object1 = {
        productName: productName,
        qty: Math.round(Number(quantityNo)),
        price: Number(priceNo).toFixed(2),
        total: Number(total).toFixed(2),
        discountedTotal: Number(discountedTotal).toFixed(2),
      };
      setproductList([...productlist, object1]);

    };
    setproductName("");
    setquantityNo(0);
    setpriceNo(0);
  }
  const generateBill = () => {
    if (!showlist) {
      setshowlist(true);
    }
  }
  const resetCounter = () => {
    setcustomerName("");
    setcustomerPhone("+91");
    setproductName("");
    setquantityNo(0);
    setpriceNo(0);
    setshowlist(false);
    setproductList([]);
    seterrorname("");
  }


  const printbill = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(" Koppal Mart Bill Invoice-2025", 55, 20)
    doc.text("__________________________", 55, 22)
    doc.setFontSize(15);
    doc.setFont("helvetica", "Normal");
    doc.text(`Customer Name: ${customerName}`, 15, 40)
    doc.text(`Phone Number: ${customerPhone}`, 15, 50)
    doc.setFontSize(12);
    doc.text(`Date:${dateStr} | Time:${timeStr}`, 135, 40)

    doc.setFontSize(15);

    const coloums = ["Sl.no", "Product Name", "Quantity", "Price", "Discount", "Total"]
    const rows = productlist.map((element, index) => [
      index + 1,
      element.productName,
      element.qty,
      element.price,
      "5%",
      element.discountedTotal,
    ]);


    autoTable(doc, {
      head: [coloums],
      body: rows,
      startY: 60,
    })
    doc.setFont("inherit", "bold");
    doc.setFontSize(16);
    const finalY = doc.lastAutoTable.finalY || 50;

    const grandTotal = productlist.reduce((total, element) => total + Number(element.discountedTotal), 0);
    doc.text(`Grand Total:  ${grandTotal.toFixed(2)} /-`, 14, finalY + 10);


    console.log(printbill);
    doc.save("kpl bill invoice.pdf");
  };


  return (
    <>
      <div className="bill">
        <h1>Koppal Mart Bill Counter</h1>
        <div className="basic">
          <label htmlFor="">Customer Name:</label>
          <div className='inputwrap'>
            <input type="text" placeholder="Enter customer name" value={customerName} onChange={handleNameChange} maxLength={23} required />
            {errorname && <div className='errorname'>{errorname}</div>}
          </div></div>
        <div className='phone'>
          <label htmlFor="">Phone Number:</label>
          <div className='inputwrap'>
            <input type="tel" placeholder="Enter phone number" value={customerPhone} onChange={checkphoneNo} maxLength={13} required />
            {errorphone && <div className='errorphone'>{errorphone}</div>}
          </div>
        </div>

        {productlist.length > 0 && <div className="added_items">
          <h3>Items list:</h3>
          <table border="3">
            <thead>
              <tr>
                <th>Sl.no</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>{
              productlist.map((element, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{element.productName}</td>
                  <td>{element.qty}</td>
                  <td>{element.price}</td>
                  <td>{element.total}</td>
                </tr>))
            }
            </tbody>
          </table>
          <button className='btn' onClick={generateBill}>🔗Generate final bill</button>
        </div>

        }

        <div className="price_details">
          <label htmlFor="">Product Name:</label>
          <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setproductName(e.target.value)} maxLength={20} />

          <label htmlFor="">Quantity:</label>
          <input type="number" placeholder="Enter quantity" value={quantityNo} onChange={(e) => setquantityNo(e.target.value)} />

          <label htmlFor="">Price:</label>
          <input type="number" placeholder="Enter price" value={priceNo} onChange={(e) => setpriceNo(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onAdd()} />

          <h3 className='total' >Total: ₹ {(quantityNo * priceNo).toFixed(2)} /- </h3>

          <button onClick={onAdd}>Add item ✓</button>

          {showlist ? (!customerName || !customerPhone || customerPhone.length < 13 || customerName.length <= 2) ?
            (<p className='error'>Please check customer Name & Phone number! </p>) :
            (<div className="generate">
              <h2>Final Bill</h2>
              <h3>🛍️Koppal Mart🛒</h3>
              <h4 className='ccph'>🤵Customer Name: {customerName} | 📞PhoneNo : {customerPhone} </h4>
            <div className='scroll'>
              <table className='table1' border="3">
                <thead>
                  <tr>
                    <th>Sl.no</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {

                    productlist.map((element, index) => (
                      <tr key={index}>
                        <td> {index + 1}</td>
                        <td> {element.productName}</td>
                        <td> {element.qty}</td>
                        <td> {element.price}</td>
                        <td>5%</td>
                        <td> {element.discountedTotal}</td>
                      </tr>
                    ))}
                </tbody>

              </table>
              <h3 className='grand'>Grand Total: ₹
                {(productlist.reduce((total, element) => {
                  return total + Number(element.discountedTotal);
                }, 0)).toFixed(2)}
              </h3>
</div>
            </div>) : null
          }
          {(showlist && customerName && customerPhone && customerPhone.length >= 13 && customerName.length >= 3) && <div className='printreset'>
            <button onClick={printbill} > 🖨️ Print bill</button> </div>
          }

          <button className='reset' onClick={resetCounter}>🔄️ Reset</button>

        </div>
      </div>


    </>

  );
}

export default App;