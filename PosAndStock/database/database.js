import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = 'ProductDB.db';
const database_version = '1.0';
const database_displayname = 'SQLite Product Database';
const database_size = 200000;

let db;

export function initProductDB() {
  db = SQLite.openDatabase(
    {
      name: database_name,
      version: database_version,
      displayname: database_displayname,
      size: database_size,
    },
    () => {
      console.log('Database opened');
      db.transaction(
        tx => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Products ' +
              '(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Promotion TEXT, Type TEXT, pcID TEXT, PicturePath TEXT, Price REAL, Quantity INTEGER, BarCode TEXT);',
          );
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Bills ' +
              '(ID INTEGER PRIMARY KEY AUTOINCREMENT, TotalAmount REAL, DateIssued DATE, TimeIssued TIME);',
          );
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS BillItems ' +
              '(ID INTEGER PRIMARY KEY AUTOINCREMENT, BillID INTEGER, ProductBarcode INTEGER, Quantity INTEGER, Subtotal REAL, ' +
              'FOREIGN KEY (BillID) REFERENCES Bills (ID), ' +
              'FOREIGN KEY (ProductBarcode) REFERENCES Products (BarCode));',
          );
        },
        error => {
          console.log('Error creating tables: ' + error.message);
        },
        () => {
          console.log('All tables created/verified successfully');
        },
      );
    },
    error => {
      console.log('Error opening database: ' + error.message);
    },
  );
}

export const insertProduct = async (
  name,
  Promotion,
  Type,
  pcID,
  picturePath,
  price,
  quantity,
  BarCode,
) => {
  // ตรวจสอบว่าฐานข้อมูลเปิดอยู่
  await initProductDB();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Products (Name, Promotion, Type, pcID, PicturePath, Price, Quantity,BarCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [name, Promotion, Type, pcID, picturePath, price, quantity, BarCode],
        (_, results) => {
          console.log('Product inserted successfully', results);
          resolve(results);
        },
        transactionError => {
          console.log('Error inserting product: ' + transactionError.message);
          reject(transactionError);
        },
      );
    });
  });
};

// Add more functions here to read, update, and delete products

export function closeDB() {
  if (db) {
    console.log('Closing DB');
    db.close(
      () => {
        console.log('Database CLOSED');
      },
      error => {
        console.log('Error closing database: ' + error.message);
      },
    );
  }
}
export const getProducts = async () => {
  await initProductDB();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Products;',
        [],
        (tx, results) => {
          let products = [];
          let len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            products.push(row); // หรือคุณสามารถเลือกเฉพาะฟิลด์ที่ต้องการเพื่อเพิ่มลงใน array
          }
          resolve(products); // ส่งคืนผลลัพธ์
        },
        error => {
          console.log(error);
          reject(error); // ส่งคืนข้อผิดพลาดหากมี
        },
      );
    });
  });
};

export const deleteProduct = async id => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Products WHERE ID = ?;',
        [id],
        (_, results) => {
          console.log('Product deleted successfully', results);
          resolve(results);
        },
        transactionError => {
          console.log('Error deleting product: ' + transactionError.message);
          reject(transactionError);
        },
      );
    });
  });
};

export const deleteAllProducts = async () => {
  await initProductDB(); // รอจนกว่าฐานข้อมูลจะเปิด
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Products;',
        [],
        (_, results) => {
          console.log('All products deleted successfully', results);
          resolve(results);
        },
        transactionError => {
          console.log(
            'Error deleting all products: ' + transactionError.message,
          );
          reject(transactionError);
        },
      );
    });
  });
};

export const getProductsByBarCode = async barCode => {
  await initProductDB(); // ตรวจสอบว่า DB เปิดอยู่
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Products WHERE BarCode = ?;',
        [barCode],
        (tx, results) => {
          let products = [];
          for (let i = 0; i < results.rows.length; i++) {
            let row = results.rows.item(i);
            products.push(row);
          }
          resolve(products); // ส่งคืน array ของผลิตภัณฑ์
        },
        error => {
          console.log('Error retrieving product by barcode: ' + error.message);
          reject(error); // ส่งคืน error หากมี
        },
      );
    });
  });
};

