<?php

$data = json_decode(file_get_contents('php://input'), true);

foreach($data as $member) {
  $first = $array['firstName'];
  $last = $array['lastName'];
  $rating = $array['rating'];

  $existingMember = mysqli_query($con, "SELECT * FROM 'table' WHERE firstName = '$first' AND lastName = '$last' LIMIT 1");

  if(mysqli_num_rows($existingMember) > 0) {
    mysqli_query($con, "UPDATE 'table' SET rating = '$rating' WHERE firstName = '$first' AND lastName = '$last'");
  } else {
    mysqli_query($con, "INSERT INTO 'table' (rating, firstName, lastName) VALUES ('$rating', '$first', '$last')");
  }
}

$result = array ('result'=>'success');

header('Content-type: application/json');
echo json_encode($result);

?>