<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";

$user_id = $_SESSION['user_id'];

/*Unread Notification Count*/

$sql = "SELECT COUNT(*) AS unread_count
        FROM notifications
        WHERE user_id = ?
        AND is_read = 0";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);

$result = $stmt->fetch();

$unread_count = $result['unread_count'];


/*Recent Notifications Section*/
$sql = "SELECT
            id,
            message,
            is_read,
            created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 5";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);

$notifications = $stmt->fetchAll();


/*My Questions Section*/

$sql = "SELECT
            q.id,
            q.title,
            q.created_at,
            c.name AS category_name,

            COUNT(a.id) AS answer_count

        FROM questions q

        INNER JOIN categories c
            ON q.category_id = c.id

        LEFT JOIN answers a
            ON q.id = a.question_id

        WHERE q.user_id = ?

        GROUP BY
            q.id,
            q.title,
            q.created_at,
            c.name

        ORDER BY q.created_at DESC

        LIMIT 5";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);

$my_questions = $stmt->fetchAll();


/* My Advice Section*/

$sql = "SELECT
            a.id,
            a.answer,
            a.is_best,
            a.created_at,

            q.id AS question_id,
            q.title AS question_title

        FROM answers a

        INNER JOIN questions q
            ON a.question_id = q.id

        WHERE a.user_id = ?

        ORDER BY a.created_at DESC

        LIMIT 5";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);

$my_answers = $stmt->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>Dashboard - Free Advice</title>

</head>

<body>


<h1>Welcome to Free Advice</h1>

<h2>
    Hello,
    <?php echo htmlspecialchars($_SESSION['user_name']); ?>!
</h2>

<p>
    You are successfully logged in.
</p>


<hr>


<!-- Notifications Section -->

<h2> Notifications</h2>

<?php if ($unread_count > 0): ?>

    <p>

        <strong>

            You have
            <?php echo $unread_count; ?>
            new notification(s).

        </strong>

    </p>

<?php else: ?>

    <p>
        No new notifications.
    </p>

<?php endif; ?>


<?php if (count($notifications) > 0): ?>

    <h3>Recent Notifications</h3>

    <?php foreach ($notifications as $notification): ?>

        <p>

            <?php if (!$notification['is_read']): ?>

                <strong>New:</strong>

            <?php endif; ?>

            <?php

            echo htmlspecialchars(
                $notification['message']
            );

            ?>

            <br>

            <small>

                <?php

                echo htmlspecialchars(
                    $notification['created_at']
                );

                ?>

            </small>

        </p>

    <?php endforeach; ?>

<?php endif; ?>


<p>

    <a href="../notifications/index.php">
        View All Notifications
    </a>

</p>


<hr>


<!-- My Questions Section -->

<h2> My Questions</h2>


<?php if (count($my_questions) === 0): ?>

    <p>
        You have not asked any questions yet.
    </p>

<?php else: ?>

    <?php foreach ($my_questions as $question): ?>

        <div>

            <h3>

                <?php

                echo htmlspecialchars(
                    $question['title']
                );

                ?>

            </h3>

            <p>

                <strong>Category:</strong>

                <?php

                echo htmlspecialchars(
                    $question['category_name']
                );

                ?>

            </p>

            <p>

                <strong>Advice Responses:</strong>

                <?php

                echo $question['answer_count'];

                ?>

            </p>

            <p>

                <strong>Posted:</strong>

                <?php

                echo htmlspecialchars(
                    $question['created_at']
                );

                ?>

            </p>

            <a
                href="../questions/view.php?id=<?php echo $question['id']; ?>"
            >
                View Question
            </a>

            <hr>

        </div>

    <?php endforeach; ?>

<?php endif; ?>


<hr>


<!-- My Advice Section -->

<h2> My Advice</h2>


<?php if (count($my_answers) === 0): ?>

    <p>
        You have not given any advice yet.
    </p>

<?php else: ?>

    <?php foreach ($my_answers as $answer): ?>

        <div>

            <h3>

                <?php

                echo htmlspecialchars(
                    $answer['question_title']
                );

                ?>

            </h3>


            <p>

                <strong>My Advice:</strong>

                <br>

                <?php

                echo nl2br(
                    htmlspecialchars(
                        $answer['answer']
                    )
                );

                ?>

            </p>


            <?php if ($answer['is_best']): ?>

                <p>
                     <strong>Best Advice</strong>
                </p>

            <?php endif; ?>


            <p>

                <strong>Posted:</strong>

                <?php

                echo htmlspecialchars(
                    $answer['created_at']
                );

                ?>

            </p>


            <a
                href="../questions/view.php?id=<?php echo $answer['question_id']; ?>"
            >
                View Question
            </a>


            <hr>

        </div>

    <?php endforeach; ?>

<?php endif; ?>


<hr>


<!-- Quick Navigation Section -->

<h2>Quick Navigation</h2>

<ul>

    <li>
        <a href="../questions/ask.php">
            Ask a Question
        </a>
    </li>

    <li>
        <a href="../questions/search.php">
            Browse Questions
        </a>
    </li>

    <li>
        <a href="../notifications/index.php">
            Notifications
        </a>
    </li>

    <li>
        <a href="../user/profile.php">
            My Profile
        </a>
    </li>

</ul>


<hr>


<!-- Account Information Section -->

<h2>Account Information</h2>

<p>

    <strong>Email:</strong>

    <?php

    echo htmlspecialchars(
        $_SESSION['user_email']
    );

    ?>

</p>


<p>

    <strong>Role:</strong>

    <?php

    echo htmlspecialchars(
        $_SESSION['user_role']
    );

    ?>

</p>


<hr>


<?php if ($_SESSION['user_role'] === 'admin'): ?>

    <h2>Administrator</h2>

    <p>

        <a href="../admin/index.php">
            Go to Admin Dashboard
        </a>

    </p>

    <hr>

<?php endif; ?>


<a href="../auth/logout.php">
    Logout
</a>


</body>

</html>