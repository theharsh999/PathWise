<?php

require_once "../includes/auth_check.php";
require_once "../config/database.php";


/* Get search parameters */

$search = trim($_GET['search'] ?? '');
$category_id = $_GET['category_id'] ?? '';
$sort = $_GET['sort'] ?? 'latest';


/* Get categories */

$sql = "SELECT id, name
        FROM categories
        ORDER BY name ASC";

$stmt = $pdo->query($sql);

$categories = $stmt->fetchAll();


/* Base query */

$sql = "SELECT
            q.id,
            q.title,
            q.description,
            q.is_anonymous,
            q.created_at,
            c.name AS category_name,
            u.name AS user_name,
            COUNT(a.id) AS answer_count

        FROM questions q

        INNER JOIN categories c
            ON q.category_id = c.id

        INNER JOIN users u
            ON q.user_id = u.id

        LEFT JOIN answers a
            ON q.id = a.question_id

        WHERE 1=1";


$params = [];


/* Search */

if ($search !== '') {

    $sql .= " AND (
                q.title LIKE ?
                OR q.description LIKE ?
              )";

    $params[] = "%" . $search . "%";
    $params[] = "%" . $search . "%";
}


/* Category filter */

if (filter_var($category_id, FILTER_VALIDATE_INT)) {

    $sql .= " AND q.category_id = ?";

    $params[] = $category_id;
}


/* Group */

$sql .= " GROUP BY
            q.id,
            q.title,
            q.description,
            q.is_anonymous,
            q.created_at,
            c.name,
            u.name";


/* Sorting */

if ($sort === 'oldest') {

    $sql .= " ORDER BY q.created_at ASC";

} elseif ($sort === 'most_answered') {

    $sql .= " ORDER BY answer_count DESC";

} else {

    $sql .= " ORDER BY q.created_at DESC";

}


/* Execute */

$stmt = $pdo->prepare($sql);

$stmt->execute($params);

$questions = $stmt->fetchAll();

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>
        Browse Questions - Free Advice
    </title>

</head>

<body>

    <h1>Free Advice</h1>

    <h2>Browse Questions</h2>


    <!-- Search -->

    <form method="GET" action="search.php">

        <input
            type="text"
            name="search"
            placeholder="Search questions..."
            value="<?php echo htmlspecialchars($search); ?>"
        >


        <select name="category_id">

            <option value="">
                All Categories
            </option>

            <?php foreach ($categories as $category): ?>

                <option
                    value="<?php echo $category['id']; ?>"

                    <?php

                    if ($category_id == $category['id']) {
                        echo "selected";
                    }

                    ?>

                >

                    <?php echo htmlspecialchars($category['name']); ?>

                </option>

            <?php endforeach; ?>

        </select>


        <select name="sort">

            <option
                value="latest"
                <?php if ($sort === 'latest') echo 'selected'; ?>
            >
                Latest
            </option>

            <option
                value="oldest"
                <?php if ($sort === 'oldest') echo 'selected'; ?>
            >
                Oldest
            </option>

            <option
                value="most_answered"
                <?php if ($sort === 'most_answered') echo 'selected'; ?>
            >
                Most Answered
            </option>

        </select>


        <button type="submit">
            Search
        </button>

    </form>


    <hr>


    <!-- Questions -->

    <?php if (count($questions) === 0): ?>

        <p>
            No questions found.
        </p>

    <?php else: ?>


        <?php foreach ($questions as $question): ?>

            <article>

                <h3>

                    <a href="view.php?id=<?php echo $question['id']; ?>">

                        <?php echo htmlspecialchars($question['title']); ?>

                    </a>

                </h3>


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

                    <?php

                    echo htmlspecialchars(
                        substr($question['description'], 0, 150)
                    );

                    ?>

                    <?php

                    if (strlen($question['description']) > 150) {
                        echo "...";
                    }

                    ?>

                </p>


                <p>

                    <strong>
                        <?php echo $question['answer_count']; ?>
                    </strong>

                    advice response(s)

                </p>


                <hr>

            </article>

        <?php endforeach; ?>


    <?php endif; ?>


    <br>

    <a href="ask.php">
        Ask for Advice
    </a>

    <br><br>

    <a href="../dashboard/index.php">
        Dashboard
    </a>

</body>

</html>