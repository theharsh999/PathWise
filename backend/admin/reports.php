<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/* Get all reports */

$sql = "SELECT
            r.id,
            r.reason,
            r.status,
            r.created_at,

            u.name AS reporter_name,

            r.question_id,
            r.answer_id,

            q.title AS question_title,

            a.answer AS answer_text

        FROM reports r

        INNER JOIN users u
            ON r.user_id = u.id

        LEFT JOIN questions q
            ON r.question_id = q.id

        LEFT JOIN answers a
            ON r.answer_id = a.id

        ORDER BY r.created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$reports = $stmt->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>Manage Reports - Free Advice</title>

</head>

<body>

    <h1>Manage Reports</h1>

    <hr>

    <?php if (count($reports) === 0): ?>

        <p>No reports found.</p>

    <?php else: ?>

        <?php foreach ($reports as $report): ?>

            <div>

                <h3>
                    Report #<?php echo $report['id']; ?>
                </h3>


                <!-- Reporter -->

                <p>

                    <strong>Reported By:</strong>

                    <?php

                    echo htmlspecialchars(
                        $report['reporter_name']
                    );

                    ?>

                </p>


                <!-- Report Type -->

                <p>

                    <strong>Type:</strong>

                    <?php if ($report['question_id']): ?>

                        Question

                    <?php else: ?>

                        Advice

                    <?php endif; ?>

                </p>


                <!-- Question -->

                <?php if ($report['question_id']): ?>

                    <p>

                        <strong>Question:</strong>

                        <?php

                        echo htmlspecialchars(
                            $report['question_title']
                        );

                        ?>

                    </p>

                <?php endif; ?>


                <!-- Advice -->

                <?php if ($report['answer_id']): ?>

                    <p>

                        <strong>Advice:</strong>

                        <?php

                        echo nl2br(
                            htmlspecialchars(
                                $report['answer_text']
                            )
                        );

                        ?>

                    </p>

                <?php endif; ?>


                <!-- Reason -->

                <p>

                    <strong>Reason:</strong>

                    <?php

                    echo htmlspecialchars(
                        $report['reason']
                    );

                    ?>

                </p>


                <!-- Current Status -->

                <p>

                    <strong>Current Status:</strong>

                    <?php

                    echo htmlspecialchars(
                        $report['status']
                    );

                    ?>

                </p>


                <!-- Update Status -->

                <form
                    action="update_report.php"
                    method="POST"
                >

                    <input
                        type="hidden"
                        name="report_id"
                        value="<?php echo $report['id']; ?>"
                    >


                    <label>
                        Change Status:
                    </label>


                    <select name="status">

                        <option
                            value="pending"
                            <?php
                            if ($report['status'] === 'pending') {
                                echo 'selected';
                            }
                            ?>
                        >
                            Pending
                        </option>


                        <option
                            value="reviewed"
                            <?php
                            if ($report['status'] === 'reviewed') {
                                echo 'selected';
                            }
                            ?>
                        >
                            Reviewed
                        </option>


                        <option
                            value="resolved"
                            <?php
                            if ($report['status'] === 'resolved') {
                                echo 'selected';
                            }
                            ?>
                        >
                            Resolved
                        </option>

                    </select>


                    <button type="submit">
                        Update Status
                    </button>

                </form>


                <!-- Report Date -->

                <p>

                    <strong>Reported On:</strong>

                    <?php

                    echo htmlspecialchars(
                        $report['created_at']
                    );

                    ?>

                </p>


                <hr>

            </div>

        <?php endforeach; ?>

    <?php endif; ?>


    <br>


    <a href="index.php">
        Back to Admin Dashboard
    </a>


</body>

</html>