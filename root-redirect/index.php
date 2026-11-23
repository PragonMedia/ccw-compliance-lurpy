<?php
/**
 * Place this file at the domain document root
 * (e.g. public_html/index.php) so getccwpermitseasy.com
 * redirects to /v1/ instead of showing the default hosting page.
 */
header('Location: /v1/', true, 301);
exit;
