<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/* Only allow POST requests */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: reports.php");
    exit;
}

$report_id = $_POST['report_id'] ?? '';
$status = $_POST['status'] ?? '';

/* Validate report ID */

if (!filter_var($report_id, FILTER_VALIDATE_INT)) {
    die("Invalid report ID.");
}

/* Allowed statuses */

$allowed_statuses = [
    'pending',
    'reviewed',
    'resolved'
];

if (!in_array($status, $allowed_statuses, true)) {
    die("Invalid report status.");
}

/*Check whether report exists*/

$sql = "SELECT id
        FROM reports
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$report_id]);

if (!$stmt->fetch()) {
    die("Report not found.");
}

/*Update report status*/

$sql = "UPDATE reports
        SET status = ?
        WHERE id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $status,
    $report_id
]);

/*Return to reports page*/

header("Location: reports.php");

exit;

?>