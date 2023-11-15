import SQLite from 'react-native-sqlite-storage';
// StockDatabase.js
import { insertProduct, getProductsByBarCode, updateProductQuantityByBarCode } from '../database/database';

// ตรงนี้คุณสามารถเรียกใช้ฟังก์ชันที่ import มาจาก ProductDatabase.js ได้


SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = "StockDB.db";
const database_version = "1.0";
const database_displayname = "SQLite Product Database";
const database_size = 200000;

let db;







export function initStockDB() {
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
      () => {
        console.log("Database opened");
        db.transaction((tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS Stock " +
            "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, ptID TEXT, PicturePath TEXT, Price REAL, Quantity INTEGER, BarCode TEXT, Pack INTEGER);",
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
  
  export const insertStock = async (name, ptID, picturePath, price, quantity, BarCode, Pack) => {
    // ตรวจสอบว่าฐานข้อมูลเปิดอยู่
    await initStockDB();
  
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO Stock (Name, ptID, PicturePath, Price, Quantity, BarCode, Pack) VALUES (?, ?, ?, ?, ?, ?, ?);",
          [name, ptID, picturePath, price, quantity, BarCode, Pack],
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
  }
  

  export const getStock = async () => {
    await initStockDB();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM Stock;',
          [],
          (tx, results) => {
            let products = [];
            let len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              products.push(row);
            }
            resolve(products);
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        );
      });
    });
  }
  
  export const deleteStock = async (id) => {
    // ตรวจสอบว่าฐานข้อมูลเปิดอยู่
    await initStockDB();
  
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          "DELETE FROM Stock WHERE ID = ?;",
          [id],
          (_, results) => {
            console.log("Stock item deleted successfully", results);
            resolve(results);
          },
          (transactionError) => {
            console.log("Error deleting stock item: " + transactionError.message);
            reject(transactionError);
          }
        );
      });
    });
  };


  // StockDatabase.js
// ...โค้ดเดิมของคุณ...

// สร้างฟังก์ชันเพื่ออัปเดตจำนวนสินค้าใน stock โดยลดลง 1 และใช้จำนวน pack ในการอัปเดตตาราง Products
export const updateStockAndProductQuantity = async (barCode, pack) => {
    await initStockDB(); // ตรวจสอบว่าฐานข้อมูลเปิดอยู่
  
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          // ลดจำนวนสินค้าใน stock ลง 1
          "UPDATE Stock SET Quantity = Quantity - 1 WHERE BarCode = ?;",
          [barCode],
          async (_, stockResults) => {
            console.log("Stock quantity decreased successfully", stockResults);
            // ตรวจสอบว่าสินค้านี้มีอยู่ในตาราง Products หรือไม่
            tx.executeSql(
              "SELECT * FROM Products WHERE BarCode = ?;",
              [barCode],
              (_, productResults) => {
                const product = productResults.rows.item(0);
                if (product) {
                  // สินค้ามีอยู่แล้ว อัปเดตจำนวน
                  tx.executeSql(
                    "UPDATE Products SET Quantity = Quantity + ? WHERE BarCode = ?;",
                    [product.Pack, barCode],
                    (_, updateResults) => {
                      console.log("Product quantity updated successfully", updateResults);
                    },
                    updateError => {
                      console.log("Error updating product quantity: " + updateError.message);
                      reject(updateError);
                    }
                  );
                } else {
                  // สินค้ายังไม่มี ให้ทำการเพิ่มสินค้าใหม่ในตาราง Products
                  // โดยใช้ข้อมูลจากตาราง Stock เช่น Name, Price, PicturePath และ BarCode
                  tx.executeSql(
                    "INSERT INTO Products (Name, Price, PicturePath, Quantity, BarCode) VALUES (?, ?, ?, ?, ?);",
                    [product.Name, product.Price, product.PicturePath, pack, barCode],
                    (_, insertResults) => {
                      console.log("New product inserted successfully", insertResults);
                    },
                    insertError => {
                      console.log("Error inserting new product: " + insertError.message);
                      reject(insertError);
                    }
                  );
                }
              },
              selectError => {
                console.log("Error selecting product: " + selectError.message);
                reject(selectError);
              }
            );
            resolve(stockResults);
          },
          (transactionError) => {
            console.log("Error updating stock quantity: " + transactionError.message);
            reject(transactionError);
          }
        );
      });
    });
  };

  export const updateStockQuantity = async (id, quantity) => {
    await initStockDB(); // ตรวจสอบว่า DB เปิดอยู่
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          "UPDATE Stock SET Quantity = ? WHERE ID = ?;",
          [quantity, id],
          (_, results) => {
            console.log("Stock quantity updated successfully", results);
            resolve(results); // ส่งคืนผลลัพธ์หลังจากอัปเดต
          },
          (transactionError) => {
            console.log("Error updating stock quantity: " + transactionError.message);
            reject(transactionError); // ส่งคืน error หากมี
          }
        );
      });
    });
  };
  
  


  
