<?php

// Betöltjük a tesztelendő fájlt

require_once __DIR__ . '/connect.php';

 

/**

 * Teszteli az adatbázis-kapcsolatot

 * @param mysqli $dbconn Az adatbázis-kapcsolat

 */

function testDatabaseConnection($dbconn)

{

    if ($dbconn) {

        echo "Az adatbázis-kapcsolat sikeres!<br>";

    } else {

        echo "Az adatbázis-kapcsolat sikertelen: " . mysqli_connect_error() . "<br>";

    }

}

 

/**

 * Teszteli a karakterkódolás beállítását az adatbázis-kapcsolaton

 * @param mysqli $dbconn Az adatbázis-kapcsolat

 */

function testCharacterEncoding($dbconn)

{

    $result = mysqli_query($dbconn, "SHOW VARIABLES LIKE 'character_set_connection';");

    $row = mysqli_fetch_assoc($result);

    if ($row['Value'] === 'utf8') {

        echo "A karakterkódolás UTF-8-ra van állítva.<br>";

    } else {

        echo "A karakterkódolás nem UTF-8. Jelenlegi beállítás: " . htmlspecialchars($row['Value']) . "<br>";

    }

}

 

/**

 * Teszteli, hogy a környezeti változók megfelelően betöltődtek-e

 */

function testEnvVariables()

{

    $requiredKeys = ['DBHOST', 'DBUSER', 'DBPASS', 'DBNAME'];

    $missingKeys = [];

 

    foreach ($requiredKeys as $key) {

        if (empty($_ENV[$key])) {

            $missingKeys[] = $key;

        }

    }

 

    if (empty($missingKeys)) {

        echo "Minden szükséges környezeti változó be van állítva.<br>";

    } else {

        echo "Hiányzó környezeti változók: " . implode(', ', $missingKeys) . "<br>";

    }

}

 

// Tesztek futtatása

echo "<h2>Adatbázis-kapcsolat tesztelése</h2>";

testDatabaseConnection($dbconn);

 

echo "<h2>Karakterkódolás tesztelése</h2>";

testCharacterEncoding($dbconn);

 

echo "<h2>Környezeti változók tesztelése</h2>";

testEnvVariables();

 

// Az adatbázis-kapcsolat lezárása


mysqli_close($dbconn);