// ฟังก์ชันเพื่ออัปเดตจำนวนผลิตภัณฑ์ในตาราง Products ด้วย BarCode
export const updateProductQuantityByBarCode = async (barCode, quantity) => {
  await initProductDB(); // ตรวจสอบว่า DB เปิดอยู่
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Products SET Quantity = ? WHERE BarCode = ?;',
        [quantity, barCode],
        (_, results) => {
          console.log('Product quantity updated successfully', results);
          resolve(results); // ส่งคืนผลลัพธ์หลังจากอัปเดต
        },
        transactionError => {
          console.log(
            'Error updating product quantity: ' + transactionError.message,
          );
          reject(transactionError); // ส่งคืน error หากมี
        },
      );
    });
  });
};

export const createBillAndBillItems = async (productDetails, totalPrice) => {
  await initProductDB();
  let billID;
  db.transaction(tx => {
    // สร้างบิลใหม่
    tx.executeSql(
      "INSERT INTO Bills (TotalAmount, DateIssued, TimeIssued) VALUES (?, date('now'), time('now'));",
      [totalPrice],
      (_, results) => {
        billID = results.insertId; // ได้ ID ของบิลที่สร้าง
        console.log('Bill created successfully', billID);
      },
      transactionError => {
        console.log('Error creating bill: ' + transactionError.message);
      },
    );

    // สร้างรายการสินค้าในบิล
    Object.entries(productDetails).forEach(([barcode, detail]) => {
      tx.executeSql(
        'INSERT INTO BillItems (BillID, ProductBarcode, Quantity, Subtotal) VALUES (?, ?, ?, ?);',
        [billID, barcode, detail.count, detail.Price * detail.count],
        (_, results) => {
          console.log('Bill item created successfully', results);
        },
        transactionError => {
          console.log('Error creating bill item: ' + transactionError.message);
        },
      );
    });
  });
};

export const decreaseProductQuantityByBarcode = async (barCode, quantity) => {
  await initProductDB();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Products SET Quantity = Quantity - ? WHERE BarCode = ?;',
        [quantity, barCode],
        (_, results) => {
          console.log('Product quantity decreased successfully', results);
          resolve(results);
        },
        transactionError => {
          console.log(
            'Error decreasing product quantity: ' + transactionError.message,
          );
          reject(transactionError);
        },
      );
    });
  });
};



export const getAllBillsWithDetails = async () => {
  await initProductDB();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT b.ID, b.TotalAmount, b.DateIssued, b.TimeIssued, bi.ProductBarcode, bi.Quantity, bi.Subtotal, p.Name, p.Price FROM Bills b ' +
        'INNER JOIN BillItems bi ON b.ID = bi.BillID ' +
        'INNER JOIN Products p ON bi.ProductBarcode = p.BarCode;',
        [],
        (tx, results) => {
          let bills = [];
          let len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            let billId = row.ID;
            let bill = bills.find(b => b.ID === billId);

            if (!bill) {
              bill = {
                ID: billId,
                TotalAmount: row.TotalAmount,
                DateIssued: row.DateIssued,
                TimeIssued: row.TimeIssued,
                Products: []
              };
              bills.push(bill);
            }

            bill.Products.push({
              Barcode: row.ProductBarcode,
              Name: row.Name,
              Price: row.Price,
              Quantity: row.Quantity,
              Subtotal: row.Subtotal
            });
          }
          resolve(bills); // ส่งคืน array ของบิลพร้อมรายละเอียดสินค้า
        },
        error => {
          console.log('Error fetching bills with details: ' + error.message);
          reject(error);
        }
      );
    });
  });
};
