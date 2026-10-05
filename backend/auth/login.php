<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Free Advice</title>
</head>

<body>

    <h1>Free Advice</h1>
    <h2>Login</h2>

    <?php
    if (isset($_GET['error'])) {
        echo "<p>" . htmlspecialchars($_GET['error']) . "</p>";
    }
    ?>

    <form action="login_process.php" method="POST">

        <label>Email:</label><br>
        <input type="email" name="email" required>
        <br><br>

        <label>Password:</label><br>
        <input type="password" name="password" required>
        <br><br>

        <button type="submit">Login</button>

    </form>

    <p>
        Don't have an account?
        <a href="register.php">Register</a>
    </p>

</body>
</html>