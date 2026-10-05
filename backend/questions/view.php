<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";

/* Validate question ID. */

if (
    !isset($_GET['id']) ||
    !filter_var($_GET['id'], FILTER_VALIDATE_INT)
) {
    die("Invalid question ID.");
}

$question_id = (int) $_GET['id'];

/* Get question details. */

$sql = "SELECT
            q.id,
            q.title,
            q.description,
            q.is_anonymous,
            q.created_at,
            q.user_id,
            c.name AS category_name,
            u.name AS user_name
        FROM questions q
        INNER JOIN categories c
            ON q.category_id = c.id
        INNER JOIN users u
            ON q.user_id = u.id
        WHERE q.id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$question_id]);

$question = $stmt->fetch();

if (!$question) {
    die("Question not found.");
}

/* Get answers and helpful votes. */

$sql = "SELECT
            a.id,
            a.answer,
            a.created_at,
            a.user_id,
            a.is_best,
            u.name AS user_name,
            COUNT(DISTINCT l.id) AS like_count,
            MAX(
                CASE
                    WHEN l.user_id = ?
                    THEN 1
                    ELSE 0
                END
            ) AS user_liked
        FROM answers a
        INNER JOIN users u
            ON a.user_id = u.id
        LEFT JOIN likes l
            ON a.id = l.answer_id
        WHERE a.question_id = ?
        GROUP BY
            a.id,
            a.answer,
            a.created_at,
            a.user_id,
            a.is_best,
            u.name
        ORDER BY a.created_at ASC";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $_SESSION['user_id'],
    $question_id
]);

$answers = $stmt->fetchAll();

/* Get replies. */

$sql = "SELECT
            r.id,
            r.answer_id,
            r.reply,
            r.created_at,
            r.user_id,
            u.name AS user_name
        FROM replies r
        INNER JOIN users u
            ON r.user_id = u.id
        INNER JOIN answers a
            ON r.answer_id = a.id
        WHERE a.question_id = ?
        ORDER BY r.created_at ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute([$question_id]);

$replies = $stmt->fetchAll();

/* Group replies by answer. */

$replies_by_answer = [];

foreach ($replies as $reply) {
    $replies_by_answer[$reply['answer_id']][] = $reply;
}

// Count answers.

$answer_count = count($answers);

// Check question owner.

$is_owner = ($question['user_id'] == $_SESSION['user_id']);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>
        <?php echo htmlspecialchars($question['title']); ?>
        - Free Advice
    </title>
</head>

