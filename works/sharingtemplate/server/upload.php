<?php
	$target_path = 'uploads/';

	$target_path = $target_path . basename($_FILES['file']['name']);

	if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
		$msg = array(
			'IsSuccess' => true,
			'ImgUrl' => 'server/' . $target_path,
		);
	} else{
	    $msg = array('IsSuccess' => false, 'msg' => '' );
	}

	echo json_encode($msg);
?>