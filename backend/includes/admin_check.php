<?php

require_once "auth_check.php";

if ($_SESSION['user_role'] !== 'admin') {
    header("Location: ../dashboard/index.php");
    exit;
}

?>