<body>

    <h1>Free Advice</h1>

    <hr>

    <!-- Question -->

    <h2>
        <?php echo htmlspecialchars($question['title']); ?>
    </h2>

    <p>
        <strong>Category:</strong>
        <?php echo htmlspecialchars($question['category_name']); ?>
    </p>

    <p>
        <strong>Asked by:</strong>

        <?php
        if ($question['is_anonymous']) {
            echo "Anonymous User";
        } else {
            echo htmlspecialchars($question['user_name']);
        }
        ?>
    </p>

    <p>
        <strong>Posted:</strong>
        <?php echo htmlspecialchars($question['created_at']); ?>
    </p>

    <hr>

    <!-- Description -->

    <h3>Problem</h3>

    <p>
        <?php
        echo nl2br(
            htmlspecialchars($question['description'])
        );
        ?>
    </p>

    <!-- Report -->

    <p>
        <a href="../reports/question.php?question_id=<?php echo $question['id']; ?>">
            Report Question
        </a>
    </p>

    <hr>

    <!-- Answer Count -->

    <h3>
        <?php echo $answer_count; ?>
        Advice Response(s)
    </h3>

    <!-- Add Answer -->

    <?php if (!$is_owner): ?>

        <p>
            <a href="../answers/add.php?question_id=<?php echo $question['id']; ?>">
                <button type="button">
                    Give Advice
                </button>
            </a>
        </p>

    <?php endif; ?>

    <hr>

    <!-- Answers -->

    <h3>Advice from Others</h3>

    <?php if ($answer_count === 0): ?>

        <p>No advice has been given yet.</p>

    <?php else: ?>

        <?php foreach ($answers as $answer): ?>

            <div>

                <!-- Author -->

                <h4>

                    <?php echo htmlspecialchars($answer['user_name']); ?>

                    <?php if ($answer['is_best']): ?>
                        Best Advice
                    <?php endif; ?>

                </h4>

                <!-- Answer -->

                <p>
                    <?php
                    echo nl2br(
                        htmlspecialchars($answer['answer'])
                    );
                    ?>
                </p>

                <!-- Date -->

                <p>
                    <small>
                        Posted:
                        <?php echo htmlspecialchars($answer['created_at']); ?>
                    </small>
                </p>

                <!-- Helpful Votes -->

                <p>

                    <a href="../answers/like.php?id=<?php echo $answer['id']; ?>">

                        <?php if ($answer['user_liked']): ?>
                            Unlike
                        <?php else: ?>
                            Helpful
                        <?php endif; ?>

                    </a>

                    &nbsp;

                    <strong>
                        <?php echo $answer['like_count']; ?>
                    </strong>

                    helpful vote(s)

                </p>

                <!-- Reply -->

                <p>
                    <a href="../replies/add.php?answer_id=<?php echo $answer['id']; ?>">
                        Reply
                    </a>
                </p>

                <!-- Report -->

                <p>
                    <a href="../reports/answer.php?answer_id=<?php echo $answer['id']; ?>">
                        Report Advice
                    </a>
                </p>

                <!-- Replies -->

                <?php if (isset($replies_by_answer[$answer['id']])): ?>

                    <h4>Replies</h4>

                    <?php foreach ($replies_by_answer[$answer['id']] as $reply): ?>

                        <div>

                            <p>
                                <strong>
                                    <?php echo htmlspecialchars($reply['user_name']); ?>:
                                </strong>
                            </p>

                            <p>
                                <?php
                                echo nl2br(
                                    htmlspecialchars($reply['reply'])
                                );
                                ?>
                            </p>

                            <p>
                                <small>
                                    Replied:
                                    <?php echo htmlspecialchars($reply['created_at']); ?>
                                </small>
                            </p>

                            <!-- Reply Owner -->

                            <?php if ($reply['user_id'] == $_SESSION['user_id']): ?>

                                <p>
                                    <a
                                        href="../replies/delete.php?id=<?php echo $reply['id']; ?>"
                                        onclick="return confirm('Are you sure you want to delete this reply?');"
                                    >
                                        Delete Reply
                                    </a>
                                </p>

                            <?php endif; ?>

                        </div>

                    <?php endforeach; ?>

                <?php endif; ?>

                <!-- Answer Owner -->

                <?php if ($answer['user_id'] == $_SESSION['user_id']): ?>

                    <p>

                        <a href="../answers/edit.php?id=<?php echo $answer['id']; ?>">
                            Edit Advice
                        </a>

                        &nbsp; | &nbsp;

                        <a
                            href="../answers/delete.php?id=<?php echo $answer['id']; ?>"
                            onclick="return confirm('Are you sure you want to delete this advice?');"
                        >
                            Delete Advice
                        </a>

                    </p>

                <?php endif; ?>

                <!-- Best Answer -->

                <?php if ($is_owner && !$answer['is_best']): ?>

                    <p>
                        <a
                            href="../answers/best.php?id=<?php echo $answer['id']; ?>"
                            onclick="return confirm('Mark this as the best advice?');"
                        >
                            Mark as Best Advice
                        </a>
                    </p>

                <?php endif; ?>

                <hr>

            </div>

        <?php endforeach; ?>

    <?php endif; ?>

    <br>

    <!-- Question Owner -->

    <?php if ($is_owner): ?>

        <a href="edit.php?id=<?php echo $question['id']; ?>">
            Edit Question
        </a>

        <br><br>

        <a
            href="delete.php?id=<?php echo $question['id']; ?>"
            onclick="return confirm('Are you sure you want to delete this question?');"
        >
            Delete Question
        </a>

    <?php endif; ?>

    <br><br>

    <!-- Navigation -->

    <a href="ask.php">
        Ask Another Question
    </a>

    <br><br>

    <a href="search.php">
        Browse Questions
    </a>

    <br><br>

    <a href="../dashboard/index.php">
        Back to Dashboard
    </a>

</body>

</html>