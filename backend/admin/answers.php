<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/* Get all answers with their authors,
  related questions, and helpful vote counts. */

$sql = "SELECT
            a.id,
            a.answer,
            a.is_best,
            a.created_at,

            u.name AS user_name,

            q.id AS question_id,
            q.title AS question_title,

            COUNT(l.id) AS like_count

        FROM answers a

        INNER JOIN users u
            ON a.user_id = u.id

        INNER JOIN questions q
            ON a.question_id = q.id

        LEFT JOIN likes l
            ON a.id = l.answer_id

        GROUP BY
            a.id,
            a.answer,
            a.is_best,
            a.created_at,
            u.name,
            q.id,
            q.title

        ORDER BY a.created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$answers = $stmt->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>Manage Answers - Free Advice</title>

</head>

<body>

    <h1>Manage Answers</h1>

    <hr>

    <?php if (count($answers) === 0): ?>

        <p>No answers found.</p>

    <?php else: ?>

        <?php foreach ($answers as $answer): ?>

            <div>

                <h3>
                    Advice #<?php echo $answer['id']; ?>
                </h3>


                <!-- Answer Section -->

                <p>

                    <strong>Advice:</strong>

                    <br>

                    <?php

                    echo nl2br(
                        htmlspecialchars(
                            $answer['answer']
                        )
                    );

                    ?>

                </p>


               <!-- Author Section -->

                <p>

                    <strong>Given By:</strong>

                    <?php

                    echo htmlspecialchars(
                        $answer['user_name']
                    );

                    ?>

                </p>

                <!-- Related Question Section -->

                <p>

                    <strong>Question:</strong>

                    <?php

                    echo htmlspecialchars(
                        $answer['question_title']
                    );

                    ?>

                </p>


                <!-- Best Advice Status Section -->

                <p>

                    <strong>Status:</strong>

                    <?php if ($answer['is_best']): ?>

                         Best Advice

                    <?php else: ?>

                        Regular Advice

                    <?php endif; ?>

                </p>


                <!-- Helpful Votes Section -->

                <p>

                    <strong>Helpful Votes:</strong>

                    <?php

                    echo $answer['like_count'];

                    ?>

                </p>


                <!-- Posted Date Section -->

                <p>

                    <strong>Posted:</strong>

                    <?php

                    echo htmlspecialchars(
                        $answer['created_at']
                    );

                    ?>

                </p>


                <!-- View Question Section -->

                <p>

                    <a
                        href="../questions/view.php?id=<?php echo $answer['question_id']; ?>"
                    >
                        View Related Question
                    </a>

                </p>


                <!-- Delete Answer Section -->

                <form
                    action="delete_answer.php"
                    method="POST"
                >

                    <input
                        type="hidden"
                        name="answer_id"
                        value="<?php echo $answer['id']; ?>"
                    >

                    <button
                        type="submit"
                        onclick="return confirm('Are you sure you want to delete this advice? This will also delete its replies and helpful votes.');"
                    >
                        Delete Advice
                    </button>

                </form>


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