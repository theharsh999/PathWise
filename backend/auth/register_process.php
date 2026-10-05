<?php

require_once "../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: register.php");
    exit;
}

$name = trim($_POST["name"]);
$email = trim($_POST["email"]);
$password = $_POST["password"];
$confirm_password = $_POST["confirm_password"];


/* Validate name */
if (empty($name)) {
    die("Name is required.");
}


/* Validate email */
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Invalid email address.");
}


/* Check password */
if (strlen($password) < 6) {
    die("Password must contain at least 6 characters.");
}


/* Check password confirmation */
if ($password !== $confirm_password) {
    die("Passwords do not match.");
}


/* Check if email already exists */

$sql = "SELECT id FROM users WHERE email = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$email]);

if ($stmt->fetch()) {
    die("An account with this email already exists.");
}


/* Hash password */

$hashed_password = password_hash(
    $password,
    PASSWORD_DEFAULT
);


/* Insert user */

$sql = "INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $name,
    $email,
    $hashed_password
]);


echo "Registration successful! <a href='login.php'>Login here</a>";

?>