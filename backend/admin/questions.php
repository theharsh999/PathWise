<?php

require_once "../includes/admin_check.php";
require_once "../config/database.php";

/*Get all questions with their categories,authors, and answer counts.*/

$sql = "SELECT
            q.id,
            q.title,
            q.description,
            q.is_anonymous,
            q.created_at,

            u.name AS user_name,

            c.name AS category_name,

            COUNT(a.id) AS answer_count

        FROM questions q

        INNER JOIN users u
            ON q.user_id = u.id

        INNER JOIN categories c
            ON q.category_id = c.id

        LEFT JOIN answers a
            ON q.id = a.question_id

        GROUP BY
            q.id,
            q.title,
            q.description,
            q.is_anonymous,
            q.created_at,
            u.name,
            c.name

        ORDER BY q.created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$questions = $stmt->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>Manage Questions - Free Advice</title>

</head>

<body>

    <h1>Manage Questions</h1>

    <hr>

    <?php if (count($questions) === 0): ?>

        <p>No questions found.</p>

    <?php else: ?>

        <?php foreach ($questions as $question): ?>

            <div>

                <h3>
                    Question #<?php echo $question['id']; ?>
                </h3>


                <!-- Title -->

                <p>

                    <strong>Title:</strong>

                    <?php

                    echo htmlspecialchars(
                        $question['title']
                    );

                    ?>

                </p>


                <!-- Description -->

                <p>

                    <strong>Description:</strong>

                    <br>

                    <?php

                    echo nl2br(
                        htmlspecialchars(
                            $question['description']
                        )
                    );

                    ?>

                </p>


                <!-- Category -->

                <p>

                    <strong>Category:</strong>

                    <?php

                    echo htmlspecialchars(
                        $question['category_name']
                    );

                    ?>

                </p>


                <!-- Author -->

                <p>

                    <strong>Asked By:</strong>

                    <?php

                    if ($question['is_anonymous']) {

                        echo "Anonymous User";

                    } else {

                        echo htmlspecialchars(
                            $question['user_name']
                        );

                    }

                    ?>

                </p>


                <!-- Answer Count -->

                <p>

                    <strong>Advice Responses:</strong>

                    <?php

                    echo $question['answer_count'];

                    ?>

                </p>


                <!-- Date -->

                <p>

                    <strong>Posted:</strong>

                    <?php

                    echo htmlspecialchars(
                        $question['created_at']
                    );

                    ?>

                </p>


                <!-- View Question -->

                <p>

                    <a
                        href="../questions/view.php?id=<?php echo $question['id']; ?>"
                    >
                        View Question
                    </a>

                </p>


                <!-- Delete Question -->

                <form
                    action="delete_question.php"
                    method="POST"
                >

                    <input
                        type="hidden"
                        name="question_id"
                        value="<?php echo $question['id']; ?>"
                    >

                    <button
                        type="submit"
                        onclick="return confirm('Are you sure you want to delete this question? This will also delete its answers, replies and likes.');"
                    >
                        Delete Question
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