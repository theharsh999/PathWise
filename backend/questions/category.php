<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";

if (
    !isset($_GET['id']) ||
    !filter_var($_GET['id'], FILTER_VALIDATE_INT)
) {
    die("Invalid category ID.");
}

$category_id = (int) $_GET['id'];

$sql = "SELECT id, name, description
        FROM categories
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$category_id]);

$category = $stmt->fetch();

if (!$category) {
    die("Category not found.");
}

$sql = "SELECT
            q.id,
            q.title,
            q.description,
            q.is_anonymous,
            q.created_at,
            u.name AS user_name,
            COUNT(a.id) AS answer_count
        FROM questions q
        INNER JOIN users u
            ON q.user_id = u.id
        LEFT JOIN answers a
            ON q.id = a.question_id
        WHERE q.category_id = ?
        GROUP BY
            q.id,
            q.title,
            q.description,
            q.is_anonymous,
            q.created_at,
            u.name
        ORDER BY q.created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute([$category_id]);

$questions = $stmt->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>
        <?php echo htmlspecialchars($category['name']); ?> - Free Advice
    </title>

</head>

<body>

<h1>
    <?php echo htmlspecialchars($category['name']); ?>
</h1>

<?php if (!empty($category['description'])): ?>

    <p>
        <?php echo htmlspecialchars($category['description']); ?>
    </p>

<?php endif; ?>

<hr>

<h2>Questions</h2>

<?php if (count($questions) === 0): ?>

    <p>No questions found in this category.</p>

<?php else: ?>

    <?php foreach ($questions as $question): ?>

        <div>

            <h3>
                <a href="view.php?id=<?php echo $question['id']; ?>">
                    <?php echo htmlspecialchars($question['title']); ?>
                </a>
            </h3>

            <p>
                <?php
                echo htmlspecialchars(
                    mb_substr($question['description'], 0, 200)
                );
                ?>
            </p>

            <p>

                <?php if ($question['is_anonymous']): ?>

                    Asked anonymously

                <?php else: ?>

                    Asked by
                    <?php echo htmlspecialchars($question['user_name']); ?>

                <?php endif; ?>

                |

                <?php echo (int) $question['answer_count']; ?>
                advice(s)

                |

                <?php echo htmlspecialchars($question['created_at']); ?>

            </p>

            <hr>

        </div>

    <?php endforeach; ?>

<?php endif; ?>

<br>

<a href="search.php">Back to Questions</a>

<br><br>

<a href="../dashboard/index.php">Back to Dashboard</a>

</body>

</html>