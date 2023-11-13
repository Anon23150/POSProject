import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = "ProductDB.db";
const database_version = "1.0";
const database_displayname = "SQLite Product Database";
const database_size = 200000;

let db;

export function initDB() {
  db = SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
    () => {
      console.log("Database opened");
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Products " +
          "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, pmID TEXT, ptID TEXT, pcID TEXT, PicturePath TEXT, Price REAL, Quantity INTEGER);",
          [],
          () => {
            console.log("Table created successfully");
          },
          error => {
            console.log("Error create table: " + error.message);
          }
        );
      });
    },
    error => {
      console.log("Error opening database: " + error.message);
    }
  );
}

export const insertProduct = async (name, pmID, ptID, pcID, picturePath, price, quantity) => {
  // ตรวจสอบว่าฐานข้อมูลเปิดอยู่
  await initDB();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO Products (Name, pmID, ptID, pcID, PicturePath, Price, Quantity) VALUES (?, ?, ?, ?, ?, ?, ?);",
        [name, pmID, ptID, pcID, picturePath, price, quantity],
        (_, results) => {
          console.log("Product inserted successfully", results);
          resolve(results);
        },
        (transactionError) => {
          console.log("Error inserting product: " + transactionError.message);
          reject(transactionError);
        }
      );
    });
  });
};

// Add more functions here to read, update, and delete products

export function closeDB() {
  if (db) {
    console.log("Closing DB");
    db.close(
      () => {
        console.log("Database CLOSED");
      },
      error => {
        console.log("Error closing database: " + error.message);
      }
    );
  }
}
export const getProducts = async () => {

    await initDB(); 
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
          (error) => {
            console.log(error);
            reject(error); // ส่งคืนข้อผิดพลาดหากมี
          }
        );
      });
    });
  };


  export const deleteProduct = async (id) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          "DELETE FROM Products WHERE ID = ?;",
          [id],
          (_, results) => {
            console.log("Product deleted successfully", results);
            resolve(results);
          },
          (transactionError) => {
            console.log("Error deleting product: " + transactionError.message);
            reject(transactionError);
          }
        );
      });
    });
  };


  export const deleteAllProducts = async () => {
    await initDB(); // รอจนกว่าฐานข้อมูลจะเปิด
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          "DELETE FROM Products;",
          [],
          (_, results) => {
            console.log("All products deleted successfully", results);
            resolve(results);
          },
          (transactionError) => {
            console.log("Error deleting all products: " + transactionError.message);
            reject(transactionError);
          }
        );
      });
    });
  };