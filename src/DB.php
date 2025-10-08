<?php
/**
 * Encapsulates a connection to the database 
 * 
 * @author  Arturo Mora-Rioja
 * @version 1.0 August 2020
 */
require_once 'info/Info.php';

class DB {    
    protected object $pdo;

    /**
     * Opens a connection to the database
     */
    public function __construct() {
        $dsn = 'mysql:host=' . Info::HOST . ';dbname=' . Info::DB_NAME . ';charset=utf8';
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ];

        try {
            $this->pdo = @new PDO($dsn, Info::USER, Info::PASSWORD, $options); 
        } catch (\PDOException $e) {
            echo 'Connection unsuccessful';
            die('Connection unsuccessful: ' . $e->getMessage());
            exit();
        }
    }

    /**
     * Closes a connection to the database
     */
    public function __destruct() {
        unset($this->pdo);
    }
}
?>