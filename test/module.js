const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydbb"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to mySQL");
});

// Create table
const createTable = () => {
    const query = "CREATE TABLE IF NOT EXISTS `datasensors` (`id` INT(10) AUTO_INCREMENT PRIMARY KEY, `ss_id` INT(10), `temp` INT(10), `humidity` INT(10), `light` INT(10), `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);";
    connection.query(query, (err, result) => {
      if (err) throw err;
      console.log("Created table successfully!");
    });
  };
  
//   // Insert data into table
  const insertNewData = (ss_id, temp, humidity, light) => {
    const query =
      "INSERT INTO datasensors (ss_id, temp, humidity, light) VALUES (?, ?, ?, ?);";
    connection.query(
      query,
      [ss_id, temp, humidity, light],
      (err, result) => {
        if (err) throw err;
        console.log("Inserted successfully");
        console.log(result);
      }
    );
  };
  
  

module.exports = {
    createTable,
    insertNewData
}