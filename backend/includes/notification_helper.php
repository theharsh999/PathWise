<?php

function createNotification($pdo, $user_id, $message)
{
    $sql = "INSERT INTO notifications
            (user_id, message)
            VALUES (?, ?)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $user_id,
        $message
    ]);
}

?>