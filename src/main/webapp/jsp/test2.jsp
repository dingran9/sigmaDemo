<% String userId = "UserId"; %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en-us">
<head>

    <title>test2</title>
    <link rel="stylesheet" media="screen" href="static/css/bootstrap.min.css?version=4.2.6.1">
    <link rel="stylesheet" media="screen" href="static/smartadmin/css/font-awesome.min.css?version=4.2.6.1">
    <link rel="stylesheet" media="screen" href="static/css/custom.css?version=4.2.6.1">
</head>
<body>
this is a test2
<script type="text/javascript">
    function handleLogout(){
        doPost("/action/idcManager/logout",{},function(objs){
            window.location.replace("login.jsp");
        /*    if(objs.httpCode=="200"){
                $("#user-login-div").hide();
                $("#user-not-login-div").show();
            }else{
                console.log("code :" + objs.code + "  msg:" + objs.message);
            }*/
        });
    }
</script>
</body>
</html>